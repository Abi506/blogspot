import { Route, Routes } from 'react-router-dom';
import Login from './components/login/login';
import NavbarHeader from './components/navbar/navbar';
import Register from './components/register/register';
import Home from './components/home/home';
import Upload_blog from './components/upload_blog/upload_blog';
import ProtectedRoute from './protectedRoute.jsx'; // Import ProtectedRoute
import Temp from './components/temp/temp.jsx';
import Blog from './components/blog/blog.jsx';
import MyBlog from './components/myBlog/myBlog.jsx';
import Faq from './components/faq/faq.jsx';
import Contact from './components/contact/contact.jsx';
import NotFound from './components/notFound/notFound.jsx';
import Profile from './components/profile/profile.jsx';
import './App.css';

const App = () => {
  return (
    <>
      <NavbarHeader />
      <Routes>
        {/* Public Routes */}
        <Route
          exact
          path='/login'
          element={
            <ProtectedRoute isLoginPage>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path='/register'
          element={
            <ProtectedRoute isLoginPage>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route exact path='/temp' element={<Temp />} />
        
        {/* Protected Routes */}
        <Route
          exact
          path='/'
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path='/upload-blog'
          element={
            <ProtectedRoute>
              <Upload_blog />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path='/blog/:id'
          element={
            <ProtectedRoute>
              <Blog />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path='/my-blog'
          element={
            <ProtectedRoute>
              <MyBlog />
            </ProtectedRoute>
          }
        />
        <Route exact path='/faq' element={<ProtectedRoute><Faq/></ProtectedRoute>}/>
        <Route exact path='/contact' element={<ProtectedRoute><Contact/></ProtectedRoute>}/>
        <Route exact path='/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        
        {/* Not Found Route */}
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </>
  );
};

export default App;
