import { ReactNode } from 'react';

interface QuickAccessButtonProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  highlighted?: boolean;
}

export function QuickAccessButton({ icon, label, onClick, href, highlighted }: QuickAccessButtonProps) {
  const classes = [
    'flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-colors',
    highlighted
      ? 'bg-[#3B5CCC]/8 text-[#3B5CCC] font-medium hover:bg-[#3B5CCC]/15'
      : 'text-[#4B5563] hover:bg-[#F3F4F6]',
  ].join(' ');

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        <span className="shrink-0 text-current">{icon}</span>
        <span>{label}</span>
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      <span className="shrink-0 text-current">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
