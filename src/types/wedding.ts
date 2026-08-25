export type GuestSide = 'groom_side' | 'bride_side' | 'mutual';
export type RSVPStatus = 'confirmed' | 'tentative' | 'declined' | 'pending';
export type MealPreference = 'traditional_pangat' | 'buffet' | 'upvas_fasting' | 'jain_satvik' | 'standard_veg' | 'non_veg_reception';

export interface Guest {
  id: string;
  name: string;
  marathiName?: string;
  side: GuestSide;
  relation: string;
  phone: string;
  city: string;
  adultsCount: number;
  kidsCount: number;
  rsvpStatus: RSVPStatus;
  attendingRituals: string[]; // ritual IDs
  cateringPreference: {
    primaryMeal: MealPreference;
    favoriteTraditionalDish?: string;
    hasFastingGuests: boolean;
    fastingCount?: number;
    specialNotes?: string;
  };
  accommodationNeeded: boolean;
  roomNumber?: string;
  aherInfo?: {
    given: boolean;
    type?: 'cash' | 'gold_silver' | 'gift_item' | 'paithani_clothes';
    amountOrItem?: string;
  };
  invitationSent: boolean;
}

export type ExpensePayer = 'groom' | 'bride' | 'shared' | 'other';
export type PayerType = ExpensePayer;

export type SplitRule = 
  | '50_50_shared' 
  | '100_groom' 
  | '100_bride' 
  | '60_40_groom_heavy' 
  | '40_60_bride_heavy' 
  | 'custom_ratio' 
  | 'sponsored';

export type PaymentStatus = 'paid' | 'partial' | 'pending';

export type ItemCategory = 
  | 'flowers_garlands' 
  | 'puja_samagri' 
  | 'sweets_catering' 
  | 'gifts_aher' 
  | 'attire_jewelry' 
  | 'music_decor' 
  | 'hall_venue' 
  | 'photography' 
  | 'transport' 
  | 'other';

export interface RitualItem {
  id: string;
  name: string;
  marathiName: string;
  category: ItemCategory;
  quantity: string;
  estimatedCost: number;
  actualCost: number;
  paidBy: ExpensePayer;
  isPurchased: boolean;
  assignedTo: string;
  vendorOrShop?: string;
  notes?: string;
}

export interface Ritual {
  id: string;
  name: string;
  marathiName: string;
  order: number;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  description: string;
  significance: string;
  status: 'upcoming' | 'in_progress' | 'completed';
  responsibleParty: 'bride_side' | 'groom_side' | 'shared';
  items: RitualItem[];
  traditionalTip?: string;
  recommendedSongsOrChants?: string;
}

export type TaskSide = 'bride' | 'groom' | 'shared';
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface TodoTask {
  id: string;
  title: string;
  marathiTitle?: string;
  eventId: string; // e.g. 'pre_wedding', 'sakharpuda', 'kelvan', 'halad', 'mehendi_sangeet', 'seemant_pujan', 'lagna_muhurta', 'catering_pangat', 'varat_gruhapravesh', 'reception_satyanarayan', 'general'
  eventName?: string;
  assignedSide: TaskSide; // 'bride' | 'groom' | 'shared'
  assigneeName?: string; // e.g. "Mama", "Kaka", "Bride Sister", "Florist", "Priest"
  priority: TaskPriority;
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
  quantity?: string; // e.g. "50 Boxes", "5 kg", "2 Sets", "100 Pheta"
  estimatedCost?: number;
  actualCost?: number;
  linkedExpenseId?: string;
}

export interface WeddingEventCategory {
  id: string;
  name: string;
  marathiName: string;
  order: number;
  date?: string;
  time?: string;
  venue?: string;
  icon?: string;
  description?: string;
}

export type MainExpenseCategory =
  | 'hall_venue'
  | 'photography_drone'
  | 'catering_pangat'
  | 'decor_mandap'
  | 'makeup_nauvari_styling'
  | 'sound_dhol_tasha'
  | 'transport_hotel'
  | 'invitations_patrika'
  | 'gifts_paithani_gold'
  | 'ritual_samagri'
  | 'miscellaneous';

export interface Expense {
  id: string;
  title: string;
  category: MainExpenseCategory;
  eventId: string; // The event this expense belongs to (e.g. 'sakharpuda', 'halad', 'lagna_muhurta', etc.)
  ritualId?: string; // Optional linked ritual if applicable
  estimatedCost: number;
  actualCost: number;
  paidBy: ExpensePayer; // Who paid upfront: 'groom' | 'bride' | 'shared'
  splitRule: SplitRule;
  groomSharePercent: number; // default 50 for shared, 100 for groom, 0 for bride
  brideSharePercent: number; // default 50 for shared, 0 for groom, 100 for bride
  paymentStatus: PaymentStatus;
  paidAmount: number;
  vendorName?: string;
  vendorPhone?: string;
  billNumber?: string;
  notes?: string;
  dateAdded: string;
  linkedTaskId?: string;
}

export interface CateringMenu {
  id: string;
  ritualId: string;
  mealTitle: string;
  serviceStyle: 'traditional_banana_leaf_pangat' | 'buffet' | 'snack_counter';
  expectedHeadcount: number;
  costPerPlate: number;
  catererName: string;
  catererPhone: string;
  menuItems: {
    category: string; // e.g. 'गोड पदार्थ (Sweets)', 'भाजी / उसळ (Curries & Usal)', 'भात (Rice Varieties)', 'तोंडाला लावायचे पदार्थ (Accompaniments)'
    items: string[];
  }[];
  upvasMenu?: string[];
  notes?: string;
}

export interface WeddingProfile {
  brideName: string;
  groomName: string;
  brideFamilyTitle: string;
  groomFamilyTitle: string;
  weddingDate: string;
  mahuratTime: string;
  city: string;
  mainKaryalaya: string;
  targetBudget: number;
  groomBudgetCap: number;
  brideBudgetCap: number;
  currency: string;
  groomEmail?: string;
  brideEmail?: string;
  creatorRole?: 'groom' | 'bride';
  isSetupCompleted?: boolean;
  partnerInviteCode?: string;
}

export interface TimelineSlot {
  id: string;
  lineId: string;
  title: string;
  marathiTitle?: string;
  startTime: string; // Format "HH:mm" e.g. "07:00", "12:36", "17:00"
  endTime: string; // Format "HH:mm" e.g. "08:30", "13:00"
  eventId?: string; // Linked ceremony category id if applicable
  location?: string; // e.g. "Main Mandap", "Dining Hall", "Courtyard"
  leadPerson?: string; // e.g. "Mama", "Guruji", "Bride's Sister", "Catering Head"
  notes?: string;
  isMuhurta?: boolean; // Highlight sacred muhurta timing with special golden glow
  colorTag?: string; // e.g. 'amber' | 'rose' | 'emerald' | 'purple' | 'blue'
  completed?: boolean;
}

export type TimelineTheme = 'maroon' | 'gold' | 'emerald' | 'royal' | 'amber' | 'rose' | 'slate';

export interface TimelineLine {
  id: string;
  title: string;
  marathiTitle?: string;
  date: string; // e.g. "2026-11-28" or "Day 1 (Nov 27)"
  startHour: string; // e.g. "07:00" or "16:00" (HH:mm)
  endHour: string; // e.g. "17:00" or "23:00" (HH:mm)
  venue?: string;
  colorTheme?: TimelineTheme;
  order: number;
  slots: TimelineSlot[];
}

