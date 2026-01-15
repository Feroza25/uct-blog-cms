import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiFileText, 
  FiEdit, 
  FiPlus, 
  FiEye, 
  FiTrash2,
  FiGrid,
  FiLayers
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const Dashboard = () => {
  const [pages, setPages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [pagesRes, postsRes] = await Promise.all([
        api.get('/pages/my-pages'),
        api.get('/posts/user/my-posts')
      ]);
      
      setPages(pagesRes.data.pages);
      setPosts(postsRes.data.posts);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;

    try {
      await api.delete(`/pages/${id}`);
      setPages(pages.filter(page => page._id !== id));
      toast.success('Page deleted successfully');
    } catch (error) {
      toast.error('Failed to delete page');
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter(post => post._id !== id));
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="space-x-4">
          <Link to="/dashboard/page-builder" className="btn-primary flex items-center">
            <FiPlus className="mr-2" />
            Create Page
          </Link>
          <Link to="/dashboard/post-editor" className="btn-secondary flex items-center">
            <FiPlus className="mr-2" />
            Create Post
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiGrid className="text-blue-600 text-2xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Total Pages</h3>
              <p className="text-3xl font-bold">{pages.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FiFileText className="text-green-600 text-2xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Total Posts</h3>
              <p className="text-3xl font-bold">{posts.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiLayers className="text-purple-600 text-2xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Published</h3>
              <p className="text-3xl font-bold">
                {posts.filter(p => p.isPublished).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pages Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Your Pages</h2>
          <Link to="/dashboard/page-builder" className="text-blue-600 hover:text-blue-800 flex items-center">
            <FiPlus className="mr-1" />
            New Page
          </Link>
        </div>
        
        {pages.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No pages created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Title</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Created</th>
                  <th className="text-left py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr key={page._id} className="border-b hover:bg-gray-50">
                    <td className="py-3">{page.title}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        page.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {page.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3">
                      {new Date(page.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <Link
                          to={`/dashboard/page-builder?edit=${page._id}`}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <FiEdit />
                        </Link>
                        <Link
                          to={`/page/${page.slug}`}
                          target="_blank"
                          className="text-green-600 hover:text-green-800"
                          title="View"
                        >
                          <FiEye />
                        </Link>
                        <button
                          onClick={() => handleDeletePage(page._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Posts Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Your Blog Posts</h2>
          <Link to="/dashboard/post-editor" className="text-blue-600 hover:text-blue-800 flex items-center">
            <FiPlus className="mr-1" />
            New Post
          </Link>
        </div>
        
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No posts created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Title</th>
                  <th className="text-left py-3">Category</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Created</th>
                  <th className="text-left py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id} className="border-b hover:bg-gray-50">
                    <td className="py-3">{post.title}</td>
                    <td className="py-3">{post.category}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        post.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <Link
                          to={`/dashboard/post-editor/${post._id}`}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <FiEdit />
                        </Link>
                        <Link
                          to={`/blog/${post.slug}`}
                          target="_blank"
                          className="text-green-600 hover:text-green-800"
                          title="View"
                        >
                          <FiEye />
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;