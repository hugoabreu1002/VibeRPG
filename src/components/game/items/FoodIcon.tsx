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
