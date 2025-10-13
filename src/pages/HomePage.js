import React, { useState, useEffect} from 'react'

function HomePage() {
    const [displayText, setDisplayText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const fullText = 'Welcome to SerendiQuest.'

    useEffect(() => {
        let index = 0;
        const typingInterval = setInterval(() => {
            if (index < fullText.length) {
                
                setDisplayText(fullText.substring(0, index + 1));
                index++
            } else {
                clearInterval(typingInterval);
            }
        }, 100);
        return () => clearInterval(typingInterval);
    }, []);

    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500)
        return () => clearInterval(cursorInterval);
    }, []);

    return (
        <div className='min-h-screen bg-black'>
            {/* NAVIGATION BAR */}
            <nav className='bg-black shadow-md p-4'>
                <div className='flex justify-between items-center px-10'>
                    {/* Left Links: */}
                    <div className='flex gap-6 font-game'>
                        <a href='/about' className='text-green-500 hover:text-green-400'>About</a>
                        <a href='/login' className='text-green-500 hover:text-green-400'>Login/Sign Up</a>
                    </div>

                    {/* Center Link: */}
                    <a href='/' className='text-2xl font-bold text-green-500 hover:text-green-400 font-game'>SerendiQuest</a>
                    
                    {/* Right Links: */}
                    <div className='flex gap-6 font-game'>
                        <a href='/questgenerator' className='text-green-500 hover:text-green-400'>Quest Generator</a>
                        <a href='/profile' className='text-green-500 hover:text-green-400'>Profile</a>
            
                    </div>
                </div>
            </nav>

            {/* Typewriter Text: */}
            <div className='flex items-center justify-center h-[calc(100vh-80px)]'>
                <h1 className='text-4xl font-game text-green-400'>
                    {displayText}
                    <span className={showCursor ? 'opacity-100' : 'opacity-0'}>|</span>
                </h1>
            </div>
        </div>
    );
}

export default HomePage;