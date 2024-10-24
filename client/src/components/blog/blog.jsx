import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { blog_post_api, host } from '../../apiRoute';
import { Container } from 'react-bootstrap';
import Cookie from 'js-cookie'
import './blog.css';

const Blog = () => {
    const [blogData, setBlogData] = useState('');
    const params = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token=Cookie.get("auth_token")
                const id = params.id;
                const response = await axios.get(`${blog_post_api}/blog/${id}`,{
                    headers: {
                        Authorization: `Bearer ${token}` // Replace `yourAuthToken` with the actual token
                    }
                });
                console.log(response, 'response from backend');
                setBlogData(response.data.post[0]); // Assuming the blog data is in post[0]
            } catch (error) {
                console.log(error, error.message);
            }
        };
        fetchData();
    }, [params.id]);

    console.log(blogData);

    // Function to convert date to IST format
    const convertToIST = (dateString) => {
        const date = new Date(dateString);
        // Adjusting to IST and returning only the date part
        return date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
    };

    // Function to calculate how long ago the post was created
    const getTimeAgo = (dateString) => {
        const postDate = new Date(dateString);
        const now = new Date();
        const diffInMs = now - postDate; // Time difference in milliseconds
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // Convert to minutes
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        } else {
            return `${diffInDays} days ago`;
        }
    };

    // Function to render the content dynamically based on type
    const renderContent = () => {
        if (blogData.content) {
            return JSON.parse(blogData.content).map((item, index) => {
                switch (item.type) {
                    case 'paragraph':
                        return <p key={index} className='blog-para'><pre>{item.text}</pre></p>;
                    case 'subheading':
                        return <h2 key={index} className='blog-sub-heading'><pre className='blog-sub-heading'>{item.text}</pre></h2>;
                    default:
                        return null;
                }
            });
        }
        return null;
    };

    return (
        <Container className='blog-custom-container'>
            <h1 className='blog-title'>{blogData.title}</h1>
            <div className='d-flex flex-row justify-content'>
            </div>
            {blogData.photo && (
                <img src={`${host}${blogData.photo}`} alt={blogData.title} className='blog-photo' />
            )}
            <p className='blog-author'>By {blogData.username} - {convertToIST(blogData.createdAt)} ({getTimeAgo(blogData.createdAt)})</p>
            {/* Display the date in IST */}
            
            <h1 className='blog-title-2'>{blogData.title}</h1>
            <div className='blog-content'>
                {renderContent()}
            </div>
        </Container>
    );
};

export default Blog;
