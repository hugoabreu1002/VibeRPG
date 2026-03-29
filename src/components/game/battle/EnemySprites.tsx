// Enhanced SVG sprites for Ragnarok Online-style monsters
export function EnemySpriteBody({ sprite }: { sprite: string }) {
  switch (sprite) {
    // ── BEASTS ──────────────────────────────────────────────
    case "slime":
      return (<g>
        <ellipse cx="0" cy="12" rx="24" ry="18" fill="#4ADE80" opacity="0.8" />
        <ellipse cx="0" cy="9" rx="21" ry="15" fill="#22C55E" />
        <ellipse cx="0" cy="4" rx="15" ry="10" fill="#86EFAC" opacity="0.6" />
        <circle cx="-8" cy="4" r="6" fill="#FFF" /><circle cx="-8" cy="4" r="3" fill="#000" />
        <circle cx="8" cy="4" r="6" fill="#FFF" /><circle cx="8" cy="4" r="3" fill="#000" />
        <ellipse cx="0" cy="12" rx="8" ry="4" fill="#166534" />
        <circle cx="0" cy="20" r="4" fill="#22C55E" opacity="0.3" />
      </g>);
    case "rat":
      return (<g>
        <ellipse cx="0" cy="12" rx="28" ry="16" fill="#78716C" />
        <circle cx="-20" cy="-4" r="10" fill="#A8A29E" />
        <circle cx="-20" cy="-4" r="6" fill="#D6D3D1" />
        <circle cx="20" cy="-4" r="10" fill="#A8A29E" />
        <circle cx="20" cy="-4" r="6" fill="#D6D3D1" />
        <ellipse cx="0" cy="0" rx="20" ry="14" fill="#A8A29E" />
        <circle cx="-8" cy="-4" r="4" fill="#FFF" /><circle cx="-8" cy="-4" r="2" fill="#F00" />
        <circle cx="8" cy="-4" r="4" fill="#FFF" /><circle cx="8" cy="-4" r="2" fill="#F00" />
        <ellipse cx="0" cy="6" rx="4" ry="3" fill="#EC4899" />
        <line x1="12" y1="4" x2="32" y2="0" stroke="#78716C" strokeWidth="2" />
        <line x1="12" y1="6" x2="32" y2="8" stroke="#78716C" strokeWidth="2" />
        <line x1="-12" y1="4" x2="-32" y2="0" stroke="#78716C" strokeWidth="2" />
        <path d="M-16,16 L-20,20 L-12,20 Z" fill="#78716C" opacity="0.6" />
        <path d="M16,16 L20,20 L12,20 Z" fill="#78716C" opacity="0.6" />
      </g>);
    case "boar":
      return (<g>
        <ellipse cx="0" cy="8" rx="32" ry="24" fill="#92400E" />
        <rect x="-36" y="-8" width="16" height="12" rx="4" fill="#92400E" />
        <ellipse cx="-32" cy="-4" rx="10" ry="8" fill="#78350F" />
        <circle cx="-36" cy="-8" r="4" fill="#FFF" /><circle cx="-36" cy="-8" r="2" fill="#000" />
        <path d="-44,-4 L-52,-12" stroke="#FDE68A" strokeWidth="3" strokeLinecap="round" />
        <path d="-44,0 L-52,4" stroke="#FDE68A" strokeWidth="3" strokeLinecap="round" />
        <rect x="20" y="24" width="6" height="12" fill="#78350F" />
        <rect x="-20" y="24" width="6" height="12" fill="#78350F" />
        <ellipse cx="0" cy="20" rx="6" ry="4" fill="#B91C1C" opacity="0.3" />
      </g>);
    case "hawk":
      return (<g>
        <path d="M0,-16 L-40,8 L-32,12 L0,0 L32,12 L40,8 Z" fill="#6B7280" />
        <ellipse cx="0" cy="4" rx="16" ry="12" fill="#9CA3AF" />
        <path d="M0,-8 L-6,4 L0,-2 L6,4 Z" fill="#F59E0B" />
        <circle cx="-8" cy="-4" r="4" fill="#FFF" /><circle cx="-8" cy="-4" r="2" fill="#000" />
        <circle cx="8" cy="-4" r="4" fill="#FFF" /><circle cx="8" cy="-4" r="2" fill="#000" />
        <path d="M-40,8 L-48,4 L-44,12 Z" fill="#4B5563" />
        <path d="M40,8 L48,4 L44,12 Z" fill="#4B5563" />
        <ellipse cx="0" cy="16" rx="8" ry="6" fill="#F59E0B" opacity="0.3" />
      </g>);
    case "bear":
      return (<g>
        <ellipse cx="0" cy="12" rx="36" ry="28" fill="#6B2F0A" />
        <circle cx="-28" cy="-16" r="12" fill="#6B2F0A" />
        <circle cx="-28" cy="-16" r="8" fill="#92400E" />
        <circle cx="28" cy="-16" r="12" fill="#6B2F0A" />
        <circle cx="28" cy="-16" r="8" fill="#92400E" />
        <ellipse cx="0" cy="-4" rx="24" ry="20" fill="#92400E" />
        <circle cx="-10" cy="-12" r="5" fill="#FFF" /><circle cx="-10" cy="-12" r="3" fill="#DC2626" />
        <circle cx="10" cy="-12" r="5" fill="#FFF" /><circle cx="10" cy="-12" r="3" fill="#DC2626" />
        <ellipse cx="0" cy="-2" rx="8" ry="6" fill="#451A03" />
        <rect x="-28" y="28" width="10" height="12" rx="4" fill="#6B2F0A" />
        <rect x="18" y="28" width="10" height="12" rx="4" fill="#6B2F0A" />
        <ellipse cx="0" cy="24" rx="10" ry="8" fill="#B91C1C" opacity="0.3" />
      </g>);
    case "wolf":
      return (<g>
        <ellipse cx="0" cy="8" rx="28" ry="20" fill="#6B7280" />
        <polygon points="-24,-16 -32,-32 -16,-20" fill="#6B7280" />
        <polygon points="24,-16 32,-32 16,-20" fill="#6B7280" />
        <ellipse cx="0" cy="-4" rx="20" ry="16" fill="#9CA3AF" />
        <circle cx="-8" cy="-8" r="5" fill="#FEF08A" /><circle cx="-8" cy="-8" r="3" fill="#000" />
        <circle cx="8" cy="-8" r="5" fill="#FEF08A" /><circle cx="8" cy="-8" r="3" fill="#000" />
        <ellipse cx="0" cy="4" rx="8" ry="5" fill="#374151" />
        <path d="M-6,8 L-2,12 L2,12 L6,8" stroke="#FFF" strokeWidth="2" fill="none" />
        <ellipse cx="0" cy="20" rx="12" ry="10" fill="#F59E0B" opacity="0.3" />
      </g>);

    // ── UNDEAD ──────────────────────────────────────────────
    case "skeleton":
      return (<g>
        <rect x="-16" y="-24" width="32" height="32" rx="4" fill="#E5E7EB" />
        <circle cx="-8" cy="-12" r="6" fill="#111" /><circle cx="8" cy="-12" r="6" fill="#111" />
        <rect x="-6" y="-4" width="12" height="4" fill="#111" />
        <rect x="-4" y="8" width="8" height="32" fill="#D1D5DB" />
        <rect x="-20" y="12" width="40" height="6" fill="#D1D5DB" />
        <rect x="-6" y="36" width="6" height="16" fill="#D1D5DB" />
        <rect x="2" y="36" width="6" height="16" fill="#D1D5DB" />
        <rect x="20" y="8" width="24" height="4" fill="#A1A1AA" transform="rotate(-30,20,10)" />
        <circle cx="0" cy="20" r="8" fill="#B91C1C" opacity="0.3" />
      </g>);
    case "zombie":
      return (<g>
        <rect x="-20" y="-20" width="40" height="28" rx="6" fill="#4A7C59" />
        <circle cx="-8" cy="-12" r="6" fill="#BEF264" /><circle cx="-8" cy="-12" r="3" fill="#000" />
        <circle cx="10" cy="-8" r="6" fill="#BEF264" /><circle cx="10" cy="-8" r="3" fill="#000" />
        <path d="M-8,-2 L8,4" stroke="#1A2E1A" strokeWidth="3" />
        <rect x="-16" y="8" width="32" height="40" fill="#3F6212" />
        <rect x="-24" y="12" width="12" height="6" fill="#4A7C59" />
        <rect x="12" y="8" width="12" height="6" fill="#4A7C59" transform="rotate(20,15,11)" />
        <rect x="-10" y="44" width="8" height="12" fill="#4A7C59" />
        <rect x="4" y="44" width="8" height="12" fill="#4A7C59" />
        <circle cx="0" cy="32" r="10" fill="#DC2626" opacity="0.3" />
      </g>);
    case "wraith":
      return (<g>
        <path d="M0,-32 C-28,-28 -32,0 -24,32 L-16,24 L-8,36 L0,28 L8,36 L16,24 L24,32 C32,0 28,-28 0,-32Z" fill="#312E81" opacity="0.8" />
        <path d="M0,-24 C-20,-20 -16,0 -12,24 L0,12 L12,24 C16,0 20,-20 0,-24Z" fill="#4338CA" opacity="0.6" />
        <circle cx="-8" cy="-8" r="6" fill="#818CF8" /><circle cx="-8" cy="-8" r="3" fill="#FFF" />
        <circle cx="8" cy="-8" r="6" fill="#818CF8" /><circle cx="8" cy="-8" r="3" fill="#FFF" />
        <circle cx="0" cy="24" r="12" fill="#A855F7" opacity="0.3" />
      </g>);
    case "lich":
      return (<g>
        <path d="M-16,-36 L16,-36 L20,-24 L-20,-24Z" fill="#7C3AED" />
        <rect x="-20" y="-24" width="40" height="28" rx="4" fill="#E5E7EB" />
        <circle cx="-8" cy="-12" r="6" fill="#7C3AED" /><circle cx="-8" cy="-12" r="3" fill="#FFF" />
        <circle cx="8" cy="-12" r="6" fill="#7C3AED" /><circle cx="8" cy="-12" r="3" fill="#FFF" />
        <rect x="-16" y="4" width="32" height="40" fill="#581C87" />
        <line x1="0" y1="6" x2="0" y2="40" stroke="#A855F7" strokeWidth="2" />
        <circle cx="0" cy="20" r="6" fill="#C084FC" opacity="0.6" />
        <rect x="20" y="-8" width="4" height="48" fill="#6B21A8" />
        <circle cx="22" cy="-12" r="8" fill="#A855F7" opacity="0.7" />
        <circle cx="0" cy="40" r="14" fill="#C084FC" opacity="0.3" />
      </g>);
    case "death-knight":
      return (<g>
        <rect x="-24" y="-28" width="48" height="32" rx="6" fill="#1C1917" />
        <path d="M-24,-28 L0,-40 L24,-28" fill="#292524" />
        <rect x="-6" y="-20" width="4" height="8" fill="#DC2626" />
        <rect x="2" y="-20" width="4" height="8" fill="#DC2626" />
        <rect x="-20" y="8" width="40" height="44" fill="#1C1917" />
        <line x1="-12" y1="8" x2="-12" y2="44" stroke="#44403C" strokeWidth="2" />
        <line x1="12" y1="8" x2="12" y2="44" stroke="#44403C" strokeWidth="2" />
        <rect x="-32" y="8" width="12" height="6" fill="#292524" />
        <rect x="20" y="8" width="12" height="6" fill="#292524" />
        <rect x="28" y="-4" width="4" height="40" fill="#78716C" />
        <rect x="20" y="-8" width="20" height="6" fill="#78716C" />
        <circle cx="0" cy="36" r="16" fill="#DC2626" opacity="0.3" />
      </g>);
    case "ghost":
      return (<g>
        <path d="M0,-24 C-24,-24 -28,8 -20,32 L-12,24 L-4,32 L4,24 L12,32 L20,24 C28,8 24,-24 0,-24Z" fill="#E0E7FF" opacity="0.6" />
        <circle cx="-8" cy="-4" r="8" fill="#312E81" /><circle cx="-6" cy="-6" r="3" fill="#FFF" />
        <circle cx="8" cy="-4" r="8" fill="#312E81" /><circle cx="7" cy="-6" r="3" fill="#FFF" />
        <ellipse cx="0" cy="8" rx="6" ry="8" fill="#312E81" opacity="0.5" />
        <circle cx="0" cy="32" r="16" fill="#818CF8" opacity="0.3" />
      </g>);

    // ── ELEMENTAL ──────────────────────────────────────────
    case "fire-sprite":
      return (<g>
        <path d="M0,-32 C-8,-16 -20,-4 -16,16 C-12,28 12,28 16,16 C20,-4 8,-16 0,-32Z" fill="#F59E0B" />
        <path d="M0,-20 C-6,-8 -12,0 -8,12 C-4,20 4,20 8,12 C12,0 6,-8 0,-20Z" fill="#EF4444" />
        <path d="M0,-8 C-2,0 -4,4 -2,10 C0,14 2,14 4,10 C6,4 2,0 0,-8Z" fill="#FDE68A" />
        <circle cx="-6" cy="0" r="3" fill="#FFF" />
        <circle cx="6" cy="0" r="3" fill="#FFF" />
        <circle cx="0" cy="24" r="12" fill="#EF4444" opacity="0.3" />
      </g>);
    case "ice-golem":
      return (<g>
        <rect x="-28" y="-20" width="56" height="48" rx="8" fill="#93C5FD" />
        <rect x="-20" y="-12" width="40" height="32" fill="#BFDBFE" />
        <polygon points="-12,-32 -4,-20 -20,-20" fill="#60A5FA" />
        <polygon points="12,-32 20,-20 4,-20" fill="#60A5FA" />
        <rect x="-10" y="-8" width="8" height="6" fill="#1E3A5F" />
        <rect x="2" y="-8" width="8" height="6" fill="#1E3A5F" />
        <rect x="-32" y="-8" width="12" height="8" fill="#7DD3FC" />
        <rect x="20" y="-8" width="12" height="8" fill="#7DD3FC" />
        <rect x="-16" y="28" width="12" height="16" fill="#93C5FD" />
        <rect x="4" y="28" width="12" height="16" fill="#93C5FD" />
        <circle cx="0" cy="40" r="16" fill="#BFDBFE" opacity="0.3" />
      </g>);
    case "thunder-hawk":
      return (<g>
        <path d="M0,-16 L-44,4 L-36,8 L0,-4 L36,8 L44,4 Z" fill="#6366F1" />
        <ellipse cx="0" cy="4" rx="16" ry="12" fill="#818CF8" />
        <circle cx="-8" cy="-2" r="4" fill="#FDE68A" /><circle cx="-8" cy="-2" r="2" fill="#000" />
        <circle cx="8" cy="-2" r="4" fill="#FDE68A" /><circle cx="8" cy="-2" r="2" fill="#000" />
        <path d="M0,-8 L-4,2 L4,2 Z" fill="#F59E0B" />
        <line x1="-32" y1="0" x2="-40" y2="-12" stroke="#FDE68A" strokeWidth="3" />
        <line x1="32" y1="0" x2="40" y2="-12" stroke="#FDE68A" strokeWidth="3" />
        <ellipse cx="0" cy="20" rx="10" ry="8" fill="#F59E0B" opacity="0.3" />
      </g>);
    case "water-serpent":
      return (<g>
        <path d="M-32,16 C-24,-8 -8,-16 0,-12 C8,-8 16,8 24,4 C32,0 36,-8 40,-12" stroke="#3B82F6" strokeWidth="12" fill="none" strokeLinecap="round" />
        <path d="M-32,16 C-24,-8 -8,-16 0,-12 C8,-8 16,8 24,4 C32,0 36,-8 40,-12" stroke="#60A5FA" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="-32" cy="16" r="12" fill="#2563EB" />
        <circle cx="-36" cy="14" r="4" fill="#FDE68A" /><circle cx="-36" cy="14" r="2" fill="#000" />
        <circle cx="-28" cy="14" r="4" fill="#FDE68A" /><circle cx="-28" cy="14" r="2" fill="#000" />
        <path d="M40,-12 L48,-20 L48,-8 Z" fill="#1D4ED8" />
        <circle cx="0" cy="24" r="16" fill="#3B82F6" opacity="0.3" />
      </g>);
    case "earth-elemental":
      return (<g>
        <rect x="-32" y="-16" width="64" height="56" rx="8" fill="#78716C" />
        <rect x="-24" y="-8" width="48" height="40" fill="#A8A29E" />
        <polygon points="-16,-28 -8,-16 -24,-16" fill="#57534E" />
        <polygon points="16,-24 24,-16 8,-16" fill="#57534E" />
        <rect x="-12" y="-4" width="8" height="8" fill="#422006" />
        <rect x="4" y="-4" width="8" height="8" fill="#422006" />
        <rect x="-6" y="12" width="12" height="6" fill="#57534E" />
        <rect x="-36" y="0" width="12" height="12" fill="#78716C" />
        <rect x="24" y="0" width="12" height="12" fill="#78716C" />
        <circle cx="0" cy="32" r="20" fill="#A8A29E" opacity="0.3" />
      </g>);
    case "storm-djinn":
      return (<g>
        <path d="M0,-32 C-24,-20 -16,8 -12,24 C-8,32 8,32 12,24 C16,8 24,-20 0,-32Z" fill="#7C3AED" opacity="0.7" />
        <path d="M0,-24 C-16,-12 -8,4 -4,16 C0,24 4,24 8,16 C12,4 16,-12 0,-24Z" fill="#A78BFA" opacity="0.6" />
        <circle cx="-8" cy="-8" r="5" fill="#FDE68A" /><circle cx="-8" cy="-8" r="3" fill="#000" />
        <circle cx="8" cy="-8" r="5" fill="#FDE68A" /><circle cx="8" cy="-8" r="3" fill="#000" />
        <path d="M-12,28 C-16,36 -8,44 0,40 C8,44 16,36 14,28" fill="#7C3AED" opacity="0.4" />
        <line x1="-16" y1="-16" x2="-28" y2="-28" stroke="#C4B5FD" strokeWidth="3" />
        <line x1="16" y1="-16" x2="28" y2="-28" stroke="#C4B5FD" strokeWidth="3" />
        <circle cx="0" cy="40" r="16" fill="#A78BFA" opacity="0.3" />
      </g>);

    // ── PLANT / INSECT ─────────────────────────────────────
    case "treant":
      return (<g>
        <rect x="-20" y="0" width="40" height="48" rx="8" fill="#78350F" />
        <rect x="-12" y="8" width="24" height="32" fill="#92400E" />
        <circle cx="-10" cy="16" r="6" fill="#14532D" />
        <circle cx="10" cy="20" r="5" fill="#14532D" />
        <ellipse cx="0" cy="28" rx="6" ry="4" fill="#1C1917" />
        <path d="M-20,0 L-36,-20 L-28,-16 L-20,-32 L-12,-12 L0,-24 L12,-12 L20,-32 L28,-16 L36,-20 L20,0" fill="#166534" />
        <circle cx="-24" cy="-12" r="8" fill="#22C55E" opacity="0.7" />
        <circle cx="24" cy="-12" r="8" fill="#22C55E" opacity="0.7" />
        <rect x="-12" y="44" width="10" height="12" fill="#78350F" />
        <rect x="4" y="44" width="10" height="12" fill="#78350F" />
        <circle cx="0" cy="56" r="16" fill="#22C55E" opacity="0.3" />
      </g>);
    case "mushroom":
      return (<g>
        <ellipse cx="0" cy="-8" rx="28" ry="20" fill="#DC2626" />
        <circle cx="-12" cy="-16" r="6" fill="#FDE68A" />
        <circle cx="8" cy="-12" r="4" fill="#FDE68A" />
        <circle cx="-4" cy="-4" r="5" fill="#FDE68A" />
        <rect x="-12" y="8" width="24" height="28" rx="6" fill="#FEF3C7" />
        <circle cx="-6" cy="16" r="4" fill="#111" /><circle cx="6" cy="16" r="4" fill="#111" />
        <ellipse cx="0" cy="24" rx="4" ry="2" fill="#A16207" />
        <circle cx="0" cy="40" r="16" fill="#DC2626" opacity="0.3" />
      </g>);
    case "spider":
      return (<g>
        <ellipse cx="0" cy="8" rx="20" ry="16" fill="#1C1917" />
        <circle cx="0" cy="-12" r="14" fill="#292524" />
        <circle cx="-6" cy="-20" r="4" fill="#DC2626" /><circle cx="-6" cy="-20" r="2" fill="#000" />
        <circle cx="6" cy="-20" r="4" fill="#DC2626" /><circle cx="6" cy="-20" r="2" fill="#000" />
        <circle cx="-4" cy="-8" r="2" fill="#DC2626" />
        <circle cx="4" cy="-8" r="2" fill="#DC2626" />
        <line x1="-16" y1="-8" x2="-36" y2="-24" stroke="#292524" strokeWidth="3" />
        <line x1="16" y1="-8" x2="36" y2="-24" stroke="#292524" strokeWidth="3" />
        <line x1="-20" y1="4" x2="-40" y2="-4" stroke="#292524" strokeWidth="3" />
        <line x1="20" y1="4" x2="40" y2="-4" stroke="#292524" strokeWidth="3" />
        <line x1="-20" y1="12" x2="-36" y2="20" stroke="#292524" strokeWidth="3" />
        <line x1="20" y1="12" x2="36" y2="20" stroke="#292524" strokeWidth="3" />
        <line x1="-16" y1="20" x2="-28" y2="32" stroke="#292524" strokeWidth="3" />
        <line x1="16" y1="20" x2="28" y2="32" stroke="#292524" strokeWidth="3" />
        <circle cx="0" cy="40" r="16" fill="#292524" opacity="0.3" />
      </g>);
    case "mantis":
      return (<g>
        <ellipse cx="0" cy="12" rx="16" ry="24" fill="#16A34A" />
        <circle cx="0" cy="-16" r="14" fill="#22C55E" />
        <circle cx="-8" cy="-20" r="6" fill="#FDE68A" /><circle cx="-8" cy="-20" r="3" fill="#000" />
        <circle cx="8" cy="-20" r="6" fill="#FDE68A" /><circle cx="8" cy="-20" r="3" fill="#000" />
        <path d="M-16,-12 L-32,-32 L-40,-28" stroke="#15803D" strokeWidth="5" fill="none" />
        <path d="M16,-12 L32,-32 L40,-28" stroke="#15803D" strokeWidth="5" fill="none" />
        <line x1="-12" y1="28" x2="-20" y2="44" stroke="#16A34A" strokeWidth="3" />
        <line x1="12" y1="28" x2="20" y2="44" stroke="#16A34A" strokeWidth="3" />
        <circle cx="0" cy="48" r="16" fill="#22C55E" opacity="0.3" />
      </g>);

    // ── DEMONIC ────────────────────────────────────────────
    case "imp":
      return (<g>
        <circle cx="0" cy="-8" r="16" fill="#DC2626" />
        <polygon points="-16,-16 -24,-32 -8,-20" fill="#991B1B" />
        <polygon points="16,-16 24,-32 8,-20" fill="#991B1B" />
        <circle cx="-6" cy="-12" r="4" fill="#FDE68A" /><circle cx="-6" cy="-12" r="2" fill="#000" />
        <circle cx="6" cy="-12" r="4" fill="#FDE68A" /><circle cx="6" cy="-12" r="2" fill="#000" />
        <path d="M-6,-2 L0,4 L6,-2" stroke="#7F1D1D" strokeWidth="2" fill="none" />
        <rect x="-8" y="8" width="16" height="24" fill="#B91C1C" />
        <path d="M-12,4 L-20,12 L-16,16 Z" fill="#991B1B" />
        <path d="M12,4 L20,12 L16,16 Z" fill="#991B1B" />
        <path d="M0,32 C-4,40 4,40 0,32" fill="#F59E0B" opacity="0.6" />
        <circle cx="0" cy="48" r="16" fill="#DC2626" opacity="0.3" />
      </g>);
    case "shadow-fiend":
      return (<g>
        <path d="M0,-32 C-32,-16 -28,16 -20,32 L-12,20 L0,32 L12,20 L20,32 C28,16 32,-16 0,-32Z" fill="#1E1B4B" opacity="0.85" />
        <path d="M0,-24 C-20,-12 -16,4 -12,20 L0,8 L12,20 C16,4 20,-12 0,-24Z" fill="#312E81" opacity="0.7" />
        <circle cx="-10" cy="-4" r="6" fill="#A855F7" /><circle cx="-10" cy="-4" r="3" fill="#FFF" />
        <circle cx="10" cy="-4" r="6" fill="#A855F7" /><circle cx="10" cy="-4" r="3" fill="#FFF" />
        <path d="M-28,-20 L-36,-36" stroke="#6B21A8" strokeWidth="2" />
        <path d="M28,-20 L36,-36" stroke="#6B21A8" strokeWidth="2" />
        <circle cx="0" cy="40" r="16" fill="#A855F7" opacity="0.3" />
      </g>);
    case "hellhound":
      return (<g>
        <ellipse cx="0" cy="8" rx="28" ry="20" fill="#7F1D1D" />
        <polygon points="-20,-12 -28,-32 -12,-16" fill="#991B1B" />
        <polygon points="20,-12 28,-32 12,-16" fill="#991B1B" />
        <ellipse cx="0" cy="-4" rx="20" ry="16" fill="#991B1B" />
        <circle cx="-8" cy="-8" r="5" fill="#F59E0B" /><circle cx="-8" cy="-8" r="3" fill="#000" />
        <circle cx="8" cy="-8" r="5" fill="#F59E0B" /><circle cx="8" cy="-8" r="3" fill="#000" />
        <ellipse cx="0" cy="4" rx="8" ry="5" fill="#450A0A" />
        <path d="M-6,8 L-2,12 L2,12 L6,8" stroke="#FDE68A" strokeWidth="2" fill="none" />
        <path d="M-16,16 C-20,24 -12,28 -8,24" stroke="#EF4444" strokeWidth="3" fill="#F59E0B" opacity="0.6" />
        <path d="M16,16 C20,24 12,28 8,24" stroke="#EF4444" strokeWidth="3" fill="#F59E0B" opacity="0.6" />
        <circle cx="0" cy="48" r="16" fill="#EF4444" opacity="0.3" />
      </g>);
    case "succubus":
      return (<g>
        <circle cx="0" cy="-12" r="16" fill="#FDE68A" />
        <path d="M-16,-20 C-20,-40 -8,-40 -4,-28" stroke="#7C2D12" strokeWidth="3" fill="none" />
        <path d="M16,-20 C20,-40 8,-40 4,-28" stroke="#7C2D12" strokeWidth="3" fill="none" />
        <circle cx="-6" cy="-16" r="4" fill="#A855F7" /><circle cx="-6" cy="-16" r="2" fill="#000" />
        <circle cx="6" cy="-16" r="4" fill="#A855F7" /><circle cx="6" cy="-16" r="2" fill="#000" />
        <path d="M-4,-6 C0,-2 4,-6" stroke="#DC2626" strokeWidth="2" fill="none" />
        <rect x="-12" y="4" width="24" height="32" rx="4" fill="#7C3AED" />
        <path d="M-20,8 L-40,-4 L-36,12 Z" fill="#6B21A8" opacity="0.6" />
        <path d="M20,8 L40,-4 L36,12 Z" fill="#6B21A8" opacity="0.6" />
        <path d="M4,36 C8,48 12,44 8,36" stroke="#DC2626" strokeWidth="2" fill="none" />
        <circle cx="0" cy="56" r="16" fill="#7C3AED" opacity="0.3" />
      </g>);
    case "arch-demon":
      return (<g>
        <rect x="-28" y="-12" width="56" height="56" rx="8" fill="#7F1D1D" />
        <path d="M-28,-12 L-20,-36 L-12,-12" fill="#991B1B" />
        <path d="M28,-12 L20,-36 L12,-12" fill="#991B1B" />
        <rect x="-20" y="-4" width="40" height="40" fill="#991B1B" />
        <circle cx="-10" cy="4" r="7" fill="#F59E0B" /><circle cx="-10" cy="4" r="4" fill="#000" />
        <circle cx="10" cy="4" r="7" fill="#F59E0B" /><circle cx="10" cy="4" r="4" fill="#000" />
        <path d="M-8,20 L-4,24 L0,20 L4,24 L8,20" stroke="#FDE68A" strokeWidth="2" fill="none" />
        <path d="M-32,-4 L-48,-20 L-44,4 Z" fill="#991B1B" />
        <path d="M32,-4 L48,-20 L44,4 Z" fill="#991B1B" />
        <path d="M0,48 C-8,64 8,64 0,48" fill="#F59E0B" opacity="0.6" />
        <circle cx="0" cy="64" r="20" fill="#DC2626" opacity="0.3" />
      </g>);
    case "dark-corrupter":
      return (<g>
        <path d="M0,-24 C-28,-16 -24,16 -16,32 L0,20 L16,32 C24,16 28,-16 0,-24Z" fill="#581C87" opacity="0.8" />
        <circle cx="-8" cy="-4" r="6" fill="#A855F7" /><circle cx="-8" cy="-4" r="3" fill="#FFF" />
        <circle cx="8" cy="-4" r="6" fill="#A855F7" /><circle cx="8" cy="-4" r="3" fill="#FFF" />
        <path d="M-4,8 L4,8" stroke="#C084FC" strokeWidth="3" />
        <circle cx="0" cy="16" r="8" fill="#7C3AED" opacity="0.5" />
        <circle cx="0" cy="48" r="16" fill="#A855F7" opacity="0.3" />
      </g>);

    // ── DRAGONS ────────────────────────────────────────────
    case "wyvern":
      return (<g>
        <ellipse cx="0" cy="8" rx="24" ry="20" fill="#166534" />
        <path d="M0,-12 L-48,0 L-40,8 L0,-4 L40,8 L48,0 Z" fill="#15803D" />
        <ellipse cx="8" cy="-12" rx="16" ry="12" fill="#22C55E" />
        <path d="M20,-12 L28,-8 L24,-4" fill="#F59E0B" />
        <circle cx="4" cy="-16" r="5" fill="#FDE68A" /><circle cx="4" cy="-16" r="3" fill="#000" />
        <circle cx="16" cy="-16" r="4" fill="#FDE68A" /><circle cx="16" cy="-16" r="2" fill="#000" />
        <path d="M-48,0 L-56,-8 L-52,4 Z" fill="#14532D" />
        <path d="M48,0 L56,-8 L52,4 Z" fill="#14532D" />
        <path d="M-12,28 C-16,36 -8,40 -4,32" stroke="#166534" strokeWidth="3" fill="none" />
        <circle cx="0" cy="56" r="16" fill="#22C55E" opacity="0.3" />
      </g>);
    case "drake":
      return (<g>
        <ellipse cx="0" cy="8" rx="28" ry="24" fill="#B91C1C" />
        <path d="M0,-16 L-40,-4 L-32,4 L0,-8 L32,4 L40,-4 Z" fill="#DC2626" />
        <ellipse cx="12" cy="-16" rx="18" ry="14" fill="#EF4444" />
        <path d="M28,-16 L36,-12 L32,-8" fill="#F59E0B" />
        <circle cx="8" cy="-20" r="5" fill="#FDE68A" /><circle cx="8" cy="-20" r="3" fill="#000" />
        <circle cx="20" cy="-20" r="4" fill="#FDE68A" /><circle cx="20" cy="-20" r="2" fill="#000" />
        <polygon points="0,-28 0,-36 8,-32" fill="#991B1B" />
        <polygon points="16,-24 12,-36 24,-30" fill="#991B1B" />
        <path d="M28,-8 L36,-4 L28,0" fill="#F59E0B" opacity="0.6" />
        <circle cx="0" cy="56" r="16" fill="#EF4444" opacity="0.3" />
      </g>);
    case "crystal-dragon":
      return (<g>
        <ellipse cx="0" cy="8" rx="28" ry="24" fill="#7C3AED" />
        <path d="M0,-16 L-44,-4 L-36,4 L0,-8 L36,4 L44,-4 Z" fill="#8B5CF6" />
        <ellipse cx="12" cy="-16" rx="18" ry="14" fill="#A78BFA" />
        <circle cx="8" cy="-20" r="5" fill="#FDE68A" /><circle cx="8" cy="-20" r="3" fill="#C084FC" />
        <circle cx="20" cy="-20" r="4" fill="#FDE68A" /><circle cx="20" cy="-20" r="2" fill="#C084FC" />
        <polygon points="-8,-28 0,-44 8,-28" fill="#E9D5FF" />
        <polygon points="16,-24 24,-40 28,-28" fill="#E9D5FF" />
        <polygon points="-12,0 -20,-8 -16,4" fill="#C4B5FD" opacity="0.6" />
        <polygon points="28,0 36,-8 32,4" fill="#C4B5FD" opacity="0.6" />
        <circle cx="0" cy="8" r="8" fill="#DDD6FE" opacity="0.4" />
        <circle cx="0" cy="56" r="16" fill="#A78BFA" opacity="0.3" />
      </g>);
    case "elder-dragon":
      return (<g>
        <ellipse cx="0" cy="8" rx="36" ry="28" fill="#78350F" />
        <path d="M0,-20 L-52,-8 L-44,0 L0,-12 L44,0 L52,-8 Z" fill="#92400E" />
        <ellipse cx="16" cy="-20" rx="22" ry="16" fill="#B45309" />
        <polygon points="-4,-36 0,-48 8,-36" fill="#D97706" />
        <polygon points="20,-28 28,-48 32,-32" fill="#D97706" />
        <polygon points="-16,-24 -24,-44 -12,-24" fill="#D97706" />
        <circle cx="8" cy="-28" r="6" fill="#F59E0B" /><circle cx="8" cy="-28" r="4" fill="#7F1D1D" />
        <circle cx="24" cy="-28" r="6" fill="#F59E0B" /><circle cx="24" cy="-28" r="4" fill="#7F1D1D" />
        <path d="M32,-16 L44,-12 L36,-8" fill="#F59E0B" />
        <rect x="-24" y="28" width="10" height="16" rx="4" fill="#78350F" />
        <rect x="14" y="28" width="10" height="16" rx="4" fill="#78350F" />
        <circle cx="0" cy="56" r="16" fill="#B45309" opacity="0.3" />
      </g>);

    // ── HUMANOID ───────────────────────────────────────────
    case "goblin":
      return (<g>
        <circle cx="0" cy="-12" r="16" fill="#4ADE80" />
        <polygon points="-16,-16 -28,-8 -16,-8" fill="#22C55E" />
        <polygon points="16,-16 28,-8 16,-8" fill="#22C55E" />
        <circle cx="-6" cy="-16" r="5" fill="#FDE68A" /><circle cx="-6" cy="-16" r="3" fill="#000" />
        <circle cx="6" cy="-16" r="5" fill="#FDE68A" /><circle cx="6" cy="-16" r="3" fill="#000" />
        <ellipse cx="0" cy="-4" rx="6" ry="4" fill="#166534" />
        <rect x="-10" y="4" width="20" height="28" fill="#713F12" />
        <rect x="-4" y="28" width="6" height="12" fill="#4ADE80" />
        <rect x="2" y="28" width="6" height="12" fill="#4ADE80" />
        <rect x="10" y="4" width="4" height="20" fill="#78716C" transform="rotate(-20,11,14)" />
        <circle cx="0" cy="48" r="16" fill="#4ADE80" opacity="0.3" />
      </g>);
    case "orc":
      return (<g>
        <rect x="-20" y="-24" width="40" height="32" rx="6" fill="#16A34A" />
        <circle cx="-8" cy="-12" r="5" fill="#FDE68A" /><circle cx="-8" cy="-12" r="3" fill="#DC2626" />
        <circle cx="8" cy="-12" r="5" fill="#FDE68A" /><circle cx="8" cy="-12" r="3" fill="#DC2626" />
        <path d="M-8,-2 L-4,4" stroke="#FFF" strokeWidth="3" /><path d="M8,-2 L4,4" stroke="#FFF" strokeWidth="3" />
        <rect x="-24" y="8" width="48" height="40" fill="#78350F" />
        <rect x="-32" y="12" width="12" height="10" fill="#16A34A" />
        <rect x="20" y="12" width="12" height="10" fill="#16A34A" />
        <rect x="28" y="4" width="6" height="36" fill="#78716C" />
        <rect x="20" y="-4" width="20" height="8" fill="#78716C" />
        <circle cx="0" cy="48" r="16" fill="#16A34A" opacity="0.3" />
      </g>);
    case "dark-mage":
      return (<g>
        <path d="M-16,-36 L0,-56 L16,-36" fill="#581C87" />
        <circle cx="0" cy="-24" r="16" fill="#FECACA" />
        <circle cx="-6" cy="-28" r="4" fill="#7C3AED" /><circle cx="-6" cy="-28" r="2" fill="#000" />
        <circle cx="6" cy="-28" r="4" fill="#7C3AED" /><circle cx="6" cy="-28" r="2" fill="#000" />
        <rect x="-16" y="-8" width="32" height="44" fill="#581C87" />
        <line x1="0" y1="-6" x2="0" y2="36" stroke="#A855F7" strokeWidth="2" />
        <rect x="20" y="-16" width="4" height="64" fill="#6B21A8" />
        <circle cx="22" cy="-20" r="8" fill="#C084FC" opacity="0.7" />
        <circle cx="0" cy="48" r="16" fill="#7C3AED" opacity="0.3" />
      </g>);
    case "bandit":
      return (<g>
        <circle cx="0" cy="-16" r="16" fill="#DEB887" />
        <rect x="-16" y="-24" width="32" height="8" fill="#1C1917" />
        <rect x="-20" y="-20" width="40" height="4" fill="#292524" />
        <circle cx="-6" cy="-16" r="4" fill="#000" />
        <circle cx="6" cy="-16" r="4" fill="#000" />
        <rect x="-12" y="-8" width="24" height="4" fill="#7C2D12" />
        <rect x="-16" y="0" width="32" height="36" fill="#44403C" />
        <rect x="-24" y="4" width="12" height="8" fill="#DEB887" />
        <rect x="12" y="4" width="12" height="8" fill="#DEB887" />
        <rect x="20" y="0" width="4" height="36" fill="#78716C" />
        <circle cx="0" cy="48" r="16" fill="#DEB887" opacity="0.3" />
      </g>);
    case "knight":
      return (<g>
        <rect x="-20" y="-28" width="40" height="32" rx="4" fill="#6B7280" />
        <path d="M0,-36 L-20,-28 L20,-28 Z" fill="#9CA3AF" />
        <rect x="-6" y="-20" width="4" height="8" fill="#1E3A5F" />
        <rect x="2" y="-20" width="4" height="8" fill="#1E3A5F" />
        <rect x="-20" y="8" width="40" height="44" fill="#6B7280" />
        <line x1="0" y1="8" x2="0" y2="44" stroke="#9CA3AF" strokeWidth="2" />
        <line x1="-16" y1="24" x2="16" y2="24" stroke="#9CA3AF" strokeWidth="2" />
        <rect x="-32" y="8" width="16" height="8" fill="#6B7280" />
        <rect x="16" y="8" width="16" height="8" fill="#6B7280" />
        <rect x="-36" y="4" width="8" height="40" fill="#9CA3AF" />
        <ellipse cx="-36" cy="4" rx="12" ry="16" fill="#4B5563" opacity="0.5" />
        <circle cx="0" cy="48" r="16" fill="#6B7280" opacity="0.3" />
      </g>);

    // ── MAGICAL ────────────────────────────────────────────
    case "spirit":
      return (<g>
        <circle cx="0" cy="0" r="24" fill="#818CF8" opacity="0.5" />
        <circle cx="0" cy="0" r="16" fill="#A5B4FC" opacity="0.6" />
        <circle cx="-6" cy="-4" r="5" fill="#FFF" /><circle cx="-6" cy="-4" r="3" fill="#4338CA" />
        <circle cx="6" cy="-4" r="5" fill="#FFF" /><circle cx="6" cy="-4" r="3" fill="#4338CA" />
        <ellipse cx="0" cy="8" rx="4" ry="6" fill="#6366F1" opacity="0.5" />
        <circle cx="0" cy="40" r="16" fill="#818CF8" opacity="0.3" />
      </g>);
    case "arcane-book":
      return (<g>
        <rect x="-24" y="-20" width="48" height="40" rx="4" fill="#7C2D12" />
        <rect x="-20" y="-16" width="40" height="32" fill="#FEF3C7" />
        <line x1="-16" y1="-8" x2="16" y2="-8" stroke="#A16207" strokeWidth="2" />
        <line x1="-16" y1="0" x2="16" y2="0" stroke="#A16207" strokeWidth="2" />
        <line x1="-16" y1="8" x2="12" y2="8" stroke="#A16207" strokeWidth="2" />
        <circle cx="-8" cy="-12" r="4" fill="#7C3AED" />
        <circle cx="8" cy="-12" r="4" fill="#7C3AED" />
        <rect x="-24" y="-4" width="4" height="24" fill="#92400E" />
        <circle cx="0" cy="20" r="6" fill="#A855F7" opacity="0.5" />
        <circle cx="0" cy="48" r="16" fill="#7C3AED" opacity="0.3" />
      </g>);
    case "plague-beast":
      return (<g>
        <ellipse cx="0" cy="8" rx="28" ry="20" fill="#4D7C0F" />
        <ellipse cx="0" cy="0" rx="20" ry="16" fill="#65A30D" />
        <circle cx="-8" cy="-8" r="6" fill="#BEF264" /><circle cx="-8" cy="-8" r="3" fill="#000" />
        <circle cx="8" cy="-8" r="6" fill="#BEF264" /><circle cx="8" cy="-8" r="3" fill="#000" />
        <ellipse cx="0" cy="4" rx="6" ry="4" fill="#365314" />
        <circle cx="-16" cy="12" r="6" fill="#84CC16" opacity="0.5" />
        <circle cx="20" cy="4" r="4" fill="#84CC16" opacity="0.5" />
        <circle cx="12" cy="20" r="5" fill="#84CC16" opacity="0.4" />
        <circle cx="0" cy="48" r="16" fill="#BEF264" opacity="0.3" />
      </g>);
    case "mimic":
      return (<g>
        <rect x="-28" y="-8" width="56" height="36" rx="6" fill="#92400E" />
        <rect x="-24" y="-4" width="48" height="28" fill="#B45309" />
        <rect x="-28" y="-8" width="56" height="8" fill="#A16207" />
        <rect x="-20" y="-4" width="40" height="4" fill="#D97706" />
        <circle cx="-8" cy="8" r="6" fill="#FFF" /><circle cx="-8" cy="8" r="3" fill="#DC2626" />
        <circle cx="8" cy="8" r="6" fill="#FFF" /><circle cx="8" cy="8" r="3" fill="#DC2626" />
        <path d="M-16,20 L-12,28 L-8,20 L-4,28 L0,20 L4,28 L8,20 L12,28 L16,20" stroke="#FDE68A" strokeWidth="3" fill="none" />
        <rect x="-8" y="-16" width="16" height="8" rx="4" fill="#78350F" />
        <circle cx="0" cy="48" r="16" fill="#B91C1C" opacity="0.3" />
      </g>);

    // Default fallback
    default:
      return (<g>
        <rect x="-28" y="-16" width="56" height="56" rx="8" fill="#4B5563" />
        <circle cx="-10" cy="0" r="7" fill="#F59E0B" /><circle cx="-10" cy="0" r="4" fill="#000" />
        <circle cx="10" cy="0" r="7" fill="#F59E0B" /><circle cx="10" cy="0" r="4" fill="#000" />
        <path d="M-8,16 L0,20 L8,16" stroke="#FFF" strokeWidth="3" fill="none" />
        <circle cx="0" cy="48" r="16" fill="#4B5563" opacity="0.3" />
      </g>);
  }
}