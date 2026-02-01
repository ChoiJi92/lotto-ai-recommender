import styled from '@emotion/styled';
import { Header } from './components/Header';
import { Routes, Route } from 'react-router-dom';
import { Main } from './pages/Main';
import { History } from './pages/History';

const MainContainer = styled.main`
  min-height: 100vh;
  padding: 6rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 4.5rem 1rem 1rem;
    justify-content: flex-start; 
  }
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

  @media (max-width: 768px) {
    width: 300px;
    height: 300px;
  }
`;

function App() {
  return (
    <MainContainer>
      <Header />
      <BackgroundGlow />
      
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </MainContainer>
  );
}

export default App;
