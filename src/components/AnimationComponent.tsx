// AnimationComponent.tsx
import React from 'react';
import './animationstyle.css';

interface AnimationComponentProps {
  onAnimationEnd: () => void;
}

const AnimationComponent: React.FC<AnimationComponentProps> = ({ onAnimationEnd }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationEnd();
    }, 4000); // Duration of the animation in milliseconds
    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return (
    <div className="animation-container">
      {/* Your animation content here */}
      <h1>Loading...</h1>
    </div>
  );
};

export default AnimationComponent;
