import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

const Home = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPage();
  }, [slug]);

  const fetchPage = async () => {
    try {
      const pageSlug = slug || 'home';
      const response = await api.get(`/pages/${pageSlug}`);
      setPage(response.data.page);
    } catch (error) {
      console.log('Page not found, showing default');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderComponent = (component) => {
    switch (component.type) {
      case 'text':
        return (
          <div 
            dangerouslySetInnerHTML={{ __html: component.content }}
            className="prose max-w-none"
          />
        );
      
      case 'image':
        return component.content ? (
          <img 
            src={component.content} 
            alt="" 
            className="max-w-full h-auto rounded-lg shadow-md"
          />
        ) : null;
      
      case 'video':
        return component.content ? (
          <div className="relative pb-[56.25%] h-0">
            <iframe
              src={component.content}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              allowFullScreen
              title="Video"
            />
          </div>
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {page ? (
        <>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
            <p className="text-gray-600">
              Last updated: {new Date(page.updatedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8">
            {page.components && page.components.map((component, index) => (
              <div key={index} className="animate-fade-in">
                {renderComponent(component)}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to BlogCMS</h1>
          <p className="text-xl text-gray-600 mb-8">
            Create amazing content with our drag-and-drop page builder
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-xl font-bold mb-3">Easy Page Building</h3>
                <p>Drag and drop components to create beautiful pages without coding.</p>
              </div>
              <div className="card">
                <h3 className="text-xl font-bold mb-3">Blog Management</h3>
                <p>Write and publish blog posts with our rich text editor.</p>
              </div>
              <div className="card">
                <h3 className="text-xl font-bold mb-3">Responsive Design</h3>
                <p>Your pages will look great on all devices.</p>
              </div>
              <div className="card">
                <h3 className="text-xl font-bold mb-3">Secure & Reliable</h3>
                <p>Built with modern security practices and reliable hosting.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;