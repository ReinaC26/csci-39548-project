import React, { useState } from 'react';
import Navbar from './Navbar';
import './QuestGeneratorPage.css';

function QuestGeneratorPage() {
    const [distance, setDistance] = useState(50);
    const [duration, setDuration] = useState(2);

    const handleDistanceSliderChange = (event) => {
        setDistance(event.target.value);
    };

    const handleDurationSliderChange = (event) => {
        setDuration(Number(event.target.value));
    };

    return (
        <div className="generator-page">
            <Navbar />
            <div className="page-container">
                <div className="left-container">
                    <div className="left-title">
                        Customize Your Quest
                    </div>
                    <div className="random-mode">
                        <div className="text-container">
                        <div className="bold-text">Random Quest Mode</div>
                        <div className="regular-text">Create a surprise adventure!</div>
                        </div>
                        <button className="mode-selection-button"></button>
                    </div>
                    {/* Customize distance */}
                    <div className="distance">
                        *Distance = 
                        <input 
                            type="text" 
                            className="input-box"
                            value={`${distance} mi`}
                            onChange={(e) => {
                                // Remove non-digit or decimal characters before updating
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
                                duration < 1 // If duration is less than 1 hour
                                    ? `${(duration * 60).toFixed(0)} mins` // If yes then show minutes
                                    : `${Math.floor(duration)} hr ${Math.floor((duration % 1) * 60)} mins` // If no then show hours + minutes
                            }
                            onChange={(e) => {
                                const input = e.target.value.toLowerCase();
                          
                                // Handle minutes input
                                if (input.includes('min')) {
                                  const mins = parseFloat(input.replace(/[^0-9.]/g, ''));
                                  if (!isNaN(mins) && mins >= 0 && mins <= 300) {
                                    setDuration(mins / 60);
                                  }
                                }
                                // Handle hours input
                                else if (input.includes('hr')) {
                                  const hours = parseFloat(input.replace(/[^0-9.]/g, ''));
                                  if (!isNaN(hours) && hours >= 0 && hours <= 5) {
                                    setDuration(hours);
                                  }
                                }
                                // Handle plain number input — assume minutes under 60, hours otherwise
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
                    />
                    <div className="end-location">End Location</div>
                    <input 
                        type="text" 
                        className="end-location-input-box focus:outline-none focus:shadow-none focus:ring-transparent"
                        placeholder="Use current location or enter an address" 
                    />
                    <div className="end-location">*Quest Description</div>
                    <textarea 
                        type="text" 
                        className="description-input-box focus:outline-none focus:shadow-none focus:ring-transparent"
                        placeholder="Description of your desired quest" 
                    />
                    </div>

                    
                <div className="right-container">
                </div>
            </div>
        </div>
    );
}

export default QuestGeneratorPage;