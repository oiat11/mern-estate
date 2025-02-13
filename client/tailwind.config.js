import lineClamp from '@tailwindcss/line-clamp';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightGreen: "#E0EEC6",  
        mossGreen: "#7CA982",  
        olive: "#C2A83E",      
        offWhite: "#F1F7ED",   
        deepGreen: "#243E36",
      },
    },
  },
  plugins: [lineClamp],
};
