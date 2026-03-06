
// Endava Brand Color Palette
// Based on official brand guidelines

export const ENDAVA_COLORS = {
    orange: '#FF5640', // Primary Brand Color
    dark: '#192B37',   // Primary Background

    // Solid Blue Shades (Neutrals/Backgrounds)
    blue: {
        90: '#30404B', // Card Backgrounds
        80: '#47555F', // Borders/Separators
        70: '#5E6A73', // Text Secondary
        60: '#758087',
        50: '#8C959B',
        40: '#A3AAAF',
        30: '#BABFC3',
        20: '#D1D5D7',
        10: '#E8EAEB',
    },

    white: '#FFFFFF',

    // Semantic Colors (derived or complementary)
    success: '#10B981', // Emerald 500
    warning: '#F59E0B', // Amber 500
    error: '#EF4444',   // Red 500
};

// Chart Theme Configuration
export const CHART_THEME = {
    background: ENDAVA_COLORS.blue[90],
    text: ENDAVA_COLORS.blue[30],
    grid: ENDAVA_COLORS.blue[80],
    tooltip: {
        background: ENDAVA_COLORS.dark,
        border: ENDAVA_COLORS.blue[80],
        text: ENDAVA_COLORS.white,
    },
    colors: [
        ENDAVA_COLORS.orange,
        '#FF8C7A', // Lighter Orange
        ENDAVA_COLORS.blue[50],
        ENDAVA_COLORS.blue[70],
    ]
};
