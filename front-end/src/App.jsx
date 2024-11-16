// SVG sine loop based on https://codepen.io/jaromvogel/pen/jWjWqN
// Color scheme: https://coolors.co/009ffd-eaf6ff-cacfd6-d6e5e3-9fd8cb

import { useState, useEffect, useRef, useCallback } from 'react'
import { Character, ArmLeft, ArmRight, Computer, Table } from './components/Character.jsx'
import { getRandomMessage, statusMessages } from './components/Messages'
import animationSettings from './config/AnimationSettings'
import { analyzeSentiment } from './config/ColabNgrokAPI'
import { SendHorizontal, Sun, Moon } from 'lucide-react'
import './styles/App.scss'

const App = () => {
  // State variables
  const [animation, setAnimationState] = useState("sleeping");
  const [armPathL, setArmPathL] = useState("M 207 171");
  const [armPathR, setArmPathR] = useState("M 207 171");
  // const [xstart, setXstart] = useState(207);
  const [xstart] = useState(207);
  // const [ystart, setYstart] = useState(171);
  const [ystart] = useState(171);
  // const [length, setLength] = useState(110);
  const [length] = useState(110);
  // const [fps, setFps] = useState(60);
  // eslint-disable-next-line no-unused-vars
  const [fps, setFps] = useState(60);

  // Interaction state variables
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isAnimationLocked, setIsAnimationLocked] = useState(false);
  const [status, setStatus] = useState('Your thoughts matter! Start typing to get insights. 🧠');
  const [isLoading, setIsLoading] = useState(false);
  const [isToggled, setIsToggled] = useState(false);

  // Refs
  const loopRef = useRef(null); // Ref to store the loop timeout
  const offsetRef = useRef(0); // Ref to store the current offset
  const typingTimerRef = useRef(null); // Ref to store the current typing state
  const stressTimerRef = useRef(null); // Ref to store the current stress state
  const buttonRef = useRef(null); // Ref to store the button element

  // Constant variables
  /* const animationSettings = {
    sleeping: {frequency: 3, amplitude: 0.1},
    passive: {frequency: 3, amplitude: 0.1},
    waiting: {frequency: 3, amplitude: 0.1},
    thinking: {frequency: 3, amplitude: 0.1},
    typing: {frequency: 3, amplitude: 0.1},
    stressed: {frequency: 10, amplitude: 0.1},
  };
  */

  const { frequency, amplitude } = animationSettings[animation];

  // Function to create curve
  const createCurve = useCallback(
    (x, currentOffset, inverted = false) => {
      const phase = inverted
        ? Math.sqrt(x * frequency) - currentOffset
        : Math.sqrt(x * frequency) + currentOffset;
      return ystart - Math.sin(phase) * (x - xstart) * amplitude;
    }, [frequency, amplitude, xstart, ystart]
  );

  // Function to update arms
  const updateArms = useCallback(
    () => {
      let x = xstart;
      let dataL = `M ${xstart} ${ystart}`;
      let dataR = `M ${xstart} ${ystart}`;
  
      while (x < xstart + length) {
        const newYL = createCurve(x, offsetRef.current);
        const newYR = createCurve(x, offsetRef.current, true);
        dataL = `${dataL} L ${x} ${newYL}`;
        dataR = `${dataR} L ${x} ${newYR}`;
        x += 1;
      }
  
      setArmPathL(dataL);
      setArmPathR(dataR);
    }, [createCurve, length, xstart, ystart]
  );

  // Animation loop
  const loop = useCallback(
    () => {
      if (animation !== "typing" && animation !== "stressed") {
        cancelAnimationFrame(loopRef.current);
        return;
      }
  
      offsetRef.current += 0.3;
      if (offsetRef.current > Math.PI * 2) {
        offsetRef.current = 0;
      }

      updateArms();

      loopRef.current = requestAnimationFrame(loop);
    }, [animation, updateArms]
  );
  
  // Handlers for input interactions
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  const handleFocus = () => {
    setIsFocused(true);
    setIsTyping(false); // Reset typing state on focus
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    setIsTyping(false); // Rest typing state on blur
  };

  // Handler for input text change
  const handleTextChange = (event) => {
    setIsTyping(true);
      setInputText(event.target.value);
  
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    typingTimerRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 700);
  };

  useEffect(() => {
    if (!isAnimationLocked) {
      if (isTyping) {
        setAnimationState("thinking");
        // setStatus(getRandomMessage(statusMessages.thinking));
      } else if (isFocused) {
        setAnimationState("waiting");
        // setStatus(getRandomMessage(statusMessages.waiting));
      } else if (isHovered) {
        setAnimationState("passive");
        // setStatus(getRandomMessage(statusMessages.passive));
      } else {
        setAnimationState("sleeping");
        // setStatus(getRandomMessage(statusMessages.sleeping));
      }
    }
  }, [isTyping, isFocused, isHovered, isAnimationLocked]);

  // Function to set animation state
  const handleSetAnimation = useCallback(
    (newAnimation, speed) => {
      if (!isAnimationLocked) {
        setAnimationState(newAnimation);
        setFps(speed || 60);
      }
      // Else, do not change the animation state as input interactions have higher priority
    }, [isAnimationLocked]
  );

  // Function to set toggle mode button
  const handleToggleMode = () => {
    setIsToggled(!isToggled);
  };

  const mode = isToggled ? "dark-mode" : "";

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      buttonRef.current.click();
    }
  }

  useEffect(() => {
    setStatus(getRandomMessage(statusMessages.sleeping));
  }, []);

  // useEffect to start or stop the animation loop based on animation state
  useEffect(() => {
    if (animation === "typing" || animation === "stressed") {
      cancelAnimationFrame(loopRef.current);
      loopRef.current = requestAnimationFrame(loop);
    } else {
      cancelAnimationFrame(loopRef.current);
    }

    return () => {
      cancelAnimationFrame(loopRef.current);
    }
  }, [animation, loop]);

  // Initialize arms update on mount
  useEffect(() => {
    updateArms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);




  // Handler for input button click
  const handleInputButtonClick = async () => {
    if (!inputText.trim()) {
      setStatus("Please enter some text for sentiment analysis.");
      return;
    }
    // set to 'typing' and lock animation
    handleSetAnimation('typing');
    setIsAnimationLocked(true);
    setStatus(getRandomMessage(statusMessages.typing));
    setIsLoading(true);

    // clear any existing timers
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    if (stressTimerRef.current) {
      clearTimeout(stressTimerRef.current);
    }

    try {
      // Send POST request to Flask backend using the analyzeSentiment function
      const result = await analyzeSentiment(inputText);

      stressTimerRef.current = setTimeout(async () => {
        handleSetAnimation('stressed');
        setStatus(getRandomMessage(statusMessages.stressed));
      }, 4000);
      
      setStatus(`Sentiment analysis result: Your mood is ${result.sentiment} (with a score of ${(result.probability * 100).toFixed(2)}%)`);
      setIsAnimationLocked(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      setStatus("Error analyzing sentiment. Please try again.");
    } finally {
      // Unlock animation and reset input
      setIsAnimationLocked(false);
      setInputText("");
      setAnimationState("sleeping");
      setIsLoading(false);
    }
  };



  // Cleanup timers and animation frames on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
      if (stressTimerRef.current) {
        clearTimeout(stressTimerRef.current);
      }
      cancelAnimationFrame(loopRef.current);
    };
  }, []);

  return (
    <div className={`App ${mode}`}>
      <div className='header-container'>
        <p>Ali Vafaei.</p>
        <button id='mode-button'
        onClick={handleToggleMode}
        >
          {!isToggled ? 
            <Sun size={16} strokeWidth={2.5} className='toggle-icon'/> :
            <Moon size={16} strokeWidth={2.5} className='toggle-icon'/>
          }
          {isToggled ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <div className='separator-container' id='separator-top'></div>
      <div className='main-container'>
        {/* <h1>Sentiment Analysis</h1> */}
        {/* <div className='separator-container'></div> */}
        <div id='character-wrapper'>
          <ArmLeft animation={animation} armPath={armPathL} />
          <Character animation={animation} />
          <ArmRight animation={animation} armPath={armPathR} />
          <Table />
          <Computer animation={animation} />
        </div>
        <div id='status'>
          <p>
            {status}
          </p>
          {isLoading && <p>Loading...</p>} {/* Display loading message if isLoading is true */}
        </div>
        {/* <AnimationControls onSetAnimation={handleSetAnimation} /> */}
        {/* Text Input with Button */}
        <div className='separator-container' id='separator-bottom'></div>
        
      </div>
      <div className='input-container'>
          <input
            type="text"
            className='input'
            placeholder='What do you think about?'
            value={inputText}
            onChange={handleTextChange}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={isAnimationLocked}
            onKeyDown={handleKeyDown}
          />
          <button 
            className='input-button'
            onClick={handleInputButtonClick}
            aria-label='Trigger Sentiment Analysis'
            disabled={isAnimationLocked || !inputText.trim()} // Disable button if animation is locked
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
            ref={buttonRef}
          >
            {/* Right Arrow SVG Icon */}
            <SendHorizontal size={20} strokeWidth={2.5}/>
          </button>
        </div>
        <div className='footer-container'>
          <p className='caption'>
            Model trained on 50,000 IMDB reviews · Accuracy: {'>'}92%; Loss: 0.1963
          </p>
          <a 
          href='https://github.com/itsalivafaei/sentiment/' 
          target='_blank'
          >
          Github Repo
          </a>
        </div>
      {/* <div className='separator-container'></div> */}
    </div>
  );
};

export default App;