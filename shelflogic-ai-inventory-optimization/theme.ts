
// Centralized Theme Configuration (Dark Mode)

export const theme = {
  // Base Colors - background and text foundations
  colors: {
    background: {
      main: "bg-[#192B37]", // Primary Dark
      card: "bg-[#30404B]", // Solid Blue 90%
      sidebar: "bg-[#192B37]", // Primary Dark
      input: "bg-[#30404B]", // Solid Blue 90%
      hover: "hover:bg-[#47555F]", // Solid Blue 80%
      active: "bg-[#47555F]",      // Solid Blue 80%
    },
    text: {
      primary: "text-[#FFFFFF]", // White
      secondary: "text-[#E8EAEB]", // Solid Blue 10%
      tertiary: "text-[#D1D5D7]",  // Solid Blue 20%
      inverted: "text-[#192B37]", // Primary Dark
      link: "text-[#FF5640]", // Primary Brand Color
    },
    border: {
      light: "border-[#5E6A73]",   // Solid Blue 70%
      base: "border-[#47555F]",    // Solid Blue 80% — replaces bright white-ish borders
      focus: "focus:border-[#FF5640]",
    }
  },

  // Brand / Semantic Colors
  semantic: {
    primary: {
      base: "text-[#FF5640]",
      bg: "bg-[#FF5640]",
      bgLight: "bg-[#FF5640]/10",
      border: "border-[#FF5640]/50",
      hover: "hover:bg-[#FF5640]/90",
      text: "text-[#FF5640]",
      gradient: "from-[#FF5640] to-[#FF8A7A]",
    },
    secondary: {
      base: "text-[#30404B]",
      bg: "bg-[#30404B]",
      bgLight: "bg-[#30404B]/30",
      border: "border-[#30404B]",
      text: "text-[#30404B]",
    },
    success: { // For positive KPIs, lifts, approval
      base: "text-emerald-400",
      bg: "bg-emerald-600",
      bgLight: "bg-emerald-900/30",
      border: "border-emerald-800",
      text: "text-emerald-300",
    },
    warning: { // For alerts, medium priority
      base: "text-amber-400",
      bg: "bg-amber-500",
      bgLight: "bg-amber-900/30",
      border: "border-amber-800",
      text: "text-amber-300",
    },
    danger: { // For stockouts, delists, negative trends
      base: "text-rose-400",
      bg: "bg-rose-600",
      bgLight: "bg-rose-900/30",
      border: "border-rose-800",
      text: "text-rose-300",
    },
    info: { // For misc tags
      base: "text-[#A3AAAF]",      // Solid Blue 40%
      bgLight: "bg-[#30404B]/50",  // Solid Blue 90% with opacity
      border: "border-[#47555F]",  // Solid Blue 80%
      text: "text-[#D1D5D7]",      // Solid Blue 20%
    }
  },

  // Component Specific Styles
  components: {
    card: "bg-[#30404B] rounded-xl border border-[#5E6A73] shadow-sm", // Solid Blue 90% and 70%
    cardHover: "hover:border-[#FF5640]/50 hover:shadow-lg hover:shadow-[#FF5640]/10 transition-all duration-300",
    button: {
      primary: "bg-[#FF5640] text-white hover:bg-[#E64D39] transition-colors shadow-sm shadow-[#FF5640]/20",
      secondary: "bg-[#47555F] text-[#FFFFFF] border border-[#5E6A73] hover:bg-[#5E6A73] hover:text-white transition-colors",
      danger: "bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-900",
    },
    badge: "px-2.5 py-0.5 rounded-full text-xs font-bold border",
    input: "w-full pl-10 pr-4 py-2 bg-[#30404B] border border-[#5E6A73] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5640]/20 focus:border-[#FF5640] text-sm placeholder-[#8C959B]", // Solid Blue 90%, 70%, 50%
    header: "bg-[#192B37]/90 backdrop-blur-md border-b border-[#30404B]", // Primary Dark and Solid Blue 90%
    imageContainer: "bg-[#FFFFFF] rounded-xl flex items-center justify-center p-4 overflow-hidden border border-[#A3AAAF]",
    // Standardized Recharts Tooltip Style for Dark Mode
    chartTooltip: {
      contentStyle: {
        backgroundColor: '#192B37',
        borderColor: '#5E6A73', // Solid Blue 70%
        borderRadius: '12px',
        color: '#FFFFFF',
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)'
      },
      itemStyle: { color: '#D1D5D7' }, // Solid Blue 20%
      labelStyle: { color: '#FFFFFF', fontWeight: 600, marginBottom: '0.25rem' }
    }
  },

  // Chart Colors (Hex codes for Recharts)
  charts: {
    primary: "#FF5640",
    secondary: "#30404B", // Solid Blue 90%
    success: "#34d399",   // Emerald 400
    warning: "#fbbf24",   // Amber 400
    danger: "#f47174",    // Rose 400
    neutral: "#758087",   // Solid Blue 60%
    grid: "#47555F",      // Solid Blue 80%
    purple: "#a78bfa",    // Violet 400
    gray: "#8C959B",      // Solid Blue 50%
  }
};
