import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import "./ProfilePage.css";
import Map from '../components/Map';

// icons ...
import { FiEdit3, FiChevronDown } from "react-icons/fi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { IoMdShare } from "react-icons/io";

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [userQuests, setUserQuests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questFilter, setQuestFilter] = useState("all");
  const [avatarFile, setAvatarFile] = useState(null);
  const [isEditingAvatar, setEditingAvatar] = useState(false);
  const fileInputRef = useRef(null);


  // notifications & friend reqs
  const [showRequests, setShowRequests] = useState(false);
  const [activeRequestTab, setActiveRequestTab] = useState("received");
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    bio: "",
  });

  // get token from localStorage (**store JWT token  here :)))))
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // api request helper
  const apiRequest = async (url, options = {}) => {
    const token = getToken();
    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(`http://localhost:5002${url}`, {
      ...defaultOptions,
      ...options,
      headers: { ...defaultOptions.headers, ...options.headers },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  };

  // load user profile
  const loadProfile = async () => {
    try {
      const [profileResponse, friendsResponse] = await Promise.all([
        apiRequest("/api/users/profile"),
        apiRequest("/api/users/friends"),
      ]);

      setUser(profileResponse.user);
      setUserInfo({
        username: profileResponse.user.username,
        email: profileResponse.user.email,
        bio: profileResponse.user.bio || "",
      });
      setFriends(friendsResponse.friends || []);
    } catch (error) {
      console.error("Failed to load profile: ", error);
    }
  };

  // load user quests w/ filtering
  const loadQuests = async (filter = "all") => {
    try {
      const response = await apiRequest(`/api/users/quests?filter=${filter}`);
      setUserQuests(response.quests || []);
    } catch (error) {
      console.error("Failed to load quests: ", error);
    }
  };

  // api loader function for fwendz :)
  const loadFriendRequests = async () => {
    try {
      const [receivedRes, sentRes] = await Promise.all([
        apiRequest("/api/friends/request/received"),
        apiRequest("/api/friends/request/sent"),
      ]);
      setReceivedRequests(receivedRes.requests || []);
      setSentRequests(sentRes.requests || []);
    } catch (error) {
      console.error("Failed to load friend requests, error: ", error);
    }
  };

  useEffect(() => {
    const initializeProfile = async () => {
      setLoading(true);
      try {
        await loadProfile();
        await loadQuests();
      } catch (error) {
        console.error("Initializing error: ", error);
      } finally {
        setLoading(false);
      }
    };

    initializeProfile();
  }, []);

  // handle filter change
  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setQuestFilter(newFilter);
    loadQuests(newFilter);
  };
  // search users
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await apiRequest(`/api/users/search?query=${query}`);
      setSearchResults(res.users || []);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
    }
  };

  // add new friend
  const addFriend = async (friendId) => {
    try {
      const res = await apiRequest("/api/users/friends/add", {
        method: "POST",
        body: JSON.stringify({ friendId }),
      });

      // synsc the new friends list
      setFriends(res.friends || []);
      alert("Added to friends!");
    } catch (error) {
      console.error("Failed to add friend:", error);
      alert("Failed to add friend");
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await apiRequest("/api/users/profile", {
        method: "PUT",
        body: JSON.stringify({
          username: userInfo.username,
          email: userInfo.email,
          bio: userInfo.bio,
        }),
      });
      //update user & userInfo state..
      setUser(response.user);
      setUserInfo({
        username: response.user.username,
        email: response.user.email,
        bio: response.user.bio || "",
      });
      localStorage.setItem("user", JSON.stringify(response.user));
      alert("Pofile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile: ", error);
      alert("Failed to save profile. Please try again.");
    }
  };

  const handleAvatarUpload = async (file = avatarFile) => {
    if (!file) {
      alert("Please select an image first");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const token = getToken();
      const response = await fetch("http://localhost:5002/api/users/avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log("Image uploaded successfully: ", result);

      //update user image in state..
      setUser((prev) => ({ ...prev, avatar: result.avatarUrl }));
      setAvatarFile(null);
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Failed to upload image: ", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  const encodeQuest = (data) => { // encode quest helper
    return btoa(
          JSON.stringify(data)
        )
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");
      };
  
  const handleShare = async (quest) => {
    const questData = {
        startLocation: quest.quest.startLocation,
        endLocation: quest.quest.endLocation,
        distance: quest.quest.distance,
        duration: quest.quest.duration,
        description: quest.quest.description,
        questGoal: quest.quest.questGoal,
        completed: true,
        sender: user?.username
      };
     
      const encoded = encodeQuest(questData);  //encode quest for link
    
      const share_data = {
        title: `Check out ${user?.username}'s Quest!`,
        text: `Check out ${user?.username}'s Quest!`,
        url:  `${window.location.origin}/sharedquest?data=${encoded}`
    };
    if (navigator.share) {
        try {
            await navigator.share(share_data);
            console.log("Quest shared!");
        } catch (error) {
            console.log("Quest share failed :(");
        }
    }
    else {
        try {
            await navigator.clipboard.writeText(share_data.url);
            console.log("Quest link copied to clipboard");
        } catch (error) {
            console.log("Failed to copy quest link :(");
        }
    }
}
  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-container">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
              color: "white",
              fontSize: "1.2rem",
            }}
          >
            Loading profile...
          </div>
        </div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-container">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
              color: "white",
              fontSize: "1.2rem",
            }}
          >
            Please log in to view your profile
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        {/* left sidebar */}
        <div className="left-sidebar">
          <div className="user-profile-section">
            <div className="profile-avatar">
              {user?.avatar ? (
                <img
                  src={`http://localhost:5002${user.avatar}`}
                  alt="Profile Avatar"
                  className="avatar-temp"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    fontSize: "0", // Remove any text styles
                  }}
                />
              ) : (
                <div className="avatar-temp">
                  {" "}
                  <CgProfile />{" "}
                </div>
              )}
              <div
                className="edit-icon"
                onClick={() => fileInputRef.current.click()}
              >
                {" "}
                <FiEdit3 />{" "}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  console.log(file);
                  setAvatarFile(file);
                  if (file) {
                    if (window.confirm("Confirm new profile picture?")) {
                      handleAvatarUpload(file);
                    }
                  }
                }}
              />
            </div>
            <div className="username-edit-box">
              <div className="username">{user?.username || "Loading..."}</div>
              <button
                className="edit-profile-btn"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>

          <div className="friends-section">
            <div className="friends-header">
              <span>Friends</span>
              <span
                className="notification-bell"
                onClick={() => {
                  setShowRequests((prev) => !prev);
                  if (!showRequests) {
                    loadFriendRequests();
                  }
                }}
              >
                {" "}
                <IoIosNotificationsOutline />{" "}
              </span>
            </div>
            {showRequests && (
              <div className="friend-requests-popup">
                {/* HEADER */}
                <div className="requests-header">
                  <h4>Friend Requests</h4>
                  <button
                    className="close-button"
                    onClick={() => setShowRequests(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="requests-tabs">
                  <span
                    className={activeRequestTab === "sent" ? "active" : ""}
                    onClick={() => setActiveRequestTab("sent")}
                  >
                    Sent(Search)
                  </span>
                  <span>|</span>
                  <span
                    className={activeRequestTab === "received" ? "active" : ""}
                    onClick={() => setActiveRequestTab("received")}
                  >
                    Received
                  </span>
                </div>
                {/* CONTENT */}
                <div className="requests-content">
                  {activeRequestTab === "received" && (
                    <>
                      {receivedRequests.length === 0 ? (
                        <div className="empty-state">No received requests</div>
                      ) : (
                        receivedRequests.map((req) => (
                          <div key={req._id} className="request-item">
                            <CgProfile />
                            <div className="request-info">
                              <div>{req.from.username}</div>
                              <small>Sent you a friend request</small>
                            </div>
                            <div className="request-actions">
                              <button
                                onClick={() => console.log("accept", req._id)}
                              >
                                ✔
                              </button>
                              <button
                                onClick={() => console.log("decline", req._id)}
                              >
                                ✖
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </>
                  )}

                  {/* Search friends */}
                  {activeRequestTab === "sent" && (
                    <>
                      {/* 🔍 Search Input */}
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSearchQuery(value);
                          searchUsers(value);
                        }}
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          marginBottom: "0.8rem",
                          fontFamily: "Kode Mono, monospace",
                        }}
                      />

                      {searchResults.map((user) => (
                        <div key={user._id} className="request-item">
                          <CgProfile />
                          <div className="request-info">
                            <div>{user.username}</div>
                          </div>

                          <div className="request-actions">
                            <button onClick={() => addFriend(user._id)}>
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
            {friends.map((friend) => (
              <div key={friend._id} className="friend-item">
                <div className="friend-avatar">
                  {" "}
                  <CgProfile />{" "}
                </div>
                <span>{friend.username}</span>
              </div>
            ))}
            {friends.length === 0 && (
              <div
                style={{
                  color: "white",
                  textAlign: "center",
                  marginTop: "1rem",
                }}
              >
                No friends yet
              </div>
            )}
          </div>
        </div>

        {/* right side */}
        <div className="main-content">
          <div className="quests-header">
            <h2>{isEditing ? "User Info" : "My Quests"}</h2>
            {!isEditing && (
              <select
                className="time-filter"
                value={questFilter}
                onChange={handleFilterChange}
              >
                <option value="all">All Quests</option>
                <option value="week">Past 7 Days</option>
                <option value="month">Past Month</option>
                <option value="favorites">Favorites</option>
              </select>
            )}
          </div>

          {isEditing ? (
            <div className="edit-profile-container">
              <div className="edit-form">
                <div className="form-group">
                  <label>Username: </label>
                  <input
                    type="text"
                    value={userInfo.username}
                    placeholder="User123"
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, username: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Password:</label>
                  <input type="password" value="************" readOnly />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={userInfo.email}
                    placeholder="user1@gmail.com"
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, email: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <input
                    value={userInfo.bio}
                    placeholder="Describe yourself"
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, bio: e.target.value })
                    }
                  />
                </div>
                <button
                  className="back-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Back
                </button>
                <button
                  className="back-btn"
                  style={{ backgroundColor: "#0B556C" }}
                  onClick={handleSaveProfile}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="quest-grid">
              {userQuests.length > 0 ? (
                userQuests.map((userQuest) => (
                  <div key={userQuest._id} className="quest-card">
                    <div className="quest-map">
                      <Map
                        width="150px"
                        height="100px"
                        startLocation={userQuest.startLocation}
                        endLocation={userQuest.endLocation}
                        showRoute={true}
                    />
                    </div>  
                    <div className="quest-info">
                      <div>
                        Completed:{" "}
                        {new Date(userQuest.completedAt).toLocaleDateString()}
                      </div>
                      <div>Distance: {userQuest.quest?.distance || "N/A"}</div>
                      <button className="share-quest-btn" onClick={() =>handleShare(userQuest)}>
                        Share Quest <IoMdShare />{" "}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    color: "white",
                    textAlign: "center",
                    marginTop: "2rem",
                    fontSize: "1.2rem",
                  }}
                >
                  No quests yet! Go explore :)
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
