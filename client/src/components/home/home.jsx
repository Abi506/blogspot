import { useState, useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { blog_post_api, host } from '../../apiRoute';
import { IoSearch } from "react-icons/io5";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookie from 'js-cookie';
import './home.css';

const Home = () => {
  const [blogs, setBlogs] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const [noResults, setNoResults] = useState(false); 
  const userSearch = useRef();

  useEffect(() => {
    const token = Cookie.get('auth_token');
    
    const fetchBlogs = async () => {
      setLoading(true); 
      try {
        const response = await axios.get(blog_post_api, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBlogs(response.data);
        setNoResults(response.data.length === 0); 
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchBlogs(); 
  }, []);

  const handleSearch = async () => {
    const token = Cookie.get('auth_token');
    const searchValue = userSearch.current.value; 

    setLoading(true); 
    try {
      const response = await axios.get(`${blog_post_api}?search=${searchValue}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlogs(response.data);
      setNoResults(response.data.length === 0); 
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setLoading(false); 
    }
  };

  const handleSort = (sortOption) => {
    let sortedBlogs = [...blogs];

    switch (sortOption) {
      case 'title':
        sortedBlogs.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'author':
        sortedBlogs.sort((a, b) => a.username.localeCompare(b.username));
        break;
      case 'date':
        sortedBlogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }
    
    setBlogs(sortedBlogs); 
  };

  return (
    <Container className="custom-home-container">
      <div className="home-logo-text-container">
        <h1 className="home-logo-text">BlogSpot</h1>
      </div>

      <div className='filter-container'>
        <input
          type='search'
          ref={userSearch}
          placeholder='Search blogs'
          className='search-input'
        />
        <button onClick={handleSearch} className='search-button'>
          <IoSearch className='search-icon' />
        </button>

        <select onChange={(e) => handleSort(e.target.value)} className="sort-input">
          <option value="">Sort By</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="date">Date</option>
        </select>
      </div>

      {loading ? (
        <p>Loading blogs...</p>
      ) : noResults ? (
        <p className='user-search-not-found'>No blogs found for "{userSearch.current.value}"</p>
      ) : (
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
      )}
    </Container>
  );
};

export default Home;
