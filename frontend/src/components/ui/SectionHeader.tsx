import { cn } from '@/lib/utils';
import { GoldDivider } from './GoldDivider';

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  light?: boolean;
}

export function SectionHeader({ label, title, subtitle, align = 'center', className, light }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        align === 'left' && 'items-start text-left',
        align === 'right' && 'items-end text-right',
        className
      )}
    >
      {label && (
        <span className={cn('section-label', light && 'text-gold-light')}>{label}</span>
      )}
      <GoldDivider align={align} />
      <h2 className={cn('section-title', light && 'text-white')}>{title}</h2>
      {subtitle && (
        <p
          className={cn(
            'font-manrope text-base max-w-2xl leading-relaxed',
            light ? 'text-white/70' : 'text-brown/70'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
