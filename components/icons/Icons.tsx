import React from 'react';

const iconProps = {
  className: "w-5 h-5",
  strokeWidth: 2,
  stroke: "currentColor",
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const CashIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
    <rect x="2" y="4" width="20" height="16" rx="2"></rect><circle cx="8" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path>
  </svg>
);

export const ShoppingBagIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

export const UserGroupIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

export const ClipboardListIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line>
  </svg>
);

export const CogIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24" >
      <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"></path><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m4.93 19.07 1.41-1.41"></path><path d="m17.66 6.34 1.41-1.41"></path>
    </svg>
);


export const PlusIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export const MinusIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export const TrashIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

export const PencilIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);

export const XIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const UserIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export const PrinterIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
      <polyline points="6 9 6 2 18 2 18 9"></polyline>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
      <rect x="6" y="14" width="12" height="8"></rect>
    </svg>
  );

export const ArrowLeftIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
      <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

export const SaveIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
);

export const TruckIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
      <rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>
    </svg>
);

export const ArchiveIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
        <polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line>
    </svg>
);

export const ChartBarIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
        <path d="M12 20V10"></path><path d="M18 20V4"></path><path d="M6 20V16"></path>
    </svg>
);

export const DocumentReportIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

export const CreditCardIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
    </svg>
);

export const ReplyIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
        <polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
    </svg>
);

export const CloudArrowDownIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
        <path d="M12 12v9"></path><path d="m16 17-4 4-4-4"></path>
    </svg>
);

export const CloudArrowUpIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
        <path d="M12 12v9"></path><path d="m16 17-4 4-4-4"></path>
        <path d="M12 21V12"></path><path d="m16 17-4-4-4 4"></path>
    </svg>
);

export const PaperAirplaneIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24">
        <path d="M22 2L11 13"></path><path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
    </svg>
);
