/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Baloo Bhai'],
        body: ["'Baloo 2'", "sans-serif"],
        sans: ["'Baloo 2'", "sans-serif"],
        serif: ["'Baloo Bhai 2'", "cursive"],
        playfair: ["'Baloo Bhai 2'", "cursive"],
      },
      fontSize: {
        // Screen-specific font sizes in pixels
        // 2560px+ screens
        "xl-2560": ["22px", { lineHeight: "1.5" }],
        "2xl-2560": ["24px", { lineHeight: "1.4" }],
        "3xl-2560": ["30px", { lineHeight: "1.3" }],
        "4xl-2560": ["36px", { lineHeight: "1.2" }],
        "5xl-2560": ["48px", { lineHeight: "1.1" }],
        "6xl-2560": ["60px", { lineHeight: "1" }],
        "7xl-2560": ["72px", { lineHeight: "1" }],
        "8xl-2560": ["96px", { lineHeight: "1" }],

        // 1440px screens
        "xl-1440": ["16px", { lineHeight: "1.5" }],
        "2xl-1440": ["18px", { lineHeight: "1.4" }],
        "3xl-1440": ["24px", { lineHeight: "1.3" }],
        "4xl-1440": ["30px", { lineHeight: "1.2" }],
        "5xl-1440": ["40px", { lineHeight: "1.1" }],
        "6xl-1440": ["50px", { lineHeight: "1" }],
        "7xl-1440": ["60px", { lineHeight: "1" }],
        "8xl-1440": ["80px", { lineHeight: "1" }],

        // 1280px screens
        "xl-1280": ["15px", { lineHeight: "1.5" }],
        "2xl-1280": ["17px", { lineHeight: "1.4" }],
        "3xl-1280": ["22px", { lineHeight: "1.3" }],
        "4xl-1280": ["28px", { lineHeight: "1.2" }],
        "5xl-1280": ["36px", { lineHeight: "1.1" }],
        "6xl-1280": ["45px", { lineHeight: "1" }],
        "7xl-1280": ["54px", { lineHeight: "1" }],
        "8xl-1280": ["72px", { lineHeight: "1" }],

        // 1024px screens (tablets)
        "xl-1024": ["15px", { lineHeight: "1.5" }],
        "2xl-1024": ["17px", { lineHeight: "1.4" }],
        "3xl-1024": ["22px", { lineHeight: "1.3" }],
        "4xl-1024": ["28px", { lineHeight: "1.2" }],
        "5xl-1024": ["36px", { lineHeight: "1.1" }],
        "6xl-1024": ["45px", { lineHeight: "1" }],
        "7xl-1024": ["54px", { lineHeight: "1" }],
        "8xl-1024": ["72px", { lineHeight: "1" }],

        // 768px screens (mobile)
        "xl-768": ["14px", { lineHeight: "1.5" }],
        "2xl-768": ["16px", { lineHeight: "1.4" }],
        "3xl-768": ["20px", { lineHeight: "1.3" }],
        "4xl-768": ["26px", { lineHeight: "1.2" }],
        "5xl-768": ["32px", { lineHeight: "1.1" }],
        "6xl-768": ["40px", { lineHeight: "1" }],
        "7xl-768": ["48px", { lineHeight: "1" }],
        "8xl-768": ["64px", { lineHeight: "1" }],

        // 480px screens (small mobile)
        "xl-480": ["15px", { lineHeight: "1.5" }],
        "2xl-480": ["17px", { lineHeight: "1.4" }],
        "3xl-480": ["22px", { lineHeight: "1.3" }],
        "4xl-480": ["28px", { lineHeight: "1.2" }],
        "5xl-480": ["36px", { lineHeight: "1.1" }],
        "6xl-480": ["45px", { lineHeight: "1" }],
        "7xl-480": ["54px", { lineHeight: "1" }],
        "8xl-480": ["72px", { lineHeight: "1" }],

        // Default font sizes (16px base)
        xs: ["12px", { lineHeight: "1rem" }],
        sm: ["14px", { lineHeight: "1.25rem" }],
        base: ["16px", { lineHeight: "1.5rem" }],
        lg: ["18px", { lineHeight: "1.75rem" }],
        xl: ["20px", { lineHeight: "1.75rem" }],
        "2xl": ["24px", { lineHeight: "2rem" }],
        "3xl": ["30px", { lineHeight: "2.25rem" }],
        "4xl": ["36px", { lineHeight: "2.5rem" }],
        "5xl": ["48px", { lineHeight: "1" }],
        "6xl": ["60px", { lineHeight: "1" }],
        "7xl": ["72px", { lineHeight: "1" }],
        "8xl": ["96px", { lineHeight: "1" }],
        "9xl": ["128px", { lineHeight: "1" }],
      },
      colors: {
        primary: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#D4AF37", // Main primary color
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
        },
        secondary: {
          50: "#f8f9fa",
          100: "#e9ecef",
          200: "#dee2e6",
          300: "#ced4da",
          400: "#adb5bd",
          500: "#6c757d",
          600: "#495057",
          700: "#343434", // Main secondary color
          800: "#212529",
          900: "#1a1a1a",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },
    },
  },
  plugins: [],
}
