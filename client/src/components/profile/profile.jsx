import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { profile_api, update_profile_api, update_profile_pic_api, host } from '../../apiRoute'; // Include API routes
import profile_pic from '../../assets/profile_pic.png';
import { Container } from 'react-bootstrap';
import './profile.css';

const Profile = () => {
    const [userDetails, setUserDetails] = useState(null); // State to store user details
    const [error, setError] = useState(null); // State to store any errors
    const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
    const [aboutMeText, setAboutMeText] = useState(''); // State to store about me input text
    const [profileImage, setProfileImage] = useState(null); // State to store the new profile image

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            const authToken = Cookie.get('auth_token'); // Retrieve auth_token from cookies

            if (!authToken) {
                setError('No authentication token found.');
                return;
            }

            try {
                const response = await axios.get(profile_api, {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // Include auth token in headers
                    },
                });
                console.log(response.data, 'response from backend');
                setUserDetails(response.data[0]); // Set user details in state
                setAboutMeText(response.data[0].aboutMe || ''); // Initialize aboutMeText
            } catch (err) {
                setError(err.response ? err.response.data.msg : 'Error fetching user data'); // Handle errors
            }
        };

        fetchUserData(); // Call the function to fetch user data
    }, []);

    // Handler for entering edit mode
    const handleEditClick = () => {
        setIsEditing(true); // Enable editing mode
    };

    // Handler for saving the updated "About Me" text
    const handleSaveClick = async () => {
        const authToken = Cookie.get('auth_token');

        if (!authToken) {
            setError('No authentication token found.');
            return;
        }

        try {
            const response = await axios.put(
                update_profile_api, // API route for updating profile
                { aboutMe: aboutMeText },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // Include auth token in headers
                    },
                }
            );
            console.log(response.data, 'response from updating profile');
            setUserDetails({ ...userDetails, aboutMe: aboutMeText }); // Update the aboutMe in the userDetails
            setIsEditing(false); // Exit editing mode
        } catch (err) {
            setError(err.response ? err.response.data.msg : 'Error updating user data');
        }
    };

    // Handler for canceling the edit
    const handleCancelClick = () => {
        setIsEditing(false); // Exit editing mode
        setAboutMeText(userDetails.aboutMe || ''); // Reset aboutMeText to original value
    };

    // Handler for selecting profile image
    const handleProfileImageChange = (e) => {
        setProfileImage(e.target.files[0]); // Set the selected image file
    };

    // Handler for uploading the profile image
    const handleProfileImageUpload = async () => {
        const authToken = Cookie.get('auth_token');

        if (!authToken) {
            setError('No authentication token found.');
            return;
        }

        const formData = new FormData();
        formData.append('profilePic', profileImage); // Append the selected image to form data

        try {
            const response = await axios.put(update_profile_pic_api, formData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'multipart/form-data', // Ensure the content type is multipart
                },
            });

            setUserDetails({ ...userDetails, profilePic: response.data.user.profilePic }); // Update the profile image in user details
            alert('Profile image updated successfully');
        } catch (err) {
            setError(err.response ? err.response.data.msg : 'Error updating profile image');
        }
    };

    // Render loading state, error, or user details
    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!userDetails) {
        return <div>Loading...</div>; // Show loading state while fetching data
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
                    {/* Profile image upload */}
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
