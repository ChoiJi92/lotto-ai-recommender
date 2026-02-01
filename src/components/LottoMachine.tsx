import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const MachineContainer = styled.div`
  width: 400px;
  height: 450px;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 20px;

  @media (max-width: 768px) {
    width: 300px;
    height: 350px;
    transform: scale(0.6); 
    transform-origin: top center;
    margin-bottom: -130px; 
  }
`;

const DrumWrapper = styled.div`
  position: relative;
  width: 320px;
  height: 320px;
  z-index: 2;
`;

const DrumFrame = styled.div`
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 8px solid rgba(200, 200, 200, 0.4);
  border-radius: 50%;
  pointer-events: none;
  z-index: 3;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -20px;
    width: 20px;
    height: 100px;
    background: linear-gradient(to right, #666, #999);
    transform: translateY(-50%);
    border-radius: 5px;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -20px;
    width: 20px;
    height: 100px;
    background: linear-gradient(to left, #666, #999);
    transform: translateY(-50%);
    border-radius: 5px;
  }
`;

const Drum = styled(motion.div)`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    inset 0 0 80px rgba(255, 255, 255, 0.1),
    0 20px 40px rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    content: '';
    position: absolute;
    top: 10%;
    left: 10%;
    width: 30%;
    height: 20%;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    filter: blur(10px);
    transform: rotate(-30deg);
  }
`;

const ExitHole = styled.div`
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 30px;
  background: #000;
  border-radius: 50% / 0 0 100% 100%;
  z-index: 4;
  border: 3px solid #444;
`;

const Chute = styled.div`
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 100px;
  background: linear-gradient(to bottom, rgba(200, 200, 200, 0.2), rgba(255, 255, 255, 0.05));
  border-left: 2px solid rgba(255, 255, 255, 0.2);
  border-right: 2px solid rgba(255, 255, 255, 0.2);
  z-index: 1;
  clip-path: polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%);
`;

const MiniBall = styled(motion.div)<{ color: string }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${props => props.color};
  position: absolute;
  box-shadow: 
    inset -3px -3px 6px rgba(0, 0, 0, 0.4),
    inset 3px 3px 6px rgba(255, 255, 255, 0.3);
  z-index: 2;
  font-size: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-weight: bold;
`;

const SupportStand = styled.div`
  position: absolute;
  bottom: 0;
  width: 240px;
  height: 120px;
  background: linear-gradient(135deg, #1a1a1a, #333);
  border-radius: 10px 10px 0 0;
  z-index: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  
  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 15px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 5px;
  }
`;

interface LottoMachineProps {
  isSpinning: boolean;
}

const COLORS = [
  'radial-gradient(circle at 30% 30%, #ffd700, #ff8c00)', // Yellow
  'radial-gradient(circle at 30% 30%, #00bfff, #1e90ff)', // Blue
  'radial-gradient(circle at 30% 30%, #ff4500, #dc143c)', // Red
  'radial-gradient(circle at 30% 30%, #a9a9a9, #696969)', // Grey
  'radial-gradient(circle at 30% 30%, #32cd32, #228b22)', // Green
];

export const LottoMachine = ({ isSpinning }: LottoMachineProps) => {
  const [balls, setBalls] = useState<{ id: number; color: string; initialX: number; initialY: number; number: number }[]>([]);

  useEffect(() => {
    const newBalls = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      number: i + 1,
      color: COLORS[i % COLORS.length],
      initialX: (Math.random() - 0.5) * 220,
      initialY: (Math.random() - 0.5) * 220,
    }));
    setBalls(newBalls);
  }, []);

  return (
    <MachineContainer>
      <DrumWrapper>
        <DrumFrame />
        <Drum
          animate={isSpinning ? {
            rotate: [0, 360],
          } : {}}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          }}
        >
          {balls.map((ball) => (
            <MiniBall
              key={ball.id}
              color={ball.color}
              animate={isSpinning ? {
                x: [
                  ball.initialX,
                  (Math.random() - 0.5) * 280,
                  (Math.random() - 0.5) * 280,
                  ball.initialX
                ],
                y: [
                  ball.initialY,
                  (Math.random() - 0.5) * 280,
                  (Math.random() - 0.5) * 280,
                  ball.initialY
                ],
                rotate: [0, 720],
              } : {
                x: ball.initialX * 0.8,
                y: 130 + (Math.random() * 10), // Settle at bottom
                rotate: 0,
              }}
              transition={{
                x: {
                  duration: isSpinning ? 0.2 + Math.random() * 0.3 : 1,
                  repeat: isSpinning ? Infinity : 0,
                  ease: "linear"
                },
                y: {
                  duration: isSpinning ? 0.2 + Math.random() * 0.3 : 1.5,
                  repeat: isSpinning ? Infinity : 0,
                  type: isSpinning ? "tween" : "spring",
                  bounce: 0.4
                },
                rotate: {
                  duration: 0.5,
                  repeat: isSpinning ? Infinity : 0,
                  ease: "linear"
                }
              }}
            >
              {ball.number}
            </MiniBall>
          ))}
        </Drum>
        <ExitHole />
      </DrumWrapper>
      <Chute />
      <SupportStand />
    </MachineContainer>
  );
};
