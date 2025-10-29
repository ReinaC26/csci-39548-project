import React, {useState} from 'react';
import Navbar from './Navbar';
import './ProfilePage.css';


// icons ... 
import { FiEdit3, FiChevronDown } from "react-icons/fi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { IoMdShare } from "react-icons/io";



function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState({
        username: 'someuser123',
        email: 'user123@gmail.com',
        bio: 'Woooo Quests!!!!!'
    });
    return (
        <div className='profile-page'>
            <Navbar />
            <div className='profile-container'>
                {/* left sidebar */}
                <div className='left-sidebar'>

                    <div className='user-profile-section'>
                        <div className='profile-avatar'>
                            <div className='avatar-temp'> <CgProfile /> </div>
                            <div className='edit-icon'> <FiEdit3 /> </div>
                        </div>
                        <div className='username-edit-box'>
                            <div className='username'>someusername1234</div>
                            <button 
                                className='edit-profile-btn'
                                onClick={() => setIsEditing(! isEditing )}
                            >
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>
                    </div>

                    <div className='friends-section'>
                        <div className='friends-header'>
                            <span>Friends</span>
                            <span className='notification-bell'> <IoIosNotificationsOutline /> </span>
                        </div>
                        <div className='friend-item'>
                            <div className='friend-avatar'> <CgProfile /> </div>
                            <span>user1</span>
                        </div>
                        <div className='friend-item'>
                            <div className='friend-avatar'> <CgProfile /> </div>
                            <span>user2</span>
                        </div>
                    </div>
                </div>

                {/* right side */}
                <div className='main-content'>
                    <div className='quests-header'>
                        <h2>{isEditing ? 'User Info' : 'My Quests'}</h2>
                        { ! isEditing && (
                            <select className='time-filter'>
                                <option>Past 7 Days</option>
                                <option>Past Month</option>
                                <option>All Quests</option>
                            </select>
                        )}
                    </div>

                    {isEditing ? (
                        <div className='edit-profile-container'>
                            <div className='edit-form'>
                                <div className='form-group'>
                                    <label>Username: </label>
                                    <input 
                                        type='text'
                                        value={userInfo.username}
                                        placeholder='User123'
                                        onChange={(e) => setUserInfo({...userInfo, username: e.target.value})}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>Password:</label>
                                    <input
                                        type='password'
                                        value='************'
                                        readOnly
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>Email</label>
                                    <input 
                                        type="email" 
                                        value={userInfo.email}
                                        placeholder="user1@gmail.com"
                                        onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>Bio</label>
                                    <input 
                                        value={userInfo.bio}
                                        placeholder="Describe yourself"
                                        onChange={(e) => setUserInfo({...userInfo, bio: e.target.value})}
                                    />
                                </div>
                                <button className='back-btn' onClick={() => setIsEditing(false)}>
                                    Back
                                </button>
                            </div>
                        </div>

                    ) : ( 

                    <div className='quest-grid'>
                    {/* Quest Card 1 */}
                    <div className='quest-card'>
                        <div className='quest-map'>
                            <div className='map-temp'>map</div>
                        </div>
                        <div className='quest-info'>
                            <div>Completed: 2 days ago</div>
                            <div>Distance: 3 miles</div>
                            <button className='share-quest-btn'>Share Quest <IoMdShare /> </button>
                        </div>
                    </div>

                    <div className='quest-card'>
                        <div className='quest-map'>
                            <div className='map-temp'>map</div>
                        </div>
                        <div className='quest-info'>
                            <div>Completed: 2 days ago</div>
                            <div>Distance: 3 miles</div>
                            <button className='share-quest-btn'>Share Quest <IoMdShare /> </button>
                        </div>
                    </div>
                </div>

                    )}

                </div>
            </div>
        </div>
    )
}

export default ProfilePage;