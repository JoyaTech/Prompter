import React, { useState } from 'react';
import { TestCase, TestResult } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { generateContent } from '../services/geminiService';
import { TrashIcon, PlusIcon, PlayIcon } from './icons';

interface PromptUnitTesterProps {
    prompt: string;
    t: (key: string) => string;
}

const PromptUnitTester: React.FC<PromptUnitTesterProps> = ({ prompt, t }) => {
    const [testCases, setTestCases] = useState<TestCase[]>([
        { id: uuidv4(), input: 'a friendly, engaging tone', expectedOutput: 'Hello there' },
    ]);
    const [results, setResults] = useState<TestResult[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const handleTestCaseChange = (id: string, field: keyof Omit<TestCase, 'id'>, value: string) => {
        setTestCases(testCases.map(tc => tc.id === id ? { ...tc, [field]: value } : tc));
    };

    const addTestCase = () => {
        setTestCases([...testCases, { id: uuidv4(), input: '', expectedOutput: '' }]);
    };
    
    const removeTestCase = (id: string) => {
        setTestCases(testCases.filter(tc => tc.id !== id));
    };

    const runTests = async () => {
        setIsRunning(true);
        setResults([]);
        const newResults: TestResult[] = [];

        for (const testCase of testCases) {
            // A simple placeholder system. Real-world might be more complex.
            const testPrompt = prompt.replace(/{{input}}/gi, testCase.input);
            try {
                const response = await generateContent(testPrompt);
                // FIX: Used response.text directly to get string output from Gemini API.
                const actualOutput = response.text;
                const pass = actualOutput.toLowerCase().includes(testCase.expectedOutput.toLowerCase());
                newResults.push({ testCaseId: testCase.id, pass, actualOutput });
            } catch (error: any) {
                newResults.push({ testCaseId: testCase.id, pass: false, actualOutput: '', error: error.message });
            }
        }
        setResults(newResults);
        setIsRunning(false);
    };

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg space-y-4 border border-gray-700 mt-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-300">{t('tester_title')}</h3>
                    <p className="text-sm text-gray-400">{t('tester_desc')}</p>
                </div>
                <button
                    onClick={runTests}
                    disabled={isRunning}
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                    <PlayIcon className="w-5 h-5"/>
                    {isRunning ? t('tester_running_tests') : t('tester_run_tests')}
                </button>
            </div>
            
            <div className="space-y-3">
                {testCases.map((tc, index) => (
                    <div key={tc.id} className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-md">
                        <span className="text-gray-400 font-mono text-sm">#{index + 1}</span>
                        <div className="flex-grow">
                            <label className="text-xs text-gray-500">{t('tester_input_label')} (use `{"{{input}}`}" in prompt)</label>
                            <input
                                type="text"
                                value={tc.input}
                                onChange={(e) => handleTestCaseChange(tc.id, 'input', e.target.value)}
                                className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-200"
                            />
                        </div>
                        <div className="flex-grow">
                             <label className="text-xs text-gray-500">{t('tester_expected_output_label')}</label>
                            <input
                                type="text"
                                value={tc.expectedOutput}
                                onChange={(e) => handleTestCaseChange(tc.id, 'expectedOutput', e.target.value)}
                                className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-200"
                            />
                        </div>
                        <button onClick={() => removeTestCase(tc.id)} className="p-2 text-gray-500 hover:text-red-400">
                            <TrashIcon className="w-5 h-5"/>
                        </button>
                    </div>
                ))}
            </div>

            <button onClick={addTestCase} className="px-3 py-1.5 text-sm font-medium text-indigo-400 border border-indigo-400/50 rounded-md flex items-center gap-2 hover:bg-indigo-400/10">
                <PlusIcon className="w-4 h-4"/>
                {t('tester_add_case')}
            </button>

            {results.length > 0 && (
                 <div className="pt-4">
                    <h4 className="text-md font-semibold text-gray-300 mb-2">{t('tester_results_title')}</h4>
                    <ul className="space-y-2">
                        {results.map(result => {
                            const testCase = testCases.find(tc => tc.id === result.testCaseId);
                            return (
                                <li key={result.testCaseId} className="p-3 bg-gray-900/50 rounded-md">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-mono text-gray-400 truncate" title={testCase?.input}>Input: "{testCase?.input}"</p>
                                        {result.pass ? (
                                            <span className="px-2 py-0.5 text-xs font-bold text-green-300 bg-green-800/50 rounded-full">{t('tester_result_pass')}</span>
                                        ) : (
                                            <span className="px-2 py-0.5 text-xs font-bold text-red-300 bg-red-800/50 rounded-full">{t('tester_result_fail')}</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Expected to contain: "{testCase?.expectedOutput}"</p>
                                    <p className="text-xs text-gray-500 mt-1">Actual: "{result.actualOutput}"</p>
                                     {result.error && <p className="text-xs text-red-400 mt-1">Error: {result.error}</p>}
                                </li>
                            );
                        })}
                    </ul>
                 </div>
            )}

        </div>
    );
};

export default PromptUnitTester;
