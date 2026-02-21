import { useState, useCallback, useRef } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCcw, History, Share2, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { LottoBall } from '../../components/LottoBall';
import { AIStatus } from '../../components/AIStatus';
import { LottoMachine } from '../../components/LottoMachine';
import { predictNumbers } from '../../ml/inference';
import { useNavigate } from 'react-router-dom';

const ContentCard = styled(motion.div)`
  background: var(--card-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--card-border);
  border-radius: 32px;
  padding: 1.5rem 2rem;
  max-width: 800px;
  width: 100%;
  text-align: center;
  box-shadow: var(--card-shadow);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
    border-radius: 20px;
    height: auto;
    max-height: 85vh; /* Limit height to viewport */
  }
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 0.2rem;
  letter-spacing: -2px;
  background: var(--title-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  word-break: keep-all;
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
    letter-spacing: -1px;
    margin-bottom: 0;
  }
`;

const Subtitle = styled.p`
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  word-break: keep-all;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 0 1rem;
    margin-bottom: 0.5rem;
  }
`;

const VisualContainer = styled.div`
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  width: 100%;

  @media (max-width: 768px) {
    transform: scale(0.85); 
    margin: -1rem 0 -2rem; 
  }
`;

const ExtractedBallContainer = styled(motion.div)`
  position: absolute;
  top: 320px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  pointer-events: none;

  @media (max-width: 768px) {
    top: 240px; 
  }
`;

const BallGrid = styled.div`
  display: flex;
  gap: 0.8rem;
  justify-content: center;
  flex-wrap: wrap;
  margin: 0.5rem 0;
  min-height: 50px; 

  @media (max-width: 768px) {
    gap: 0.4rem;
    margin: 0.2rem 0 0.5rem;
  }
`;

const ActionButton = styled(motion.button)`
  background: var(--primary-btn);
  border: none;
  color: var(--primary-btn-text);
  padding: 0.8rem 2.5rem;
  border-radius: 100px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0.7rem 1.5rem;
    font-size: 0.9rem;
    min-width: 160px;
    justify-content: center;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    margin-top: 1rem;
    gap: 0.75rem;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

const ResetButton = styled.button`
  background: var(--btn-bg);
  border: 1px solid var(--btn-border);
  color: var(--btn-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
  white-space: nowrap;
  justify-content: center;

  svg {
    flex-shrink: 0;
  }
  
  &:hover {
    color: var(--text-main);
    background: var(--btn-hover-bg);
    border-color: var(--btn-hover-border);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 0.65rem 0.5rem;
    font-size: 0.85rem;
    width: 100%;
  }
`;

const HistoryButton = styled.button`
  background: var(--btn-bg);
  border: 1px solid var(--btn-border);
  color: var(--btn-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
  white-space: nowrap;
  justify-content: center;

  svg {
    flex-shrink: 0;
  }
  
  &:hover {
    color: var(--text-main);
    background: var(--btn-hover-bg);
    border-color: var(--btn-hover-border);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 0.65rem 0.5rem;
    font-size: 0.85rem;
    width: 100%;
  }
`;




export const Main = () => {
  const navigate = useNavigate()
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedNumbers, setExtractedNumbers] = useState<number[]>([]);
  const [currentExtraction, setCurrentExtraction] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const captureRef = useRef<HTMLDivElement>(null);

  const handleShare = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    try {
      if (navigator.share) {
        await navigator.share({
          title: '내 행운의 로또 번호',
          text: `AI가 추천해준 행운의 로또 번호는 ${extractedNumbers.join(', ')} 입니다! 당신도 추천받아보세요 :)`,
          url: 'https://verolabo.com',
        });
      } else {
        alert('공유하기 기능을 지원하지 않는 브라우저입니다. URL을 복사해주세요.');
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  const handleSaveImage = async () => {
    if (!captureRef.current) return;
    try {
      const canvas = await html2canvas(captureRef.current, { backgroundColor: null, scale: 2 });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `lotto-ai-numbers-${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to save image:', err);
      alert('이미지 저장에 실패했습니다.');
    }
  };

  const generateNumbers = useCallback(async () => {
    setIsAnalyzing(true);
    setExtractedNumbers([]);
    setCurrentExtraction(null);

    if (intervalRef.current) clearInterval(intervalRef.current);

    const startTime = Date.now();

    let finalNumbers: number[];
    try {
      const result = await predictNumbers();
      finalNumbers = result.numbers;
    } catch (error) {
      console.warn('ML inference failed, falling back to random:', error);
      finalNumbers = [];
      while (finalNumbers.length < 6) {
        const rand = Math.floor(Math.random() * 45) + 1;
        if (!finalNumbers.includes(rand)) {
          finalNumbers.push(rand);
        }
      }
      finalNumbers.sort((a, b) => a - b);
    }

    // Ensure minimum 2-second display of AIStatus animation
    const elapsed = Date.now() - startTime;
    const minDelay = 2000;
    if (elapsed < minDelay) {
      await new Promise((resolve) => setTimeout(resolve, minDelay - elapsed));
    }

    // Extract one by one
    let count = 0;
    intervalRef.current = setInterval(() => {
      if (count < 6) {
        const num = finalNumbers[count];
        setCurrentExtraction(num);

        setTimeout(() => {
          setExtractedNumbers((prev) => [...prev, num]);
          setCurrentExtraction(null);
        }, 600);

        count++;
      } else {
        clearInterval(intervalRef.current);
        setIsAnalyzing(false);

        const sortedNumbers = [...finalNumbers].sort((a, b) => a - b);
        setExtractedNumbers(sortedNumbers);

        const historyItem = {
          id: Date.now().toString(),
          date: new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          numbers: sortedNumbers,
        };

        const existingHistory = localStorage.getItem('lottoHistory');
        const history = existingHistory ? JSON.parse(existingHistory) : [];
        localStorage.setItem(
          'lottoHistory',
          JSON.stringify([historyItem, ...history])
        );
      }
    }, 1200);
  }, []);

  return (
    <ContentCard
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Title>AI 행운번호</Title>
      <Subtitle>
        인공지능이 과거 당첨 패턴을 정밀 분석하여<br/>당신에게 찾아올 행운의 번호를 예측합니다.
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
              <div ref={captureRef} style={{ padding: '20px 10px', borderRadius: '16px' }}>
                <BallGrid>
                  {extractedNumbers.map((num, idx) => (
                    <LottoBall key={`${num}-${idx}`} number={num} delay={0} />
                  ))}
                </BallGrid>
              </div>
              
              {!isAnalyzing && (
                <>
                  {extractedNumbers.length === 0 ? (
                    <ActionButton
                      whileHover={{ scale: 1.05, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={generateNumbers}
                    >
                      <Sparkles size={20} />
                      AI 번호 생성하기
                    </ActionButton>
                  ) : (
                    <ButtonContainer>
                      <ResetButton type="button" onClick={handleSaveImage}>
                        <Download size={16} />
                        이미지 저장
                      </ResetButton>
                      <ResetButton type="button" onClick={handleShare}>
                        <Share2 size={16} />
                        공유하기
                      </ResetButton>
                      <ResetButton type="button" onClick={generateNumbers}>
                        <RefreshCcw size={16} />
                        다시 생성
                      </ResetButton>
                      <HistoryButton type="button" onClick={() => navigate('/history')}>
                        <History size={16} />
                        추첨기록
                      </HistoryButton>
                    </ButtonContainer>
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
