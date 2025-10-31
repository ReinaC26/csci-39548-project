import Navbar from './Navbar';
import './AboutPage.css';

function AboutPage() {
    return (
        <div className= "about-page">
            <Navbar/>
         <div className = "page-headings">
            <p>What is SerendiQuest?</p> 
        </div>
        <div className = "page-content">
            <p>SerendiQuest is for people with a sense of curiosity looking for engaging ways to discover more about their community and their city.</p>
            <p> Use it to create personalized, location-based adventure prompts and go on unexpected adventures!</p>
        </div>
       <div className = "page-headings">
            <p>How do I start my quest?</p> 
        </div>
        <div className = "page-content">
            <p>Navigate to <span style={{color:"#ffdba6"}}>Quest Generator</span>.</p>
            <p>Choose your distance, duration, and start location to start a quest.</p>
            <p>If you’re in the mood to totally embrace the unpredictable, select <span style={{color:"#ffdba6"}}>Random Quest Mode</span>!</p>
        </div>
        </div>
    );
}
export default AboutPage;