import { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCcw } from 'lucide-react';
import { Header } from './components/Header';
import { LottoBall } from './components/LottoBall';
import { AIStatus } from './components/AIStatus';
import { LottoMachine } from './components/LottoMachine';

const MainContainer = styled.main`
  min-height: 100vh;
  padding: 8rem 2rem 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const BackgroundGlow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(112, 0, 255, 0.15) 0%, rgba(0, 247, 255, 0.05) 50%, transparent 70%);
  pointer-events: none;
  z-index: -1;
`;

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
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  letter-spacing: -2px;
  background: linear-gradient(to bottom, #ffffff, rgba(255, 255, 255, 0.5));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.1rem;
  margin-bottom: 3rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const BallGrid = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin: 3rem 0;
  min-height: 80px;
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
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
`;

const VisualContainer = styled.div`
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

function App() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateNumbers = useCallback(() => {
    setIsAnalyzing(true);
    setNumbers([]);
    
    // Simulate AI analysis time
    setTimeout(() => {
      const newNumbers: number[] = [];
      while (newNumbers.length < 6) {
        const rand = Math.floor(Math.random() * 45) + 1;
        if (!newNumbers.includes(rand)) {
          newNumbers.push(rand);
        }
      }
      setNumbers(newNumbers.sort((a, b) => a - b));
      setIsAnalyzing(false);
    }, 3500); 
  }, []);

  return (
    <MainContainer>
      <Header />
      <BackgroundGlow />
      
      <ContentCard
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Title>AI Fortune<br />Drum Machine.</Title>
        <Subtitle>
          Watch the neural network simulate the drawing process in real-time. Direct probability synthesis in action.
        </Subtitle>

        <VisualContainer>
          <LottoMachine isSpinning={isAnalyzing} />
          
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
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
                  {numbers.map((num, idx) => (
                    <LottoBall key={`${num}-${idx}`} number={num} delay={idx * 0.2} />
                  ))}
                </BallGrid>
                
                {numbers.length === 0 ? (
                  <ActionButton
                    whileHover={{ scale: 1.05, boxShadow: '0 15px 30px rgba(0, 247, 255, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={generateNumbers}
                  >
                    <Sparkles size={20} />
                    Start Extraction
                  </ActionButton>
                ) : (
                  <ResetButton onClick={generateNumbers}>
                    <RefreshCcw size={16} />
                    Draw Again
                  </ResetButton>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </VisualContainer>
      </ContentCard>
    </MainContainer>
  );
}

export default App;
