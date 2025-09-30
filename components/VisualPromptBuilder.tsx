import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PromptComponent, PromptComponentType } from '../types';
import { UserIcon, TargetIcon, InfoIcon, LockIcon, TextBoxIcon, TrashIcon, MoveIcon } from './icons';

interface VisualPromptBuilderProps {
  components: PromptComponent[];
  onComponentsChange: (newComponents: PromptComponent[]) => void;
  t: (key: string) => string;
}

const COMPONENT_MAP: Record<PromptComponentType, { labelKey: string; icon: React.FC<any> }> = {
  role: { labelKey: 'component_type_role', icon: UserIcon },
  task: { labelKey: 'component_type_task', icon: TargetIcon },
  context: { labelKey: 'component_type_context', icon: InfoIcon },
  constraints: { labelKey: 'component_type_constraints', icon: LockIcon },
  text: { labelKey: 'component_type_text', icon: TextBoxIcon },
};

const PaletteItem: React.FC<{ type: PromptComponentType; t: (key: string) => string }> = ({ type, t }) => {
  const { labelKey, icon: Icon } = COMPONENT_MAP[type];

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('componentType', type);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex items-center gap-3 p-2.5 bg-card-secondary border border-border-color rounded-lg cursor-grab hover:bg-border-color transition-colors"
    >
      <Icon className="w-5 h-5 text-accent" />
      <span className="text-sm font-medium text-text-main">{t(labelKey)}</span>
    </div>
  );
};

const CanvasItem: React.FC<{
  component: PromptComponent;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  t: (key: string) => string;
}> = ({ component, onUpdate, onDelete, onDragStart, t }) => {
  const { labelKey } = COMPONENT_MAP[component.type];

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, component.id)}
      className="bg-card-secondary p-4 rounded-lg border border-border-color relative group"
    >
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-text-secondary">{t(labelKey)}</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDelete(component.id)}
            className="p-1 text-text-secondary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete component"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
          <MoveIcon className="w-5 h-5 text-text-secondary cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <textarea
        value={component.content}
        onChange={(e) => onUpdate(component.id, e.target.value)}
        className="w-full h-24 p-2 bg-background border border-border-color rounded-md text-sm text-text-main resize-y focus:ring-2 focus:ring-primary focus:outline-none"
        placeholder={`Enter content for ${t(labelKey)}...`}
      />
    </div>
  );
};

const VisualPromptBuilder: React.FC<VisualPromptBuilderProps> = ({ components, onComponentsChange, t }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const handleContentChange = (id: string, content: string) => {
    onComponentsChange(components.map(c => (c.id === id ? { ...c, content } : c)));
  };

  const handleDeleteComponent = (id: string) => {
    onComponentsChange(components.filter(c => c.id !== id));
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.setData('componentId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const componentType = e.dataTransfer.getData('componentType') as PromptComponentType;
    const componentId = e.dataTransfer.getData('componentId');

    if (componentType) {
      const newComponent: PromptComponent = { id: uuidv4(), type: componentType, content: '' };
      onComponentsChange([...components, newComponent]);
    } else if (componentId && draggedItemId) {
      const draggedIndex = components.findIndex(c => c.id === draggedItemId);
      const targetElement = (e.target as HTMLElement).closest('[draggable="true"]');
      const targetId = targetElement?.getAttribute('data-id');
      const targetIndex = components.findIndex(c => c.id === targetId);

      if (draggedIndex > -1 && targetIndex > -1 && draggedIndex !== targetIndex) {
          const newItems = [...components];
          const [removed] = newItems.splice(draggedIndex, 1);
          newItems.splice(targetIndex, 0, removed);
          onComponentsChange(newItems);
      }
    }
    setDraggedItemId(null);
  };

  return (
    <div className="grid grid-cols-12 gap-4 bg-card p-4 rounded-lg border border-border-color h-full">
      <div className="col-span-3">
        <h3 className="text-md font-semibold text-text-main mb-3">{t('visual_builder_palette_title')}</h3>
        <div className="space-y-3">
          {(Object.keys(COMPONENT_MAP) as PromptComponentType[]).map(type => (
            <PaletteItem key={type} type={type} t={t} />
          ))}
        </div>
      </div>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={() => setIsDraggingOver(false)}
        className={`col-span-9 p-4 bg-background rounded-lg border-2 ${
          isDraggingOver ? 'border-primary' : 'border-dashed border-border-color'
        } transition-colors min-h-[300px] overflow-y-auto`}
      >
        {components.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-text-secondary">{t('visual_builder_drop_zone')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {components.map(c => (
              <div key={c.id} data-id={c.id}>
                <CanvasItem component={c} onUpdate={handleContentChange} onDelete={handleDeleteComponent} onDragStart={handleDragStart} t={t} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualPromptBuilder;
