import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

    // Detect custom styling
    const hasCustomColors = className.includes('bg-') || className.includes('text-');
    const hasCustomBorder = className.includes('border-');

    let variantStyles = "";

    if (variant === 'default') {
      // Only apply default styles if no custom colors
      variantStyles = hasCustomColors ? "" : "bg-primary text-primary-foreground hover:opacity-90";
    } else if (variant === 'outline') {
      // For outline, only add default border if no custom border is specified
      variantStyles = hasCustomBorder ? "" : "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
    } else if (variant === 'ghost') {
      variantStyles = "hover:bg-accent hover:text-accent-foreground";
    }

    const sizeStyles = {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3 text-sm",
      lg: "h-11 px-8 text-base",
    };

    return (
      <button
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
