import React, { useState, useEffect } from 'react';

import { i18n } from 'i18next';
import {
  Theme,
  Paper,
  StyledEngineProvider,
  Button as MuiButton,
} from '@mui/material';
import Header, { HEADER_HEIGHT } from './components/Header';
import styled from '@emotion/styled';
import ThemeSwitchProvider from './ThemeSwitchProvider';
import { RecoilRoot } from 'recoil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCubesStacked } from '@fortawesome/free-solid-svg-icons';
import Game from './components/Game';

const Container = styled(Paper)`
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  max-height: 100%;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 1.5rem;
  max-height: calc(100% - ${HEADER_HEIGHT});
  overflow: auto;
  background-color: #000;
  position: relative;
`;

const Score = styled.div`
  color: white;
  font-family: 'Press Start 2P', cursive;
  font-size: 24px;
  text-shadow: 2px 2px 0 #ff0000, 4px 4px 0 #ff9900;
  background: black;
  padding: 10px;
  border: 2px solid #00ff00;
  border-radius: 5px;
  display: inline-block;
  margin-bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  position: relative;
  text-align: center;
`;

const Button = styled(MuiButton)`
  color: black;
  background-color: white;
  font-family: 'Press Start 2P', cursive;
  font-size: 24px;
  text-shadow: 2px 2px 0 #ff0000, 4px 4px 0 #ff9900;
  padding: 10px;
  border: 2px solid #00ff00;
  border-radius: 5px;
  display: inline-block;
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
`;

interface AppProps {
  theme: Theme;
  i18n: i18n;
  settings: any;
}

export function App(props: AppProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [personalBest, setPersonalBest] = useState(0);
  const [lastScore, setLastScore] = useState(0);

  const handleGameOver = (score: React.SetStateAction<number>) => {
    setGameOver(true);
    setFinalScore(score);
  };

  const startNewGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setFinalScore(0);
  };

  useEffect(() => {
    const storedPersonalBest = localStorage.getItem('personalBest');
    const storedLastScore = localStorage.getItem('lastScore');
    if (storedPersonalBest) setPersonalBest(Number(storedPersonalBest));
    if (storedLastScore) setLastScore(Number(storedLastScore));
  }, []);

  useEffect(() => {
    if (gameOver) {
      localStorage.setItem('lastScore', finalScore.toString());
      setLastScore(finalScore);
      if (finalScore > personalBest) {
        localStorage.setItem('personalBest', finalScore.toString());
        setPersonalBest(finalScore);
      }
    }
  }, [gameOver, finalScore, personalBest]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeSwitchProvider mode={props.theme.palette.mode}>
        <Container square elevation={0}>
          <Header>
            <FontAwesomeIcon icon={faCubesStacked} /> Blocks
          </Header>
          <Content>
            {gameStarted ? (
              gameOver ? (<>
                  <Score>Final: {finalScore}</Score>
                  <Score>Personal Best: {personalBest}</Score>
                  <Score>Last Score: {lastScore}</Score>
                  <Button variant="contained" onClick={startNewGame}>
                    New Game
                  </Button>
              </>) : (
                <Game onGameOver={handleGameOver} />
              )
            ) : (<>
              <Score>Final: {finalScore}</Score>
              <Score>Personal Best: {personalBest}</Score>
              <Button variant="contained" onClick={startNewGame}>
                New Game
              </Button>
            </>)}
          </Content>
        </Container>
      </ThemeSwitchProvider>
    </StyledEngineProvider>
  );
}

export default function WithProviders(props: AppProps) {
  return (
    <RecoilRoot override key="broker">
      <App {...props} />
    </RecoilRoot>
  );
}
