import styled from '@emotion/styled';
import { Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  z-index: 10;

  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
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

const Nav = styled.nav`
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
    gap: 1.5rem;
    a {
      font-size: 0.9rem;
      padding: 0.4rem 0.8rem;
    }
  }
`;

export const Header = () => {
  return (
    <HeaderContainer>
      <Logo to="/">
        <Cpu size={24} color="#00f7ff" />
        AI <span>로또 추천</span>
      </Logo>
    </HeaderContainer>
  );
};
