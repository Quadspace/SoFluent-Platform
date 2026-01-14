/**
 * Brand Text Component
 * Theme-aware typography using CSS variables
 */

const BrandText = ({
  children,
  variant = 'body',
  size = 'base',
  color = 'primary',
  weight = 'normal',
  className = '',
  as: Component = 'p',
  ...props
}) => {
  const variants = {
    display: 'font-display',
    body: 'font-body',
    bold: 'font-bold',
  };

  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
  };

  const colors = {
    primary: 'text-sofluent-black',
    secondary: 'text-sofluent-gris',
    tertiary: 'text-gray-500',
    white: 'text-white',
    cherry: 'text-sofluent-cherry',
    gold: 'text-sofluent-gold',
    light: 'text-white/70',
    // Theme-aware colors
    theme: 'text-theme-text',
    themeSecondary: 'text-theme-textSecondary',
  };

  const weights = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const classes = `${variants[variant]} ${sizes[size]} ${colors[color]} ${weights[weight]} ${className}`;

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

export default BrandText;
