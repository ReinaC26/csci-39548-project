import React from 'react'

function HomePage() {
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
        </div>
    );
}

export default HomePage;