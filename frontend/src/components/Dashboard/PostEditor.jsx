import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FiSave, FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [post, setPost] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Uncategorized',
    tags: '',
    isPublished: false,
    featuredImage: null
  });

  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id]);

  const fetchPost = async (postId) => {
    try {
      const response = await api.get('/posts/user/my-posts');
      const foundPost = response.data.posts.find(p => p._id === postId);
      if (foundPost) {
        setPost(foundPost);
        setFormData({
          title: foundPost.title,
          content: foundPost.content,
          excerpt: foundPost.excerpt || '',
          category: foundPost.category,
          tags: foundPost.tags?.join(', ') || '',
          isPublished: foundPost.isPublished,
          featuredImage: foundPost.featuredImage
        });
      }
    } catch (error) {
      toast.error('Failed to fetch post');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleContentChange = (content) => {
    setFormData({
      ...formData,
      content
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append('featuredImage', file);

    setUploading(true);

    try {
      // You'll need to handle the image upload here
      // This is a placeholder - you'll need to implement the actual upload
      toast.info('Image upload functionality needs to be implemented');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setLoading(true);

    try {
      const postData = new FormData();
      postData.append('title', formData.title);
      postData.append('content', formData.content);
      postData.append('excerpt', formData.excerpt);
      postData.append('category', formData.category);
      postData.append('tags', formData.tags);
      postData.append('isPublished', formData.isPublished);

      if (formData.featuredImage instanceof File) {
        postData.append('featuredImage', formData.featuredImage);
      }

      let response;
      if (id) {
        response = await api.put(`/posts/${id}`, postData);
        toast.success('Post updated successfully');
      } else {
        response = await api.post('/posts', postData);
        toast.success('Post created successfully');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {id ? 'Edit Post' : 'Create New Post'}
        </h1>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary flex items-center"
        >
          <FiSave className="mr-2" />
          {loading ? 'Saving...' : 'Save Post'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Featured Image */}
        <div className="card">
          <h3 className="font-bold mb-4">Featured Image</h3>
          <div className="flex items-center space-x-4">
            {formData.featuredImage && (
              <div className="w-32 h-32">
                <img
                  src={typeof formData.featuredImage === 'string' 
                    ? formData.featuredImage 
                    : URL.createObjectURL(formData.featuredImage)}
                  alt="Featured"
                  className="w-full h-full object-cover rounded"
                />
              </div>
            )}
            <div>
              <label className="btn-secondary flex items-center cursor-pointer">
                <FiUpload className="mr-2" />
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Recommended size: 1200x630px
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="card">
          <h3 className="font-bold mb-4">Post Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter post title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Excerpt
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                className="input-field"
                rows="3"
                placeholder="Brief description of your post"
                maxLength="200"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.excerpt.length}/200 characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="Uncategorized">Uncategorized</option>
                  <option value="Technology">Technology</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Business">Business</option>
                  <option value="Education">Education</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="tag1, tag2, tag3"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Separate tags with commas
                </p>
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({
                    ...formData,
                    isPublished: e.target.checked
                  })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Publish this post
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="card">
          <h3 className="font-bold mb-4">Content *</h3>
          <ReactQuill
            value={formData.content}
            onChange={handleContentChange}
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
              ]
            }}
            theme="snow"
          />
        </div>
      </form>
    </div>
  );
};

export default PostEditor;