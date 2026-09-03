"use client";

import React, { useState } from "react";
import {
  Search,
  Upload,
  Sparkles,
  X,
  Check,
  Image as ImageIcon,
  FolderOpen,
} from "lucide-react";

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  currentImage?: string;
  title?: string;
}

interface CuratedStock {
  title: string;
  category: string;
  url: string;
}

const STOCK_LIBRARY: CuratedStock[] = [
  // Cosmétique & Beauté
  {
    title: "Sérum Visage Flacon Verre",
    category: "cosmetique",
    url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&auto=format&fit=crop&q=80",
  },
  {
    title: "Crème Hydratante Bio Naturelle",
    category: "cosmetique",
    url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&auto=format&fit=crop&q=80",
  },
  {
    title: "Huile Essentielle Pure",
    category: "cosmetique",
    url: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200&auto=format&fit=crop&q=80",
  },
  {
    title: "Routine Soin Peau Noire / Métisse",
    category: "cosmetique",
    url: "https://images.unsplash.com/photo-1512290900672-1f5be979c614?w=1200&auto=format&fit=crop&q=80",
  },

  // Montres & Bijoux
  {
    title: "Montre Chronographe Noire Luxe",
    category: "montres",
    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80",
  },
  {
    title: "Smartwatch Sport Connectée",
    category: "montres",
    url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=1200&auto=format&fit=crop&q=80",
  },
  {
    title: "Montre Cuir Marron Prestige",
    category: "montres",
    url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&auto=format&fit=crop&q=80",
  },

  // Chaussures & Mode
  {
    title: "Sneakers Streetwear Rouge & Blanc",
    category: "mode",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=80",
  },
  {
    title: "Chaussures Sport Confort",
    category: "mode",
    url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&auto=format&fit=crop&q=80",
  },
  {
    title: "Sac à Main Cuir Haut de Gamme",
    category: "mode",
    url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&auto=format&fit=crop&q=80",
  },
  {
    title: "Vêtements Style Moderne",
    category: "mode",
    url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80",
  },

  // Agroalimentaire & Miel
  {
    title: "Pot de Miel Sauvage Doré",
    category: "agro",
    url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200&auto=format&fit=crop&q=80",
  },
  {
    title: "Rayon de Miel Pure Nature",
    category: "agro",
    url: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=1200&auto=format&fit=crop&q=80",
  },
  {
    title: "Épices et Saveurs d'Afrique",
    category: "agro",
    url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&auto=format&fit=crop&q=80",
  },

  // Services, Artisans & Dépannage
  {
    title: "Artisan Électricien / Dépannage",
    category: "services",
    url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&auto=format&fit=crop&q=80",
  },
  {
    title: "Technicien Serrurerie Outillage",
    category: "services",
    url: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=1200&auto=format&fit=crop&q=80",
  },
  {
    title: "Plomberie & Réparation Express",
    category: "services",
    url: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1200&auto=format&fit=crop&q=80",
  },

  // Tech, Gadgets & Électronique
  {
    title: "Casque Audio Bluetooth Sans Fil",
    category: "tech",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80",
  },
  {
    title: "Écouteurs TWS Haute Définition",
    category: "tech",
    url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1200&auto=format&fit=crop&q=80",
  },
  {
    title: "Smartphone & Écran Tactile",
    category: "tech",
    url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=80",
  },

  // Formations & Business Digital
  {
    title: "Entrepreneur Africain & Ordinateur",
    category: "business",
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80",
  },
  {
    title: "E-commerce & Stratégie Digitale",
    category: "business",
    url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80",
  },
];

const CATEGORIES = [
  { id: "all", name: "Tous les produits" },
  { id: "cosmetique", name: "🧴 Cosmétiques & Soins" },
  { id: "montres", name: "⌚ Montres & Bijoux" },
  { id: "mode", name: "👟 Chaussures & Mode" },
  { id: "agro", name: "🍯 Miel & Agroalimentaire" },
  { id: "services", name: "🛠️ Artisans & Dépannage" },
  { id: "tech", name: "🎧 Tech & Gadgets" },
  { id: "business", name: "📈 Formations & Digital" },
];

