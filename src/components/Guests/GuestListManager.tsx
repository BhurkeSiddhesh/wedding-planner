import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Guest, RSVPStatus, MealPreference } from '../../types/wedding';
import { 
  Users, 
  Search, 
  PlusCircle, 
  Phone, 
  Home, 
  Trash2, 
  Edit3, 
  MessageSquare
} from 'lucide-react';

interface GuestListManagerProps {
  onOpenAddGuest: () => void;
  onEditGuest: (guest: Guest) => void;
}

export const GuestListManager: React.FC<GuestListManagerProps> = ({
  onOpenAddGuest,
  onEditGuest,
}) => {
  const { guests, rituals, updateGuest, deleteGuest, batchUpdateRSVP, guestMetrics } = useWedding();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSide, setSelectedSide] = useState<string>('all');
  const [selectedRSVP, setSelectedRSVP] = useState<string>('all');
  const [selectedCatering, setSelectedCatering] = useState<string>('all');
  const [selectedGuestIds, setSelectedGuestIds] = useState<string[]>([]);

  // Filter guests
  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.marathiName && g.marathiName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      g.relation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.phone.includes(searchQuery);

    const matchesSide = selectedSide === 'all' || g.side === selectedSide;
    const matchesRSVP = selectedRSVP === 'all' || g.rsvpStatus === selectedRSVP;
    const matchesCatering = selectedCatering === 'all' || g.cateringPreference.primaryMeal === selectedCatering;

    return matchesSearch && matchesSide && matchesRSVP && matchesCatering;
  });

  const toggleSelectGuest = (id: string) => {
    setSelectedGuestIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const generateWhatsAppMessage = (guest: Guest) => {
    const text = `सप्रेम नमस्कार ${guest.name}! 🙏\nआमच्या लग्नाला आपले सहकुटुंब सहपरिवार अगत्याचे निमंत्रण आहे.\nभोजन व्यवस्था: ${guest.cateringPreference.primaryMeal === 'traditional_pangat' ? 'पारंपरिक पंगत' : 'बुफे'}.\nआपली उपस्थिती निश्चित करा. धन्यवाद!`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const mealPreferenceLabels: { [key in MealPreference]: { name: string; icon: string } } = {
    traditional_pangat: { name: 'Traditional Pangat (केळीच्या पानावर पंगत)', icon: '🍃' },
    buffet: { name: 'Buffet (बुफे भोजन)', icon: '🍽️' },
    upvas_fasting: { name: 'Upvas Fasting (उपवास फराळ)', icon: '🥥' },
    jain_satvik: { name: 'Jain/Satvik (कांदा-लसूण विरहित)', icon: '🥗' },
    standard_veg: { name: 'Standard Veg (शाकाहारी)', icon: '🥕' },
    non_veg_reception: { name: 'Non-Veg Reception', icon: '🍗' },
  };

  return (
    <div className="space-y-4 pb-8">
      
      {/* Header Banner - High Density */}
      <div className="bg-gradient-to-r from-[#4a0e0e] via-[#3d0b0b] to-[#2b0707] rounded-xl p-4 sm:p-5 text-[#faecd0] shadow-md border border-[#d4af37]/35">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
              <Users className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>निमंत्रित पाहुणे, उपस्थिती व पारंपरिक भोजन पसंती</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-serif-marathi text-white mt-0.5">
              Guest List & Catering Preferences
            </h2>
            <p className="text-xs text-amber-200/80 mt-0.5 max-w-2xl">
              Track RSVP statuses for both Var-Paksha & Vadhu-Paksha families, Maharashtrian catering choices (Pangat vs Buffet, Upvas fasting counts, room allocations).
            </p>
          </div>

          <button
            onClick={onOpenAddGuest}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#d4af37] hover:bg-[#c29e28] text-[#420d0d] font-bold text-xs transition shadow-xs shrink-0 self-start md:self-auto"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add New Guest Family</span>
          </button>
        </div>

        {/* Headcount Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3.5 pt-3 border-t border-[#d4af37]/20 text-xs">
          <div className="bg-black/25 rounded-md p-2.5 border border-white/10">
            <span className="text-amber-200/70 block text-[10px] uppercase font-bold">Total Confirmed</span>
            <span className="text-base font-bold text-emerald-300 font-serif-marathi">{guestMetrics.confirmedGuests} Pax</span>
            <span className="text-[10px] text-amber-200/80 block">({guestMetrics.totalAdults} Adults + {guestMetrics.totalKids} Kids)</span>
          </div>

          <div className="bg-black/25 rounded-md p-2.5 border border-white/10">
            <span className="text-amber-200/70 block text-[10px] uppercase font-bold">Pangat Seating</span>
            <span className="text-base font-bold text-[#d4af37] font-serif-marathi">{guestMetrics.pangatPreferenceCount} Meals</span>
            <span className="text-[10px] text-amber-200/70 block">{guestMetrics.buffetPreferenceCount} Buffet Meals</span>
          </div>

          <div className="bg-black/25 rounded-md p-2.5 border border-white/10">
            <span className="text-amber-200/70 block text-[10px] uppercase font-bold">Upvas / Fasting</span>
            <span className="text-base font-bold text-[#faecd0] font-serif-marathi">{guestMetrics.fastingCount} Guests</span>
            <span className="text-[10px] text-amber-200/70 block">{guestMetrics.jainSatvikCount} Satvik (No onion/garlic)</span>
          </div>

          <div className="bg-black/25 rounded-md p-2.5 border border-white/10">
            <span className="text-amber-200/70 block text-[10px] uppercase font-bold">Rooms Allotted</span>
            <span className="text-base font-bold text-white font-serif-marathi">{guestMetrics.accommodationNeededCount} Pax</span>
            <span className="text-[10px] text-amber-200/70 block">Karyalaya Suites</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#ffffff] p-3 rounded-lg border border-[#e8e1d5] shadow-xs space-y-2.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2.5">
          <div className="w-full md:w-72 relative">
            <Search className="w-3.5 h-3.5 text-[#8f8173] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, relation, city, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-[#fdfaf5] border border-[#e8e1d5] focus:outline-none focus:ring-1 focus:ring-[#6b1d1d] text-[#2d2d2d] placeholder:text-[#8f8173]"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {/* Side filter */}
            <select
              value={selectedSide}
              onChange={(e) => setSelectedSide(e.target.value)}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-[#fdfaf5] border border-[#e8e1d5] text-[#2d2d2d] focus:outline-none focus:ring-1 focus:ring-[#6b1d1d]"
            >
              <option value="all">All Family Sides</option>
              <option value="bride_side">👰 Vadhu Paksha (Bride)</option>
              <option value="groom_side">🤵 Var Paksha (Groom)</option>
              <option value="mutual">🤝 Mutual Friends</option>
            </select>

            {/* RSVP filter */}
            <select
              value={selectedRSVP}
              onChange={(e) => setSelectedRSVP(e.target.value)}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-[#fdfaf5] border border-[#e8e1d5] text-[#2d2d2d] focus:outline-none focus:ring-1 focus:ring-[#6b1d1d]"
            >
              <option value="all">All RSVP Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="tentative">Tentative</option>
              <option value="declined">Declined</option>
              <option value="pending">Pending</option>
            </select>

            {/* Catering preference filter */}
            <select
              value={selectedCatering}
              onChange={(e) => setSelectedCatering(e.target.value)}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-[#fdfaf5] border border-[#e8e1d5] text-[#2d2d2d] focus:outline-none focus:ring-1 focus:ring-[#6b1d1d]"
            >
              <option value="all">All Catering Types</option>
              <option value="traditional_pangat">🍃 Traditional Pangat</option>
              <option value="buffet">🍽️ Buffet</option>
              <option value="jain_satvik">🥗 Jain / Satvik</option>
              <option value="upvas_fasting">🥥 Upvas Fasting</option>
            </select>
          </div>
        </div>

        {/* Batch Actions Bar (when items selected) */}
        {selectedGuestIds.length > 0 && (
          <div className="pt-2 border-t border-[#e8e1d5] flex flex-wrap items-center justify-between gap-2 bg-[#faecd0]/40 p-2 rounded-md">
            <div className="text-xs font-bold text-[#6b1d1d]">
              {selectedGuestIds.length} Guests Selected
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#7d7063]">Batch RSVP:</span>
              <button
                onClick={() => batchUpdateRSVP(selectedGuestIds, 'confirmed')}
                className="px-2 py-0.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition"
              >
                Mark Confirmed
              </button>
              <button
                onClick={() => batchUpdateRSVP(selectedGuestIds, 'tentative')}
                className="px-2 py-0.5 rounded bg-[#b85a1a] hover:bg-[#9a4a15] text-white text-xs font-semibold transition"
              >
                Mark Tentative
              </button>
              <button
                onClick={() => batchUpdateRSVP(selectedGuestIds, 'declined')}
                className="px-2 py-0.5 rounded bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold transition"
              >
                Mark Declined
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Guest Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredGuests.map((guest) => {
          const isSelected = selectedGuestIds.includes(guest.id);
          const totalGuestHeadcount = (guest.adultsCount || 0) + (guest.kidsCount || 0);
          const mealInfo = mealPreferenceLabels[guest.cateringPreference.primaryMeal] || {
            name: guest.cateringPreference.primaryMeal,
            icon: '🍽️',
          };

          return (
            <div
              key={guest.id}
              className={`bg-[#ffffff] rounded-lg p-3.5 border transition-all duration-150 shadow-xs relative ${
                isSelected
                  ? 'border-[#d4af37] bg-[#faecd0]/15'
                  : 'border-[#e8e1d5] hover:border-[#d4af37]/60'
              }`}
            >
              {/* Top Row: Select, Name, Side, and RSVP Badge */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5 min-w-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectGuest(guest.id)}
                    className="mt-0.5 w-3.5 h-3.5 rounded text-[#6b1d1d] border-[#e8e1d5] focus:ring-[#6b1d1d] cursor-pointer"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-[#1f1f1f] font-serif-marathi">
                      {guest.name}
                    </h3>
                    {guest.marathiName && (
                      <p className="text-[11px] text-[#6b1d1d] font-medium">{guest.marathiName}</p>
                    )}
                    <p className="text-[11px] text-[#7d7063] mt-0.5">{guest.relation} • {guest.city}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`px-2 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                      guest.rsvpStatus === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : guest.rsvpStatus === 'tentative'
                        ? 'bg-[#faecd0] text-[#6b1d1d] border border-[#d4af37]/30'
                        : guest.rsvpStatus === 'declined'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-[#f4ede1] text-[#63584e]'
                    }`}
                  >
                    {guest.rsvpStatus}
                  </span>

                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      guest.side === 'groom_side'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : guest.side === 'bride_side'
                        ? 'bg-pink-50 text-pink-800 border border-pink-200'
                        : 'bg-purple-50 text-purple-800 border border-purple-200'
                    }`}
                  >
                    {guest.side === 'groom_side' ? '🤵 Var' : guest.side === 'bride_side' ? '👰 Vadhu' : '🤝 Mutual'}
                  </span>
                </div>
              </div>

              {/* Middle: Catering Preference & Dietary Highlights */}
              <div className="mt-2.5 p-2.5 rounded bg-[#fcf9f2] border border-[#e8e1d5] space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#2d2d2d] flex items-center gap-1 text-[11px]">
                    <span>{mealInfo.icon}</span>
                    <span>{mealInfo.name.split(' (')[0]}</span>
                  </span>
                  <span className="font-bold text-[#1f1f1f] bg-white px-1.5 py-0.2 rounded border border-[#e8e1d5] text-[10px]">
                    {totalGuestHeadcount} Meals ({guest.adultsCount}A + {guest.kidsCount}K)
                  </span>
                </div>

                {guest.cateringPreference.favoriteTraditionalDish && (
                  <p className="text-[#63584e] text-[11px]">
                    💖 Loved Dish: <strong className="text-[#6b1d1d]">{guest.cateringPreference.favoriteTraditionalDish}</strong>
                  </p>
                )}

                {guest.cateringPreference.hasFastingGuests && (
                  <p className="text-[#8b2626] font-medium flex items-center gap-1 text-[11px]">
                    <span>🥥 Upvas: {guest.cateringPreference.fastingCount || 1} guest(s) need Sabudana faral</span>
                  </p>
                )}

                {guest.cateringPreference.specialNotes && (
                  <p className="text-[#7d7063] italic text-[10px]">
                    Note: {guest.cateringPreference.specialNotes}
                  </p>
                )}
              </div>

              {/* Bottom: Contact, Room Allotment & Attending Rituals */}
              <div className="mt-2.5 pt-2 border-t border-[#e8e1d5] flex flex-wrap items-center justify-between gap-1.5 text-xs text-[#7d7063]">
                <div className="flex items-center gap-2.5">
                  <a
                    href={`tel:${guest.phone}`}
                    className="flex items-center gap-1 text-[#2d2d2d] hover:text-[#6b1d1d] font-medium text-[11px]"
                  >
                    <Phone className="w-3 h-3 text-[#6b1d1d]" />
                    <span>{guest.phone}</span>
                  </a>

                  {guest.accommodationNeeded && (
                    <span className="flex items-center gap-0.5 text-emerald-800 font-medium text-[10px]">
                      <Home className="w-3 h-3" />
                      <span>{guest.roomNumber || 'Room Needed'}</span>
                    </span>
                  )}
                </div>

                {/* Actions: WhatsApp, Edit, Delete */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => generateWhatsAppMessage(guest)}
                    className="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition"
                    title="Send WhatsApp Invite / Confirmation"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onEditGuest(guest)}
                    className="p-1 rounded bg-[#f4ede1] hover:bg-[#e8e1d5] text-[#2d2d2d] transition"
                    title="Edit Guest Details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteGuest(guest.id)}
                    className="p-1 rounded bg-[#f4ede1] hover:bg-rose-100 text-[#8f8173] hover:text-rose-700 transition"
                    title="Delete Guest"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Attending Rituals Tags */}
              <div className="mt-1.5 flex flex-wrap gap-1">
                {guest.attendingRituals.map((ritId) => {
                  const r = rituals.find((item) => item.id === ritId);
                  if (!r) return null;
                  return (
                    <span
                      key={ritId}
                      className="text-[9px] px-1.5 py-0.2 rounded bg-[#f4ede1] text-[#63584e] border border-[#e8e1d5]"
                    >
                      {r.name.split(' (')[0]}
                    </span>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
