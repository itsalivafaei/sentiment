// Character component
import propTypes from 'prop-types';
import '../styles/Character.scss'

const Character = ({ animation }) => {
    const characterClass = `character -${animation}`;
    return (
        <svg className={characterClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">
        <circle className="character__eye -eye-r" cx="87.59" cy="134.46" r="5.12"/>
        <g id="body">
            <circle className="character__body -part-1" cx="140.71" cy="122.62" r="42.88"/>
            <circle className="character__body -part-2" cx="166.95" cy="141.82" r="42.88"/>
            <circle className="character__body -part-3" cx="191.26" cy="173.82" r="42.88"/>
            <circle className="character__body" cx="197.02" cy="335.1" r="42.88"/>
            <circle className="character__body" cx="197.02" cy="295.42" r="42.88"/>
            <circle className="character__body" cx="206.62" cy="216.06" r="42.88"/>
            <circle className="character__body" cx="205.98" cy="258.94" r="42.88"/>
        </g>
        <circle className="character__eye -eye-l-extra" cx="87.59" cy="134.46" r="5.12"/>
        <circle className="character__eye -eye-l" cx="115.11" cy="134.46" r="5.12"/>
        </svg>
    );
};

// Left arm component
const ArmLeft = ({ animation, armPath }) => (
    <svg className="arm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">
        { animation === 'typing' && <path className="arm-typing-left" d={armPath} /> }
        { animation === 'stressed' && <path className="arm-typing-left" d={armPath} /> }
        { animation === 'waiting' && <path d="M175.27,152.06s55.19,87.24-65.77,74.44" /> }
        { animation === 'thinking' && <path d="M175.93,152.78s-10.18,82-36.43,103.72" /> }
        { animation === 'passive' && <path d="M175.93,152.78s-10.18,82-36.43,103.72" /> }
        { animation === 'sleeping' && <path d="M175.93,152.78s-10.18,82-36.43,103.72" /> }
    </svg>
);

// Right arm component
const ArmRight = ({ animation, armPath }) => (
    <svg className="arm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">
        { animation === 'typing' && <path className="arm-typing-right" d={armPath} /> }
        { animation === 'stressed' && <path className="arm-typing-right" d={armPath} /> }
        { animation === 'waiting' && <path d="M207.26,171.26s45.19,85-75.76,72.24" /> }
        { animation === 'thinking' && <path className="arm-thinking-right" d="M207.48,172.34s-76,114.16-93-9.84" /> }
        { animation === 'passive' && <path d="M207.93,172c.57-.48,11.3,86.45-23.43,112.52" /> }
        { animation === 'sleeping' && <path d="M207.93,172c.57-.48,11.3,86.45-23.43,112.52" /> }
    </svg>
);

// Computer component
const Computer = ({ animation }) => {
    const computerClass = `computer -${animation}`;
    return (
        <svg className={computerClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 82 55">
        <polygon className="computer__keyboard" points="29,42.5 81,51.5 45,55.5 30,49.5 "/>
        <path className="computer__keyboard" d="M80.3,55.5H45.7c-0.9,0-1.7-0.7-1.7-1.7v-0.7c0-0.9,0.7-1.7,1.7-1.7h34.7c0.9,0,1.7,0.7,1.7,1.7v0.7
            C82,54.8,81.2,55.5,80.3,55.5z"/>
        <path className="computer__screen" d="M38.9,55.4l-27.3-6.3c-1.6-0.4-2.8-1.6-3.1-3.2l-8.4-41C-0.5,2.2,1.7-0.2,4.5,0l27.4,2.5
            c1.8,0.2,3.3,1.5,3.7,3.3l8.3,44.8C44.4,53.6,41.8,56.1,38.9,55.4z"/>
        </svg>
    );
};

// Table component
const Table = () => (
    <svg className="table" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 530 160.1">
        <polygon points="530,65.8 197.7,0 0,10.6 274.9,160.1 " />
    </svg>
);

Character.propTypes = {
    animation: propTypes.string.isRequired,
};

ArmLeft.propTypes = {
    animation: propTypes.string.isRequired,
    armPath: propTypes.string.isRequired,
};

ArmRight.propTypes = {
    animation: propTypes.string.isRequired,
    armPath: propTypes.string.isRequired,
};

Computer.propTypes = {
    animation: propTypes.string.isRequired,
};


export { Character, ArmLeft, ArmRight, Computer, Table };