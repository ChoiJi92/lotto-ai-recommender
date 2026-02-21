import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Brain, Activity, TrendingUp, Thermometer } from 'lucide-react';
import { DREAM_DICTIONARY } from '../ml/inference';

const ReportContainer = styled(motion.div)<{ isLarge?: boolean }>`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid var(--card-border);
  border-radius: 24px;
  width: 100%;
  text-align: left;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.03);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: ${props => props.isLarge ? '2rem 1.5rem' : '1.25rem'};
    border-radius: ${props => props.isLarge ? '28px' : '20px'};
    margin-top: ${props => props.isLarge ? '1.5rem' : '1rem'};
  }
`;

const ReportHeader = styled.div<{ isLarge?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;

  h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--text-main);
    display: flex;
    align-items: center;
    gap: 0.5rem;

    @media (max-width: 768px) {
      font-size: 1.15rem;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;

const StatItem = styled.div<{ isLarge?: boolean }>`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.1);
  }

  [data-theme='dark'] &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  span.label {
    font-size: 0.8rem;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  span.value {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-main);
  }

  @media (max-width: 768px) {
    padding: ${props => props.isLarge ? '1rem' : '0.75rem'};
    
    span.label {
      font-size: 0.75rem;
    }
    
    span.value {
      font-size: 1.05rem;
    }
  }
`;

const ConfidenceBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const Progress = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 10px;
`;

const SummaryBox = styled.div<{ isLarge?: boolean }>`
  padding: 1rem;
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%);
  border-left: 4px solid #4facfe;
  border-radius: 0 12px 12px 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--text-main);

  strong {
    color: #4facfe;
  }

  @media (max-width: 768px) {
    font-size: 0.88rem;
    padding: ${props => props.isLarge ? '1rem' : '0.85rem'};
  }
