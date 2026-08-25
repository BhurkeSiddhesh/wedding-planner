import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { formatINR } from '../../utils/calculations';
import { 
  UtensilsCrossed, 
  Sparkles, 
  CheckCircle2, 
} from 'lucide-react';

export const CateringPlanner: React.FC = () => {
  const { cateringMenus, guestMetrics } = useWedding();
  const [activeMenuId, setActiveMenuId] = useState<string>(cateringMenus[0]?.id || '');

  const activeMenu = cateringMenus.find((m) => m.id === activeMenuId) || cateringMenus[0];

  return (
    <div className="space-y-4 pb-8">
      
      {/* Header Banner - High Density */}
      <div className="bg-gradient-to-r from-[#4a0e0e] via-[#3d0b0b] to-[#2b0707] rounded-xl p-4 sm:p-5 text-[#faecd0] shadow-md border border-[#d4af37]/35">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>पारंपरिक महाराष्ट्रीयन पंगत व भोजन व्यवस्था</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-serif-marathi text-white mt-0.5">
              Maharashtrian Catering & Pangat Planner
            </h2>
            <p className="text-xs text-amber-200/80 mt-0.5 max-w-2xl">
              Authentic Marathi wedding menus from Ukdiche Modak with Sajuk Toop to traditional Banana Leaf (केळीचे पान) seating arrangements and Upvas faral.
            </p>
          </div>

          <div className="bg-black/25 rounded-md p-2.5 border border-white/10 shrink-0">
            <span className="text-[10px] text-amber-200/70 block uppercase font-bold">Total Confirmed</span>
            <span className="text-base font-bold text-white font-serif-marathi">{guestMetrics.confirmedGuests} Plates</span>
            <span className="text-[10px] text-amber-200/70 block">
              {guestMetrics.pangatPreferenceCount} Pangat + {guestMetrics.fastingCount} Upvas
            </span>
          </div>
        </div>
      </div>

      {/* Traditional Banana Leaf Interactive Visualizer - High Density */}
      <div className="bg-[#1b2e23] text-white rounded-lg p-4 sm:p-5 shadow-md border border-emerald-500/30 relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-500/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-base">
              🍃
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold font-serif-marathi text-emerald-200">
                Traditional Maharashtrian "Pangat" Leaf Layout (केळीच्या पानावर वाढण्याची परंपरा)
              </h3>
              <p className="text-[11px] text-emerald-300/80">
                Vedic culinary etiquette: Salt & lemon top-left, curries in middle, sweets in top-right, fragrant rice in center.
              </p>
            </div>
          </div>
        </div>

        {/* Visual Simulated Banana Leaf */}
        <div className="mt-3.5 p-4 rounded-lg bg-emerald-950/60 border border-emerald-500/30">
          <div className="text-center pb-2.5 text-[10px] font-bold uppercase tracking-widest text-emerald-300">
            🍃 केळीचे पान • पारंपारिक पंगत मांडणी
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
            
            {/* Top Left: Salt, Lemon, Chutney, Koshimbir */}
            <div className="bg-[#11241a] p-3 rounded-md border border-emerald-500/20 space-y-1">
              <span className="text-[10px] font-bold text-[#d4af37] uppercase block">
                १. डावी बाजू (Top-Left): तोंडी लावायचे
              </span>
              <ul className="space-y-0.5 text-stone-300 text-[11px]">
                <li>• मीठ व ताजे लिंबू (Salt & Lemon)</li>
                <li>• कैरी / आंब्याचे लोणचे (Mango Pickle)</li>
                <li>• मिरचीचा ठेचा व चटणी (Thecha & Chutney)</li>
                <li>• खमंग काकडी कोशिंबीर (Koshimbir)</li>
                <li>• अळूची व कोथिंबीर वडी (Alu Vadi)</li>
                <li>• सांडगे, कुरडया व पापड (Sandage & Papad)</li>
              </ul>
            </div>

            {/* Middle: Bhaji, Usal, Amti */}
            <div className="bg-[#11241a] p-3 rounded-md border border-emerald-500/20 space-y-1">
              <span className="text-[10px] font-bold text-[#d4af37] uppercase block">
                २. मध्यभाग (Center): भाजी, उसळ व भात
              </span>
              <ul className="space-y-0.5 text-stone-300 text-[11px]">
                <li>• बटाट्याची सुकी भाजी (Potato Sabzi)</li>
                <li>• मटार-काजूची उसळ (Matar Usal)</li>
                <li>• भरली वांगी (Bharli Vangi)</li>
                <li>• साजूक तूप, वरण व गरम भात (Varan Bhat)</li>
                <li>• झणझणीत कटाची आमटी (Katachi Amti)</li>
                <li>• मसाले भात (Masale Bhat)</li>
              </ul>
            </div>

            {/* Top Right: Royal Sweets & Digestives */}
            <div className="bg-[#11241a] p-3 rounded-md border border-emerald-500/20 space-y-1">
              <span className="text-[10px] font-bold text-[#d4af37] uppercase block">
                ३. उजवी बाजू (Top-Right): गोडधोड व पेय
              </span>
              <ul className="space-y-0.5 text-stone-300 text-[11px]">
                <li>• उकडीचे मोदक (Ukdiche Modak with Ghee)</li>
                <li>• गुळाची मऊ पुरणपोळी (Puran Poli)</li>
                <li>• केशरी बासुंदी / श्रीखंड (Basundi)</li>
                <li>• गरमागरम जिलेबी (Crispy Jalebi)</li>
                <li>• सोलकढी व गारगार मठ्ठा (Mattha)</li>
                <li>• सुगंधी कलकत्ता मीठा विडा (Paan)</li>
              </ul>
            </div>

          </div>

          <div className="mt-2.5 pt-2 border-t border-emerald-500/20 text-center text-[10px] text-emerald-300/80 italic font-serif-marathi">
            "वदनी कवळ घेता नाम घ्या श्रीहरीचे । सहज हवन होते नाम घेता फुकाचे ॥" — पारंपारिक भोजन श्लोक
          </div>
        </div>
      </div>

      {/* Menu Selector & Detailed Dishes List */}
      <div className="bg-[#ffffff] rounded-lg p-4 sm:p-5 border border-[#e8e1d5] shadow-xs space-y-4">
        
        {/* Menu Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pb-3 border-b border-[#e8e1d5]">
          {cateringMenus.map((menu) => {
            const isActive = menu.id === activeMenu.id;
            return (
              <button
                key={menu.id}
                onClick={() => setActiveMenuId(menu.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#6b1d1d] text-white shadow-xs'
                    : 'bg-[#f4ede1] text-[#2d2d2d] hover:bg-[#e8e1d5]'
                }`}
              >
                <span>{menu.serviceStyle === 'traditional_banana_leaf_pangat' ? '🍃' : '🍽️'}</span>
                <span>{menu.mealTitle.split(' (')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Menu Details */}
        {activeMenu && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#faecd0]/30 p-3.5 rounded-lg border border-[#d4af37]/40">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b1d1d]">
                  {activeMenu.serviceStyle === 'traditional_banana_leaf_pangat'
                    ? 'Traditional Banana Leaf Pangat'
                    : 'Buffet Setup'}
                </span>
                <h3 className="text-base font-bold text-[#1f1f1f] font-serif-marathi mt-0.5">
                  {activeMenu.mealTitle}
                </h3>
                <p className="text-[11px] text-[#7d7063] mt-0.5">
                  Caterer: <strong className="text-[#2d2d2d]">{activeMenu.catererName}</strong> • {activeMenu.catererPhone}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs bg-white p-2.5 rounded-md border border-[#e8e1d5] shadow-xs">
                <div>
                  <span className="text-[10px] text-[#7d7063] block">Guests</span>
                  <span className="font-bold text-[#1f1f1f] text-sm">{activeMenu.expectedHeadcount} Pax</span>
                </div>
                <div className="h-6 w-px bg-[#e8e1d5]" />
                <div>
                  <span className="text-[10px] text-[#7d7063] block">Rate / Plate</span>
                  <span className="font-bold text-[#6b1d1d] text-sm">{formatINR(activeMenu.costPerPlate)}</span>
                </div>
                <div className="h-6 w-px bg-[#e8e1d5]" />
                <div>
                  <span className="text-[10px] text-[#7d7063] block">Est. Total</span>
                  <span className="font-bold text-[#1f1f1f] text-sm">
                    {formatINR(activeMenu.expectedHeadcount * activeMenu.costPerPlate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Courses / Dishes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeMenu.menuItems.map((category, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-[#fcf9f2] border border-[#e8e1d5]">
                  <h4 className="font-bold text-xs text-[#6b1d1d] font-serif-marathi pb-1.5 mb-2 border-b border-[#e8e1d5] flex items-center justify-between">
                    <span>{category.category}</span>
                    <span className="text-[10px] font-normal text-[#7d7063]">{category.items.length} items</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-[#2d2d2d]">
                    {category.items.map((dish, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#6b1d1d] shrink-0 mt-0.5" />
                        <span>{dish}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Dedicated Upvas Menu Block if available */}
              {activeMenu.upvasMenu && (
                <div className="p-3.5 rounded-lg bg-[#faecd0]/30 border border-[#d4af37]/40">
                  <h4 className="font-bold text-xs text-[#6b1d1d] font-serif-marathi pb-1.5 mb-2 border-b border-[#d4af37]/30 flex items-center justify-between">
                    <span>🥥 उपवास स्पेशल फराळ मेनू (Fasting Menu)</span>
                    <span className="text-[10px] font-semibold text-[#8b2626]">{guestMetrics.fastingCount} Guests</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-[#2d2d2d]">
                    {activeMenu.upvasMenu.map((item, uIdx) => (
                      <li key={uIdx} className="flex items-start gap-1.5">
                        <span className="text-[#8b2626] font-bold text-xs">🍃</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {activeMenu.notes && (
              <div className="p-2.5 rounded-md bg-[#faecd0]/40 border border-[#d4af37]/30 text-xs text-[#7d7063] flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#6b1d1d] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#6b1d1d]">Pangat Service Note: </strong>
                  {activeMenu.notes}
                </div>
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
};
