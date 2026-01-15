import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Blog from './pages/Blog';

// Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PageBuilder from './components/Dashboard/PageBuilder';
import PostEditor from './components/Dashboard/PostEditor';

function App() {
  const isAuthenticated = localStorage.getItem('token');

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/page/:slug" element={<Home />} />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/dashboard/page-builder" 
              element={isAuthenticated ? <PageBuilder /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/dashboard/post-editor" 
              element={isAuthenticated ? <PostEditor /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/dashboard/post-editor/:id" 
              element={isAuthenticated ? <PostEditor /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;