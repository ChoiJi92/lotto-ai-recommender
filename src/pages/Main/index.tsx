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
import { AIReportCard } from '../../components/AIReportCard';
import type { AIReportData } from '../../components/AIReportCard';
import type { RecommendStrategy } from '../../ml/inference';
import { Target, Zap, ShieldCheck, PartyPopper, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';


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
    padding: 1.5rem 1rem;
    border-radius: 20px;
    width: 100%;
  }
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 0.2rem;
  letter-spacing: -2px;
  color: var(--text-main);
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
    transform: scale(0.8);
    transform-origin: top center;
    margin-top: -0.5rem;
    margin-bottom: -4rem; /* Compensate for the scale to close the gap */
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

const CaptureArea = styled.div`
  width: 100%;
  padding: 1.5rem;
  background: var(--bg-bottom);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 1rem 0.4rem; /* Minimal side padding */
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
const InputSection = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 1.5rem auto 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: left;
  animation: fadeIn 0.5s ease-out;

  @media (max-width: 768px) {
    margin: 1rem auto 1.5rem;
    gap: 1.2rem;
  }
`;

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding-left: 0.2rem;

  span {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-weight: 400;
  }
`;

const StrategyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
`;

const StrategyButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'var(--primary-btn)' : 'var(--btn-bg)'};
  color: ${props => props.active ? 'var(--primary-btn-text)' : 'var(--btn-text)'};
  border: 1px solid ${props => props.active ? 'transparent' : 'var(--btn-border)'};
  padding: 1rem 0.5rem;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  box-shadow: ${props => props.active ? '0 8px 16px rgba(49, 130, 246, 0.3)' : 'none'};
  
  &:hover {
    transform: translateY(-2px);
    background: ${props => props.active ? 'var(--primary-btn)' : 'var(--btn-hover-bg)'};
    border-color: ${props => props.active ? 'transparent' : 'var(--btn-hover-border)'};
  }

  svg {
    opacity: ${props => props.active ? 1 : 0.6};
  }

  small {
    font-size: 0.65rem;
    opacity: 0.8;
    font-weight: 400;
  }
`;

const DreamInput = styled.textarea`
  background: var(--btn-bg);
  border: 1px solid var(--btn-border);
  color: var(--text-main);
  border-radius: 20px;
  padding: 1.2rem;
  font-size: 0.95rem;
  resize: none;
  height: 100px;
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  font-family: inherit;
  line-height: 1.5;
  
  &:focus {
    border-color: #4facfe;
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 0 0 4px rgba(79, 172, 254, 0.1);
  }
  
  &::placeholder {
    color: var(--text-muted);
    font-size: 0.85rem;
  }
`;




const GuideSection = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: 5rem;
  padding: 3rem;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 32px;
  text-align: left;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-top: 3rem;
    border-radius: 24px;
  }
`;

const GuideTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 0.6rem;

  &::before {
    content: '';
    width: 4px;
    height: 24px;
    background: var(--accent-gradient);
    border-radius: 2px;
  }
`;

const GuideGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const GuideItem = styled.div`
  h4 {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0.8rem;
    color: var(--text-main);
  }
  p {
    font-size: 0.9rem;
    color: var(--text-muted);
    line-height: 1.6;
    word-break: keep-all;
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  padding: 20px;
`;

const WinnerContent = styled(motion.div)`
  background: var(--card-bg);
  padding: 2.5rem 1.5rem;
  border-radius: 32px;
  border: 1px solid rgba(79, 172, 254, 0.5);
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: var(--text-muted);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-main);
  }
