import { useState, useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { blog_post_api, host } from '../../apiRoute';
import { IoSearch } from "react-icons/io5";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookie from 'js-cookie';
import './home.css';

const Home = () => {
  const [blogs, setBlogs] = useState([]); // Initialize blogs as an array
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [loading, setLoading] = useState(false); // To handle loading state
  const [noResults, setNoResults] = useState(false); // To handle no results state
  const [sortType, setSortType] = useState(''); // State to store the selected sort type

  const userSearch = useRef();

  useEffect(() => {
    const token = Cookie.get('auth_token');
    
    const fetchBlogs = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(blog_post_api, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBlogs(response.data);
        setNoResults(response.data.length === 0); // Check if there are no blogs
      } catch (error) {
        console.log(error, 'error');
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchBlogs(); // Fetch blogs initially when the component mounts
  }, []);

  const handleSearch = async () => {
    const token = Cookie.get('auth_token');
    const searchValue = userSearch.current.value; // Get the search input value

    setLoading(true); // Start loading
    try {
      const response = await axios.get(`${blog_post_api}?search=${searchValue}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlogs(response.data); // Update blogs with the search results
      setNoResults(response.data.length === 0); // Set no results if no blogs found
    } catch (error) {
      console.log(error, 'error during search');
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleSort = (sortOption) => {
    setSortType(sortOption);
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
    
    setBlogs(sortedBlogs); // Update the sorted blogs
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

        {/* Sort Options Dropdown */}
        <select onChange={(e) => handleSort(e.target.value)} className="sort-input">
          <option value="">Sort By</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="date">Date</option>
        </select>
      </div>

      {loading ? (
        <p>Loading blogs...</p> // Loading message
      ) : noResults ? (
        <p className='user-search-not-found'>No blogs found for "{userSearch.current.value}"</p> // No blogs found message
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
