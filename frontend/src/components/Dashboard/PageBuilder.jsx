import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { FiType, FiImage, FiVideo, FiLayout, FiSave } from 'react-icons/fi';
import api from '../../utils/api';
import SortableItem from './SortableItem';

const PageBuilder = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [components, setComponents] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const pageId = searchParams.get('edit');

  useEffect(() => {
    if (pageId) {
      fetchPage(pageId);
    }
  }, [pageId]);

  const fetchPage = async (id) => {
    try {
      const response = await api.get(`/pages/my-pages`);
      const page = response.data.pages.find(p => p._id === id);
      if (page) {
        setPage(page);
        setTitle(page.title);
        setSlug(page.slug);
        setComponents(page.components || []);
        setIsPublished(page.isPublished);
      }
    } catch (error) {
      toast.error('Failed to fetch page');
    }
  };

  const availableComponents = [
    { id: 'text', type: 'text', name: 'Text Block', icon: <FiType />, content: '' },
    { id: 'image', type: 'image', name: 'Image', icon: <FiImage />, content: '' },
    { id: 'video', type: 'video', name: 'Video', icon: <FiVideo />, content: '' },
    { id: 'layout', type: 'layout', name: 'Layout', icon: <FiLayout />, content: '' }
  ];

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  const addComponent = (type) => {
    const newComponent = {
      id: `comp-${Date.now()}`,
      type,
      content: '',
      position: { x: 0, y: components.length * 100 },
      size: { width: '100%', height: 'auto' },
      styles: {}
    };

    if (type === 'text') {
      newComponent.content = '<p>Enter your text here...</p>';
    }

    setComponents([...components, newComponent]);
  };

  const updateComponent = (id, updates) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    ));
  };

  const removeComponent = (id) => {
    setComponents(components.filter(comp => comp.id !== id));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a page title');
      return;
    }

    setLoading(true);

    try {
      const pageData = {
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        components,
        isPublished
      };

      let response;
      if (pageId) {
        response = await api.put(`/pages/${pageId}`, pageData);
        toast.success('Page updated successfully');
      } else {
        response = await api.post('/pages', pageData);
        toast.success('Page created successfully');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save page');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {pageId ? 'Edit Page' : 'Create New Page'}
        </h1>
        <div className="space-x-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn-primary flex items-center"
          >
            <FiSave className="mr-2" />
            {loading ? 'Saving...' : 'Save Page'}
          </button>
        </div>
      </div>

      {/* Page Settings */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Page Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Enter page title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="input-field"
              placeholder="url-slug"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">
              Publish this page
            </span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Available Components */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="font-bold mb-4">Components</h3>
            <div className="space-y-2">
              {availableComponents.map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => addComponent(comp.type)}
                  className="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors draggable-item"
                >
                  <span className="mr-3">{comp.icon}</span>
                  <span>{comp.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Page Builder Canvas */}
        <div className="lg:col-span-3">
          <div className="card">
            <h3 className="font-bold mb-4">Page Builder</h3>
            
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="droppable-area min-h-[500px] p-4">
                {components.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p className="mb-4">Drag components here or click on components to add them</p>
                    <p>Start building your page!</p>
                  </div>
                ) : (
                  <SortableContext
                    items={components.map(c => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {components.map((component) => (
                      <SortableItem
                        key={component.id}
                        component={component}
                        updateComponent={updateComponent}
                        removeComponent={removeComponent}
                      />
                    ))}
                  </SortableContext>
                )}
              </div>

              <DragOverlay>
                {activeId ? (
                  <div className="bg-white border border-blue-300 rounded-lg shadow-lg p-4">
                    {availableComponents.find(c => c.id === activeId)?.name}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageBuilder;