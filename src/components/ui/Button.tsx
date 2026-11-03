import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { buttonStyles, type ButtonVariant } from '@/components/ui/buttonStyles';

interface BaseProps {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" {...props} className={buttonStyles(variant, className)}>
      {children}
    </button>
  );
}

export function LinkButton({
  variant = 'primary',
  className = '',
  children,
  ...props
}: BaseProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a {...props} className={buttonStyles(variant, className)}>
      {children}
    </a>
  );
}
