import styled from '@emotion/styled';
import { Cpu } from 'lucide-react';

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
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: -0.5px;
  color: #ffffff;
  
  span {
    background: linear-gradient(135deg, #00f7ff 0%, #7000ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  
  a {
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: color 0.2s;
    
    &:hover {
      color: #ffffff;
    }
  }
`;

const ContactButton = styled.button`
  background: rgba(0, 247, 255, 0.1);
  border: 1px solid rgba(0, 247, 255, 0.3);
  color: #00f7ff;
  padding: 0.5rem 1.25rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(0, 247, 255, 0.2);
    box-shadow: 0 0 15px rgba(0, 247, 255, 0.3);
  }
`;

export const Header = () => {
  return (
    <HeaderContainer>
      <Logo>
        <Cpu size={24} color="#00f7ff" />
        AI <span>Lotto Recommender</span>
      </Logo>
      <Nav>
        <a href="#">Premium</a>
        <a href="#">Analysis</a>
        <a href="#">History</a>
      </Nav>
      <ContactButton>Connect AI</ContactButton>
    </HeaderContainer>
  );
};