export function ImagePickerModal({
  isOpen,
  onClose,
  onSelectImage,
  currentImage,
  title = "Choisir une Photo Professionnelle",
}: ImagePickerModalProps) {
  const [activeTab, setActiveTab] = useState<"search" | "upload" | "url">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [customUrl, setCustomUrl] = useState(currentImage || "");
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filtrage des photos
  const filteredPhotos = STOCK_LIBRARY.filter((photo) => {
    const matchesCategory = selectedCategory === "all" || photo.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Gestion du téléversement de fichier local (PC / Smartphone)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setUploadedPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmUpload = () => {
    if (uploadedPreview) {
      onSelectImage(uploadedPreview);
      onClose();
    }
  };

  const handleConfirmUrl = () => {
    if (customUrl.trim()) {
      onSelectImage(customUrl.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#0B1020] border border-white/15 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* EN-TÊTE DU SÉLECTEUR */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">{title}</h3>
              <p className="text-[11px] text-slate-400">
                Photos haute résolution gratuites & téléversement direct
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ONGLETS DU SÉLECTEUR */}
        <div className="flex items-center border-b border-white/10 bg-slate-950/60 px-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab("search")}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "search"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Banque d'Images Gratuites</span>
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "upload"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Depuis mon Appareil (PC / Mobile)</span>
          </button>
          <button
            onClick={() => setActiveTab("url")}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "url"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <span>Lien URL Direct</span>
          </button>
        </div>

        {/* CORPS DE L'ONGLET RECHERCHE */}
        {activeTab === "search" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Barre de recherche */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher : montre, crème bio, miel, baskets, artisan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Filtres par catégories */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Grille de photos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              {filteredPhotos.map((photo, i) => (
                <div
                  key={i}
                  onClick={() => {
                    onSelectImage(photo.url);
                    onClose();
                  }}
                  className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-indigo-500 hover:shadow-xl transition-all cursor-pointer aspect-video bg-slate-900"
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity flex items-end p-2.5">
                    <span className="text-[10px] font-bold text-white truncate">
                      {photo.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CORPS DE L'ONGLET TÉLÉVERSEMENT LOCAL */}
        {activeTab === "upload" && (
          <div className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-center space-y-5 text-center">
            {uploadedPreview ? (
              <div className="space-y-4 max-w-sm w-full">
                <div className="rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-2xl aspect-video bg-black">
                  <img
                    src={uploadedPreview}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setUploadedPreview(null)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-slate-300 text-xs font-bold hover:bg-slate-800 cursor-pointer"
                  >
                    Choisir un autre fichier
                  </button>
                  <button
                    onClick={handleConfirmUpload}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    <Check className="w-4 h-4" />
                    <span>Appliquer cette image</span>
                  </button>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-white/20 hover:border-indigo-500 rounded-3xl p-8 sm:p-12 w-full max-w-md flex flex-col items-center justify-center gap-3 cursor-pointer bg-slate-950/40 hover:bg-indigo-950/10 transition-all group">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                  <FolderOpen className="w-7 h-7" />
                </div>
                <div>
                  <span className="font-bold text-sm text-white block">
                    Cliquez pour choisir une photo sur votre appareil
                  </span>
                  <span className="text-xs text-slate-400 mt-1 block">
                    Prend en charge PNG, JPG, WebP (Prise de photo mobile disponible)
                  </span>
                </div>
              </label>
            )}
          </div>
        )}

        {/* CORPS DE L'ONGLET URL DIRECTE */}
        {activeTab === "url" && (
          <div className="flex-1 p-6 sm:p-8 space-y-4 max-w-lg mx-auto w-full">
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-slate-300">
                Adresse URL de l'image :
              </label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {customUrl && (
              <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black">
                <img
                  src={customUrl}
                  alt="Aperçu"
                  className="w-full h-full object-cover"
                  onError={() => alert("Impossible de charger l'image depuis cette URL.")}
                />
              </div>
            )}

            <button
              onClick={handleConfirmUrl}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg cursor-pointer"
            >
              Valider cette image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
