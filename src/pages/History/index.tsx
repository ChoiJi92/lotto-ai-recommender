import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, History as HistoryIcon, ArrowLeft, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LottoBall } from '../../components/LottoBall';

const HistoryContainer = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;

  @media (max-width: 768px) {
    padding: 1rem 1rem 6rem;
  }
`;

const BackButton = styled.button`
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
  margin-bottom: 1.5rem;
  
  &:hover {
    color: var(--text-main);
    background: var(--btn-hover-bg);
    border-color: var(--btn-hover-border);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 0.65rem 1.25rem;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  color: var(--text-main);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const Title = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ClearButton = styled.button`
  background: rgba(255, 59, 48, 0.1);
  color: #ff3b30;
  border: 1px solid rgba(255, 59, 48, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 59, 48, 0.2);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 0.75rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: var(--card-bg);
  border-radius: 24px;
  border: 1px dashed var(--card-border);
  color: var(--text-muted);
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
    font-size: 1rem;
  }
`;

const HistoryCard = styled(motion.div)`
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--card-border);
  border-radius: 24px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative; /* For absolute positioning of delete button on mobile */
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.2rem;
    padding: 1.5rem 1.2rem;
    padding-right: 4rem; /* Make room for absolute buttons */
  }
`;

const DateText = styled.div`
  color: var(--text-muted);
  font-size: 0.9rem;
  font-family: monospace;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    width: 100%;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const BallsRow = styled.div`
  display: flex;
  gap: 0.8rem;
  justify-content: center;
  flex-wrap: wrap; /* Allow wrapping on very small screens */

  @media (max-width: 768px) {
    gap: 0.5rem;
    width: 100%;
    justify-content: flex-start; /* Left align on mobile */
    
    /* Scale down balls slightly via transform or just container size */
    & > div { 
      transform: scale(0.9);
      margin: -2px; 
    }
  }
`;

const DeleteItemButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #ff3b30;
    background: var(--btn-hover-bg);
  }

  @media (max-width: 768px) {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 59, 48, 0.1);
    color: #ff3b30;
    padding: 0.4rem;
  }
`;

const ShareItemButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #3182f6;
    background: var(--btn-hover-bg);
  }

  @media (max-width: 768px) {
    position: absolute;
    top: 1rem;
    right: 3.5rem;
    background: var(--btn-bg);
    color: var(--text-main);
    padding: 0.4rem;
    border: 1px solid var(--btn-border);
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    display: contents; /* Actions are position:absolute on mobile */
  }
`;

interface HistoryItem {
  id: string;
  date: string;
  numbers: number[];
}

export const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // Load history from local storage
    const saved = localStorage.getItem('lottoHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const deleteItem = (id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem('lottoHistory', JSON.stringify(newHistory));
  };

  const clearAll = () => {
    if (window.confirm('모든 기록을 삭제하시겠습니까?')) {
      setHistory([]);
      localStorage.removeItem('lottoHistory');
    }
  };

  const shareItem = async (item: HistoryItem) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: '내 행운의 로또 번호',
          text: `AI가 추천해준 행운의 로또 번호는 ${item.numbers.join(', ')} 입니다! 당신도 추천받아보세요 :)`,
          url: window.location.href.replace('/history', ''),
        });
      } else {
        alert('공유하기 기능을 지원하지 않는 브라우저입니다. URL을 복사해주세요.');
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  return (
    <HistoryContainer>
      <BackButton onClick={() => navigate('/')}>
        <ArrowLeft size={16} />
        AI 추첨
      </BackButton>
      <Header>
        <Title>
          <HistoryIcon size={28} color="#3182f6" />
          과거 추천 기록
        </Title>
        {history.length > 0 && (
          <ClearButton onClick={clearAll}>
            <Trash2 size={16} />
            전체 삭제
          </ClearButton>
        )}
      </Header>

      {history.length === 0 ? (
        <EmptyState>
          <HistoryIcon size={48} style={{ opacity: 0.3 }} />
          <p>아직 저장된 추첨 기록이 없습니다.</p>
        </EmptyState>
      ) : (
        <AnimatePresence>
          {history.map((item) => (
            <HistoryCard
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              layout
            >
              <DateText>{item.date}</DateText>
              <BallsRow>
                {item.numbers.map((num, idx) => (
                  <LottoBall 
                    key={`${item.id}-${idx}`} 
                    number={num} 
                    delay={idx * 0.05} 
                    // Pass a scale prop if needed, or handle size via styled components for smaller balls
                  />
                ))}
              </BallsRow>
              <CardActions>
                <ShareItemButton onClick={() => shareItem(item)}>
                  <Share2 size={18} />
                </ShareItemButton>
                <DeleteItemButton onClick={() => deleteItem(item.id)}>
                  <Trash2 size={18} />
                </DeleteItemButton>
              </CardActions>
            </HistoryCard>
          ))}
        </AnimatePresence>
      )}
    </HistoryContainer>
  );
};