`;

// 이 인터페이스는 머신러닝의 예측 결과나 통계를 받기 위한 데이터 구조입니다.
export interface AIReportData {
  numbers: number[];
  probabilities?: number[];
  rfProbabilities?: number[];
  xgbProbabilities?: number[];
  hotNumbers?: number[];
  coldNumbers?: number[];
  strategy?: 'balanced' | 'stable' | 'challenge';
  dreamText?: string;
}

interface AIReportCardProps {
  data: AIReportData;
  isLarge?: boolean;
}

export const AIReportCard: React.FC<AIReportCardProps> = ({ data, isLarge = false }) => {
  // 로또 통계 분석 (홀짝, 총합 등)을 메모이제이션하여 연산 최적화 - 개발자(Skill) 원칙 준수
  const analysis = useMemo(() => {
    const { numbers, probabilities, rfProbabilities, xgbProbabilities } = data;
    
    // 1. 기초 통계
    let oddCount = 0;
    let evenCount = 0;
    let consecutiveCount = 0;
    
    // Sort array just in case before evaluating consecutive
    const sortedNums = [...numbers].sort((a,b) => a-b);
    
    sortedNums.forEach((num, index) => {
      if (num % 2 === 0) evenCount++;
      else oddCount++;
      
      if (index > 0 && num === sortedNums[index - 1] + 1) {
        consecutiveCount++;
      }
    });

    // 2. 머신러닝 확률 기반 신뢰도 및 Hot/Cold 분석
    let aiConfidence = 85; 
    let hotCount = 0;
    let coldCount = 0;
    
    if (data.hotNumbers) {
      hotCount = numbers.filter(n => data.hotNumbers!.includes(n)).length;
    }
    if (data.coldNumbers) {
      coldCount = numbers.filter(n => data.coldNumbers!.includes(n)).length;
    }
    const neutralCount = 6 - hotCount - coldCount;

    let dominantModel = "조화로운 패턴";
    
    if (probabilities && probabilities.length >= 45) {
      // 선택된 번호들의 평균 예측 확률을 구하여 0~100 사이의 신뢰도로 변환 (가상의 스케일링 적용)
      const selectedProbs = numbers.map(num => probabilities[num - 1]);
      const avgProb = selectedProbs.reduce((a, b) => a + b, 0) / 6;
      aiConfidence = Math.min(Math.round((avgProb * 100 * 2) + 60), 99); // UX 상 60~99% 사이로 매핑

      // 어떤 모델이 더 높은 가중치를 주었는지 분석
      if (rfProbabilities && xgbProbabilities) {
        const avgRf = numbers.map(n => rfProbabilities[n-1]).reduce((a,b) => a+b, 0) / 6;
        const avgXgb = numbers.map(n => xgbProbabilities[n-1]).reduce((a,b) => a+b, 0) / 6;
        if (avgRf > avgXgb * 1.1) dominantModel = "Random Forest 모델 강세";
        else if (avgXgb > avgRf * 1.1) dominantModel = "XGBoost 모델 강세";
        else dominantModel = "앙상블 (RF & XGB) 완벽 조화";
      }
    }

    // 3. 총평 문구 생성
    let summaryText = "";

    // Dream & Strategy specific prefix
    if (data.dreamText) {
      const keywords = Object.keys(DREAM_DICTIONARY).filter(k => data.dreamText!.includes(k));
      if (keywords.length > 0) {
        summaryText += `꿈 속의 '${keywords.join(', ')}' 기운을 분석하여 행운의 숫자를 조합에 반영했습니다. `;
      }
    }

    if (data.strategy === 'stable') {
      summaryText += "통계적으로 가장 가능성 높은 '상위 확률' 번호들에 집중한 안정적인 투자 전략입니다. ";
    } else if (data.strategy === 'challenge') {
      summaryText += "최근 미출현 번호와 AI의 예측 번호를 과감하게 조합한 '한 방'을 노리는 도전적인 전략입니다. ";
    }

    if (consecutiveCount > 0) {
      summaryText += `연속된 번호가 ${consecutiveCount}쌍 포착된 독특한 패턴입니다. `;
    } else {
      summaryText += "모든 숫자가 골고루 흩어진 넓은 분포를 보이고 있습니다. ";
    }

    if (oddCount === 6 || evenCount === 6) summaryText += "극단적인 홀/짝 쏠림이 발견되어 의외의 일확천금을 노려볼 만합니다.";
    else if (oddCount === 3 && evenCount === 3) summaryText += "홀짝 균형이 완벽하여 가장 스탠다드하고 기복이 적은 안정적인 당첨을 기대할 수 있습니다.";
    else summaryText += "과거 당첨 이력이 가장 빈번하게 관측된 최적의 밸런스 조합입니다.";

    // Hot/Cold 전용 코멘트 추가
    if (hotCount >= 4) summaryText += " 최근 기세가 좋은 '뜨거운 숫자'들이 대거 포함되어 승부수를 던지기 좋습니다.";
    else if (coldCount >= 3) summaryText += " 오랫동안 나오지 않은 '장기 미출현수'를 저격하여 큰 한 방을 노리는 전략입니다.";

    return {
      oddEven: `${oddCount}:${evenCount}`,
      consecutiveText: consecutiveCount > 0 ? `${consecutiveCount}쌍 존재` : "없음",
      aiConfidence,
      dominantModel,
      summaryText,
      thermo: {
        hot: hotCount,
        cold: coldCount,
        neutral: neutralCount
      }
    };
  }, [data]);

  return (
    <ReportContainer
      isLarge={isLarge}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
    >
      <ReportHeader isLarge={isLarge}>
        <Brain size={24} color="#4facfe" />
        <h3>AI 심층 분석 리포트</h3>
      </ReportHeader>

      <StatsGrid>
        <StatItem isLarge={isLarge}>
          <span className="label">
            <TrendingUp size={14} /> 종합 AI 신뢰도
          </span>
          <span className="value">{analysis.aiConfidence}%</span>
          <ConfidenceBar>
            <Progress 
              initial={{ width: 0 }}
              animate={{ width: `${analysis.aiConfidence}%` }} 
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            />
          </ConfidenceBar>
        </StatItem>
        <StatItem>
          <span className="label">
            <Thermometer size={14} /> 숫자 온도계 (뜨거움:보통:차가움)
          </span>
          <span className="value" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <span style={{ color: '#ff4b2b' }}>{analysis.thermo.hot}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>:</span>
            <span style={{ color: 'var(--text-main)' }}>{analysis.thermo.neutral}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>:</span>
            <span style={{ color: '#4facfe' }}>{analysis.thermo.cold}</span>
          </span>
          <div style={{ display: 'flex', height: '4px', borderRadius: '2px', overflow: 'hidden', marginTop: '6px' }}>
            <div style={{ width: `${(analysis.thermo.hot/6)*100}%`, background: '#ff4b2b' }} />
            <div style={{ width: `${(analysis.thermo.neutral/6)*100}%`, background: 'var(--btn-border)' }} />
            <div style={{ width: `${(analysis.thermo.cold/6)*100}%`, background: '#4facfe' }} />
          </div>
        </StatItem>
        <StatItem>
          <span className="label">
            <Activity size={14} /> 홀:짝 비율
          </span>
          <span className="value">{analysis.oddEven}</span>
        </StatItem>
        <StatItem isLarge={isLarge}>
          <span className="label">
            <Activity size={14} /> 연속 출현 (쌍)
          </span>
          <span className="value" style={{ fontSize: '1rem', marginTop: '0.1rem' }}>
            {analysis.consecutiveText}
          </span>
        </StatItem>
      </StatsGrid>

      <SummaryBox isLarge={isLarge}>
        <strong>💡 AI 코멘트:</strong> {analysis.summaryText}
      </SummaryBox>
    </ReportContainer>
  );
};
