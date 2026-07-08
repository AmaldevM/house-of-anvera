import { cn } from '@/lib/utils';

interface GoldDividerProps {
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export function GoldDivider({ className, align = 'center' }: GoldDividerProps) {
  return (
    <div
      className={cn(
        'h-[2px] w-16',
        align === 'left' && 'mr-auto ml-0',
        align === 'right' && 'ml-auto mr-0',
        align === 'center' && 'mx-auto',
        className
      )}
      style={{
        background:
          align === 'left'
            ? 'linear-gradient(90deg, #C89B3C, transparent)'
            : align === 'right'
            ? 'linear-gradient(270deg, #C89B3C, transparent)'
            : 'linear-gradient(90deg, transparent, #C89B3C, transparent)',
      }}
    />
  );
}
