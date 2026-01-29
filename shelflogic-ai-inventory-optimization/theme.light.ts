// Centralized Theme Configuration (Light Mode Backup)

export const theme = {
  // Base Colors - background and text foundations
  colors: {
    background: {
      main: "bg-slate-50",
      card: "bg-white",
      sidebar: "bg-slate-900",
      input: "bg-white",
      hover: "hover:bg-slate-50",
      active: "bg-slate-100",
    },
    text: {
      primary: "text-slate-900",
      secondary: "text-slate-500",
      tertiary: "text-slate-400",
      inverted: "text-white",
      link: "text-blue-600",
    },
    border: {
      light: "border-slate-100",
      base: "border-slate-200",
      focus: "focus:border-blue-500",
    }
  },

  // Brand / Semantic Colors
  semantic: {
    primary: {
      base: "text-blue-600",
      bg: "bg-blue-600",
      bgLight: "bg-blue-50",
      border: "border-blue-200",
      hover: "hover:bg-blue-700",
      text: "text-blue-700",
      gradient: "from-blue-600 to-indigo-600",
    },
    secondary: {
      base: "text-indigo-600",
      bg: "bg-indigo-600",
      bgLight: "bg-indigo-50",
      border: "border-indigo-200",
      text: "text-indigo-700",
    },
    success: { // For positive KPIs, lifts, approval
      base: "text-emerald-600",
      bg: "bg-emerald-600",
      bgLight: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
    },
    warning: { // For alerts, medium priority
      base: "text-amber-500",
      bg: "bg-amber-500",
      bgLight: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-800",
    },
    danger: { // For stockouts, delists, negative trends
      base: "text-red-600",
      bg: "bg-red-600",
      bgLight: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
    },
    info: { // For misc tags
      base: "text-slate-600",
      bgLight: "bg-slate-100",
      border: "border-slate-200",
      // Added missing text property to resolve theme type inconsistency in components
      text: "text-slate-700",
    }
  },

  // Component Specific Styles
  components: {
    card: "bg-white rounded-xl border border-slate-200 shadow-sm",
    cardHover: "hover:shadow-md transition-shadow duration-200",
    button: {
      primary: "bg-slate-900 text-white hover:bg-blue-600 transition-colors shadow-sm",
      secondary: "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors",
      danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
    },
    badge: "px-2.5 py-0.5 rounded-full text-xs font-bold border",
    input: "w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm",
    header: "bg-white/90 backdrop-blur-md border-b border-slate-200",
  },

  // Chart Colors (Hex codes for Recharts)
  charts: {
    primary: "#3b82f6", // Blue 500
    secondary: "#6366f1", // Indigo 500
    success: "#10b981", // Emerald 500
    warning: "#f59e0b", // Amber 500
    danger: "#ef4444", // Red 500
    neutral: "#94a3b8", // Slate 400
    grid: "#e2e8f0",    // Slate 200
  }
};