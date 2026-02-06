// Centralized Theme Configuration (Dark Mode)

export const theme = {
  // Base Colors - background and text foundations
  colors: {
    background: {
      main: "bg-[var(--color-brand-primary-200)]",
      card: "bg-[var(--color-brand-sb-shade-90)]",
      sidebar: "bg-[var(--color-brand-primary-400)]",
      input: "bg-slate-800",
      hover: "hover:bg-slate-800",
      active: "bg-slate-800",
    },
    text: {
      primary: "text-[var(--color-brand-primary-300)]",
      secondary: "text-[var(--color-brand-sb-shade-40)]",
      tertiary: "text-[var(--color-brand-sb-shade-40)]",
      inverted: "text-black",
      link: "text-[var(--color-brand-primary-50)]",
    },
    border: {
      light: "border-[var(--color-brand-sb-shade-80)]",
      base: "border-[var(--color-brand-sb-shade-70)]",
      focus: "focus:border-[var(--color-brand-primary-50)]",
    }
  },

  // Brand / Semantic Colors
  semantic: {
    primary: {
      base: "text-[var(--color-brand-primary-50)]",
      bg: "bg-[var(--color-brand-primary-50)]",
      bgLight: "bg-[var(--color-brand-primary-500)]", // Darker background for badges
      border: "border-[var(--color-brand-primary-500)]",
      hover: "hover:bg-[var(--color-brand-primary-500)]",
      text: "text-[var(--color-brand-primary-50)]",
      gradient: "from-cyan-600 to-blue-600",
    },
    secondary: {
      base: "text-[var(--color-brand-secondary-50)]",
      bg: "bg-[var(--color-brand-secondary-50)]",
      bgLight: "bg-[var(--color-brand-secondary-100)]",
      border: "border-[var(--color-brand-secondary-200)]",
      text: "text-[var(--color-brand-secondary-50)]",
    },
    success: { // For positive KPIs, lifts, approval
      base: "text-emerald-400",
      bg: "bg-emerald-600",
      bgLight: "bg-emerald-950",
      border: "border-[var(--color-brand-sc-positive)]",
      text: "text-emerald-200",
    },
    warning: { // For alerts, medium priority
      base: "text-amber-400",
      bg: "bg-amber-500",
      bgLight: "bg-amber-950",
      border: "border-[var(--color-brand-sc-warning)]",
      text: "text-amber-200",
    },
    danger: { // For stockouts, delists, negative trends
      base: "text-rose-400",
      bg: "bg-rose-600",
      bgLight: "bg-rose-950",
      border: "border-[var(--color-brand-sc-negative)]",
      text: "text-rose-200",
    },
    info: { // For misc tags
      base: "text-slate-300",
      bgLight: "bg-slate-800",
      border: "border-slate-700",
      // Added missing text property to resolve theme type inconsistency in components
      text: "text-slate-300",
    }
  },

  // Component Specific Styles
  components: {
    card: "bg-[var(--color-brand-sb-shade-90)] rounded-xl border border-[var(--color-brand-sb-shade-80)] shadow-sm",
    // Updated cardHover to use a glowing Cyan border for a modern feel
    cardHover: "hover:border-[var(--color-brand-primary-50)] hover:shadow-lg transition-all duration-300",
    button: {
      primary: "bg-[var(--color-brand-primary-50)] text-white hover:bg-[var(--color-brand-primary-500)] transition-colors shadow-sm shadow-[var(--color-brand-primary-500)]",
      secondary: "bg-[var(--color-brand-primary-200)] text-slate-300 border border-slate-700 hover:bg-[var(--color-brand-primary-500)] hover:text-white transition-colors",
      danger: "bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-900",
    },
    badge: "px-2.5 py-0.5 rounded-full text-xs font-bold border",
    input: "w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary-500)] focus:border-[var(--color-brand-primary-500)] text-sm placeholder-slate-500",
    header: "bg-slate-900/90 backdrop-blur-md border-b border-slate-800",
    imageContainer: "bg-white rounded-xl flex items-center justify-center p-4 overflow-hidden border border-slate-700/50",
    // Standardized Recharts Tooltip Style for Dark Mode
    chartTooltip: {
      contentStyle: { 
        backgroundColor: '#30404B', // Slate 900
        borderColor: '#47555F', // Slate 800
        borderRadius: '12px', 
        color: '#E8EAEB', // Slate 50
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)'
      },
      itemStyle: { color: '#7C94A6' }, // Slate 400
      labelStyle: { color: '#E8EAEB', fontWeight: 600, marginBottom: '0.25rem' }
    }
  },

  // Chart Colors (Hex codes for Recharts - optimized for Dark Mode)
  charts: {
    primary: "#5899C4", // Cyan 400
    secondary: "#3E9C8F", // Indigo 400
    success: "#3DD17B", // Emerald 400
    warning: "#F99C11", // Amber 400
    danger: "#E84641", // Rose 400
    neutral: "#7C94A6", // Slate 500
    grid: "#334155",    // Slate 700
    purple: "#8684BF",  // Violet 400
    gray: "#7C94A6",    // Slate 400
  }
};