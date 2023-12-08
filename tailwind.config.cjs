/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
    theme: {
      extend: {},
    },
    plugins: [require("@tailwindcss/typography"), require("daisyui")],
    daisyui: {
        themes: [
          {
            cupcake: {
          ...require("daisyui/src/theming/themes")["cupcake"],
          "primary": "#A0C4FF",
          "secondary": "#BDB2FF",
          "accent": "#FDFFB6",
          "neutral": "#3a86ff",
          "base-100": "#FFFFFC",
          "info": "#1a1a9f",
          "success": "#adf7b6",
          "warning": "#FFD6A5",
          "error": "#FFADAD",
    
          ".menu-active": {
            "background-color": "#1a1a9f",
            "color": "#FFFFFC",
          }
                    }}, 
            {synthwave:{
          ...require("daisyui/src/theming/themes")["synthwave"],
          "primary": "#A0C4FF",
          "secondary": "#BDB2FF",
          "accent": "#FDFFB6",
          "neutral": "#3a86ff",
          "base-100": "#1a103d",
          "info": "#1a1a9f",
          "success": "#adf7b6",
          "warning": "#FFD6A5",
          "error": "#FFADAD",
                    }
          }]
        
      },
  }