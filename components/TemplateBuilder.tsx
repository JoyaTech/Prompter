import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PromptComponent, PromptComponentType } from '../types';
import { UserIcon, TargetIcon, InfoIcon, LockIcon } from './icons';

interface TemplateBuilderProps {
  components: PromptComponent[];
  onComponentsChange: (newComponents: PromptComponent[]) => void;
}

const componentOrder: PromptComponentType[] = ['role', 'task', 'context', 'constraints'];

const COMPONENT_METADATA: Record<PromptComponentType, { labelKey: string; icon: React.FC<any>; placeholderKey: string }> = {
    role: { labelKey: 'component_type_role', icon: UserIcon, placeholderKey: 'template_role_label' },
    task: { labelKey: 'component_type_task', icon: TargetIcon, placeholderKey: 'template_task_label' },
    context: { labelKey: 'component_type_context', icon: InfoIcon, placeholderKey: 'template_context_label' },
    constraints: { labelKey: 'component_type_constraints', icon: LockIcon, placeholderKey: 'template_constraints_label' },
    text: { labelKey: 'component_type_text', icon: () => null, placeholderKey: 'prompt_placeholder' }
};

const TemplateBuilder: React.FC<TemplateBuilderProps> = ({ components, onComponentsChange }) => {
    const { t } = useTranslation();

    const textFields = useMemo(() => {
        const fields: Record<string, string> = {};
        componentOrder.forEach(type => {
            const component = components.find(c => c.type === type);
            fields[type] = component ? component.content : '';
        });
        return fields;
    }, [components]);

    const handleFieldChange = (type: PromptComponentType, content: string) => {
        const newComponents = [...components];
        const existingComponentIndex = newComponents.findIndex(c => c.type === type);

        if (content) {
            if (existingComponentIndex > -1) {
                // Update existing component
                newComponents[existingComponentIndex] = { ...newComponents[existingComponentIndex], content };
            } else {
                // Add new component
                const newComponent: PromptComponent = { id: `template-${type}`, type, content };
                newComponents.push(newComponent);
                // Sort to maintain a consistent order
                newComponents.sort((a, b) => {
                    const orderA = a.type === 'text' ? 99 : componentOrder.indexOf(a.type);
                    const orderB = b.type === 'text' ? 99 : componentOrder.indexOf(b.type);
                    return orderA - orderB;
                });
            }
        } else {
            // Remove component if content is empty
            if (existingComponentIndex > -1) {
                newComponents.splice(existingComponentIndex, 1);
            }
        }
        
        onComponentsChange(newComponents);
    };

    return (
        <div className="bg-card p-4 rounded-lg border border-border-color h-full overflow-y-auto">
             <h3 className="text-md font-semibold text-text-main mb-4">{t('template_builder_title')}</h3>
             <div className="space-y-4">
                {componentOrder.map(type => {
                    const { labelKey, icon: Icon, placeholderKey } = COMPONENT_METADATA[type];
                    return (
                        <div key={type}>
                            <label className="flex items-center gap-2 text-sm font-semibold text-text-secondary mb-2">
                                <Icon className="w-5 h-5 text-accent" />
                                {t(labelKey)}
                            </label>
                            <textarea
                                value={textFields[type]}
                                onChange={(e) => handleFieldChange(type, e.target.value)}
                                className="w-full h-24 p-2 bg-background border border-border-color rounded-md text-sm text-text-main resize-y focus:ring-2 focus:ring-primary focus:outline-none"
                                placeholder={`${t(placeholderKey)}...`}
                            />
                        </div>
                    );
                })}
             </div>
        </div>
    );
};

export default TemplateBuilder;
