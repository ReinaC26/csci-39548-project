import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './HomePage.css';

function HomePage() {
    const [displayText, setDisplayText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const fullText = 'Welcome to SerendiQuest!';

    useEffect(() => {
        let index = 0;
        const typingInterval = setInterval(() => {
            if (index < fullText.length) {
                setDisplayText(fullText.substring(0, index + 1));
                index++;
            } else {
                clearInterval(typingInterval);
            }
        }, 100);
        return () => clearInterval(typingInterval);
    }, []);

    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500);
        return () => clearInterval(cursorInterval);
    }, []);

    return (
        <div className="homepage">
            {/* Navbar */}
            <Navbar />

            {/* Typewriter Text */}
            <div className="typewriter-container">
                <h1 className="typewriter-text">
                    {displayText}
                    <span className={`cursor ${showCursor ? 'visible' : 'hidden'}`}>|</span>
                </h1>
            </div>
            <div className="page-content">
                <p>Your adventure awaits...</p>
            </div>
            <a href="/questgenerator" className="page-button">
                Generate Adventure
            </a>
        </div>
    );
}

export default HomePage;
