import { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { register_api } from '../../apiRoute';
import { useNavigate } from 'react-router-dom';
import './register.css';

const Register = () => {
  const [userData, setUserData] = useState({ username: "", password: "" ,email:""});
  const [error_msg,setErorMessage]=useState('')
  const [success_msg,setSuccessMessage]=useState("")

  const navigate=useNavigate()

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value, 
    }));
  };

 
  const handleLogin = async () => {
    if(userData.email && userData.username && userData.password){
    try {
      const response = await axios.post(register_api, userData);
      console.log(response,'response form backend')
      if(response.data.msg==="Register successful"){
        setSuccessMessage("Registered Successfully")
        setTimeout(() => {
            navigate("/login");
          }, 3000);
      }
      else{
        setErorMessage(response.data.msg)
      }
      console.log( response.data);
    } catch (error) {
      console.error("Register failed", error);
    }
    }
    else if (userData.username===""){
        alert("Enter Username")
    }
    else if(userData.email===""){
        alert("Enter email")
    }
    else if(userData.password===""){
        alert("Enter password")
    }
  };

  return (
    <Container className="custom-login-container custom-register-container">
      <div className="login-container register-container">
        <h1 className="login-text register-text">Register</h1>

        <FloatingLabel
          controlId="floatingInput"
          label="Username"
          className="mb-3 custom-input-styles-login custom-input-styles-register"
        >
          <Form.Control
            type="text"
            placeholder="Username"
            name="username"
            value={userData.username}
            required
            onChange={handleInput}
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="floatingEmail"
          label="email"
          className="custom-input-styles-login custom-input-styles-register"
          
        >
          <Form.Control
            type="email"
            placeholder="email"
            name="email"
            required
            value={userData.email}
            onChange={handleInput}
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="floatingPassword"
          label="Password"
          className="custom-input-styles-login custom-input-styles-register"
        >
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            required
            value={userData.password}
            onChange={handleInput}
          />
        </FloatingLabel>
        {error_msg && (
        <p className='error-message'>{error_msg}</p>
       )}


{success_msg && (
        <p className='text-primary'>{success_msg}</p>
       )}

        <Button 
          variant="primary" 
          className="custom-login-button-styles" 
          onClick={handleLogin}
        >
          Register
        </Button>
      </div>
    </Container>
  );
};

export default Register;
