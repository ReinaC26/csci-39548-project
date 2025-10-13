import React from 'react'

function HomePage() {
    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-400 to-purple-500'>
            {/* NAVIGATION BAR */}
            <nav className='bg-white shadow-md p-4'>
                <div className='flex justify-between items-center px-8'>
                    <h2 className='text-2xl font-bold text-gray-800'>SerendiQuest</h2>
                    <div className='flex gap-6'>
                        <a href ='/' className='text-gray-700 hover:text-blue-500'>Home</a>
                        <a href='/questgenerator' className='text-gray-700 hover:text-blue-500'>Quest Generator</a>
                        <a href='/profile' className='text-gray-700 hover:text-blue-500'>Profile</a>
                        <a href='/login' className='text-gray-700 hover:text-blue-500'>Login</a>
                        <a href='/signup' className='text-gray-700 hover:text-blue-500'>Sign Up</a>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default HomePage;