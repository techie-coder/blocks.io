export const generateObstacles = () => {
    return [
      { x: 5, y: 3, image: 'https://path-to-your-image.com/obstacle1.png' },
      { x: 12, y: 1, image: 'https://path-to-your-image.com/obstacle2.png' },
      { x: 8, y: 4, image: 'https://path-to-your-image.com/obstacle3.png' },
    ];
  };
  
export const isObstacle = (x, y, obstacles) => {
    return obstacles.some(obstacle => obstacle.x === x && obstacle.y === y);
};
