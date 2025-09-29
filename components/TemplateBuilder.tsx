// FIX: Implemented the TemplateBuilder component to manage dynamic prompt variables.
import React, { useState } from 'react';
import { PlusIcon, TrashIcon } from './icons';

interface TemplateBuilderProps {
  variables: string[];
  onVariablesChange: (variables: string[]) => void;
  t: (key: string) => string;
}

const TemplateBuilder: React.FC<TemplateBuilderProps> = ({ variables, onVariablesChange, t }) => {
  const [newVar, setNewVar] = useState('');

  const handleAddVariable = () => {
    const sanitizedVar = newVar.replace(/[^a-zA-Z0-9_]/g, '').trim();
    if (sanitizedVar && !variables.includes(sanitizedVar)) {
      onVariablesChange([...variables, sanitizedVar]);
      setNewVar('');
    }
  };

  const handleRemoveVariable = (varToRemove: string) => {
    onVariablesChange(variables.filter((v) => v !== varToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddVariable();
    }
  };

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg">
      <h3 className="font-semibold text-gray-300">{t('variables_title')}</h3>
      <p className="text-sm text-gray-500 mt-1 mb-4">{t('variables_desc')}</p>
      
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newVar}
          onChange={(e) => setNewVar(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('variable_name_placeholder')}
          className="flex-grow bg-gray-900/50 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <button
          onClick={handleAddVariable}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          {t('add_variable')}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {variables.map((v) => (
          <div key={v} className="bg-gray-700 rounded-full px-3 py-1 flex items-center gap-2 text-sm text-cyan-300 animate-fade-in">
            <span>{`{{${v}}}`}</span>
            <button
              onClick={() => handleRemoveVariable(v)}
              className="text-gray-500 hover:text-red-400"
              title={`Remove ${v}`}
            >
              <TrashIcon className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateBuilder;
