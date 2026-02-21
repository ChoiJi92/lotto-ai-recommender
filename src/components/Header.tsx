import { useState } from 'react';
import styled from '@emotion/styled';
import { Cpu, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;

  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: row; 
    align-items: center;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: -0.5px;
  color: var(--text-main);
  text-decoration: none;
  z-index: 51; 
  
  span {
    color: var(--text-main);
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const DesktopNav = styled.nav`
  display: flex;
  gap: 2rem;
  
  a {
    color: var(--text-muted);
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.2s;
    background: var(--btn-bg);
    backdrop-filter: blur(10px);
    border: 1px solid var(--btn-border);
    
    &:hover {
      color: var(--text-main);
      background: var(--btn-hover-bg);
      border-color: var(--btn-hover-border);
      transform: translateY(-1px);
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--text-main);
  cursor: pointer;
  z-index: 51;
  padding: 0.5rem;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileNavOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: var(--menu-bg);
  backdrop-filter: blur(10px);
  z-index: 50;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;

  a {
    color: var(--text-main);
    font-size: 1.5rem;
    font-weight: 700;
    text-decoration: none;
    padding: 1rem 2rem;
    
    &:hover {
        color: #3182f6;
    }
  }
`;

const ThemeToggleButton = styled.button`
  background: none;
  border: none;
  color: var(--text-main);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  transition: transform 0.2s;
  z-index: 51;

  &:hover {
    transform: scale(1.1);
  }
`;

const MobileActions = styled.div`
  display: none;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    display: flex;
  }
`;

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <HeaderContainer>
      <Logo to="/">
        <Cpu size={24} color="#3182f6" />
        AI <span>로또 추천</span>
      </Logo>
      
      <DesktopNav>
        <ThemeToggleButton onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </ThemeToggleButton>
        <Link to="/history">기록</Link>
      </DesktopNav>

      <MobileActions>
        <ThemeToggleButton onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </ThemeToggleButton>
        <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </MobileMenuButton>
      </MobileActions>

      <AnimatePresence>
        {isMenuOpen && (
          <MobileNavOverlay
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <Link to="/" onClick={() => setIsMenuOpen(false)}>홈으로</Link>
            <Link to="/history" onClick={() => setIsMenuOpen(false)}>과거 추천 기록</Link>
          </MobileNavOverlay>
        )}
      </AnimatePresence>
    </HeaderContainer>
  );
};
