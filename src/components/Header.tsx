import { useState } from 'react';
import styled from '@emotion/styled';
import { Cpu, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
  color: #ffffff;
  text-decoration: none;
  z-index: 51; 
  
  span {
    background: linear-gradient(135deg, #00f7ff 0%, #7000ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
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
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.2s;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    &:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
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
  color: #fff;
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
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  z-index: 50;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;

  a {
    color: #fff;
    font-size: 1.5rem;
    font-weight: 700;
    text-decoration: none;
    padding: 1rem 2rem;
    
    &:hover {
        color: #00f7ff;
    }
  }
`;

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <HeaderContainer>
      <Logo to="/">
        <Cpu size={24} color="#00f7ff" />
        AI <span>로또 추천</span>
      </Logo>
      
      <DesktopNav>
        <Link to="/history">기록</Link>
      </DesktopNav>

      <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </MobileMenuButton>

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
