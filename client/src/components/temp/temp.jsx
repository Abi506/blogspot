import React, { useState } from 'react';
import axios from 'axios';

const Temp = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('username', 'abinandhan'); 
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/temp', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.msg); 
    
      setTitle('');
      setContent('');
      setFile(null);
    } catch (error) {
      console.error("Error uploading post:", error);
      setMessage("Error uploading post"); 
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit">Create Post</button>
      </form>
      {message && <p>{message}</p>} 
    </div>
  );
};

export default Temp;
