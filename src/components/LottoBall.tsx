import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const BallContainer = styled(motion.div)<{ colorIndex: number; size?: 'small' | 'normal' }>`
  width: ${props => props.size === 'small' ? '30px' : '60px'};
  height: ${props => props.size === 'small' ? '30px' : '60px'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.size === 'small' ? '0.8rem' : '1.5rem'};
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  background: ${props => {
    const colors = [
      'radial-gradient(circle at 30% 30%, #ffd700, #ff8c00)', // Yellow
      'radial-gradient(circle at 30% 30%, #00bfff, #1e90ff)', // Blue
      'radial-gradient(circle at 30% 30%, #ff4500, #dc143c)', // Red
      'radial-gradient(circle at 30% 30%, #a9a9a9, #696969)', // Grey
      'radial-gradient(circle at 30% 30%, #32cd32, #228b22)', // Green
    ];
    return colors[props.colorIndex % colors.length];
  }};
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2), inset -5px -5px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 5px;
    left: 10px;
    width: 20px;
    height: 10px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: rotate(-30deg);
  }
`;

interface LottoBallProps {
  number: number;
  delay?: number;
  size?: 'small' | 'normal';
}

export const LottoBall = ({ number, delay = 0, size = 'normal' }: LottoBallProps) => {
  const getColorIndex = (num: number) => {
    if (num <= 10) return 0;
    if (num <= 20) return 1;
    if (num <= 30) return 2;
    if (num <= 40) return 3;
    return 4;
  };

  return (
    <BallContainer
      size={size}
      colorIndex={getColorIndex(number)}
      initial={{ scale: 0, y: 50, opacity: 0, rotate: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 260, 
        damping: 20,
        delay 
      }}
      whileHover={{ scale: 1.05 }}
    >
      {number}
    </BallContainer>
  );
};
