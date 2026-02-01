import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const MachineContainer = styled.div`
  width: 320px;
  height: 320px;
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Drum = styled(motion.div)`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    inset 0 0 50px rgba(255, 255, 255, 0.1),
    0 30px 60px rgba(0, 0, 0, 0.5),
    inset 0 0 10px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    top: 15%;
    left: 15%;
    width: 30%;
    height: 15%;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    filter: blur(5px);
    transform: rotate(-30deg);
  }
`;

const MiniBall = styled(motion.div)<{ color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.color};
  position: absolute;
  box-shadow: 
    inset -4px -4px 8px rgba(0, 0, 0, 0.3),
    inset 4px 4px 8px rgba(255, 255, 255, 0.2);
`;

const MachineBase = styled.div`
  position: absolute;
  bottom: -40px;
  width: 200px;
  height: 60px;
  background: linear-gradient(to bottom, #2a2a2a, #0a0a0a);
  border-radius: 12px;
  z-index: 1;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  &::after {
    content: '';
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 10px;
    background: #1a1a1a;
    border-radius: 5px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);
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
  const [balls, setBalls] = useState<{ id: number; color: string; initialX: number; initialY: number }[]>([]);

  useEffect(() => {
    const newBalls = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      initialX: (Math.random() - 0.5) * 200,
      initialY: (Math.random() - 0.5) * 200,
    }));
    setBalls(newBalls);
  }, []);

  return (
    <MachineContainer>
      <Drum
        animate={isSpinning ? {
          rotate: [0, 360],
        } : {}}
        transition={{
          rotate: { duration: 3, repeat: Infinity, ease: "linear" },
        }}
      >
        {balls.map((ball) => (
          <MiniBall
            key={ball.id}
            color={ball.color}
            animate={isSpinning ? {
              x: [
                ball.initialX,
                (Math.random() - 0.5) * 240,
                (Math.random() - 0.5) * 240,
                ball.initialX
              ],
              y: [
                ball.initialY,
                (Math.random() - 0.5) * 240,
                (Math.random() - 0.5) * 240,
                ball.initialY
              ],
              rotate: [0, 360],
              scale: [1, 1.1, 0.9, 1]
            } : {
              x: ball.initialX,
              y: 120, // Settle at bottom
              rotate: 0,
              scale: 1
            }}
            transition={{
              x: {
                duration: isSpinning ? 0.3 + Math.random() * 0.4 : 1,
                repeat: isSpinning ? Infinity : 0,
                ease: "linear"
              },
              y: {
                duration: isSpinning ? 0.3 + Math.random() * 0.4 : 1.5,
                repeat: isSpinning ? Infinity : 0,
                type: isSpinning ? "tween" : "spring",
                bounce: 0.4
              },
              rotate: {
                duration: 0.5,
                repeat: isSpinning ? Infinity : 0,
                ease: "linear"
              },
              scale: {
                duration: 0.8,
                repeat: isSpinning ? Infinity : 0
              }
            }}
          />
        ))}
      </Drum>
      <MachineBase />
    </MachineContainer>
  );
};
