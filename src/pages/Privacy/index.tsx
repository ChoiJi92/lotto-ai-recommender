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

  ul {
    padding-left: 1.2rem;
  }
`;

export const Privacy = () => {
  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ContentCard>
        <Title>개인정보처리방침</Title>
        
        <Section>
          <h2>1. 개인정보의 수집 항목 및 방법</h2>
          <p>베로 데이터 연구소('https://verolabo.com', 이하 '연구소')는 별도의 회원가입 없이 서비스를 제공하며, 사용자의 개인 식별 정보를 수집하지 않습니다.</p>
          <ul>
            <li>자동 수집 항목: 접속 로그, 쿠키, 접속 IP 정보, 브라우저 종류, 운영체제 (서비스 최적화 및 통계 분석용)</li>
            <li>사용자 입력 항목: 꿈 분석 기능을 위해 입력하는 텍스트 (해당 데이터는 분석 즉시 사용되며 별도로 서버에 영구 저장되지 않습니다.)</li>
          </ul>
        </Section>

        <Section>
          <h2>2. 개인정보의 수집 및 이용 목적</h2>
          <p>연구소는 수집한 정보를 다음의 목적을 위해 활용합니다.</p>
          <ul>
            <li>서비스 제공 및 관리: 인공지능 로또 번호 추천 기능 제공</li>
            <li>서비스 개선: 이용 패턴 분석을 통한 UI/UX 최적화</li>
            <li>광고 게재: 구글 애드센스 등 외부 광고 플랫폼 이용을 위한 사용자 관심사 기반 맞춤형 광고 제공</li>
          </ul>
        </Section>

        <Section>
          <h2>3. 개인정보의 제3자 제공 및 위탁</h2>
          <p>연구소는 사용자의 개인정보를 외부에 제공하지 않습니다. 다만, 구글(Google)과 같은 타사 광고 업체는 쿠키를 사용하여 사용자의 웹사이트 방문 기록에 따라 광고를 게재할 수 있습니다.</p>
          <p>구글의 맞춤형 광고 설정에 대한 자세한 내용은 구글의 광고 설정 페이지에서 확인하실 수 있습니다.</p>
        </Section>

        <Section>
          <h2>4. 개인정보의 보유 및 파기</h2>
          <p>본 서비스는 회원 정보를 보유하지 않으므로 파기할 개인정보가 존재하지 않습니다. 접속 로그 등 통계 데이터는 서버 관리 정책에 따라 일정 기간 경과 후 자동 파기됩니다.</p>
        </Section>

        <Section>
          <h2>5. 이용자의 권리와 의무</h2>
          <p>사용자는 언제든지 웹브라우저의 설정을 통해 쿠키 저장을 거부할 수 있습니다. 또한 본 서비스를 이용함으로써 발생하는 모든 결과에 대한 책임은 이용자 본인에게 있습니다.</p>
        </Section>

        <Section>
          <h2>6. 개인정보 보호책임자</h2>
          <p>이름: 베로 데이터 연구소 관리자</p>
          <p>이메일: kairoscanner@gmail.com</p>
        </Section>

        <p style={{ marginTop: '3rem', fontSize: '0.8rem', opacity: 0.5 }}>시행 일자: 2026년 2월 21일</p>
      </ContentCard>
    </Container>
  );
};
