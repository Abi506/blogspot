import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { profile_api, update_profile_api, update_profile_pic_api, host } from '../../apiRoute';
import profile_pic from '../../assets/profile_pic.png';
import { Container } from 'react-bootstrap';
import './profile.css';

const Profile = () => {
    const [userDetails, setUserDetails] = useState(null); 
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false); 
    const [aboutMeText, setAboutMeText] = useState(''); 
    const [profileImage, setProfileImage] = useState(null); 


    useEffect(() => {
        const fetchUserData = async () => {
            const authToken = Cookie.get('auth_token'); 

            if (!authToken) {
                setError('No authentication token found.');
                return;
            }

            try {
                const response = await axios.get(profile_api, {
                    headers: {
                        Authorization: `Bearer ${authToken}`, 
                    },
                });
                console.log(response.data, 'response from backend');
                setUserDetails(response.data[0]); 
                setAboutMeText(response.data[0].aboutMe || ''); 
            } catch (err) {
                setError(err.response ? err.response.data.msg : 'Error fetching user data'); 
            }
        };

        fetchUserData(); 
    }, []);


    const handleEditClick = () => {
        setIsEditing(true); 
    };


    const handleSaveClick = async () => {
        const authToken = Cookie.get('auth_token');

        if (!authToken) {
            setError('No authentication token found.');
            return;
        }

        try {
            const response = await axios.put(
                update_profile_api,
                { aboutMe: aboutMeText },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`, 
                    },
                }
            );
            console.log(response.data, 'response from updating profile');
            setUserDetails({ ...userDetails, aboutMe: aboutMeText }); 
            setIsEditing(false); 
        } catch (err) {
            setError(err.response ? err.response.data.msg : 'Error updating user data');
        }
    };

    
    const handleCancelClick = () => {
        setIsEditing(false); 
        setAboutMeText(userDetails.aboutMe || ''); 
    };

   
    const handleProfileImageChange = (e) => {
        setProfileImage(e.target.files[0]); 
    };

 
    const handleProfileImageUpload = async () => {
        const authToken = Cookie.get('auth_token');

        if (!authToken) {
            setError('No authentication token found.');
            return;
        }

        const formData = new FormData();
        formData.append('profilePic', profileImage); 

        try {
            const response = await axios.put(update_profile_pic_api, formData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'multipart/form-data', 
                },
            });

            setUserDetails({ ...userDetails, profilePic: response.data.user.profilePic }); 
            alert('Profile image updated successfully');
        } catch (err) {
            setError(err.response ? err.response.data.msg : 'Error updating profile image');
        }
    };


    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!userDetails) {
        return <div>Loading...</div>; 
    }

    return (
        <Container className="profile-container">
            <div className="profile-details">
                <div className="profile-details-header">
                    <div className='d-flex'>
                    {userDetails.profilePic ? (
                        <img src={`${host}${userDetails.profilePic}`} className="user-profile" alt="Profile" />
                    ) : (
                        <img src={profile_pic} alt="Profile" className="user-profile" />
                    )}
                    <h2>{userDetails.username.toUpperCase()}</h2>
                
                    </div>
                    <div className='d-flex flex-column'>
                    <div className="upload-profile-pic">
                        <input type="file" onChange={handleProfileImageChange} accept="image/*" />
                        <button onClick={handleProfileImageUpload} className="upload-button">
                            Upload Profile Image
                        </button>
                    </div>
                    </div>              

                <div className="about-me-section ">
                    <h3 className='about-me-heading'>About Me</h3>
                    {isEditing ? (
                        <div className="edit-about-me">
                            <textarea
                                value={aboutMeText}
                                onChange={(e) => setAboutMeText(e.target.value)}
                                rows="4"
                                className="about-me-input"
                            />
                            <div className="edit-buttons">
                                <button onClick={handleSaveClick} className="save-button">
                                    Save
                                </button>
                                <button onClick={handleCancelClick} className="cancel-button">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="about-me-view">
                            <p className="about-me-para">{userDetails.aboutMe || 'No description available.'}</p>
                            <button onClick={handleEditClick} className="edit-button">
                                Edit About Me
                            </button>
                        </div>
                        
                    )}
                    </div>
                    <div>
                        <h1 className='about-me-heading'>User Info</h1>
                        <li className='d-flex'>
                        <p><strong>username:</strong>{userDetails.username}</p>
                        </li>
                        <li className='d-flex'>
                        <p><strong>email:</strong>{userDetails.email}</p>
                        </li>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default Profile;
