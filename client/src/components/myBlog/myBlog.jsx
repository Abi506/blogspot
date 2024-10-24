import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Cookie from 'js-cookie';
import { my_blog_api, host } from '../../apiRoute';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './myBlog.css';

const MyBlog = () => {
    const [blogs, setBlogs] = useState([]); // Initialize blogs as an array

    useEffect(() => {
        const fetchBlogs = async () => {
            const token = Cookie.get('auth_token');
            console.log(token, 'token in MyBlog'); // Check the token here

            try {
                const response = await axios.get(my_blog_api, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response);
                console.log(response.data, 'response data');
                setBlogs(response.data);
            } catch (error) {
                console.log(error, 'error fetching blogs');
            }
        };

        fetchBlogs(); // Call the async function
    }, []);

    return (
        <Container>
            <h1>My Blog</h1>

            {blogs.length > 0 ? ( // Check if there are any blogs
                <ul className='list-of-blogs'>
                    {blogs.map((each) => (
                        <Link to={`/blog/${each._id}`} key={each._id} className='link-styles'>
                            <li className='list-card-container shadow'>
                                <img src={`${host}${each.photo}`} alt={each.title} className='card-image' />
                                <h1 className='card-heading'>{each.title}</h1>
                                <p className='card-author'>By {each.username}</p>
                            </li>
                        </Link>
                    ))}
                </ul>
            ) : (
                <p>You haven't uploaded any blogs.</p> // Message when no blogs are available
            )}
        </Container>
    );
};

export default MyBlog;
