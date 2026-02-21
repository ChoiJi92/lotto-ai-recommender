import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const Container = styled(motion.div)`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  text-align: left;
`;

const ContentCard = styled.div`
  background: var(--card-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--card-border);
  border-radius: 32px;
  padding: 3rem;
  color: var(--text-main);
  box-shadow: var(--card-shadow);

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 20px;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 2rem;
  letter-spacing: -1px;
`;

const Section = styled.section`
  margin-bottom: 2.5rem;

  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--text-main);
  }

  p, li {
    font-size: 0.95rem;
    color: var(--text-muted);
    line-height: 1.7;
    margin-bottom: 0.5rem;
  }

  strong {
    color: var(--text-main);
  }
`;

export const Terms = () => {
  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ContentCard>
        <Title>이용약관</Title>
        
        <Section>
          <h2>제 1 조 (목적)</h2>
          <p>본 약관은 베로 데이터 연구소(이하 '연구소')가 제공하는 AI 로또 번호 추천 서비스(이하 '서비스')의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.</p>
        </Section>

        <Section>
          <h2>제 2 조 (서비스의 성격 및 책임의 한계)</h2>
          <p>1. 본 서비스는 인공지능 알고리즘과 통계 데이터를 기반으로 한 <strong>단순 참고용 번호 추천 시스템</strong>입니다.</p>
          <p>2. 추천된 번호는 <strong>당첨을 보장하지 않으며</strong>, 실제 복권 당첨 결과와는 아무런 연관이 없습니다.</p>
          <p>3. 본 서비스를 이용한 복권 구매 및 그에 따른 모든 결과에 대한 책임은 <strong>이용자 본인</strong>에게 있으며, 연구소는 어떠한 손실이나 결과에 대해서도 법적 책임을 지지 않습니다.</p>
        </Section>

        <Section>
          <h2>제 3 조 (이용자의 의무)</h2>
          <p>이용자는 본 서비스를 오로지 오락 및 참고 목적으로만 이용해야 하며, 시스템에 해를 끼치는 행위나 비정상적인 접근을 해서는 안 됩니다.</p>
        </Section>

        <Section>
          <h2>제 4 조 (서비스의 변경 및 중단)</h2>
          <p>연구소는 운영상, 기술상의 필요에 따라 서비스의 전부 또는 일부를 변경하거나 중단할 수 있습니다. 이 경우 별도의 통지 없이 서비스 내에서 변경된 내용을 공지할 수 있습니다.</p>
        </Section>

        <Section>
          <h2>제 5 조 (광고 게재)</h2>
          <p>본 서비스의 무료 제공을 위해 사이트 내에 구글 애드센스 등 광고가 게재될 수 있으며, 이용자는 서비스 이용 시 노출되는 광고 게재에 동의하는 것으로 간주합니다.</p>
        </Section>

        <Section>
          <h2>제 6 조 (관할 법원)</h2>
          <p>본 서비스 이용과 관련하여 발생한 분쟁에 대해서는 연구소의 소재지를 관할하는 법원을 전합 관할 법원으로 합니다.</p>
        </Section>

        <p style={{ marginTop: '3rem', fontSize: '0.8rem', opacity: 0.5 }}>본 약관은 2026년 2월 21일부터 시행됩니다.</p>
      </ContentCard>
    </Container>
  );
};
