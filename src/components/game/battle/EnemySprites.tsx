// Unique SVG sprite for each enemy type
export function EnemySpriteBody({ sprite }: { sprite: string }) {
  switch (sprite) {
    // ── BEASTS ──
    case "slime":
      return (<g>
        <ellipse cx="0" cy="8" rx="16" ry="12" fill="#4ADE80" opacity="0.8"/>
        <ellipse cx="0" cy="6" rx="14" ry="10" fill="#22C55E"/>
        <ellipse cx="0" cy="2" rx="10" ry="7" fill="#86EFAC" opacity="0.5"/>
        <circle cx="-5" cy="2" r="3" fill="#FFF"/><circle cx="-5" cy="2" r="1.5" fill="#000"/>
        <circle cx="5" cy="2" r="3" fill="#FFF"/><circle cx="5" cy="2" r="1.5" fill="#000"/>
        <ellipse cx="0" cy="8" rx="4" ry="2" fill="#166534"/>
      </g>);
    case "rat":
      return (<g>
        <ellipse cx="0" cy="6" rx="14" ry="8" fill="#78716C"/>
        <circle cx="-10" cy="-2" r="5" fill="#A8A29E"/>
        <circle cx="-10" cy="-2" r="3" fill="#D6D3D1"/>
        <circle cx="10" cy="-2" r="5" fill="#A8A29E"/>
        <circle cx="10" cy="-2" r="3" fill="#D6D3D1"/>
        <ellipse cx="0" cy="0" rx="10" ry="7" fill="#A8A29E"/>
        <circle cx="-4" cy="-2" r="2" fill="#FFF"/><circle cx="-4" cy="-2" r="1" fill="#F00"/>
        <circle cx="4" cy="-2" r="2" fill="#FFF"/><circle cx="4" cy="-2" r="1" fill="#F00"/>
        <ellipse cx="0" cy="3" rx="2" ry="1.5" fill="#EC4899"/>
        <line x1="6" y1="2" x2="16" y2="0" stroke="#78716C" strokeWidth="1"/>
        <line x1="6" y1="3" x2="16" y2="4" stroke="#78716C" strokeWidth="1"/>
        <line x1="-6" y1="2" x2="-16" y2="0" stroke="#78716C" strokeWidth="1"/>
      </g>);
    case "boar":
      return (<g>
        <ellipse cx="0" cy="4" rx="16" ry="12" fill="#92400E"/>
        <rect x="-18" y="-4" width="8" height="6" rx="2" fill="#92400E"/>
        <ellipse cx="-16" cy="-2" rx="5" ry="4" fill="#78350F"/>
        <circle cx="-18" cy="-4" r="2" fill="#FFF"/><circle cx="-18" cy="-4" r="1" fill="#000"/>
        <path d="-22,-2 L-26,-6" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round"/>
        <path d="-22,0 L-26,2" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round"/>
        <rect x="10" y="12" width="3" height="6" fill="#78350F"/>
        <rect x="-10" y="12" width="3" height="6" fill="#78350F"/>
      </g>);
    case "hawk":
      return (<g>
        <path d="M0,-8 L-20,4 L-16,6 L0,0 L16,6 L20,4 Z" fill="#6B7280"/>
        <ellipse cx="0" cy="2" rx="8" ry="6" fill="#9CA3AF"/>
        <path d="M0,-4 L-3,2 L0,0 L3,2 Z" fill="#F59E0B"/>
        <circle cx="-4" cy="-2" r="2" fill="#FFF"/><circle cx="-4" cy="-2" r="1" fill="#000"/>
        <circle cx="4" cy="-2" r="2" fill="#FFF"/><circle cx="4" cy="-2" r="1" fill="#000"/>
        <path d="M-20,4 L-24,2 L-22,6 Z" fill="#4B5563"/>
        <path d="M20,4 L24,2 L22,6 Z" fill="#4B5563"/>
      </g>);
    case "bear":
      return (<g>
        <ellipse cx="0" cy="6" rx="18" ry="14" fill="#6B2F0A"/>
        <circle cx="-14" cy="-8" r="6" fill="#6B2F0A"/>
        <circle cx="-14" cy="-8" r="4" fill="#92400E"/>
        <circle cx="14" cy="-8" r="6" fill="#6B2F0A"/>
        <circle cx="14" cy="-8" r="4" fill="#92400E"/>
        <ellipse cx="0" cy="-2" rx="12" ry="10" fill="#92400E"/>
        <circle cx="-5" cy="-6" r="2.5" fill="#FFF"/><circle cx="-5" cy="-6" r="1.5" fill="#DC2626"/>
        <circle cx="5" cy="-6" r="2.5" fill="#FFF"/><circle cx="5" cy="-6" r="1.5" fill="#DC2626"/>
        <ellipse cx="0" cy="-1" rx="4" ry="3" fill="#451A03"/>
        <rect x="-14" y="14" width="5" height="6" rx="2" fill="#6B2F0A"/>
        <rect x="9" y="14" width="5" height="6" rx="2" fill="#6B2F0A"/>
      </g>);
    case "wolf":
      return (<g>
        <ellipse cx="0" cy="4" rx="14" ry="10" fill="#6B7280"/>
        <polygon points="-12,-8 -16,-16 -8,-10" fill="#6B7280"/>
        <polygon points="12,-8 16,-16 8,-10" fill="#6B7280"/>
        <ellipse cx="0" cy="-2" rx="10" ry="8" fill="#9CA3AF"/>
        <circle cx="-4" cy="-4" r="2.5" fill="#FEF08A"/><circle cx="-4" cy="-4" r="1.5" fill="#000"/>
        <circle cx="4" cy="-4" r="2.5" fill="#FEF08A"/><circle cx="4" cy="-4" r="1.5" fill="#000"/>
        <ellipse cx="0" cy="2" rx="4" ry="2.5" fill="#374151"/>
        <path d="M-3,4 L-1,6 L1,6 L3,4" stroke="#FFF" strokeWidth="1" fill="none"/>
      </g>);

    // ── UNDEAD ──
    case "skeleton":
      return (<g>
        <rect x="-8" y="-12" width="16" height="16" rx="2" fill="#E5E7EB"/>
        <circle cx="-4" cy="-6" r="3" fill="#111"/><circle cx="4" cy="-6" r="3" fill="#111"/>
        <rect x="-3" y="-2" width="6" height="2" fill="#111"/>
        <rect x="-2" y="4" width="4" height="16" fill="#D1D5DB"/>
        <rect x="-10" y="6" width="20" height="3" fill="#D1D5DB"/>
        <rect x="-3" y="18" width="3" height="8" fill="#D1D5DB"/>
        <rect x="1" y="18" width="3" height="8" fill="#D1D5DB"/>
        <rect x="10" y="4" width="12" height="2" fill="#A1A1AA" transform="rotate(-30,10,5)"/>
      </g>);
    case "zombie":
      return (<g>
        <rect x="-10" y="-10" width="20" height="14" rx="3" fill="#4A7C59"/>
        <circle cx="-4" cy="-6" r="3" fill="#BEF264"/><circle cx="-4" cy="-6" r="1.5" fill="#000"/>
        <circle cx="5" cy="-4" r="3" fill="#BEF264"/><circle cx="5" cy="-4" r="1.5" fill="#000"/>
        <path d="M-4,0 L4,2" stroke="#1A2E1A" strokeWidth="2"/>
        <rect x="-8" y="4" width="16" height="20" fill="#3F6212"/>
        <rect x="-12" y="6" width="6" height="3" fill="#4A7C59"/>
        <rect x="6" y="4" width="6" height="3" fill="#4A7C59" transform="rotate(20,9,5)"/>
        <rect x="-5" y="22" width="4" height="6" fill="#4A7C59"/>
        <rect x="2" y="22" width="4" height="6" fill="#4A7C59"/>
      </g>);
    case "wraith":
      return (<g>
        <path d="M0,-16 C-14,-14 -16,0 -12,16 L-8,12 L-4,18 L0,14 L4,18 L8,12 L12,16 C16,0 14,-14 0,-16Z" fill="#312E81" opacity="0.8"/>
        <path d="M0,-14 C-10,-12 -12,0 -8,10 L0,6 L8,10 C12,0 10,-12 0,-14Z" fill="#4338CA" opacity="0.6"/>
        <circle cx="-4" cy="-4" r="3" fill="#818CF8"/><circle cx="-4" cy="-4" r="1.5" fill="#FFF"/>
        <circle cx="4" cy="-4" r="3" fill="#818CF8"/><circle cx="4" cy="-4" r="1.5" fill="#FFF"/>
      </g>);
    case "lich":
      return (<g>
        <path d="M-8,-18 L8,-18 L10,-12 L-10,-12Z" fill="#7C3AED"/>
        <rect x="-10" y="-12" width="20" height="14" rx="2" fill="#E5E7EB"/>
        <circle cx="-4" cy="-6" r="3" fill="#7C3AED"/><circle cx="-4" cy="-6" r="1.5" fill="#FFF"/>
        <circle cx="4" cy="-6" r="3" fill="#7C3AED"/><circle cx="4" cy="-6" r="1.5" fill="#FFF"/>
        <rect x="-8" y="2" width="16" height="20" fill="#581C87"/>
        <line x1="0" y1="4" x2="0" y2="20" stroke="#A855F7" strokeWidth="1"/>
        <circle cx="0" cy="10" r="3" fill="#C084FC" opacity="0.6"/>
        <rect x="10" y="-4" width="2" height="24" fill="#6B21A8"/>
        <circle cx="11" cy="-6" r="4" fill="#A855F7" opacity="0.7"/>
      </g>);
    case "death-knight":
      return (<g>
        <rect x="-12" y="-14" width="24" height="16" rx="3" fill="#1C1917"/>
        <path d="M-12,-14 L0,-20 L12,-14" fill="#292524"/>
        <rect x="-3" y="-10" width="2" height="4" fill="#DC2626"/>
        <rect x="1" y="-10" width="2" height="4" fill="#DC2626"/>
        <rect x="-10" y="2" width="20" height="22" fill="#1C1917"/>
        <line x1="-6" y1="4" x2="-6" y2="22" stroke="#44403C" strokeWidth="1"/>
        <line x1="6" y1="4" x2="6" y2="22" stroke="#44403C" strokeWidth="1"/>
        <rect x="-16" y="2" width="6" height="3" fill="#292524"/>
        <rect x="10" y="2" width="6" height="3" fill="#292524"/>
        <rect x="14" y="-2" width="2" height="20" fill="#78716C"/>
        <rect x="10" y="-4" width="10" height="3" fill="#78716C"/>
      </g>);
    case "ghost":
      return (<g>
        <path d="M0,-14 C-12,-12 -14,4 -10,16 L-6,12 L-2,16 L2,12 L6,16 L10,12 C14,4 12,-12 0,-14Z" fill="#E0E7FF" opacity="0.6"/>
        <circle cx="-4" cy="-2" r="4" fill="#312E81"/><circle cx="-3" cy="-3" r="1.5" fill="#FFF"/>
        <circle cx="4" cy="-2" r="4" fill="#312E81"/><circle cx="5" cy="-3" r="1.5" fill="#FFF"/>
        <ellipse cx="0" cy="4" rx="3" ry="4" fill="#312E81" opacity="0.5"/>
      </g>);

    // ── ELEMENTAL ──
    case "fire-sprite":
      return (<g>
        <path d="M0,-16 C-4,-8 -10,-2 -8,8 C-6,14 6,14 8,8 C10,-2 4,-8 0,-16Z" fill="#F59E0B"/>
        <path d="M0,-10 C-3,-4 -6,0 -4,6 C-2,10 4,10 6,6 C8,0 3,-4 0,-10Z" fill="#EF4444"/>
        <path d="M0,-4 C-1,0 -2,2 -1,5 C0,7 2,7 3,5 C4,2 1,0 0,-4Z" fill="#FDE68A"/>
        <circle cx="-3" cy="0" r="1.5" fill="#FFF"/>
        <circle cx="3" cy="0" r="1.5" fill="#FFF"/>
      </g>);
    case "ice-golem":
      return (<g>
        <rect x="-14" y="-10" width="28" height="24" rx="4" fill="#93C5FD"/>
        <rect x="-10" y="-6" width="20" height="16" fill="#BFDBFE"/>
        <polygon points="-6,-16 -2,-10 -10,-10" fill="#60A5FA"/>
        <polygon points="6,-16 10,-10 2,-10" fill="#60A5FA"/>
        <rect x="-5" y="-4" width="4" height="3" fill="#1E3A5F"/>
        <rect x="1" y="-4" width="4" height="3" fill="#1E3A5F"/>
        <rect x="-16" y="-4" width="6" height="4" fill="#7DD3FC"/>
        <rect x="10" y="-4" width="6" height="4" fill="#7DD3FC"/>
        <rect x="-8" y="14" width="6" height="8" fill="#93C5FD"/>
        <rect x="2" y="14" width="6" height="8" fill="#93C5FD"/>
      </g>);
    case "thunder-hawk":
      return (<g>
        <path d="M0,-8 L-22,2 L-18,4 L0,-2 L18,4 L22,2 Z" fill="#6366F1"/>
        <ellipse cx="0" cy="2" rx="8" ry="6" fill="#818CF8"/>
        <circle cx="-4" cy="-1" r="2" fill="#FDE68A"/><circle cx="-4" cy="-1" r="1" fill="#000"/>
        <circle cx="4" cy="-1" r="2" fill="#FDE68A"/><circle cx="4" cy="-1" r="1" fill="#000"/>
        <path d="M0,-4 L-2,1 L2,1 Z" fill="#F59E0B"/>
        <line x1="-16" y1="0" x2="-20" y2="-6" stroke="#FDE68A" strokeWidth="2"/>
        <line x1="16" y1="0" x2="20" y2="-6" stroke="#FDE68A" strokeWidth="2"/>
      </g>);
    case "water-serpent":
      return (<g>
        <path d="M-16,8 C-12,-4 -4,-8 0,-6 C4,-4 8,4 12,2 C16,0 18,-4 20,-6" stroke="#3B82F6" strokeWidth="6" fill="none" strokeLinecap="round"/>
        <path d="M-16,8 C-12,-4 -4,-8 0,-6 C4,-4 8,4 12,2 C16,0 18,-4 20,-6" stroke="#60A5FA" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <circle cx="-16" cy="8" r="6" fill="#2563EB"/>
        <circle cx="-18" cy="6" r="2" fill="#FDE68A"/><circle cx="-18" cy="6" r="1" fill="#000"/>
        <circle cx="-14" cy="6" r="2" fill="#FDE68A"/><circle cx="-14" cy="6" r="1" fill="#000"/>
        <path d="M20,-6 L24,-10 L24,-2 Z" fill="#1D4ED8"/>
      </g>);
    case "earth-elemental":
      return (<g>
        <rect x="-16" y="-8" width="32" height="28" rx="4" fill="#78716C"/>
        <rect x="-12" y="-4" width="24" height="20" fill="#A8A29E"/>
        <polygon points="-8,-14 -4,-8 -12,-8" fill="#57534E"/>
        <polygon points="8,-12 12,-8 4,-8" fill="#57534E"/>
        <rect x="-6" y="-2" width="4" height="4" fill="#422006"/>
        <rect x="2" y="-2" width="4" height="4" fill="#422006"/>
        <rect x="-3" y="6" width="6" height="3" fill="#57534E"/>
        <rect x="-18" y="0" width="6" height="6" fill="#78716C"/>
        <rect x="12" y="0" width="6" height="6" fill="#78716C"/>
      </g>);
    case "storm-djinn":
      return (<g>
        <path d="M0,-16 C-12,-10 -8,4 -6,12 C-4,16 4,16 6,12 C8,4 12,-10 0,-16Z" fill="#7C3AED" opacity="0.7"/>
        <path d="M0,-12 C-8,-6 -4,2 -2,8 C0,12 2,12 4,8 C6,2 8,-6 0,-12Z" fill="#A78BFA" opacity="0.6"/>
        <circle cx="-4" cy="-4" r="2.5" fill="#FDE68A"/><circle cx="-4" cy="-4" r="1" fill="#000"/>
        <circle cx="4" cy="-4" r="2.5" fill="#FDE68A"/><circle cx="4" cy="-4" r="1" fill="#000"/>
        <path d="M-6,14 C-8,18 -4,22 0,20 C4,22 8,18 6,14" fill="#7C3AED" opacity="0.4"/>
        <line x1="-8" y1="-8" x2="-14" y2="-14" stroke="#C4B5FD" strokeWidth="2"/>
        <line x1="8" y1="-8" x2="14" y2="-14" stroke="#C4B5FD" strokeWidth="2"/>
      </g>);

    // ── PLANT / INSECT ──
    case "treant":
      return (<g>
        <rect x="-10" y="0" width="20" height="24" rx="4" fill="#78350F"/>
        <rect x="-6" y="4" width="12" height="16" fill="#92400E"/>
        <circle cx="-5" cy="8" r="3" fill="#14532D"/>
        <circle cx="5" cy="10" r="2.5" fill="#14532D"/>
        <ellipse cx="0" cy="14" rx="3" ry="2" fill="#1C1917"/>
        <path d="M-10,0 L-18,-10 L-14,-8 L-10,-14 L-6,-6 L0,-12 L6,-6 L10,-14 L14,-8 L18,-10 L10,0" fill="#166534"/>
        <circle cx="-12" cy="-6" r="4" fill="#22C55E" opacity="0.7"/>
        <circle cx="12" cy="-6" r="4" fill="#22C55E" opacity="0.7"/>
        <rect x="-6" y="22" width="5" height="6" fill="#78350F"/>
        <rect x="2" y="22" width="5" height="6" fill="#78350F"/>
      </g>);
    case "mushroom":
      return (<g>
        <ellipse cx="0" cy="-4" rx="14" ry="10" fill="#DC2626"/>
        <circle cx="-6" cy="-8" r="3" fill="#FDE68A"/>
        <circle cx="4" cy="-6" r="2" fill="#FDE68A"/>
        <circle cx="-2" cy="-2" r="2.5" fill="#FDE68A"/>
        <rect x="-6" y="4" width="12" height="14" rx="3" fill="#FEF3C7"/>
        <circle cx="-3" cy="8" r="2" fill="#111"/><circle cx="3" cy="8" r="2" fill="#111"/>
        <ellipse cx="0" cy="12" rx="2" ry="1" fill="#A16207"/>
      </g>);
    case "spider":
      return (<g>
        <ellipse cx="0" cy="4" rx="10" ry="8" fill="#1C1917"/>
        <circle cx="0" cy="-6" r="7" fill="#292524"/>
        <circle cx="-3" cy="-8" r="2" fill="#DC2626"/><circle cx="-3" cy="-8" r="1" fill="#000"/>
        <circle cx="3" cy="-8" r="2" fill="#DC2626"/><circle cx="3" cy="-8" r="1" fill="#000"/>
        <circle cx="-2" cy="-4" r="1" fill="#DC2626"/>
        <circle cx="2" cy="-4" r="1" fill="#DC2626"/>
        <line x1="-8" y1="-4" x2="-18" y2="-12" stroke="#292524" strokeWidth="2"/>
        <line x1="8" y1="-4" x2="18" y2="-12" stroke="#292524" strokeWidth="2"/>
        <line x1="-10" y1="2" x2="-20" y2="-2" stroke="#292524" strokeWidth="2"/>
        <line x1="10" y1="2" x2="20" y2="-2" stroke="#292524" strokeWidth="2"/>
        <line x1="-10" y1="6" x2="-18" y2="10" stroke="#292524" strokeWidth="2"/>
        <line x1="10" y1="6" x2="18" y2="10" stroke="#292524" strokeWidth="2"/>
        <line x1="-8" y1="10" x2="-14" y2="16" stroke="#292524" strokeWidth="2"/>
        <line x1="8" y1="10" x2="14" y2="16" stroke="#292524" strokeWidth="2"/>
      </g>);
    case "mantis":
      return (<g>
        <ellipse cx="0" cy="6" rx="8" ry="12" fill="#16A34A"/>
        <circle cx="0" cy="-8" r="7" fill="#22C55E"/>
        <circle cx="-4" cy="-10" r="3" fill="#FDE68A"/><circle cx="-4" cy="-10" r="1.5" fill="#000"/>
        <circle cx="4" cy="-10" r="3" fill="#FDE68A"/><circle cx="4" cy="-10" r="1.5" fill="#000"/>
        <path d="M-8,-6 L-16,-16 L-20,-14" stroke="#15803D" strokeWidth="2.5" fill="none"/>
        <path d="M8,-6 L16,-16 L20,-14" stroke="#15803D" strokeWidth="2.5" fill="none"/>
        <line x1="-6" y1="14" x2="-10" y2="22" stroke="#16A34A" strokeWidth="2"/>
        <line x1="6" y1="14" x2="10" y2="22" stroke="#16A34A" strokeWidth="2"/>
      </g>);

    // ── DEMONIC ──
    case "imp":
      return (<g>
        <circle cx="0" cy="-4" r="8" fill="#DC2626"/>
        <polygon points="-8,-8 -12,-16 -4,-10" fill="#991B1B"/>
        <polygon points="8,-8 12,-16 4,-10" fill="#991B1B"/>
        <circle cx="-3" cy="-6" r="2" fill="#FDE68A"/><circle cx="-3" cy="-6" r="1" fill="#000"/>
        <circle cx="3" cy="-6" r="2" fill="#FDE68A"/><circle cx="3" cy="-6" r="1" fill="#000"/>
        <path d="M-3,0 L0,2 L3,0" stroke="#7F1D1D" strokeWidth="1.5" fill="none"/>
        <rect x="-4" y="4" width="8" height="12" fill="#B91C1C"/>
        <path d="M-6,2 L-10,6 L-8,8 Z" fill="#991B1B"/>
        <path d="M6,2 L10,6 L8,8 Z" fill="#991B1B"/>
        <path d="M0,16 C2,20 4,22 6,18" stroke="#DC2626" strokeWidth="1.5" fill="none"/>
      </g>);
    case "shadow-fiend":
      return (<g>
        <path d="M0,-16 C-16,-8 -14,8 -10,16 L-6,10 L0,16 L6,10 L10,16 C14,8 16,-8 0,-16Z" fill="#1E1B4B" opacity="0.85"/>
        <path d="M0,-12 C-10,-6 -8,4 -6,10 L0,6 L6,10 C8,4 10,-6 0,-12Z" fill="#312E81" opacity="0.7"/>
        <circle cx="-5" cy="-2" r="3" fill="#A855F7"/><circle cx="-5" cy="-2" r="1.5" fill="#FFF"/>
        <circle cx="5" cy="-2" r="3" fill="#A855F7"/><circle cx="5" cy="-2" r="1.5" fill="#FFF"/>
        <path d="M-14,-10 L-18,-18" stroke="#6B21A8" strokeWidth="1.5"/>
        <path d="M14,-10 L18,-18" stroke="#6B21A8" strokeWidth="1.5"/>
      </g>);
    case "hellhound":
      return (<g>
        <ellipse cx="0" cy="4" rx="14" ry="10" fill="#7F1D1D"/>
        <polygon points="-10,-6 -14,-16 -6,-8" fill="#991B1B"/>
        <polygon points="10,-6 14,-16 6,-8" fill="#991B1B"/>
        <ellipse cx="0" cy="-2" rx="10" ry="8" fill="#991B1B"/>
        <circle cx="-4" cy="-4" r="2.5" fill="#F59E0B"/><circle cx="-4" cy="-4" r="1.5" fill="#000"/>
        <circle cx="4" cy="-4" r="2.5" fill="#F59E0B"/><circle cx="4" cy="-4" r="1.5" fill="#000"/>
        <ellipse cx="0" cy="2" rx="4" ry="2.5" fill="#450A0A"/>
        <path d="M-3,4 L-1,6 L1,6 L3,4" stroke="#FDE68A" strokeWidth="1"/>
        <path d="M-8,8 C-10,12 -6,14 -4,12" stroke="#EF4444" strokeWidth="2" fill="#F59E0B" opacity="0.6"/>
        <path d="M8,8 C10,12 6,14 4,12" stroke="#EF4444" strokeWidth="2" fill="#F59E0B" opacity="0.6"/>
      </g>);
    case "succubus":
      return (<g>
        <circle cx="0" cy="-6" r="8" fill="#FDE68A"/>
        <path d="M-8,-10 C-10,-18 -4,-20 -2,-14" stroke="#7C2D12" strokeWidth="2" fill="none"/>
        <path d="M8,-10 C10,-18 4,-20 2,-14" stroke="#7C2D12" strokeWidth="2" fill="none"/>
        <circle cx="-3" cy="-8" r="2" fill="#A855F7"/><circle cx="-3" cy="-8" r="1" fill="#000"/>
        <circle cx="3" cy="-8" r="2" fill="#A855F7"/><circle cx="3" cy="-8" r="1" fill="#000"/>
        <path d="M-2,-3 C0,-1 2,-3" stroke="#DC2626" strokeWidth="1"/>
        <rect x="-6" y="2" width="12" height="16" rx="2" fill="#7C3AED"/>
        <path d="M-10,4 L-20,-2 L-18,6 Z" fill="#6B21A8" opacity="0.6"/>
        <path d="M10,4 L20,-2 L18,6 Z" fill="#6B21A8" opacity="0.6"/>
        <path d="M2,18 C4,24 6,22 4,18" stroke="#DC2626" strokeWidth="1.5" fill="none"/>
      </g>);
    case "arch-demon":
      return (<g>
        <rect x="-14" y="-6" width="28" height="28" rx="4" fill="#7F1D1D"/>
        <path d="M-14,-6 L-10,-18 L-6,-6" fill="#991B1B"/>
        <path d="M14,-6 L10,-18 L6,-6" fill="#991B1B"/>
        <rect x="-10" y="-2" width="20" height="20" fill="#991B1B"/>
        <circle cx="-5" cy="2" r="3.5" fill="#F59E0B"/><circle cx="-5" cy="2" r="2" fill="#000"/>
        <circle cx="5" cy="2" r="3.5" fill="#F59E0B"/><circle cx="5" cy="2" r="2" fill="#000"/>
        <path d="M-4,10 L-2,12 L0,10 L2,12 L4,10" stroke="#FDE68A" strokeWidth="1.5"/>
        <path d="M-16,-2 L-24,-10 L-22,2 Z" fill="#991B1B"/>
        <path d="M16,-2 L24,-10 L22,2 Z" fill="#991B1B"/>
        <path d="M0,22 C-4,28 4,28 0,22" fill="#F59E0B" opacity="0.5"/>
      </g>);
    case "dark-corrupter":
      return (<g>
        <path d="M0,-14 C-14,-8 -12,8 -8,16 L0,10 L8,16 C12,8 14,-8 0,-14Z" fill="#581C87" opacity="0.8"/>
        <circle cx="-4" cy="-2" r="3" fill="#A855F7"/><circle cx="-4" cy="-2" r="1.5" fill="#FFF"/>
        <circle cx="4" cy="-2" r="3" fill="#A855F7"/><circle cx="4" cy="-2" r="1.5" fill="#FFF"/>
        <path d="M-2,4 L2,4" stroke="#C084FC" strokeWidth="2"/>
        <circle cx="0" cy="8" r="4" fill="#7C3AED" opacity="0.5"/>
      </g>);

    // ── DRAGONS ──
    case "wyvern":
      return (<g>
        <ellipse cx="0" cy="4" rx="12" ry="10" fill="#166534"/>
        <path d="M0,-6 L-24,0 L-20,4 L0,0 L20,4 L24,0 Z" fill="#15803D"/>
        <ellipse cx="4" cy="-6" rx="8" ry="6" fill="#22C55E"/>
        <path d="M10,-6 L14,-4 L12,-2" fill="#F59E0B"/>
        <circle cx="2" cy="-8" r="2.5" fill="#FDE68A"/><circle cx="2" cy="-8" r="1.5" fill="#000"/>
        <circle cx="8" cy="-8" r="2" fill="#FDE68A"/><circle cx="8" cy="-8" r="1" fill="#000"/>
        <path d="M-24,0 L-28,-4 L-26,2 Z" fill="#14532D"/>
        <path d="M24,0 L28,-4 L26,2 Z" fill="#14532D"/>
        <path d="M-6,14 C-8,18 -4,20 -2,16" stroke="#166534" strokeWidth="2" fill="none"/>
      </g>);
    case "drake":
      return (<g>
        <ellipse cx="0" cy="4" rx="14" ry="12" fill="#B91C1C"/>
        <path d="M0,-8 L-20,-2 L-16,2 L0,-4 L16,2 L20,-2 Z" fill="#DC2626"/>
        <ellipse cx="6" cy="-8" rx="9" ry="7" fill="#EF4444"/>
        <path d="M14,-8 L18,-6 L16,-4" fill="#F59E0B"/>
        <circle cx="4" cy="-10" r="2.5" fill="#FDE68A"/><circle cx="4" cy="-10" r="1.5" fill="#000"/>
        <circle cx="10" cy="-10" r="2" fill="#FDE68A"/><circle cx="10" cy="-10" r="1" fill="#000"/>
        <polygon points="0,-14 -4,-18 4,-18" fill="#991B1B"/>
        <polygon points="8,-14 6,-18 12,-16" fill="#991B1B"/>
        <path d="M14,-4 L18,-2 L14,0" fill="#F59E0B" opacity="0.6"/>
      </g>);
    case "crystal-dragon":
      return (<g>
        <ellipse cx="0" cy="4" rx="14" ry="12" fill="#7C3AED"/>
        <path d="M0,-8 L-22,-2 L-18,2 L0,-4 L18,2 L22,-2 Z" fill="#8B5CF6"/>
        <ellipse cx="6" cy="-8" rx="9" ry="7" fill="#A78BFA"/>
        <circle cx="4" cy="-10" r="2.5" fill="#FDE68A"/><circle cx="4" cy="-10" r="1.5" fill="#C084FC"/>
        <circle cx="10" cy="-10" r="2" fill="#FDE68A"/><circle cx="10" cy="-10" r="1" fill="#C084FC"/>
        <polygon points="-4,-16 0,-22 4,-16" fill="#E9D5FF"/>
        <polygon points="8,-14 12,-20 14,-14" fill="#E9D5FF"/>
        <polygon points="-6,0 -10,-4 -8,2" fill="#C4B5FD" opacity="0.6"/>
        <polygon points="14,0 18,-4 16,2" fill="#C4B5FD" opacity="0.6"/>
        <circle cx="0" cy="6" r="4" fill="#DDD6FE" opacity="0.4"/>
      </g>);
    case "elder-dragon":
      return (<g>
        <ellipse cx="0" cy="4" rx="18" ry="14" fill="#78350F"/>
        <path d="M0,-10 L-26,-4 L-22,0 L0,-6 L22,0 L26,-4 Z" fill="#92400E"/>
        <ellipse cx="8" cy="-10" rx="11" ry="8" fill="#B45309"/>
        <polygon points="-2,-18 2,-24 6,-18" fill="#D97706"/>
        <polygon points="10,-18 14,-24 16,-16" fill="#D97706"/>
        <polygon points="-8,-16 -12,-22 -6,-16" fill="#D97706"/>
        <circle cx="4" cy="-12" r="3" fill="#F59E0B"/><circle cx="4" cy="-12" r="1.5" fill="#7F1D1D"/>
        <circle cx="12" cy="-12" r="3" fill="#F59E0B"/><circle cx="12" cy="-12" r="1.5" fill="#7F1D1D"/>
        <path d="M16,-8 L22,-6 L18,-4" fill="#F59E0B"/>
        <rect x="-12" y="14" width="5" height="8" rx="2" fill="#78350F"/>
        <rect x="8" y="14" width="5" height="8" rx="2" fill="#78350F"/>
      </g>);

    // ── HUMANOID ──
    case "goblin":
      return (<g>
        <circle cx="0" cy="-6" r="8" fill="#4ADE80"/>
        <polygon points="-8,-8 -14,-4 -8,-4" fill="#22C55E"/>
        <polygon points="8,-8 14,-4 8,-4" fill="#22C55E"/>
        <circle cx="-3" cy="-8" r="2.5" fill="#FDE68A"/><circle cx="-3" cy="-8" r="1.5" fill="#000"/>
        <circle cx="3" cy="-8" r="2.5" fill="#FDE68A"/><circle cx="3" cy="-8" r="1.5" fill="#000"/>
        <ellipse cx="0" cy="-2" rx="3" ry="2" fill="#166534"/>
        <rect x="-5" y="2" width="10" height="14" fill="#713F12"/>
        <rect x="-2" y="14" width="3" height="6" fill="#4ADE80"/>
        <rect x="1" y="14" width="3" height="6" fill="#4ADE80"/>
        <rect x="5" y="0" width="2" height="10" fill="#78716C" transform="rotate(-20,6,5)"/>
      </g>);
    case "orc":
      return (<g>
        <rect x="-10" y="-12" width="20" height="16" rx="3" fill="#16A34A"/>
        <circle cx="-4" cy="-6" r="2.5" fill="#FDE68A"/><circle cx="-4" cy="-6" r="1.5" fill="#DC2626"/>
        <circle cx="4" cy="-6" r="2.5" fill="#FDE68A"/><circle cx="4" cy="-6" r="1.5" fill="#DC2626"/>
        <path d="M-4,-1 L-2,2" stroke="#FFF" strokeWidth="2"/><path d="M4,-1 L2,2" stroke="#FFF" strokeWidth="2"/>
        <rect x="-12" y="4" width="24" height="20" fill="#78350F"/>
        <rect x="-16" y="6" width="6" height="5" fill="#16A34A"/>
        <rect x="10" y="6" width="6" height="5" fill="#16A34A"/>
        <rect x="14" y="0" width="3" height="18" fill="#78716C"/>
        <rect x="10" y="-2" width="10" height="4" fill="#78716C"/>
      </g>);
    case "dark-mage":
      return (<g>
        <path d="M-8,-18 L0,-28 L8,-18" fill="#581C87"/>
        <circle cx="0" cy="-12" r="8" fill="#FECACA"/>
        <circle cx="-3" cy="-14" r="2" fill="#7C3AED"/><circle cx="-3" cy="-14" r="1" fill="#000"/>
        <circle cx="3" cy="-14" r="2" fill="#7C3AED"/><circle cx="3" cy="-14" r="1" fill="#000"/>
        <rect x="-8" y="-4" width="16" height="22" fill="#581C87"/>
        <line x1="0" y1="-2" x2="0" y2="16" stroke="#A855F7" strokeWidth="1"/>
        <rect x="8" y="-8" width="2" height="24" fill="#6B21A8"/>
        <circle cx="9" cy="-10" r="3" fill="#C084FC" opacity="0.7"/>
      </g>);
    case "bandit":
      return (<g>
        <circle cx="0" cy="-8" r="8" fill="#DEB887"/>
        <rect x="-8" y="-12" width="16" height="4" fill="#1C1917"/>
        <rect x="-10" y="-10" width="20" height="2" fill="#292524"/>
        <circle cx="-3" cy="-8" r="2" fill="#000"/>
        <circle cx="3" cy="-8" r="2" fill="#000"/>
        <rect x="-6" y="-4" width="12" height="2" fill="#7C2D12"/>
        <rect x="-8" y="0" width="16" height="18" fill="#44403C"/>
        <rect x="-12" y="2" width="6" height="4" fill="#DEB887"/>
        <rect x="6" y="2" width="6" height="4" fill="#DEB887"/>
        <rect x="10" y="0" width="2" height="14" fill="#78716C"/>
      </g>);
    case "knight":
      return (<g>
        <rect x="-10" y="-14" width="20" height="16" rx="2" fill="#6B7280"/>
        <path d="M0,-18 L-10,-14 L10,-14 Z" fill="#9CA3AF"/>
        <rect x="-3" y="-10" width="2" height="4" fill="#1E3A5F"/>
        <rect x="1" y="-10" width="2" height="4" fill="#1E3A5F"/>
        <rect x="-10" y="2" width="20" height="22" fill="#6B7280"/>
        <line x1="0" y1="4" x2="0" y2="22" stroke="#9CA3AF" strokeWidth="1"/>
        <line x1="-8" y1="12" x2="8" y2="12" stroke="#9CA3AF" strokeWidth="1"/>
        <rect x="-16" y="2" width="8" height="4" fill="#6B7280"/>
        <rect x="8" y="2" width="8" height="4" fill="#6B7280"/>
        <rect x="-18" y="-2" width="4" height="16" fill="#9CA3AF"/>
        <ellipse cx="-18" cy="0" rx="6" ry="8" fill="#4B5563" opacity="0.5"/>
      </g>);

    // ── MAGICAL ──
    case "spirit":
      return (<g>
        <circle cx="0" cy="0" r="12" fill="#818CF8" opacity="0.5"/>
        <circle cx="0" cy="0" r="8" fill="#A5B4FC" opacity="0.6"/>
        <circle cx="-3" cy="-2" r="2.5" fill="#FFF"/><circle cx="-3" cy="-2" r="1.5" fill="#4338CA"/>
        <circle cx="3" cy="-2" r="2.5" fill="#FFF"/><circle cx="3" cy="-2" r="1.5" fill="#4338CA"/>
        <ellipse cx="0" cy="4" rx="2" ry="3" fill="#6366F1" opacity="0.5"/>
      </g>);
    case "arcane-book":
      return (<g>
        <rect x="-12" y="-10" width="24" height="20" rx="2" fill="#7C2D12"/>
        <rect x="-10" y="-8" width="20" height="16" fill="#FEF3C7"/>
        <line x1="-8" y1="-4" x2="8" y2="-4" stroke="#A16207" strokeWidth="1"/>
        <line x1="-8" y1="0" x2="8" y2="0" stroke="#A16207" strokeWidth="1"/>
        <line x1="-8" y1="4" x2="4" y2="4" stroke="#A16207" strokeWidth="1"/>
        <circle cx="-4" cy="-6" r="2" fill="#7C3AED"/>
        <circle cx="4" cy="-6" r="2" fill="#7C3AED"/>
        <rect x="-12" y="-2" width="2" height="12" fill="#92400E"/>
        <circle cx="0" cy="10" r="3" fill="#A855F7" opacity="0.5"/>
      </g>);
    case "plague-beast":
      return (<g>
        <ellipse cx="0" cy="4" rx="14" ry="10" fill="#4D7C0F"/>
        <ellipse cx="0" cy="0" rx="10" ry="8" fill="#65A30D"/>
        <circle cx="-4" cy="-4" r="3" fill="#BEF264"/><circle cx="-4" cy="-4" r="1.5" fill="#000"/>
        <circle cx="4" cy="-4" r="3" fill="#BEF264"/><circle cx="4" cy="-4" r="1.5" fill="#000"/>
        <ellipse cx="0" cy="2" rx="3" ry="2" fill="#365314"/>
        <circle cx="-8" cy="6" r="3" fill="#84CC16" opacity="0.5"/>
        <circle cx="10" cy="2" r="2" fill="#84CC16" opacity="0.5"/>
        <circle cx="6" cy="10" r="2.5" fill="#84CC16" opacity="0.4"/>
      </g>);
    case "mimic":
      return (<g>
        <rect x="-14" y="-4" width="28" height="18" rx="3" fill="#92400E"/>
        <rect x="-12" y="-2" width="24" height="14" fill="#B45309"/>
        <rect x="-14" y="-4" width="28" height="4" fill="#A16207"/>
        <rect x="-10" y="-2" width="20" height="2" fill="#D97706"/>
        <circle cx="-4" cy="4" r="3" fill="#FFF"/><circle cx="-4" cy="4" r="1.5" fill="#DC2626"/>
        <circle cx="4" cy="4" r="3" fill="#FFF"/><circle cx="4" cy="4" r="1.5" fill="#DC2626"/>
        <path d="M-8,10 L-6,14 L-4,10 L-2,14 L0,10 L2,14 L4,10 L6,14 L8,10" stroke="#FDE68A" strokeWidth="1.5" fill="none"/>
        <rect x="-4" y="-8" width="8" height="4" rx="2" fill="#78350F"/>
      </g>);

    // Default fallback
    default:
      return (<g>
        <rect x="-14" y="-8" width="28" height="28" rx="4" fill="#4B5563"/>
        <circle cx="-5" cy="0" r="3.5" fill="#F59E0B"/><circle cx="-5" cy="0" r="2" fill="#000"/>
        <circle cx="5" cy="0" r="3.5" fill="#F59E0B"/><circle cx="5" cy="0" r="2" fill="#000"/>
        <path d="M-4,8 L0,10 L4,8" stroke="#FFF" strokeWidth="1.5" fill="none"/>
      </g>);
  }
}
