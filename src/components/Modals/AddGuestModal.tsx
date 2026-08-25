import React, { useState, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Guest, GuestSide, RSVPStatus, MealPreference } from '../../types/wedding';
import { X, Users, Utensils } from 'lucide-react';

interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGuest?: Guest | null;
}

export const AddGuestModal: React.FC<AddGuestModalProps> = ({
  isOpen,
  onClose,
  initialGuest,
}) => {
  const { rituals, addGuest, updateGuest } = useWedding();

  const [name, setName] = useState('');
  const [marathiName, setMarathiName] = useState('');
  const [side, setSide] = useState<GuestSide>('bride_side');
  const [relation, setRelation] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Pune');
  const [adultsCount, setAdultsCount] = useState<number>(2);
  const [kidsCount, setKidsCount] = useState<number>(0);
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus>('confirmed');
  const [attendingRituals, setAttendingRituals] = useState<string[]>([]);
  
  // Catering preferences
  const [primaryMeal, setPrimaryMeal] = useState<MealPreference>('traditional_pangat');
  const [favoriteTraditionalDish, setFavoriteTraditionalDish] = useState('');
  const [hasFastingGuests, setHasFastingGuests] = useState(false);
  const [fastingCount, setFastingCount] = useState<number>(1);
  const [specialNotes, setSpecialNotes] = useState('');

  // Stay & Aher
  const [accommodationNeeded, setAccommodationNeeded] = useState(false);
  const [roomNumber, setRoomNumber] = useState('');

  useEffect(() => {
    if (initialGuest) {
      setName(initialGuest.name);
      setMarathiName(initialGuest.marathiName || '');
      setSide(initialGuest.side);
      setRelation(initialGuest.relation);
      setPhone(initialGuest.phone);
      setCity(initialGuest.city);
      setAdultsCount(initialGuest.adultsCount);
      setKidsCount(initialGuest.kidsCount);
      setRsvpStatus(initialGuest.rsvpStatus);
      setAttendingRituals(initialGuest.attendingRituals || []);
      setPrimaryMeal(initialGuest.cateringPreference.primaryMeal);
      setFavoriteTraditionalDish(initialGuest.cateringPreference.favoriteTraditionalDish || '');
      setHasFastingGuests(initialGuest.cateringPreference.hasFastingGuests || false);
      setFastingCount(initialGuest.cateringPreference.fastingCount || 1);
      setSpecialNotes(initialGuest.cateringPreference.specialNotes || '');
      setAccommodationNeeded(initialGuest.accommodationNeeded);
      setRoomNumber(initialGuest.roomNumber || '');
    } else {
      setName('');
      setMarathiName('');
      setSide('bride_side');
      setRelation('Relatives');
      setPhone('+91 ');
      setCity('Pune');
      setAdultsCount(2);
      setKidsCount(0);
      setRsvpStatus('confirmed');
      setAttendingRituals(rituals.map((r) => r.id));
      setPrimaryMeal('traditional_pangat');
      setFavoriteTraditionalDish('Ukdiche Modak & Puran Poli');
      setHasFastingGuests(false);
      setFastingCount(1);
      setSpecialNotes('');
      setAccommodationNeeded(false);
      setRoomNumber('');
    }
  }, [initialGuest, isOpen, rituals]);

  if (!isOpen) return null;

  const toggleRitual = (ritualId: string) => {
    setAttendingRituals((prev) =>
      prev.includes(ritualId) ? prev.filter((id) => id !== ritualId) : [...prev, ritualId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const guestPayload: Omit<Guest, 'id'> = {
      name,
      marathiName: marathiName.trim() || undefined,
      side,
      relation,
      phone,
      city,
      adultsCount: Number(adultsCount) || 1,
      kidsCount: Number(kidsCount) || 0,
      rsvpStatus,
      attendingRituals,
      cateringPreference: {
        primaryMeal,
        favoriteTraditionalDish: favoriteTraditionalDish.trim() || undefined,
        hasFastingGuests,
        fastingCount: hasFastingGuests ? Number(fastingCount) || 1 : undefined,
        specialNotes: specialNotes.trim() || undefined,
      },
      accommodationNeeded,
      roomNumber: accommodationNeeded ? roomNumber : undefined,
      invitationSent: true,
    };

    if (initialGuest) {
      updateGuest(initialGuest.id, guestPayload);
    } else {
      addGuest(guestPayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#ffffff] rounded-xl max-w-2xl w-full border border-[#e8e1d5] shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#4a0e0e] via-[#3d0b0b] to-[#2b0707] p-3.5 sm:p-4 text-[#faecd0] flex items-center justify-between border-b border-[#d4af37]/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold font-serif-marathi text-white">
                {initialGuest ? 'Edit Guest Family Details' : 'Add New Guest Family & Catering'}
              </h3>
              <p className="text-[10px] text-amber-200/80">
                पाहुण्यांची माहिती, भोजन पसंती व उपवास नोंदणी
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 text-stone-200 flex items-center justify-center transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
          
          {/* 1. Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                Guest / Family Head Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh & Sunita Patil"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                Marathi Name (मराठी नाव)
              </label>
              <input
                type="text"
                placeholder="उदा. रमेश व सुनिता पाटील"
                value={marathiName}
                onChange={(e) => setMarathiName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                Family Side *
              </label>
              <select
                value={side}
                onChange={(e) => setSide(e.target.value as GuestSide)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              >
                <option value="bride_side">👰 Vadhu Paksha (Bride)</option>
                <option value="groom_side">🤵 Var Paksha (Groom)</option>
                <option value="mutual">🤝 Mutual Friends/Colleagues</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                Relation / Role
              </label>
              <input
                type="text"
                placeholder="e.g. Maternal Uncle, Friend"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+91 98..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>
          </div>

          {/* 2. Headcount & RSVP */}
          <div className="p-3 rounded-lg bg-[#faecd0]/30 border border-[#d4af37]/40 grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[#6b1d1d] uppercase tracking-wider mb-1">
                Adults Count
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={adultsCount}
                onChange={(e) => setAdultsCount(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-white border border-[#e8e1d5] font-bold text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#6b1d1d] uppercase tracking-wider mb-1">
                Kids Count
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={kidsCount}
                onChange={(e) => setKidsCount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-white border border-[#e8e1d5] font-bold text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#6b1d1d] uppercase tracking-wider mb-1">
                City / Native Place
              </label>
              <input
                type="text"
                placeholder="e.g. Pune, Satara"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-white border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#6b1d1d] uppercase tracking-wider mb-1">
                RSVP Status
              </label>
              <select
                value={rsvpStatus}
                onChange={(e) => setRsvpStatus(e.target.value as RSVPStatus)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-white border border-[#e8e1d5] font-semibold text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              >
                <option value="confirmed">Confirmed</option>
                <option value="tentative">Tentative</option>
                <option value="declined">Declined</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* 3. Traditional Catering Preferences */}
          <div className="p-3 rounded-lg bg-[#fcf9f2] border border-[#e8e1d5] space-y-2.5">
            <h4 className="font-bold text-[10px] uppercase tracking-wider text-[#6b1d1d] flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-[#6b1d1d]" />
              <span>Maharashtrian Catering Preferences</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#2d2d2d] mb-1">
                  Primary Meal Style
                </label>
                <select
                  value={primaryMeal}
                  onChange={(e) => setPrimaryMeal(e.target.value as MealPreference)}
                  className="w-full px-3 py-1.5 text-xs rounded-md bg-white border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
                >
                  <option value="traditional_pangat">🍃 Traditional Banana Leaf Pangat (केळीच्या पानावर)</option>
                  <option value="buffet">🍽️ Buffet Service</option>
                  <option value="jain_satvik">🥗 Jain / Satvik (No onion, no garlic)</option>
                  <option value="upvas_fasting">🥥 Upvas Fasting (उपवास फराळ)</option>
                  <option value="standard_veg">🥕 Standard Vegetarian</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#2d2d2d] mb-1">
                  Favorite Marathi Sweet / Dish
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ukdiche Modak, Puran Poli, Basundi"
                  value={favoriteTraditionalDish}
                  onChange={(e) => setFavoriteTraditionalDish(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-md bg-white border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
                />
              </div>
            </div>

            {/* Fasting (Upvas) toggle */}
            <div className="pt-2 border-t border-[#e8e1d5] flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-[#2d2d2d] font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasFastingGuests}
                  onChange={(e) => setHasFastingGuests(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#6b1d1d] border-[#e8e1d5] accent-[#6b1d1d]"
                />
                <span>Has family members observing Upvas / Ekadashi fast? (उपवास फराळ)</span>
              </label>

              {hasFastingGuests && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-[#7d7063] font-semibold">Count:</span>
                  <input
                    type="number"
                    min="1"
                    max={adultsCount + kidsCount}
                    value={fastingCount}
                    onChange={(e) => setFastingCount(parseInt(e.target.value) || 1)}
                    className="w-14 px-2 py-0.5 text-xs rounded border border-[#e8e1d5] font-bold bg-white text-center"
                  />
                </div>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Dietary or service notes (e.g. Senior citizen low sugar, baby milk required)"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-white border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>
          </div>

          {/* 4. Attending Rituals */}
          <div>
            <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1.5">
              Attending Ceremonies & Rituals
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {rituals.map((r) => {
                const isChecked = attendingRituals.includes(r.id);
                return (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => toggleRitual(r.id)}
                    className={`p-2 rounded-md text-xs text-left border transition flex items-center justify-between ${
                      isChecked
                        ? 'bg-[#faecd0]/50 border-[#d4af37] text-[#6b1d1d] font-semibold'
                        : 'bg-[#fcf9f2] border-[#e8e1d5] text-[#7d7063] hover:bg-[#f4ede1]'
                    }`}
                  >
                    <span className="truncate">{r.name.split(' (')[0]}</span>
                    {isChecked && <span className="text-[#6b1d1d] font-bold">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Stay & Room Allocation */}
          <div className="pt-2 border-t border-[#e8e1d5] flex flex-wrap items-center justify-between gap-2.5">
            <label className="flex items-center gap-2 text-xs text-[#2d2d2d] font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={accommodationNeeded}
                onChange={(e) => setAccommodationNeeded(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-[#6b1d1d] border-[#e8e1d5] accent-[#6b1d1d]"
              />
              <span>Requires Karyalaya Room Stay (निवास व्यवस्था)</span>
            </label>

            {accommodationNeeded && (
              <input
                type="text"
                placeholder="e.g. Room 204 (Bride Block)"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] font-medium text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            )}
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-[#e8e1d5] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#7d7063] hover:bg-[#f4ede1] rounded-md transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#6b1d1d] hover:bg-[#521414] text-white font-bold text-xs rounded-md shadow-xs transition"
            >
              {initialGuest ? 'Save Changes' : 'Save Guest'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
