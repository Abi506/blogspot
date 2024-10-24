import { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { login_api } from '../../apiRoute';
import { useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie'
import './login.css';

const Login = () => {
  const [userData, setUserData] = useState({ username: "", password: "" });
  const [error_msg,setErorMessage]=useState("")
  const navigate=useNavigate()

  // Handle input change
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value, // Update specific field (username or password)
    }));
  };

  // Handle login action
  const handleLogin = async () => {
    if(userData.password && userData.username){
    try {
      // Make an axios POST request to login
      console.log(login_api)
      const response = await axios.post(login_api, userData);
      if(response.data.msg==="Login successful"){
        Cookie.set("auth_token", response.data.token, { expires: 1 / 24 }); 
        navigate('/')
      }
      else{
        setErorMessage(response.data.msg)
      }
      console.log("Login successful", response.data);
    } catch (error) {
        
      console.error("Login failed", error);
    }
   }
   else if (userData.username===""){
    alert("Enter username")
   }
   else if(userData.password===""){
    alert("Enter password")
   }
  };

  return (
    <Container className="custom-login-container">
      <div className="login-container">
        <h1 className="login-text">Login</h1>

        <FloatingLabel
          controlId="floatingInput"
          label="Username"
          className="mb-3 custom-input-styles-login"
          required 
        >
          <Form.Control
            type="text"
            placeholder="Username"
            name="username"
            value={userData.username}
            onChange={handleInput}
            required 
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="floatingPassword"
          label="Password"
          className="custom-input-styles-login"
          required 
        >
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={userData.password}
            onChange={handleInput}
            required 
          />
        </FloatingLabel>
        {error_msg &&(
        <p className='error-message'>{error_msg}</p>
         )}
        <Button 
          variant="danger" 
          className="custom-login-button-styles" 
          onClick={handleLogin}
        >
          Login
        </Button>
      </div>
    </Container>
  );
};

export default Login;
