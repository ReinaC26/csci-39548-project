import React from 'react'

function HomePage() {
    return (
        <div className='min-h-screen bg-gradient-to-br from-green-400 to-emerald-600'>
            {/* NAVIGATION BAR */}
            <nav className='bg-stone-100 shadow-md p-4'>
                <div className='flex justify-between items-center px-8'>
                    {/* Left Links: */}
                    <div className='flex gap-6'>
                        <a href='/about' className='text-stone-700 hover:text-green-600'>About</a>
                        <a href='/login' className='text-stone-700 hover:text-green-600'>Login/Sign Up</a>
                    </div>

                    {/* Center Link: */}
                    <a href='/' className='text-2xl font-bold text-green-800hover:text-green-600'>SerendiQuest</a>
                    
                    {/* Right Links: */}
                    <div className='flex gap-6'>
                        <a href='/questgenerator' className='text-stone-700 hover:text-green-600'>Quest Generator</a>
                        <a href='/profile' className='text-stone-700 hover:text-green-600'>Profile</a>
            
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default HomePage;