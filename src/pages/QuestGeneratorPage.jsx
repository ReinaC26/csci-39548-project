import React, { useState } from 'react';
import Navbar from './Navbar';
import Map from '../components/Map';
import FeedbackForm from '../components/FeedbackForm';
import './QuestGeneratorPage.css';

function QuestGeneratorPage() {
    const [distance, setDistance] = useState(50);
    const [duration, setDuration] = useState(2);
    const [isRandomMode, setIsRandomMode] = useState(false);
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [description, setDescription] = useState('');
    const [generatedQuest, setGeneratedQuest] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);

    const handleDistanceSliderChange = (event) => {
        setDistance(event.target.value);
    };

    const handleDurationSliderChange = (event) => {
        setDuration(Number(event.target.value));
    };

    // Validate required fields
    const validateForm = () => {
        if (isRandomMode) {
            return true; // No validation needed for random mode
        }
        
        if (!startLocation.trim()) {
            setError('Please enter a start location');
            return false;
        }
        
        if (!description.trim()) {
            setError('Please enter a quest description');
            return false;
        }
        
        return true;
    };

    // API call to create quest
    const handleCreateQuest = async () => {
        setError('');
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        
        try {
            const requestBody = isRandomMode 
                ? { 
                    distance: '5 mi',
                    duration: '1 hr',
                    startLocation: 'Random location in New York City',
                    endLocation: 'Random location in New York City',
                    description: 'surprise adventure'
                  }
                : {
                    distance: `${distance} mi`,
                    duration: duration < 1 
                        ? `${(duration * 60).toFixed(0)} mins` 
                        : `${Math.floor(duration)} hr ${Math.floor((duration % 1) * 60)} mins`,
                    startLocation,
                    endLocation: endLocation || startLocation,
                    description
                };

            const response = await fetch('http://localhost:5002/api/quests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }

            const data = await response.json();
            setGeneratedQuest(data);
            
        } catch (error) {
            console.error("Failed to fetch:", error);
            setError(error.message || 'Failed to create quest. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // save completed quest to user's profile
    const handleQuestComplete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found, user not logged in');
                setShowFeedbackForm(true); // show feedback anyways
                return;
            }
            const response = await fetch(`http://localhost:5002/api/users/quests/${generatedQuest._id}/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                console.log('Quest saved to profile successfully!');
            }
        } catch (error) {
            console.log('Error saving quest: ', error);
        }
        // show feedback form regarless of save result
        setShowFeedbackForm(true);
    };

    return (
        <div className="generator-page">
            <Navbar />
            <div className="page-container">
                <div className="left-container">
                {generatedQuest ? (
                    <>
                    <button className="back-btn" onClick={() => {
                        setGeneratedQuest(null);
                        setIsRandomMode(false);
                    }}>
                        Back
                    </button>
                    
                        <div className="quest-result-card">
                            <div className="left-title">Your Quest</div>
                            <div className="quest-details-container">
                                <div className="quest-section">
                                    <p><strong>Start Location:</strong> {generatedQuest.startLocation}</p>
                                    <p><strong>End Location:</strong> {generatedQuest.endLocation}</p>
                                </div>
                                <div className="quest-section">
                                    <p><strong>Distance:</strong> {generatedQuest.distance}</p>
                                    <p><strong>Time:</strong> {generatedQuest.duration}</p>
                                </div>
                                <div className="quest-section">
                                    <div className="bold-text">Description:</div>
                                    <div className="regular-text">{generatedQuest.description}</div>
                                </div>
                                <div className="quest-section">
                                    <div className="bold-text">Goal:</div>
                                    <div className="regular-text">{generatedQuest.questGoal}</div>
                                </div>
                            </div>
                        </div>
                    </>
                    ) : (
                        <>
                    <div className={`left-title ${isRandomMode ? 'centered' : ''}`}>
                        Customize Your Quest
                    </div>
                    <div className={`random-mode ${isRandomMode ? 'centered' : ''}`}>
                        <div className="text-container">
                        <div className="bold-text">Random Quest Mode</div>
                        <div className="regular-text">Create a surprise adventure!</div>
                        </div>
                        <button 
                            className="mode-selection-button"
                            onClick={() => {
                                setIsRandomMode(!isRandomMode);
                                setError('');
                            }}
                        >
                            {isRandomMode && <span>✓</span>}
                        </button>
                    </div>
                    {!isRandomMode && (
                        <>
                    {/* Customize distance */}
                    <div className="distance">
                        *Distance = 
                        <input 
                            type="text" 
                            className="input-box"
                            value={`${distance} mi`}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9.]/g, '');
                                if (val === '') {
                                  setDistance(0);
                                } else {
                                  const num = Number(val);
                                  if (!isNaN(num) && num >= 0 && num <= 100) {
                                    setDistance(num);
                                  }
                                }
                            }}
                        />
                    </div>
                    <div className="customize-slider" style={{ width: '90%' }}>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={distance} 
                            step="1" 
                            id="customize-slider"
                            className="customize-slider"
                            onChange={handleDistanceSliderChange} 
                        />
                    </div>
                    {/* Custom duration */}
                    <div className="duration">
                        *Duration = 
                        <input
                            type="text"
                            className="input-box"
                            value={
                                duration < 1
                                    ? `${(duration * 60).toFixed(0)} mins`
                                    : `${Math.floor(duration)} hr ${Math.floor((duration % 1) * 60)} mins`
                            }
                            onChange={(e) => {
                                const input = e.target.value.toLowerCase();
                          
                                if (input.includes('min')) {
                                  const mins = parseFloat(input.replace(/[^0-9.]/g, ''));
                                  if (!isNaN(mins) && mins >= 0 && mins <= 300) {
                                    setDuration(mins / 60);
                                  }
                                }
                                else if (input.includes('hr')) {
                                  const hours = parseFloat(input.replace(/[^0-9.]/g, ''));
                                  if (!isNaN(hours) && hours >= 0 && hours <= 5) {
                                    setDuration(hours);
                                  }
                                }
                                else {
                                  const num = parseFloat(input.replace(/[^0-9.]/g, ''));
                                  if (!isNaN(num)) {
                                    if (num <= 60) setDuration(num / 60);
                                    else if (num <= 300) setDuration(num / 60);
                                  }
                                }
                              }}
                        />
                    </div>
                    <div className="customize-slider" style={{ width: '90%' }}>
                        <input
                            type="range"
                            min="0"
                            max="5.01"
                            value={duration}
                            step="0.015"
                            id="customize-slider"
                            className="customize-slider"
                            onChange={handleDurationSliderChange}
                        />
                    </div>

                    {/* Customize start/end location */}
                    <div className="start-location">*Start Location</div>
                    <input 
                        type="text" 
                        className="start-location-input-box focus:outline-none focus:shadow-none focus:ring-transparent"
                        placeholder="Use current location or enter an address" 
                        value={startLocation}
                        onChange={(e) => setStartLocation(e.target.value)}
                    />
                    <div className="end-location">End Location</div>
                    <input 
                        type="text" 
                        className="end-location-input-box focus:outline-none focus:shadow-none focus:ring-transparent"
                        placeholder="Use current location or enter an address" 
                        value={endLocation}
                        onChange={(e) => setEndLocation(e.target.value)}
                    />
                    <div className="end-location">*Quest Description</div>
                    <textarea 
                        type="text" 
                        className="description-input-box focus:outline-none focus:shadow-none focus:ring-transparent"
                        placeholder="Description of your desired quest" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    </>
                    )}
                    
                    {/* Error message */}
                    {error && (
                        <div className="error-message" style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}
                    
                    <button 
                        className={`quest-create-btn ${isRandomMode ? 'centered' : ''}`}
                        onClick={handleCreateQuest}
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Create"}   
                    </button>
                    </>
                    )}
                </div>

                    
                <div className="right-container">
                    <div className="right-title">Journey</div>               
                    <Map 
                        width="100%" 
                        height="85vh" 
                    />
                    <div className="show-location-container">
                        <div className="show-location-btn"></div>
                        <div className="location-btn-label">
                            Show Start and End Locations
                            <div className="location-icon-container">
                                <img 
                                    src="/start_location.png" 
                                    alt="Start location icon" 
                                    className="start-location-icon" 
                                />
                                Start
                                <img 
                                    src="/end_location.png" 
                                    alt="End location icon" 
                                    className="end-location-icon" 
                                />
                                End
                            </div>
                        </div>
                        <div 
                            className="quest-complete-btn"
                            onClick={() => generatedQuest && !isLoading && handleQuestComplete()}
                            disabled={isLoading || !generatedQuest}
                            style={{ 
                                opacity: generatedQuest && !isLoading ? 1 : 0.5, 
                                cursor: generatedQuest && !isLoading ? 'pointer' : 'not-allowed' 
                            }}
                        >
                            Quest Complete!
                        </div>
                        <div className="regenerate-btn">
                        {!isRandomMode ? (
                                <button 
                                    onClick={() => setGeneratedQuest(null)}
                                    disabled={!generatedQuest}
                                    style={{ 
                                        opacity: generatedQuest ? 1 : 0.5, 
                                        cursor: generatedQuest ? 'pointer' : 'not-allowed' 
                                    }}
                                >
                                    Edit Quest
                                </button>
                            ) : (
                                <button 
                                    onClick={handleCreateQuest}
                                    disabled={isLoading || !generatedQuest}
                                    style={{ opacity: generatedQuest && !isLoading ? 1 : 0.5, cursor: generatedQuest && !isLoading ? 'pointer' : 'not-allowed' }}
                                >
                                    {isLoading ? "Loading..." : "Regenerate"}   
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <FeedbackForm 
                isOpen={showFeedbackForm} 
                onClose={() => setShowFeedbackForm(false)}
                questId={generatedQuest?._id}
                onSubmitSuccess={() => {
                    setGeneratedQuest(null);
                    setIsRandomMode(false);
                }}
            />
        </div>
    );
}

export default QuestGeneratorPage;