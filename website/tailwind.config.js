/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			// Warm Neutral Color Scheme - Orange/Stone palette
  			brand: {
  				primary: '#F97316',      // orange-500
  				secondary: '#EA580C',    // orange-600
  				success: '#10B981',      // emerald-500 (unchanged)
  				light: '#FAFAF9',        // stone-50
  				dark: '#1C1917',         // stone-900
  				muted: '#78716C',        // stone-500
  				'muted-light': '#A8A29E' // stone-400
  			},
  			// Orange palette for primary actions
  			orange: {
  				50: '#FFF7ED',
  				100: '#FFEDD5',
  				200: '#FED7AA',
  				300: '#FDBA74',
  				400: '#FB923C',
  				500: '#F97316',
  				600: '#EA580C',
  				700: '#C2410C',
  				800: '#9A3412',
  				900: '#7C2D12',
  			},
  			terminal: {
  				bg: '#1C1917',           // stone-900
  				text: '#F97316',         // orange-500
  				dim: '#78716C',          // stone-500
  				accent: '#FB923C',       // orange-400
  				error: '#EF4444',
  				warning: '#F59E0B'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			mono: [
  				'JetBrains Mono',
  				'SF Mono',
  				'Courier New',
  				'monospace'
  			],
  			sans: [
  				'DM Sans',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'sans-serif'
  			],
  			display: [
  				'DM Sans',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'sans-serif'
  			]
  		},
  		animation: {
  			blink: 'blink 1s step-end infinite',
  			'fade-in': 'fadeIn 0.5s ease-out forwards',
  			'slide-up': 'slideUp 0.6s ease-out forwards',
  			float: 'float 6s ease-in-out infinite',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		keyframes: {
  			blink: {
  				'0%, 50%': {
  					opacity: '1'
  				},
  				'51%, 100%': {
  					opacity: '0'
  				}
  			},
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			slideUp: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			float: {
  				'0%, 100%': {
  					transform: 'translateY(0)'
  				},
  				'50%': {
  					transform: 'translateY(-10px)'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		}
  	}
  },
  plugins: [],
}
