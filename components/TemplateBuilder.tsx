// FIX: Replaced the old dynamic variable builder with the structured GenSpark 2.0 field builder.
import React from 'react';
import { TemplateFields } from '../types';

interface TemplateBuilderProps {
  fields: TemplateFields;
  onFieldChange: (fields: TemplateFields) => void;
  children: React.ReactNode; // For the additional instructions textarea
  t: (key: string) => string;
}

const TemplateBuilder: React.FC<TemplateBuilderProps> = ({ fields, onFieldChange, children, t }) => {
    const fieldMap: { key: keyof TemplateFields; labelKey: string }[] = [
        { key: 'role', labelKey: 'template_role_label' },
        { key: 'task', labelKey: 'template_task_label' },
        { key: 'context', labelKey: 'template_context_label' },
        { key: 'constraints', labelKey: 'template_constraints_label' },
    ];

    const handleFieldChange = (field: keyof TemplateFields, value: string) => {
        onFieldChange({ ...fields, [field]: value });
    };

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg space-y-4 border border-gray-700">
            {fieldMap.map(({ key, labelKey }) => (
                <div key={key}>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                        {t(labelKey)}
                    </label>
                    <textarea
                        value={fields[key]}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        className="w-full h-20 p-3 bg-gray-900/50 border border-gray-600 rounded-md text-sm text-gray-200 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>
            ))}
            
            <div className="pt-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                    {t('prompt_placeholder')}
                </label>
                {children}
            </div>
        </div>
    );
};

export default TemplateBuilder;