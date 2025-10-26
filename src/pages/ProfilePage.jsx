import React from 'react';
import Navbar from './Navbar';
import './ProfilePage.css';


function ProfilePage() {
    return (
        <div className='profile-page'>
            <Navbar />
            <div className='profile-container'>
                {/* left sidebar */}
                <div className='left-sidebar'>

                    <div className='user-profile-section'>
                        <div className='profile-avatar'>
                            <div className='avatar-temp'> image </div>
                            <div className='edit-icon'> ✎ </div>
                        </div>
                        <div className='username'>someusername1234</div>
                        <button className='edit-profile-btn'>Edit Profile</button>
                    </div>


                    <div className='friends-section'>
                        <div className='friends-header'>
                            <span>Friends</span>
                            <span className='notification-bell'> bell icon </span>
                        </div>
                        <div className='friend-item'>
                            <div className='friend-avatar'> i </div>
                            <span>user1</span>
                        </div>
                    </div>
                </div>

                {/* right side */}
                <div className='main-content'>
                    <div className='quests-header'>
                        <h2>My Quests</h2>
                        <select className='time-filter'>
                            <option>Past 7 Days</option>
                            <option>Past Month</option>
                            <option>All Quests</option>
                        </select>
                    </div>

                    <div className='quest-grid'>
                        {/* Quest Card 1 */}
                        <div className='quest-card'>
                            <div className='quest-map'>
                                <div className='map-temp'>map</div>
                            </div>
                            <div className='quest-info'>
                                <div>Completed: 2 days ago</div>
                                <div>Distance: 3 miles</div>
                                <button className='share-quest-btn'>Share Quest</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;