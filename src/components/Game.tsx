import React, { useRef, useEffect, useState } from 'react';
import { randomShape } from './shapeFactory'; // Adjust the import path as needed
import styled from '@emotion/styled';
import { HEADER_HEIGHT } from './Header';

const ROWS = 18;
const COLS = 11;
const BLOCK_SIZE = 30;

const Score = styled.div`
    color: white;
    font-family: 'Press Start 2P', cursive;
    font-size: 16px;
    text-shadow: 2px 2px 0 #ff0000, 4px 4px 0 #ff9900;
    background: black;
    padding: 10px;
    border: 2px solid #00ff00;
    border-radius: 5px;
    display: inline-block;
    top: calc(1rem + ${HEADER_HEIGHT});
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
    text-align: center;
`;

const Game = ({ onGameOver }: { onGameOver: any }) => {
  const canvasRef = useRef(null);
  const [currentShape, setCurrentShape] = useState(randomShape());
  const [position, setPosition] = useState({ x: 4, y: 0 }); // Initial position of the shape
  const [board, setBoard] = useState(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
  const [score, setScore] = useState(0);
  const [blockCount, setBlockCount] = useState(0);
  const [intervalSpeed, setIntervalSpeed] = useState(500);


  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const initializeGame = () => {
      canvas.width = COLS * BLOCK_SIZE;
      canvas.height = ROWS * BLOCK_SIZE;
      draw(context);
    };

    const draw = (context) => {
        context.clearRect(0, 0, canvas.width, canvas.height);
      
        // Draw the board
        board.forEach((row, y) => {
          row.forEach((cell, x) => {
            if (cell) {
              context.fillStyle = "#83BBCE";
              context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
              context.strokeStyle = 'black';
              context.lineWidth = 2;
              context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
          });
        });
      
        // Draw the current shape
        if (currentShape) {
          context.fillStyle = 'white';
          currentShape.shape.forEach(block => {
            const blockX = (block.x + position.x) * BLOCK_SIZE;
            const blockY = (block.y + position.y) * BLOCK_SIZE;
      
            context.fillRect(blockX, blockY, BLOCK_SIZE, BLOCK_SIZE);
            context.strokeStyle = 'black';
            context.lineWidth = 2;
            context.strokeRect(blockX, blockY, BLOCK_SIZE, BLOCK_SIZE);
          });
        }
      };
      

    const isCollision = (shape, pos) => {
      for (let block of shape) {
        const newX = block.x + pos.x;
        const newY = block.y + pos.y;
        if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX])) {
          return true;
        }
      }
      return false;
    };

    const clearFullRows = (board) => {
      const newBoard = board.filter(row => row.some(cell => !cell));
      const clearedRows = ROWS - newBoard.length;
      while (newBoard.length < ROWS) {
        newBoard.unshift(Array(COLS).fill(null));
      }
      return { newBoard, clearedRows };
    };

    const gameTick = () => {
        const newPosition = { x: position.x, y: position.y + 1 };
        if (!isCollision(currentShape.shape, newPosition)) {
          setPosition(newPosition);
        } else {
          const newBoard = [...board];
          currentShape.shape.forEach(block => {
            const x = block.x + position.x;
            const y = block.y + position.y;
            if (y >= 0) {
              newBoard[y][x] = 'filled';
            }
          });
    
          const { newBoard: updatedBoard } = clearFullRows(newBoard);
    
          setBoard(updatedBoard);
    
          if (isCollision(randomShape().shape, { x: 4, y: 0 })) {
            onGameOver(score);
            return;
          }
    
          setCurrentShape(randomShape());
          setPosition({ x: 4, y: 0 });
          setScore(prevScore => prevScore + 1);
          setBlockCount(prevCount => prevCount + currentShape.shape.length);
    
          if ((blockCount + 1) % 10 === 0) {
            setIntervalSpeed(prevSpeed => Math.max(prevSpeed - 50, 50)); // Ensure a minimum speed
          }
        }
    
        draw(context);
      };

    const handleKeyDown = (e) => {
      if (!currentShape) return;

      let newPos = { ...position };
      let newShape = currentShape.shape;

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          newPos = { ...position, x: position.x - 1 };
          if (!isCollision(currentShape.shape, newPos)) {
            setPosition(newPos);
          }
          break;
        case 'ArrowRight':
        case 'd':
          newPos = { ...position, x: position.x + 1 };
          if (!isCollision(currentShape.shape, newPos)) {
            setPosition(newPos);
          }
          break;
        case 'ArrowDown':
        case 's':
          newPos = { ...position, y: position.y + 1 };
          if (!isCollision(currentShape.shape, newPos)) {
            setPosition(newPos);
          }
          break;
        case 'ArrowUp':
        case 'w':
          // Rotate the shape (90 degree clockwise rotation)
          newShape = currentShape.shape.map(block => ({
            x: block.y,
            y: -block.x
          }));
          if (!isCollision(newShape, position)) {
            setCurrentShape({ ...currentShape, shape: newShape });
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const intervalId = setInterval(() => {
        gameTick();
      }, intervalSpeed);

    initializeGame();

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentShape, position, board, score]);

  return (
    <div>
      <Score>Score: {score}</Score>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default Game;
