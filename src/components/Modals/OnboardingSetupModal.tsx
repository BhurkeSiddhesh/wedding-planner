import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWedding } from '../../context/WeddingContext';
import { Sparkles, Calendar, Clock, MapPin, Heart, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { UserRole } from '../../context/AuthContext';

interface OnboardingSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingSetupModal: React.FC<OnboardingSetupModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, userRole, setUserRole } = useAuth();
  const { profile, updateProfile, resetAllData } = useWedding();

  const [selectedRole, setSelectedRole] = useState<UserRole>(userRole || 'groom');
  const [groomName, setGroomName] = useState(profile.groomName || 'Aditya Deshmukh');
  const [brideName, setBrideName] = useState(profile.brideName || 'Swarali Kulkarni');
  const [weddingDate, setWeddingDate] = useState(profile.weddingDate || '2026-11-28');
  const [mahuratTime, setMahuratTime] = useState(profile.mahuratTime || '12:36 PM (शुभ मुहूर्त)');
  const [mainKaryalaya, setMainKaryalaya] = useState(
    profile.mainKaryalaya || 'Alankar Lawns & Mangal Karyalaya, Karve Road, Pune'
  );
  const [city, setCity] = useState(profile.city || 'Pune, Maharashtra');
  const [targetBudget, setTargetBudget] = useState(
    profile.targetBudget ? profile.targetBudget.toString() : '1500000'
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weddingDate || !mainKaryalaya.trim()) return;

    // 1. Update user role
    setUserRole(selectedRole);

    // 2. Prepare profile
    const budgetNum = parseFloat(targetBudget) || 1500000;
    const halfBudget = Math.round(budgetNum / 2);

    const updated = {
      groomName: groomName.trim(),
      brideName: brideName.trim(),
      weddingDate,
      mahuratTime: mahuratTime.trim(),
      mainKaryalaya: mainKaryalaya.trim(),
      city: city.trim(),
      targetBudget: budgetNum,
      groomBudgetCap: halfBudget,
      brideBudgetCap: halfBudget,
      isSetupCompleted: true,
      creatorRole: selectedRole as 'groom' | 'bride',
      groomEmail: selectedRole === 'groom' && currentUser?.email ? currentUser.email : profile.groomEmail,
      brideEmail: selectedRole === 'bride' && currentUser?.email ? currentUser.email : profile.brideEmail,
    };

    updateProfile(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('wedding_setup_done', 'true');
    }

    // Wipe any existing mock items for a clean slate experience as requested
    await resetAllData();

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs font-sans-google overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-stone-200 flex flex-col my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Banner */}
        <div className="p-6 bg-gradient-to-r from-[#4a0e0e] via-[#6b1d1d] to-[#8c2525] text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 mb-3 shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>

          <h2 className="font-serif-marathi text-xl sm:text-2xl font-bold tracking-wide text-amber-100">
            ॥ शुभमंगल सावधान ॥
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/90 mt-1 max-w-md mx-auto">
            Welcome to your Marathi Wedding Planner. Let&apos;s configure your wedding date, muhurta, and venue to begin with a clean slate!
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          
          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-2">
              1. What is your role? <span className="text-rose-600">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('groom')}
                className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition ${
                  selectedRole === 'groom'
                    ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span className="text-2xl">🤵</span>
                <div>
                  <p className="font-bold text-stone-900 text-xs">I am the Groom (वर)</p>
                  <p className="text-[11px] text-stone-500">Var-Paksha Planner</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('bride')}
                className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition ${
                  selectedRole === 'bride'
                    ? 'bg-rose-50/80 border-rose-500 ring-2 ring-rose-500/20 shadow-xs'
                    : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span className="text-2xl">👰</span>
                <div>
                  <p className="font-bold text-stone-900 text-xs">I am the Bride (वधू)</p>
                  <p className="text-[11px] text-stone-500">Vadhu-Paksha Planner</p>
                </div>
              </button>
            </div>
            <p className="text-[11px] text-stone-500 mt-1.5 italic">
              {selectedRole === 'groom'
                ? '💡 As the Groom, you will be able to invite your Bride to collaborate in real-time.'
                : '💡 As the Bride, you will be able to invite your Groom to collaborate in real-time.'}
            </p>
          </div>

          {/* Couple Names */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-2">
              2. Couple Names (वर व वधूची नावे)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] font-medium text-stone-600 block mb-1">Groom Name (वराचे नाव)</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditya Deshmukh"
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
                />
              </div>

              <div>
                <span className="text-[11px] font-medium text-stone-600 block mb-1">Bride Name (वधूचे नाव)</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Swarali Kulkarni"
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
                />
              </div>
            </div>
          </div>

          {/* Date & Muhurta Time */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-2">
              3. Wedding Date & Auspicious Muhurta (विवाह तारीख व शुभ मुहूर्त) <span className="text-rose-600">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] font-medium text-stone-600 block mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#7a1c1c]" /> Wedding Date
                </span>
                <input
                  type="date"
                  required
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20 font-medium"
                />
              </div>

              <div>
                <span className="text-[11px] font-medium text-stone-600 block mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600" /> Auspicious Muhurta (वेळ)
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. 12:36 PM (शुभ मुहूर्त)"
                  value={mahuratTime}
                  onChange={(e) => setMahuratTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
                />
              </div>
            </div>
          </div>

          {/* Venue & City */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-2">
              4. Wedding Venue & Location (विवाह स्थळ / मंगल कार्यालय) <span className="text-rose-600">*</span>
            </label>
            <div className="space-y-2">
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alankar Lawns & Mangal Karyalaya, Karve Road"
                  value={mainKaryalaya}
                  onChange={(e) => setMainKaryalaya(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="City e.g. Pune, Maharashtra"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
                />

                <input
                  type="number"
                  placeholder="Target Budget ₹ e.g. 1500000"
                  value={targetBudget}
                  onChange={(e) => setTargetBudget(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
                />
              </div>
            </div>
          </div>

          {/* Clean Slate Notice */}
          <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 text-[11px] text-stone-600 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Your planner will start as a <strong>clean slate</strong> with your custom wedding date and venue. You can create custom tasks/expenses or load the comprehensive Marathi Wedding Template at any time!
            </p>
          </div>

          {/* Submit Action */}
          <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-stone-500 hover:text-stone-800 text-xs font-medium"
            >
              Skip for now
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#7a1c1c] hover:bg-[#581212] transition shadow-md flex items-center gap-2 text-xs"
            >
              <span>Start Planning (Clean Slate)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
