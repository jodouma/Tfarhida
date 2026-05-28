module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"],
      },
      boxShadow: {
        glow: "0 18px 60px rgba(236, 72, 153, 0.2)",
      },
      backgroundImage: {
        "party-mesh":
          "radial-gradient(circle at 12% 18%, rgba(251,191,36,.42), transparent 28%), radial-gradient(circle at 88% 12%, rgba(20,184,166,.3), transparent 26%), radial-gradient(circle at 70% 78%, rgba(236,72,153,.25), transparent 31%), linear-gradient(135deg, #fff7ed 0%, #fdf2f8 48%, #ecfeff 100%)",
      },
    },
  },
  plugins: [],
};