`;

import { fetchWinningNumbers, getLatestDrawNo } from '../../utils/lottoApi';

export const Main = () => {
  const navigate = useNavigate()
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedNumbers, setExtractedNumbers] = useState<number[]>(() => {
    const saved = sessionStorage.getItem('lastNumbers');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentExtraction, setCurrentExtraction] = useState<number | null>(null);
  const [strategy, setStrategy] = useState<RecommendStrategy>('balanced');
  const [dreamText, setDreamText] = useState('');
  const [predictionData, setPredictionData] = useState<AIReportData | null>(() => {
    const saved = sessionStorage.getItem('lastPrediction');
    return saved ? JSON.parse(saved) : null;
  });
  const [winnerResult, setWinnerResult] = useState<{ drawNo: number; matchCount: number; numbers: number[] } | null>(null);

  // Persistence: Save results to sessionStorage
  useEffect(() => {
    if (extractedNumbers.length === 6) {
      sessionStorage.setItem('lastNumbers', JSON.stringify(extractedNumbers));
    } else if (extractedNumbers.length === 0) {
      sessionStorage.removeItem('lastNumbers');
    }
  }, [extractedNumbers]);

  useEffect(() => {
    if (predictionData) {
      sessionStorage.setItem('lastPrediction', JSON.stringify(predictionData));
    } else {
      sessionStorage.removeItem('lastPrediction');
    }
  }, [predictionData]);

  // AI Weekly Feedback: 페이지 접속 시 최근 당첨 결과 대조
  useEffect(() => {
    const checkResults = async () => {
      const historyStr = localStorage.getItem('lottoHistory');
      if (!historyStr) return;

      const history = JSON.parse(historyStr);
      const latestDrawNo = getLatestDrawNo();
      const lastChecked = localStorage.getItem('lastCheckedDraw');

      // 이미 확인한 회차라면 패스
      if (lastChecked === latestDrawNo.toString()) return;

      // 실제 최신 당첨 번호 가져오기
      const realResult = await fetchWinningNumbers(latestDrawNo);
      if (!realResult) {
        // 아직 이번 주 결과가 안 나왔을 수 있으므로 이전 회차 확인 시도
        const prevResult = await fetchWinningNumbers(latestDrawNo - 1);
        if (!prevResult || lastChecked === prevResult.drawNo.toString()) return;
        checkMatch(prevResult, history);
      } else {
        checkMatch(realResult, history);
      }
    };

    const checkMatch = (result: { drawNo: number; numbers: number[] }, history: any[]) => {
      // 히스토리 중 해당 회차 번호가 있는지 확인 (drawNo가 저장되어 있어야 함)
      for (const item of history) {
        // AI가 예측한 회차와 당첨 회차가 일치하는지 확인
        if (item.predictionData?.drawNo === result.drawNo) {
          const matches = item.numbers.filter((n: number) => result.numbers.includes(n));
          if (matches.length >= 3) {
            setWinnerResult({
              drawNo: result.drawNo,
              matchCount: matches.length,
              numbers: item.numbers
            });

            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#4facfe', '#00f2fe', '#ffd700']
            });
            break;
          }
        }
      }
      localStorage.setItem('lastCheckedDraw', result.drawNo.toString());
    };

    const timer = setTimeout(checkResults, 2000);
    return () => clearTimeout(timer);
  }, []);

  const predictionDataRef = useRef<AIReportData | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const captureAreaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    setExtractedNumbers([]);
    setPredictionData(null);
    setDreamText('');
    sessionStorage.removeItem('lastNumbers');
    sessionStorage.removeItem('lastPrediction');
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

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

  const handleSaveImage = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!captureAreaRef.current) return;
    
    // Add a loading state if needed
    try {
      // Small delay to ensure all animations are settled
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(captureAreaRef.current, { 
        backgroundColor: getComputedStyle(document.body).backgroundColor || '#0a0a0a',
        scale: 2,
        useCORS: true,
        allowTaint: false, // Set to false for security/CORS
        logging: false,
      });

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Failed to create blob');

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `lotto-ai-report-${new Date().getTime()}.png`;
      
      // For mobile Safari and some others, link.click() might need to be in the DOM
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
    } catch (err) {
      console.error('Failed to save image:', err);
      alert('이미지 저장에 실패했습니다. 공유하기 기능을 이용해 주세요.');
    }
  };

  const generateNumbers = useCallback(async () => {
    setIsAnalyzing(true);
    setPredictionData(null);
    setExtractedNumbers([]);
    setCurrentExtraction(null);

    if (intervalRef.current) clearInterval(intervalRef.current);

    const startTime = Date.now();
    let finalNumbers: number[] = [];
    try {
      const result = await predictNumbers(strategy, dreamText);
      finalNumbers = result.numbers;
      predictionDataRef.current = { ...result, strategy, dreamText };
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
      
      // Attempt to load hot/cold metadata even on ML failure for the report
      try {
        const response = await fetch('/models/next_draw_features.json');
        const features = await response.json();
        const hotNumbers: number[] = [];
        const coldNumbers: number[] = [];
        features.features.forEach((row: number[], idx: number) => {
          if (row[5] === 1) hotNumbers.push(idx + 1);
          if (row[6] === 1) coldNumbers.push(idx + 1);
        });
        predictionDataRef.current = { numbers: finalNumbers, hotNumbers, coldNumbers, strategy, dreamText };
      } catch (e) {
        predictionDataRef.current = { numbers: finalNumbers, strategy, dreamText };
      }
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
        
        if (predictionDataRef.current) {
          predictionDataRef.current.numbers = sortedNumbers;
        }
        setPredictionData(predictionDataRef.current);

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
          predictionData: predictionDataRef.current
        };

        const existingHistory = localStorage.getItem('lottoHistory');
        const history = existingHistory ? JSON.parse(existingHistory) : [];
        localStorage.setItem(
          'lottoHistory',
          JSON.stringify([historyItem, ...history])
        );
      }
    }, 1200);
  }, [strategy, dreamText]);

  return (
    <ContentCard
      ref={scrollRef}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <CaptureArea ref={captureAreaRef}>
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
                <div style={{ padding: '20px 10px', borderRadius: '16px' }}>
                  <BallGrid>
                    {extractedNumbers.map((num, idx) => (
                      <LottoBall key={`${num}-${idx}`} number={num} delay={0} />
                    ))}
                  </BallGrid>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </VisualContainer>

        <AnimatePresence>
          {!isAnalyzing && extractedNumbers.length > 0 && predictionData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ width: '100%', padding: '0 5px' }}
            >
              <AIReportCard data={predictionData} isLarge={true} />
            </motion.div>
          )}
        </AnimatePresence>
      </CaptureArea>


      {!isAnalyzing && extractedNumbers.length > 0 && (
        <ButtonContainer>
          <ResetButton type="button" onClick={handleSaveImage}>
            <Download size={16} />
            이미지 저장
          </ResetButton>
          <ResetButton type="button" onClick={handleShare}>
            <Share2 size={16} />
            공유하기
          </ResetButton>
          <ResetButton type="button" onClick={handleReset}>
            <RefreshCcw size={16} />
            다시 생성
          </ResetButton>
          <HistoryButton type="button" onClick={() => navigate('/history')}>
            <History size={16} />
            추첨기록
          </HistoryButton>
        </ButtonContainer>
      )}

      {!isAnalyzing && extractedNumbers.length === 0 && (
        <div style={{ marginTop: '0', width: '100%' }}>
          <InputSection>
            <FormItem>
              <Label>
                <Target size={16} color="#4facfe" /> 추천 전략 선택
              </Label>
              <StrategyGrid>
                <StrategyButton 
                  type="button" 
                  active={strategy === 'stable'} 
                  onClick={() => setStrategy('stable')}
                >
                  <ShieldCheck size={20} />
                  안정형
                  <small>확률 기반</small>
                </StrategyButton>
                <StrategyButton 
                  type="button" 
                  active={strategy === 'balanced'} 
                  onClick={() => setStrategy('balanced')}
                >
                  <Target size={20} />
                  밸런스
                  <small>전천후 추천</small>
                </StrategyButton>
                <StrategyButton 
                  type="button" 
                  active={strategy === 'challenge'} 
                  onClick={() => setStrategy('challenge')}
                >
                  <Zap size={20} />
                  도전형
                  <small>독특한 조합</small>
                </StrategyButton>
              </StrategyGrid>
            </FormItem>

            <FormItem>
              <Label>
                <Sparkles size={16} color="#4facfe" /> 꿈 분석기 <span>(선택 사항)</span>
              </Label>
              <DreamInput 
                placeholder="어제 꾼 꿈 내용을 입력해 보세요. AI가 행운의 키워드를 분석하여 번호 생성에 반영합니다. (예: 돼지 꿈을 꿨어요, 조상을 만났어요)"
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
              />
            </FormItem>
          </InputSection>

          <ActionButton
            whileHover={{ scale: 1.05, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            onClick={generateNumbers}
          >
            <Sparkles size={20} />
            AI 분석 및 번호 생성
          </ActionButton>
        </div>
      )}

      <AnimatePresence>
        {winnerResult && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WinnerContent
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
            >
              <CloseButton onClick={() => setWinnerResult(null)}>
                <X size={20} />
              </CloseButton>
              <PartyPopper size={48} color="#ffd700" style={{ marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                축하합니다! 🏆
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                AI가 추천해드린 {winnerResult.drawNo}회차 번호가<br/>
                <strong>{winnerResult.matchCount}개 일치</strong>하여 당첨되었습니다!
              </p>
              
              <div style={{ 
                background: 'rgba(79, 172, 254, 0.1)', 
                padding: '1.2rem', 
                borderRadius: '20px',
                marginBottom: '1.5rem'
              }}>
                <BallGrid>
                  {winnerResult.numbers.map((n, i) => (
                    <LottoBall key={i} number={n} size="small" />
                  ))}
                </BallGrid>
              </div>

              <ActionButton onClick={() => setWinnerResult(null)}>
                확인했습니다
              </ActionButton>
            </WinnerContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
      <GuideSection>
        <GuideTitle>AI 행운번호 예측 가이드</GuideTitle>
        <GuideGrid>
          <GuideItem>
            <h4>🤖 앙상블 인공지능 모델</h4>
            <p>
              본 시스템은 Random Forest와 XGBoost 알고리즘을 결합한 앙상블 학습 모델을 사용합니다. 
              과거 20년간의 당첨 데이터를 학습하여 단순 랜덤보다 정교한 확률 분포를 계산합니다.
            </p>
          </GuideItem>
          <GuideItem>
            <h4>⚖️ 3가지 맞춤형 전략</h4>
            <p>
              유저의 성향에 따라 안정형, 밸런스, 도전형 전략을 선택할 수 있습니다. 
              각 전략은 분석 모델의 가중치를 다르게 적용하여 최적의 조합을 찾아냅니다.
            </p>
          </GuideItem>
          <GuideItem>
            <h4>💭 꿈 분석 엔진</h4>
            <p>
              자연어 처리 기반의 꿈 키워드 분석 기능을 통해 유저의 무의식적 영감을 수치화합니다. 
              꿈속의 상징들을 행운의 숫자로 변환하여 분석 결과에 즉시 반영합니다.
            </p>
          </GuideItem>
          <GuideItem>
            <h4>📊 실시간 통계 반영</h4>
            <p>
              매주 업데이트되는 최신 회차 데이터를 바탕으로 Hot(빈출), Cold(미출현) 번호를 
              실시간 분석하여 가장 시의적절한 추천 번호를 제공합니다.
            </p>
          </GuideItem>
        </GuideGrid>
      </GuideSection>
    </ContentCard>
  );
};
