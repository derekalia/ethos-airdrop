import React, {useEffect,useState,useRef} from 'react';
import styled, { css } from 'styled-components';


interface BarSectionProps {
  onClick?: () => void;
  number?: string;
  desc?: string;
  precent?: number;
  color: string;
}

export const BarSection = ({ number, desc, color, precent = 1, onClick }: BarSectionProps) => {
  const barRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isDescVisible, setIsDescVisible] = useState(true);

  useEffect(() => {
      const updateVisibility = () => {
          if (barRef.current) {
              const width = barRef.current.offsetWidth;
              setIsVisible(width >= 170);
              setIsDescVisible(width >= 60);
          }
      };

      // Use ResizeObserver for more accurate width detection
      const resizeObserver = new ResizeObserver(() => updateVisibility());
      if (barRef.current) {
          resizeObserver.observe(barRef.current);
      }

      // Run the initial visibility check with a slight delay
      const initialCheckTimeout = setTimeout(updateVisibility, 50);

      // Cleanup
      return () => {
          if (barRef.current) {
              resizeObserver.unobserve(barRef.current);
          }
          clearTimeout(initialCheckTimeout);
      };
  }, []);

  return (
      <BarSectionComponent ref={barRef} onClick={onClick} precent={precent} color={color}>
          <p className="bar-item-number" style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
          ${number}
          </p>
          <p className="bar-item-desc" style={{ visibility: isDescVisible ? 'visible' : 'hidden' }}>
          ${desc}
          </p>
      </BarSectionComponent>
  );
};

const BarSectionComponent = styled.div<BarSectionProps>`
flex: ${props => props.precent || 1};
display: flex;
padding: 3em clamp(0.5em, 0.5vw, 2em) clamp(0.5em, 0.5vw, 2em) clamp(0.5em, 0.5vw, 2em);
flex-direction: column;
justify-content: flex-end;
word-wrap: break-word;
overflow-wrap: break-word;
white-space: normal;
background-color: ${props => props.color};
height: 100%;
overflow: hidden;
min-width: 0;

.bar-item-number {
  font-weight: bold;
  font-size: clamp(2rem, 3vw, 4rem); 
  text-transform: uppercase;   
}

.bar-item-desc {
  font-size: clamp(0.75rem, 0.3vw, 2rem); 
  text-transform: uppercase;
  text-overflow: ellipsis;
  white-space: nowrap;
}
`;


interface BarLegendProps {
    text?:string;
    color?:string;
    number?:string;
}

export const BarLegend = ({ text = "N/A", color = "#ffffff",number}: BarLegendProps) => {
   
    return (
  <BarLegendComponent color= {color}>
    <div className="data-legend-point"></div>
    <p className="data-legend-text">{text} { number && (" [ $" + number + " ]")}</p>
  </BarLegendComponent>
  );
};

export const BarLegendComponent = styled.div<BarSectionProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap:0.5em;

  .data-legend-point {
      width:0.75em;
      height:0.75em;
      border-radius: 50%;
      background-color: ${props => props.color};
  }

    .data-legend-text {
      text-transform: uppercase;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      font-size: clamp(0.65rem, 1vw, 2vw);
    }
`;


