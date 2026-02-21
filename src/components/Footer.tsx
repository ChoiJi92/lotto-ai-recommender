import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  width: 100%;
  padding: 4rem 2rem;
  margin-top: 4rem;
  border-top: 1px solid var(--card-border);
  background: rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  
  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.01);
  }

  @media (max-width: 768px) {
    padding: 3rem 1rem;
    margin-top: 2rem;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const FooterLink = styled(Link)`
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: var(--text-main);
  }
`;

const ExternalLink = styled.a`
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: var(--text-main);
  }
`;

const Copyright = styled.p`
  color: var(--text-muted);
  font-size: 0.8rem;
  opacity: 0.7;
`;

const BrandInfo = styled.div`
  text-align: center;
  max-width: 600px;
  margin-bottom: 1rem;

  h3 {
    font-size: 1rem;
    color: var(--text-main);
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.8rem;
    color: var(--text-muted);
    line-height: 1.6;
    word-break: keep-all;
  }
`;

export const Footer = () => {
  return (
    <FooterContainer>
      <BrandInfo>
        <h3>베로 데이터 연구소 (Vero Lab)</h3>
        <p>
          인공지능과 데이터 사이언스를 결합하여 사용자들에게 행운의 가치를 전달합니다. 
          본 서비스는 로또 당첨을 보장하지 않으며, 모든 투자 및 게임의 법적 책임은 이용자 본인에게 있습니다.
        </p>
      </BrandInfo>
      
      <FooterLinks>
        <FooterLink to="/terms">이용약관</FooterLink>
        <FooterLink to="/privacy">개인정보처리방침</FooterLink>
        <ExternalLink href="mailto:kairoscanner@gmail.com">문의하기</ExternalLink>
      </FooterLinks>

      <Copyright>
        &copy; {new Date().getFullYear()} Vero Lab. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};
