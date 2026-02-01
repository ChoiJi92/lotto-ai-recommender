export const theme = {
  colors: {
    primary: '#00f7ff',
    secondary: '#7000ff',
    background: '#0a0a1a',
    surface: 'rgba(255, 255, 255, 0.05)',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    accent: '#ff00d4',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #00f7ff 0%, #7000ff 100%)',
    surface: 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
  },
  shadows: {
    glow: '0 0 20px rgba(0, 247, 255, 0.3)',
    premium: '0 10px 30px rgba(0, 0, 0, 0.5)',
  },
  blur: 'backdrop-filter: blur(12px);',
};

export type Theme = typeof theme;
