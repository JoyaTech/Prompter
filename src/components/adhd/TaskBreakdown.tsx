import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface TaskStep {
  id: string;
  title: string;
  description: string;
  estimatedTime: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  dependencies?: string[]; // IDs of steps that must be completed first
}

interface TaskBreakdownProps {
  prompt: string;
  onStepsGenerated?: (steps: TaskStep[]) => void;
  onStepCompleted?: (stepId: string) => void;
}

const TaskBreakdown: React.FC<TaskBreakdownProps> = ({ 
  prompt, 
  onStepsGenerated, 
  onStepCompleted 
}) => {
  const { t } = useTranslation();
  const [steps, setSteps] = useState<TaskStep[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedComplexity, setSelectedComplexity] = useState<'simple' | 'detailed' | 'comprehensive'>('detailed');
  const [showVisualView, setShowVisualView] = useState(false);

  const generateSteps = async () => {
    setIsGenerating(true);
    
    try {
      // Mock step generation - in real app would use AI to break down the prompt
      const generatedSteps = await mockGenerateSteps(prompt, selectedComplexity);
      setSteps(generatedSteps);
      onStepsGenerated?.(generatedSteps);
    } catch (error) {
      console.error('Failed to generate steps:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleStepCompletion = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, completed: !step.completed }
        : step
    ));
    onStepCompleted?.(stepId);
  };

  const getStepColor = (difficulty: TaskStep['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 border-green-300 text-green-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'hard': return 'bg-red-100 border-red-300 text-red-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getDifficultyIcon = (difficulty: TaskStep['difficulty']) => {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  const canStartStep = (step: TaskStep): boolean => {
    if (!step.dependencies?.length) return true;
    return step.dependencies.every(depId => 
      steps.find(s => s.id === depId)?.completed
    );
  };

  const getProgressStats = () => {
    const completed = steps.filter(s => s.completed).length;
    const total = steps.length;
    const totalTime = steps.reduce((acc, step) => acc + step.estimatedTime, 0);
    const completedTime = steps.filter(s => s.completed).reduce((acc, step) => acc + step.estimatedTime, 0);
    
    return { completed, total, totalTime, completedTime };
  };

  const stats = getProgressStats();

  return (
    <div className="task-breakdown bg-card p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{t('adhd_task_breakdown')}</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowVisualView(!showVisualView)}
            className={`
              px-3 py-1 rounded text-sm
              ${showVisualView ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}
            `}
          >
            {showVisualView ? '📋' : '🗺️'}
          </button>
        </div>
      </div>

      {/* Complexity Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          {t('adhd_breakdown_complexity')}
        </label>
        <div className="flex space-x-2">
          {(['simple', 'detailed', 'comprehensive'] as const).map(complexity => (
            <button
              key={complexity}
              onClick={() => setSelectedComplexity(complexity)}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${selectedComplexity === complexity 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
            >
              {t(`adhd_complexity_${complexity}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      {steps.length === 0 && (
        <button
          onClick={generateSteps}
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {isGenerating ? t('adhd_generating_steps') : t('adhd_break_down_task')}
        </button>
      )}

      {/* Progress Overview */}
      {steps.length > 0 && (
        <div className="bg-background p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{t('adhd_progress_overview')}</span>
            <span className="text-sm text-text-secondary">
              {stats.completed}/{stats.total} {t('adhd_steps_completed')}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(stats.completed / stats.total) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-text-secondary">
            <span>
              {t('adhd_estimated_time')}: {stats.totalTime} {t('minutes')}
            </span>
            <span>
              {t('adhd_time_saved')}: {stats.completedTime} {t('minutes')}
            </span>
          </div>
        </div>
      )}

      {/* Steps Display */}
      {steps.length > 0 && (
        <div className={showVisualView ? 'visual-view' : 'list-view'}>
          {showVisualView ? (
            <VisualStepsView 
              steps={steps} 
              onStepToggle={toggleStepCompletion}
              canStartStep={canStartStep}
              getStepColor={getStepColor}
              getDifficultyIcon={getDifficultyIcon}
              t={t}
            />
          ) : (
            <ListStepsView 
              steps={steps} 
              onStepToggle={toggleStepCompletion}
              canStartStep={canStartStep}
              getStepColor={getStepColor}
              getDifficultyIcon={getDifficultyIcon}
              t={t}
            />
          )}
        </div>
      )}

      {/* Regenerate Steps */}
      {steps.length > 0 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={generateSteps}
            disabled={isGenerating}
            className="px-4 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
          >
            {t('adhd_regenerate_steps')}
          </button>
        </div>
      )}
    </div>
  );
};

// List View Component
const ListStepsView: React.FC<{
  steps: TaskStep[];
  onStepToggle: (stepId: string) => void;
  canStartStep: (step: TaskStep) => boolean;
  getStepColor: (difficulty: TaskStep['difficulty']) => string;
  getDifficultyIcon: (difficulty: TaskStep['difficulty']) => string;
  t: (key: string) => string;
}> = ({ steps, onStepToggle, canStartStep, getStepColor, getDifficultyIcon, t }) => (
  <div className="space-y-3">
    {steps.map((step, index) => {
      const canStart = canStartStep(step);
      
      return (
        <div
          key={step.id}
          className={`
            border rounded-lg p-4 transition-all duration-200
            ${step.completed 
              ? 'bg-green-50 border-green-200' 
              : canStart 
                ? 'bg-white border-border hover:border-primary' 
                : 'bg-gray-50 border-gray-200 opacity-60'
            }
          `}
        >
          <div className="flex items-start space-x-3">
            <button
              onClick={() => canStart && onStepToggle(step.id)}
              disabled={!canStart}
              className={`
                mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${step.completed 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : canStart 
                    ? 'border-gray-300 hover:border-primary' 
                    : 'border-gray-200 cursor-not-allowed'
                }
              `}
            >
              {step.completed && '✓'}
            </button>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-sm text-gray-500">
                  {t('adhd_step')} {index + 1}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${getStepColor(step.difficulty)}`}>
                  {getDifficultyIcon(step.difficulty)} {t(`adhd_difficulty_${step.difficulty}`)}
                </span>
                <span className="text-xs text-gray-500">
                  ~{step.estimatedTime} {t('min')}
                </span>
              </div>
              
              <h4 className={`font-medium mb-1 ${step.completed ? 'line-through text-gray-500' : ''}`}>
                {step.title}
              </h4>
              
              <p className="text-sm text-text-secondary mb-2">
                {step.description}
              </p>
              
              {step.dependencies && step.dependencies.length > 0 && (
                <div className="text-xs text-gray-500">
                  {t('adhd_depends_on')}: {step.dependencies.map(depId => {
                    const depStep = steps.find(s => s.id === depId);
                    return depStep?.title;
                  }).join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

// Visual View Component (Flow Chart Style)
const VisualStepsView: React.FC<{
  steps: TaskStep[];
  onStepToggle: (stepId: string) => void;
  canStartStep: (step: TaskStep) => boolean;
  getStepColor: (difficulty: TaskStep['difficulty']) => string;
  getDifficultyIcon: (difficulty: TaskStep['difficulty']) => string;
  t: (key: string) => string;
}> = ({ steps, onStepToggle, canStartStep, getStepColor, getDifficultyIcon, t }) => (
  <div className="visual-flow">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {steps.map((step, index) => {
        const canStart = canStartStep(step);
        
        return (
          <div
            key={step.id}
            className={`
              relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
              ${step.completed 
                ? 'bg-green-100 border-green-300' 
                : canStart 
                  ? 'bg-white border-primary hover:shadow-lg' 
                  : 'bg-gray-100 border-gray-300 opacity-60'
              }
            `}
            onClick={() => canStart && onStepToggle(step.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500">
                {index + 1}
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-xs">
                  {getDifficultyIcon(step.difficulty)}
                </span>
                {step.completed && <span className="text-green-500">✅</span>}
              </div>
            </div>
            
            <h4 className="font-medium text-sm mb-2 line-clamp-2">
              {step.title}
            </h4>
            
            <p className="text-xs text-text-secondary mb-2 line-clamp-3">
              {step.description}
            </p>
            
            <div className="flex justify-between items-center text-xs">
              <span className={`px-2 py-1 rounded ${getStepColor(step.difficulty)}`}>
                {t(`adhd_difficulty_${step.difficulty}`)}
              </span>
              <span className="text-gray-500">
                ~{step.estimatedTime}m
              </span>
            </div>
            
            {/* Dependency Lines - simplified for visual representation */}
            {step.dependencies && step.dependencies.length > 0 && (
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                {step.dependencies.length}
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

// Mock function to simulate AI step generation
async function mockGenerateSteps(prompt: string, complexity: 'simple' | 'detailed' | 'comprehensive'): Promise<TaskStep[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const baseSteps: Omit<TaskStep, 'id'>[] = [
    {
      title: 'Analyze the prompt requirements',
      description: 'Break down what the prompt is asking for and identify key components',
      estimatedTime: 10,
      difficulty: 'easy',
      completed: false
    },
    {
      title: 'Research relevant information',
      description: 'Gather necessary background information and context',
      estimatedTime: 20,
      difficulty: 'medium',
      completed: false,
      dependencies: []
    },
    {
      title: 'Create initial draft',
      description: 'Write the first version based on analysis and research',
      estimatedTime: 30,
      difficulty: 'medium',
      completed: false,
      dependencies: []
    },
    {
      title: 'Review and refine',
      description: 'Check for accuracy, completeness, and quality',
      estimatedTime: 15,
      difficulty: 'hard',
      completed: false,
      dependencies: []
    },
    {
      title: 'Final validation',
      description: 'Ensure the output meets all requirements',
      estimatedTime: 10,
      difficulty: 'easy',
      completed: false,
      dependencies: []
    }
  ];

  // Add more steps based on complexity
  let steps = baseSteps;
  
  if (complexity === 'detailed' || complexity === 'comprehensive') {
    steps.push({
      title: 'Format and structure',
      description: 'Organize the content for better readability',
      estimatedTime: 15,
      difficulty: 'medium',
      completed: false,
      dependencies: []
    });
  }
  
  if (complexity === 'comprehensive') {
    steps.push(
      {
        title: 'Peer review',
        description: 'Get feedback from others',
        estimatedTime: 25,
        difficulty: 'medium',
        completed: false,
        dependencies: []
      },
      {
        title: 'Final polish',
        description: 'Make final improvements based on feedback',
        estimatedTime: 20,
        difficulty: 'hard',
        completed: false,
        dependencies: []
      }
    );
  }

  // Add IDs and set up dependencies
  return steps.map((step, index) => ({
    ...step,
    id: `step-${index + 1}`,
    dependencies: index === 0 ? [] : [`step-${index}`]
  }));
}

export default TaskBreakdown;