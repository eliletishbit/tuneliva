import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createAdminClient } from "@/lib/supabase/admin";

const DATA_DIR = path.join(process.cwd(), ".data");
const FEEDBACK_FILE = path.join(DATA_DIR, "feedback.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch {}
  }
}

export interface FeedbackRecord {
  id: string;
  questionId: string;
  questionText: string;
  answer: string;
  comment?: string;
  userEmail?: string;
  userId?: string;
  funnelSlug?: string;
  createdAt: string;
}

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("platform_feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      return NextResponse.json(data);
    }
  } catch {}

  ensureDataDir();
  if (fs.existsSync(FEEDBACK_FILE)) {
    try {
      const raw = fs.readFileSync(FEEDBACK_FILE, "utf-8");
      const list: FeedbackRecord[] = JSON.parse(raw);
      return NextResponse.json(list);
    } catch {
      return NextResponse.json([]);
    }
  }
  return NextResponse.json([]);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { questionId, questionText, answer, comment, userEmail, userId, funnelSlug } = body;

    if (!questionText || !answer) {
      return NextResponse.json({ error: "Question et réponse requises" }, { status: 400 });
    }

    const newRecord: FeedbackRecord = {
      id: "fb-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      questionId: questionId || "general",
      questionText,
      answer,
      comment: comment || "",
      userEmail: userEmail || "anonyme",
      userId: userId || "",
      funnelSlug: funnelSlug || "",
      createdAt: new Date().toISOString(),
    };

    try {
      const supabase = createAdminClient();
      await supabase.from("platform_feedback").insert([
        {
          id: newRecord.id,
          question_id: newRecord.questionId,
          question_text: newRecord.questionText,
          answer: newRecord.answer,
          comment: newRecord.comment,
          user_email: newRecord.userEmail,
          user_id: newRecord.userId,
          funnel_slug: newRecord.funnelSlug,
          created_at: newRecord.createdAt,
        },
      ]);
    } catch (err) {
      console.warn("Supabase platform_feedback fallback:", err);
    }

    ensureDataDir();
    let currentList: FeedbackRecord[] = [];
    if (fs.existsSync(FEEDBACK_FILE)) {
      try {
        currentList = JSON.parse(fs.readFileSync(FEEDBACK_FILE, "utf-8"));
      } catch {}
    }
    currentList.unshift(newRecord);
    try {
      fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(currentList, null, 2), "utf-8");
    } catch {}

    return NextResponse.json({ success: true, record: newRecord });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Erreur interne" }, { status: 500 });
  }
}
