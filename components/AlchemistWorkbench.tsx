import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Essence } from '../types';
import { blendPrompt } from '../services/geminiService';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoveIcon, TrashIcon, SparklesIcon, SaveIcon, SendIcon, WandIcon } from './icons';
import SavePromptModal from './SavePromptModal';

interface SortableEssenceProps {
  id: string;
  text: string;
  onUpdate: (id: string, text: string) => void;
  onRemove: (id: string) => void;
}

const SortableEssence: React.FC<SortableEssenceProps> = ({ id, text, onUpdate, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 bg-background p-2 rounded-md">
      <div {...attributes} {...listeners} className="cursor-grab p-1 text-text-secondary">
        <MoveIcon className="w-5 h-5" />
      </div>
      <input
        type="text"
        value={text}
        onChange={(e) => onUpdate(id, e.target.value)}
        className="flex-grow bg-transparent focus:outline-none text-sm"
      />
      <button onClick={() => onRemove(id)} className="p-1 text-text-secondary hover:text-red-400">
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

interface AlchemistWorkbenchProps {
  basePrompt: string;
  essences: Essence[];
  onUpdateBasePrompt: (prompt: string) => void;
  onUpdateEssences: (essences: Essence[]) => void;
  onClearWorkbench: () => void;
  onSavePrompt: (name: string, text: string) => void;
  onRefineInIDE: (prompt: string) => void;
}

const AlchemistWorkbench: React.FC<AlchemistWorkbenchProps> = ({ basePrompt, essences, onUpdateBasePrompt, onUpdateEssences, onClearWorkbench, onSavePrompt, onRefineInIDE }) => {
  const { t } = useTranslation();
  const [blendedPrompt, setBlendedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleUpdateEssence = (id: string, text: string) => {
    onUpdateEssences(essences.map(e => (e.id === id ? { ...e, text } : e)));
  };
  
  const handleRemoveEssence = (id: string) => {
    onUpdateEssences(essences.filter(e => e.id !== id));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = essences.findIndex(e => e.id === active.id);
      const newIndex = essences.findIndex(e => e.id === over.id);
      onUpdateEssences(arrayMove(essences, oldIndex, newIndex));
    }
  };
  
  const handleBlend = async () => {
    if (!basePrompt) return;
    setIsLoading(true);
    setBlendedPrompt('');
    try {
      const response = await blendPrompt(basePrompt, essences.map(e => e.text));
      setBlendedPrompt(response.text);
    } catch (error) {
      console.error("Blending failed:", error);
      setBlendedPrompt("An error occurred during blending.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-card p-4 rounded-lg border border-border-color h-full flex flex-col">
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-text-main">{t('alchemist_workbench_title')}</h3>
            <div className="flex items-center gap-2">
                <button onClick={onClearWorkbench} className="px-3 py-1.5 text-xs font-semibold bg-card-secondary text-text-secondary rounded-md hover:bg-border-color hover:text-text-main transition-colors">
                    {t('alchemist_clear_button')}
                </button>
                 <button onClick={handleBlend} disabled={!basePrompt || isLoading} className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors">
                    <WandIcon className="w-5 h-5"/>
                    {isLoading ? t('status_generating') : t('alchemist_blend_button')}
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow overflow-y-auto pr-2">
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-semibold text-text-secondary">{t('alchemist_base_prompt_label')}</label>
                    <textarea value={basePrompt} onChange={e => onUpdateBasePrompt(e.target.value)} className="w-full mt-1 h-24 p-2 bg-background border border-border-color rounded-md" />
                </div>
                 <div>
                    <label className="text-sm font-semibold text-text-secondary">{t('alchemist_essences_label')}</label>
                    <p className="text-xs text-text-secondary/80 mb-2">{t('alchemist_essences_desc')}</p>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={essences} strategy={verticalListSortingStrategy}>
                            <div className="space-y-2">
                                {essences.map(e => <SortableEssence key={e.id} id={e.id} text={e.text} onUpdate={handleUpdateEssence} onRemove={handleRemoveEssence} />)}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            </div>
            
            <div className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-semibold text-text-secondary">Blended Prompt</h4>
                    {blendedPrompt && (
                        <div className="flex items-center gap-2">
                             <button onClick={() => setIsSaveModalOpen(true)} title="Save Prompt" className="p-1 text-text-secondary hover:text-primary"><SaveIcon className="w-4 h-4"/></button>
                             <button onClick={() => onRefineInIDE(blendedPrompt)} title={t('alchemist_refine_ide')} className="p-1 text-text-secondary hover:text-primary"><SendIcon className="w-4 h-4"/></button>
                        </div>
                    )}
                </div>
                <div className="flex-grow bg-background rounded-md p-3 text-sm text-text-main whitespace-pre-wrap overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full text-text-secondary">
                             <SparklesIcon className="w-6 h-6 animate-pulse text-primary mr-2" />
                             Blending...
                        </div>
                    ) : (blendedPrompt || "Your blended prompt will appear here.")}
                </div>
            </div>
        </div>
      </div>
      {blendedPrompt && 
        <SavePromptModal
            isOpen={isSaveModalOpen}
            onClose={() => setIsSaveModalOpen(false)}
            promptText={blendedPrompt}
        />
      }
    </>
  );
};

export default AlchemistWorkbench;
