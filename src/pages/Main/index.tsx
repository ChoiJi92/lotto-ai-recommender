import { useState, useCallback, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCcw } from 'lucide-react';
import { LottoBall } from '../../components/LottoBall';
import { AIStatus } from '../../components/AIStatus';
import { LottoMachine } from '../../components/LottoMachine';

const ContentCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 32px;
  padding: 3rem;
  max-width: 800px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    border-radius: 24px;
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  letter-spacing: -2px;
  background: linear-gradient(to bottom, #ffffff, rgba(255, 255, 255, 0.5));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  word-break: keep-all;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
    letter-spacing: -1px;
    margin-bottom: 0.5rem;
  }
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  word-break: keep-all;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 0.95rem;
    padding: 0 1rem;
    margin-bottom: 2rem;
  }
`;

const VisualContainer = styled.div`
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  position: relative;

  @media (max-width: 768px) {
    margin: 0;
    transform: scale(0.9);
  }
`;

const ExtractedBallContainer = styled(motion.div)`
  position: absolute;
  top: 320px; /* Adjusted to align with the exit hole center */
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  pointer-events: none;

  @media (max-width: 768px) {
    top: 240px; /* Precise adjustment for mobile scaled machine */
  }
`;

const BallGrid = styled.div`
  display: flex;
  gap: 1.2rem;
  justify-content: center;
  flex-wrap: wrap;
  margin: 2rem 0;
  min-height: 80px;

  @media (max-width: 768px) {
    gap: 0.8rem;
    margin: 1.5rem 0;
  }
`;

const ActionButton = styled(motion.button)`
  background: linear-gradient(135deg, #00f7ff 0%, #7000ff 100%);
  border: none;
  color: #000;
  padding: 1.25rem 3rem;
  border-radius: 100px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0 auto;
  box-shadow: 0 10px 20px rgba(0, 247, 255, 0.3);
  white-space: nowrap;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1rem;
    width: 100%;
    justify-content: center;
  }
`;

const ResetButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  margin-top: 1.5rem;
  transition: color 0.2s;
  
  &:hover {
    color: #ffffff;
  }

  @media (max-width: 768px) {
    margin-top: 1rem;
  }
`;

export const Main = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedNumbers, setExtractedNumbers] = useState<number[]>([]);
  const [currentExtraction, setCurrentExtraction] = useState<number | null>(null);

  const generateNumbers = useCallback(() => {
    setIsAnalyzing(true);
    setExtractedNumbers([]);
    setCurrentExtraction(null);
    
    // Simulate AI sequence
    setTimeout(() => {
      const finalNumbers: number[] = [];
      while (finalNumbers.length < 6) {
        const rand = Math.floor(Math.random() * 45) + 1;
        if (!finalNumbers.includes(rand)) {
          finalNumbers.push(rand);
        }
      }
      
      // Extract one by one
      let count = 0;
      const interval = setInterval(() => {
        if (count < 6) {
          const num = finalNumbers[count];
          setCurrentExtraction(num);
          
          // After animation, add to grid
          setTimeout(() => {
            setExtractedNumbers(prev => [...prev, num]);
            setCurrentExtraction(null);
          }, 600);
          
          count++;
        } else {
          clearInterval(interval);
          setIsAnalyzing(false);
          
          // Save to history
          const sortedNumbers = [...finalNumbers].sort((a, b) => a - b);
          setExtractedNumbers(sortedNumbers); // Ensure displayed numbers are sorted at the end if you prefer, or keep them extraction order. Let's keep extraction order for display but save sorted. Actually, let's reset extractedNumbers to sorted version for cleaner look or keep as is. The user didn't specify, but history usually shows sorted. Let's save sorted to history.
          
          const historyItem = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('ko-KR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            numbers: sortedNumbers
          };

          const existingHistory = localStorage.getItem('lottoHistory');
          const history = existingHistory ? JSON.parse(existingHistory) : [];
          localStorage.setItem('lottoHistory', JSON.stringify([historyItem, ...history]));
        }
      }, 1200);
      
    }, 2000);
  }, []);

  return (
    <ContentCard
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Title>AI 행운의<br />로또 추첨기</Title>
      <Subtitle>
        인공지능이 과거 당첨 패턴을 정밀 분석하여<br />당신에게 찾아올 행운의 번호를 예측합니다.
      </Subtitle>

      <VisualContainer>
        <LottoMachine isSpinning={isAnalyzing && extractedNumbers.length < 6} />
        
        <AnimatePresence>
          {currentExtraction && (
            <ExtractedBallContainer
              key={currentExtraction}
              initial={{ y: -50, scale: 0.8, opacity: 0, x: '-50%' }}
              animate={{ 
                y: [0, 80],
                scale: [0.8, 1.2],
                opacity: 1,
                x: '-50%'
              }}
              exit={{ y: 120, scale: 0.5, opacity: 0, x: '-50%' }}
              transition={{ duration: 0.5, ease: "circOut" }}
            >
              <LottoBall number={currentExtraction} />
            </ExtractedBallContainer>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isAnalyzing && extractedNumbers.length === 0 ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AIStatus />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ width: '100%', textAlign: 'center' }}
            >
              <BallGrid>
                {extractedNumbers.map((num, idx) => (
                  <LottoBall key={`${num}-${idx}`} number={num} delay={0} />
                ))}
              </BallGrid>
              
              {!isAnalyzing && (
                <>
                  {extractedNumbers.length === 0 ? (
                    <ActionButton
                      whileHover={{ scale: 1.05, boxShadow: '0 15px 30px rgba(0, 247, 255, 0.4)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={generateNumbers}
                    >
                      <Sparkles size={20} />
                      AI 번호 생성하기
                    </ActionButton>
                  ) : (
                    <ResetButton onClick={generateNumbers}>
                      <RefreshCcw size={16} />
                      다시 생성하기
                    </ResetButton>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </VisualContainer>
    </ContentCard>
  );
};
