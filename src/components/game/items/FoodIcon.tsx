import { motion } from "framer-motion";

interface FoodIconProps {
  foodId: string;
  className?: string;
  size?: string;
}

export function FoodIcon({ foodId, className = "", size = "w-8 h-8" }: FoodIconProps) {
  const getIcon = () => {
    const baseId = foodId.replace(/-[0-9]+$/, '');
    switch (baseId) {
      case "food-bread":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 6C4.23858 6 2 8.23858 2 11V14C2 16.7614 4.23858 19 7 19H17C19.7614 19 22 16.7614 22 14V11C22 8.23858 19.7614 6 17 6H7Z" fill="#D2B48C" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 6V19" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 6V19" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 6V19" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "food-milk":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2H16" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 2V6L7 11V22H17V11L14 6V2" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 16H17" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 11H17" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 14H14" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "food-meat":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 14C6 14 3.5 12.5 3.5 10C3.5 7.5 5.5 6 8 8C10.5 10 9 12.5 9 12.5" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18 10C18 10 20.5 11.5 20.5 14C20.5 16.5 18.5 18 16 16C13.5 14 15 11.5 15 11.5" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 8C8 8 9 4 14 5C19 6 16 16 16 16" fill="#A0522D" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 10L14 14" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "food-beer":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9V22H16V9" fill="#FBBF24" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 12H19C20.6569 12 22 13.3431 22 15V16C22 17.6569 20.6569 19 19 19H16" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 9C5 9 5 5 9 5C13 5 13 8 15 8C17 8 17 9 17 9H5Z" fill="#FCD34D" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 9V22" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "food-honey-cake":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="10" width="18" height="10" rx="2" fill="#D97706" stroke="#92400E" strokeWidth="2"/>
            <rect x="5" y="12" width="14" height="6" fill="#FCD34D"/>
            <path d="M8 8L12 4L16 8" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="14" r="2" fill="#F59E0B"/>
            <path d="M6 14H18" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        );
      case "food-elixir-soup":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="12" cy="18" rx="8" ry="4" fill="#4C1D95" stroke="#7C3AED" strokeWidth="2"/>
            <path d="M4 18V12C4 8 8 6 12 6C16 6 20 8 20 12V18" stroke="#7C3AED" strokeWidth="2"/>
            <path d="M8 14C8 14 9 12 12 12C15 12 16 14 16 14" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="10" cy="16" r="1" fill="#A78BFA"/>
            <circle cx="14" cy="16" r="1" fill="#A78BFA"/>
            <path d="M12 2V6" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
            <path d="M9 3L12 6L15 3" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "food-dragon-fruit":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="12" cy="14" rx="7" ry="8" fill="#EC4899" stroke="#DB2777" strokeWidth="2"/>
            <path d="M8 10C8 10 9 8 12 8C15 8 16 10 16 10" stroke="#FBCFE8" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="10" cy="12" r="1" fill="#FBCFE8"/>
            <circle cx="14" cy="12" r="1" fill="#FBCFE8"/>
            <circle cx="12" cy="16" r="1" fill="#FBCFE8"/>
            <path d="M12 2C12 2 8 4 8 6C8 8 12 8 12 8C12 8 16 8 16 6C16 4 12 2 12 2Z" fill="#22C55E" stroke="#16A34A" strokeWidth="1.5"/>
            <path d="M12 8V10" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        );
      case "potion-health-minor":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3H15L16 7H8L9 3Z" fill="#6B7280" stroke="#4B5563" strokeWidth="1.5"/>
            <path d="M8 7H16V18C16 20 14 22 12 22C10 22 8 20 8 18V7Z" fill="#EF4444" stroke="#DC2626" strokeWidth="2"/>
            <path d="M12 10V16" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round"/>
            <path d="M9 13H15" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case "potion-health":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3H15L16 7H8L9 3Z" fill="#9CA3AF" stroke="#6B7280" strokeWidth="1.5"/>
            <path d="M8 7H16V18C16 20 14 22 12 22C10 22 8 20 8 18V7Z" fill="#DC2626" stroke="#B91C1C" strokeWidth="2"/>
            <path d="M12 10V16" stroke="#FECACA" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M9 13H15" stroke="#FECACA" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="10" cy="10" r="1" fill="#FECACA" opacity="0.6"/>
          </svg>
        );
      case "potion-health-major":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3H15L16 7H8L9 3Z" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2"/>
            <path d="M8 7H16V18C16 20 14 22 12 22C10 22 8 20 8 18V7Z" fill="#B91C1C" stroke="#991B1B" strokeWidth="2"/>
            <path d="M12 9V17" stroke="#FEE2E2" strokeWidth="3" strokeLinecap="round"/>
            <path d="M8.5 13H15.5" stroke="#FEE2E2" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="10" cy="10" r="1.5" fill="#FEE2E2" opacity="0.8"/>
            <circle cx="14" cy="10" r="1.5" fill="#FEE2E2" opacity="0.8"/>
            <path d="M10 6L12 4L14 6" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "potion-mana-minor":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3H15L16 7H8L9 3Z" fill="#6B7280" stroke="#4B5563" strokeWidth="1.5"/>
            <path d="M8 7H16V18C16 20 14 22 12 22C10 22 8 20 8 18V7Z" fill="#3B82F6" stroke="#2563EB" strokeWidth="2"/>
            <path d="M12 10L10 14H14L12 18" stroke="#BFDBFE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "potion-mana":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3H15L16 7H8L9 3Z" fill="#9CA3AF" stroke="#6B7280" strokeWidth="1.5"/>
            <path d="M8 7H16V18C16 20 14 22 12 22C10 22 8 20 8 18V7Z" fill="#2563EB" stroke="#1D4ED8" strokeWidth="2"/>
            <path d="M12 9L9.5 14H14.5L12 19" stroke="#DBEAFE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="10" cy="11" r="1" fill="#DBEAFE" opacity="0.6"/>
          </svg>
        );
      case "potion-mana-major":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3H15L16 7H8L9 3Z" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2"/>
            <path d="M8 7H16V18C16 20 14 22 12 22C10 22 8 20 8 18V7Z" fill="#1D4ED8" stroke="#1E40AF" strokeWidth="2"/>
            <path d="M12 8L9 14H15L12 20" stroke="#EFF6FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9.5" cy="11" r="1.5" fill="#EFF6FF" opacity="0.8"/>
            <circle cx="14.5" cy="11" r="1.5" fill="#EFF6FF" opacity="0.8"/>
            <path d="M10 6L12 4L14 6" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "potion-elixir-vitality":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 2H15L16 6H8L9 2Z" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2"/>
            <path d="M8 6H16V17C16 19 14 21 12 21C10 21 8 19 8 17V6Z" fill="url(#goldGradient)" stroke="#F59E0B" strokeWidth="2"/>
            <defs>
              <linearGradient id="goldGradient" x1="12" y1="6" x2="12" y2="21" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FCD34D"/>
                <stop offset="1" stopColor="#D97706"/>
              </linearGradient>
            </defs>
            <path d="M12 9V15" stroke="#FEF3C7" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M9 12H15" stroke="#FEF3C7" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="2" fill="#FEF3C7" opacity="0.5"/>
            <path d="M10 5L12 3L14 5" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="10" cy="9" r="1" fill="#FEF3C7" opacity="0.8"/>
            <circle cx="14" cy="9" r="1" fill="#FEF3C7" opacity="0.8"/>
          </svg>
        );
      case "potion-strength":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3H15L16 7H8L9 3Z" fill="#6B7280" stroke="#4B5563" strokeWidth="1.5"/>
            <path d="M8 7H16V18C16 20 14 22 12 22C10 22 8 20 8 18V7Z" fill="#DC2626" stroke="#B91C1C" strokeWidth="2"/>
            <path d="M10 10L14 10L14 14L10 14Z" fill="#FEE2E2" stroke="#FECACA" strokeWidth="1"/>
            <path d="M12 8V16" stroke="#FECACA" strokeWidth="2" strokeLinecap="round"/>
            <path d="M9 12H15" stroke="#FECACA" strokeWidth="2" strokeLinecap="round"/>
            <path d="M10 10L14 14" stroke="#FECACA" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        );
      case "potion-defense":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3H15L16 7H8L9 3Z" fill="#9CA3AF" stroke="#6B7280" strokeWidth="1.5"/>
            <path d="M8 7H16V18C16 20 14 22 12 22C10 22 8 20 8 18V7Z" fill="#78716C" stroke="#57534E" strokeWidth="2"/>
            <path d="M12 9L9 12V16L12 19L15 16V12L12 9Z" fill="#D6D3D1" stroke="#A8A29E" strokeWidth="1.5"/>
            <circle cx="12" cy="14" r="2" fill="#78716C"/>
          </svg>
        );
      case "potion-magic":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3H15L16 7H8L9 3Z" fill="#9CA3AF" stroke="#6B7280" strokeWidth="1.5"/>
            <path d="M8 7H16V18C16 20 14 22 12 22C10 22 8 20 8 18V7Z" fill="#7C3AED" stroke="#6D28D9" strokeWidth="2"/>
            <path d="M12 9L10 13H14L12 17" stroke="#DDD6FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="13" r="2" fill="#DDD6FE" opacity="0.5"/>
            <path d="M10 10L14 16" stroke="#DDD6FE" strokeWidth="1" strokeLinecap="round"/>
            <path d="M14 10L10 16" stroke="#DDD6FE" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        );
      case "scroll-teleport":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4H18V20H6V4Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="2"/>
            <path d="M6 4C6 4 6 2 8 2H16C18 2 18 4 18 4" stroke="#D97706" strokeWidth="2"/>
            <path d="M6 20C6 20 6 22 8 22H16C18 22 18 20 18 20" stroke="#D97706" strokeWidth="2"/>
            <path d="M9 8H15" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M9 11H15" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M9 14H13" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="14" cy="17" r="2" fill="#8B5CF6" stroke="#7C3AED" strokeWidth="1"/>
            <path d="M14 15V19" stroke="#7C3AED" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        );
      case "crystal-healing":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L8 8V16L12 22L16 16V8L12 2Z" fill="#10B981" stroke="#059669" strokeWidth="2"/>
            <path d="M12 6L10 10V14L12 18L14 14V10L12 6Z" fill="#6EE7B7"/>
            <path d="M12 8V16" stroke="#059669" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M9 12H15" stroke="#059669" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="1" fill="#059669"/>
          </svg>
        );
      case "amulet-revival":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C12 2 6 6 6 12C6 18 12 22 12 22C12 22 18 18 18 12C18 6 12 2 12 2Z" fill="#F59E0B" stroke="#D97706" strokeWidth="2"/>
            <path d="M12 6C12 6 8 9 8 13C8 17 12 19 12 19C12 19 16 17 16 13C16 9 12 6 12 6Z" fill="#FCD34D"/>
            <path d="M12 9V15" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
            <path d="M9 12H15" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="2" fill="#FEF3C7"/>
            <path d="M10 8L12 6L14 8" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 16L12 18L14 16" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <div className="w-full h-full rounded-md bg-slate-700 border-2 border-slate-600 flex items-center justify-center">
            <span className="text-xs text-slate-400">?</span>
          </div>
        );
    }
  };

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`relative ${size} ${className}`}
    >
      {getIcon()}
    </motion.div>
  );
}
