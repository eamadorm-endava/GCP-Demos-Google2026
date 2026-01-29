// Centralized Theme Configuration (Dark Mode)

export const theme = {
  // Base Colors - background and text foundations
  colors: {
    background: {
      main: "bg-slate-950",
      card: "bg-slate-900",
      sidebar: "bg-black",
      input: "bg-slate-800",
      hover: "hover:bg-slate-800",
      active: "bg-slate-800",
    },
    text: {
      primary: "text-slate-50",
      secondary: "text-slate-400",
      tertiary: "text-slate-500",
      inverted: "text-slate-900",
      link: "text-cyan-400",
    },
    border: {
      light: "border-slate-800",
      base: "border-slate-800",
      focus: "focus:border-cyan-500",
    }
  },

  // Brand / Semantic Colors
  semantic: {
    primary: {
      base: "text-cyan-400",
      bg: "bg-cyan-600",
      bgLight: "bg-cyan-950", // Darker background for badges
      border: "border-cyan-900",
      hover: "hover:bg-cyan-500",
      text: "text-cyan-200",
      gradient: "from-cyan-600 to-blue-600",
    },
    secondary: {
      base: "text-indigo-400",
      bg: "bg-indigo-600",
      bgLight: "bg-indigo-950",
      border: "border-indigo-900",
      text: "text-indigo-200",
    },
    success: { // For positive KPIs, lifts, approval
      base: "text-emerald-400",
      bg: "bg-emerald-600",
      bgLight: "bg-emerald-950",
      border: "border-emerald-900",
      text: "text-emerald-200",
    },
    warning: { // For alerts, medium priority
      base: "text-amber-400",
      bg: "bg-amber-500",
      bgLight: "bg-amber-950",
      border: "border-amber-900",
      text: "text-amber-200",
    },
    danger: { // For stockouts, delists, negative trends
      base: "text-rose-400",
      bg: "bg-rose-600",
      bgLight: "bg-rose-950",
      border: "border-rose-900",
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
    card: "bg-slate-900 rounded-xl border border-slate-800 shadow-sm",
    // Updated cardHover to use a glowing Cyan border for a modern feel
    cardHover: "hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-900/10 transition-all duration-300",
    button: {
      primary: "bg-cyan-600 text-white hover:bg-cyan-500 transition-colors shadow-sm shadow-cyan-900/20",
      secondary: "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors",
      danger: "bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-900",
    },
    badge: "px-2.5 py-0.5 rounded-full text-xs font-bold border",
    input: "w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-sm placeholder-slate-500",
    header: "bg-slate-900/90 backdrop-blur-md border-b border-slate-800",
    imageContainer: "bg-white rounded-xl flex items-center justify-center p-4 overflow-hidden border border-slate-700/50",
    // Standardized Recharts Tooltip Style for Dark Mode
    chartTooltip: {
      contentStyle: { 
        backgroundColor: '#0f172a', // Slate 900
        borderColor: '#1e293b', // Slate 800
        borderRadius: '12px', 
        color: '#f8fafc', // Slate 50
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)'
      },
      itemStyle: { color: '#94a3b8' }, // Slate 400
      labelStyle: { color: '#f8fafc', fontWeight: 600, marginBottom: '0.25rem' }
    }
  },

  // Chart Colors (Hex codes for Recharts - optimized for Dark Mode)
  charts: {
    primary: "#22d3ee", // Cyan 400
    secondary: "#818cf8", // Indigo 400
    success: "#34d399", // Emerald 400
    warning: "#fbbf24", // Amber 400
    danger: "#f47174", // Rose 400
    neutral: "#64748b", // Slate 500
    grid: "#334155",    // Slate 700
    purple: "#a78bfa",  // Violet 400
    gray: "#94a3b8",    // Slate 400
  }
};