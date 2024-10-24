import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { useState, useEffect } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Cookie from 'js-cookie';
import { NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import profile_pic from '../../assets/profile_pic.png';
import axios from 'axios';
import { profile_api, host } from '../../apiRoute';
import './navbar.css';

function NavbarHeader() {
    const token = Cookie.get("auth_token");
    const [profileData, setProfileData] = useState(null); 
    const navigate = useNavigate(); 

    useEffect(() => {
        if (token) {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(profile_api, {
                        headers: {
                            Authorization: `Bearer ${token}`, 
                        },
                    });
                    console.log(response,'response from backedn 12212')
                    if (response.data[0]?.profilePic) {
                        setProfileData(response.data[0]);
                    } else {
                        setProfileData({ profilePic: "" }); 
                    }
                } catch (err) {
                    console.error("Error fetching profile data:", err);
                }
            };

            fetchUserData(); 
        }
    }, [token]);

    const handleLogout = () => {
        Cookie.remove("auth_token");
        navigate('/login'); 
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary nav-custom-container">
            <Container>
                <Navbar.Brand href="/" className='nav-logo-text'>BlogSpot</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="m-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href='/upload-blog'>Upload Blog</Nav.Link>
                        <Nav.Link href='/my-blog'>My Blogs</Nav.Link>

                        <NavDropdown title="Contact" id="contact-dropdown">
                            <NavDropdown.Item href="/contact">Contact Us</NavDropdown.Item>
                            <NavDropdown.Item href="/faq">FAQs</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        {token ? (
                            <>
                                <Nav.Link href='/profile'>
                                    <img 
                                        src={profileData?.profilePic ? `${host}${profileData.profilePic}` : profile_pic} 
                                        className='navbar-profile-image' 
                                        alt="Profile" 
                                    />
                                </Nav.Link>
                                <Nav.Link onClick={handleLogout}>Logout</Nav.Link> 
                            </>
                        ) : (
                            <>
                                <Nav.Link href='/login'>Login</Nav.Link>
                                <Nav.Link href='/register'>Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarHeader;
