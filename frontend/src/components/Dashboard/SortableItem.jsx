import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiEdit2, FiTrash2, FiMove } from 'react-icons/fi';

const SortableItem = ({ component, updateComponent, removeComponent }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const renderComponent = () => {
    switch (component.type) {
      case 'text':
        return (
          <div>
            <h4 className="font-medium mb-2">Text Block</h4>
            <div
              contentEditable
              dangerouslySetInnerHTML={{ __html: component.content }}
              onBlur={(e) => updateComponent(component.id, { content: e.target.innerHTML })}
              className="min-h-[100px] border rounded p-3 bg-white"
            />
          </div>
        );
      
      case 'image':
        return (
          <div>
            <h4 className="font-medium mb-2">Image</h4>
            <div className="border rounded p-4 bg-gray-50 text-center">
              <input
                type="text"
                placeholder="Enter image URL"
                value={component.content}
                onChange={(e) => updateComponent(component.id, { content: e.target.value })}
                className="input-field mb-3"
              />
              {component.content && (
                <img 
                  src={component.content} 
                  alt="Preview" 
                  className="max-w-full h-auto rounded"
                />
              )}
            </div>
          </div>
        );
      
      case 'video':
        return (
          <div>
            <h4 className="font-medium mb-2">Video</h4>
            <div className="border rounded p-4 bg-gray-50">
              <input
                type="text"
                placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                value={component.content}
                onChange={(e) => updateComponent(component.id, { content: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        );
      
      default:
        return (
          <div>
            <h4 className="font-medium mb-2">Layout Section</h4>
            <div className="border-2 border-dashed border-gray-300 rounded p-8 bg-gray-50 text-center">
              <p className="text-gray-500">Layout Container</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-4 border rounded-lg bg-white p-4 shadow-sm"
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          <button
            {...attributes}
            {...listeners}
            className="text-gray-400 hover:text-gray-600 cursor-move"
            title="Drag to reorder"
          >
            <FiMove size={20} />
          </button>
          <span className="text-sm font-medium text-gray-600">
            {component.type.charAt(0).toUpperCase() + component.type.slice(1)}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => removeComponent(component.id)}
            className="text-red-500 hover:text-red-700"
            title="Remove component"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
      
      {renderComponent()}
    </div>
  );
};

export default SortableItem;