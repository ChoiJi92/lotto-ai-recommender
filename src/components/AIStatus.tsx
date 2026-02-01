import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const WaveContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 40px;
`;

const Bar = styled(motion.div)`
  width: 4px;
  background: linear-gradient(to top, #00f7ff, #7000ff);
  border-radius: 2px;
`;

const StatusText = styled(motion.p)`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 1px;
`;

export const AIStatus = () => {
  const bars = Array.from({ length: 20 });
  
  return (
    <StatusContainer>
      <WaveContainer>
        {bars.map((_, i) => (
          <Bar
            key={i}
            animate={{
              height: [10, 40, 15, 30, 10],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.05,
              ease: "easeInOut"
            }}
          />
        ))}
      </WaveContainer>
      <StatusText
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        AI가 당첨 패턴을 분석 중입니다...
      </StatusText>
    </StatusContainer>
  );
};
