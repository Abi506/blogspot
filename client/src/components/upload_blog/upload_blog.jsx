import { useState } from "react";
import axios from "axios";
import { blog_post_api } from "../../apiRoute";
import Cookie from 'js-cookie'
import { useNavigate } from "react-router-dom";
import "./upload_blog.css";

const UploadBlog = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState([]); 
    const [file, setFile] = useState(null); 
    const navigate=useNavigate()

    const handleAddContent = (type) => {
        if (type === "paragraph") {
            setContent([...content, { type: "paragraph", text: "" }]);
        } else if (type === "subheading") {
            setContent([...content, { type: "subheading", text: "" }]);
        }
    };

    const handleFileChange = (file) => {
        setFile(file); 
    };

    const handleTextChange = (index, text) => {
        const updatedContent = [...content];
        updatedContent[index].text = text;
        setContent(updatedContent);
    };

    const handleDeleteContent = (index) => {
        const updatedContent = content.filter((_, i) => i !== index);
        setContent(updatedContent);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        const token=Cookie.get("auth_token")
        
        // Fixed spelling mistake from 'titile' to 'title'
        formData.append('title', title);
        // Stringify content array before sending
        formData.append('content', JSON.stringify(content));
        formData.append('file', file);
        const titleValue = formData.get('title');
    const fileValue = formData.get('file');
    const contentValue = formData.get('content');
    console.log(fileValue,'file value........')
    if (!titleValue) {
        alert("Enter the title before publishing");
        return; // Stop further execution
    }
    if (!fileValue) {  // Updated check for file existence
        alert("Upload the blog image before publishing");
        return; // Stop further execution
    }
    if (!contentValue || contentValue === "[]") {
        alert("Write the content of your blog before uploading");
        return; // Stop further execution
    }
        
        try {
            const response = await axios.post(blog_post_api, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization':`Bearer ${token}`
                }
            });
            console.log(response, 'response from backend');
            navigate(`/blog/${response.data._id}`)
        } catch (err) {
            console.error("Error uploading post", err);
        }
    
    };

    return (
        <div className="upload-blog-container">
            <h1 className="blog-heading">Write Your Blog</h1>
            <br />
            <form className="upload-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    className="title-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <div className="single-image-upload">
                    <input
                        type="file"
                        onChange={(e) => handleFileChange(e.target.files[0])}
                        className="input-image"
                        accept="image/*"
                        required
                    />
                    {file && (
                        <img
                            src={URL.createObjectURL(file)}
                            alt="Upload Preview"
                            className="writeImg"
                        />
                    )}
                </div>
                <div className="contentList">
                    {content.map((item, index) => (
                        <div key={index} className="content-item">
                            <textarea
                                placeholder={
                                    item.type === "paragraph"
                                        ? "Enter your paragraph"
                                        : "Enter a subheading"
                                }
                                value={item.text}
                                onChange={(e) => handleTextChange(index, e.target.value)}
                                className="textarea-input"
                            ></textarea>
                            <button type="button" onClick={() => handleDeleteContent(index)}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
                <div className="addContentOptions">
                    <button type="button" onClick={() => handleAddContent("subheading")} className="bg bg-primary text-white add-buttons">
                        Add Subheading
                    </button>
                    <button type="button" onClick={() => handleAddContent("paragraph")} className="bg bg-warning text-white add-buttons">
                        Add Paragraph
                    </button>
                </div>
                <button type="submit" className="bg bg-secondary text-white">
                    Publish
                </button>
            </form>
        </div>
    );
};

export default UploadBlog;
