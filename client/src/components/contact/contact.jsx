import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import Cookie from 'js-cookie'
import './contact.css';
import { contact_api } from '../../apiRoute';

const Contact = () => {
  // State to handle form data
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    message: '',
  });

  // State for success or error messages
  const [responseMessage, setResponseMessage] = useState('');

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token=Cookie.get("auth_token")
    try {
      const response = await axios.post(contact_api,
        {
          username: userData.username,
          email: userData.email,
          message: userData.message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Replace with actual token
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response,'response')
      // Handle successful response
      if (response.status === 200) {
        setResponseMessage('Message sent successfully!');
        // Optionally reset form fields
        setUserData({
          username: '',
          email: '',
          message: '',
        });

        setTimeout(()=>{
            setResponseMessage("")
        },2000)
      }
    } catch (error) {
      setResponseMessage('Error sending message. Please try again.');
    }
  };

  return (
    <Container className="contact-container">
      <Row>
        <Col md={12} className="contact-information-column">
          <div>
            <h2>Contact Information</h2>
            <p>
              <strong>Email:</strong> abinandhan506@gmail.com
            </p>
            <p>
              <strong>Phone:</strong> 9360373897
            </p>
            <p>
              <strong>Address:</strong> 1/324A L.S Mahal Near Athipatti, Aruppukottai - 626101
            </p>
          </div>
          <div>
            <h2>Find Us Here</h2>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d491.8909087585489!2d78.12647738789207!3d9.49765850000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sathipatti%20cooperative%20bank!5e0!3m2!1sen!2sin!4v1729739280887!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </Col>
        <Col md={12} className="contact-form-container mt-5">
          <div>
            <h2>Get in Touch</h2>
            <Form className="contact-form" onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicName" className="mb-4">
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Enter your name"
                  value={userData.username}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicEmail" className="mb-4">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={userData.email}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicMessage" className="mb-4">
                <Form.Control
                  as="textarea"
                  name="message"
                  rows={4}
                  placeholder="Your message"
                  value={userData.message}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              {responseMessage && (<p style={{color:"green"}}>{responseMessage}</p>)}
              <Button variant="primary" type="submit" className="mb-4">
                Send Message
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
