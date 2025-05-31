import React, { useEffect, useState } from 'react';
import { ArrowLeft, Merge, Save, Upload, XSquare } from 'lucide-react';
import { TaskInput } from '../TaskInput';
import { TaskList } from '../TaskList';
import { Task } from '../../types/task';
import { saveTaskList } from '../../services/taskListService';
import { useVariables, Variable } from '../../context/variableContext';
import { VariableListSection } from '../VariableListSection';
import { MergeVariablesModal } from '../MergeVariablesModal';
import { ImportDataType } from '../../types/importData';

interface ListEditorProps {
  list?: {
    id?: string;
    name: string;
    data: Task[];
    variables: Variable[];
    is_example?: boolean;
  };
  onSave: () => void;
  onCancel: () => void;
  onError: (error: string) => void;
}

export function ListEditor({ list, onSave, onCancel, onError }: ListEditorProps) {
  const [name, setName] = useState(list?.name || '');
  const [tasks, setTasks] = useState<Task[]>(list?.data || []);
  const [isExample, setIsExample] = useState(list?.is_example || false);
  const [saving, setSaving] = useState(false);
  const [hasTokens, setHasTokens] = useState(false);
  const [showMergeVariablesModal, setShowMergeVariablesModal] = useState(false);

  const { variables, setVariables, mergingVariables, setMergingVariables } = useVariables();

  useEffect(() => {
    setVariables(list?.variables || []);
    setMergingVariables(false);
  }, []);

  useEffect(() => {
    const checker = variables.filter(variable => variable.token.length > 0);
    setHasTokens(checker.length > 0);
  }, [variables]);

  useEffect(() => {
    
  }, [mergingVariables]);

  const handleSave = async () => {
    if (!name.trim()) {
      onError('Please enter a name for the list');
      return;
    }

    if (tasks.length === 0) {
      onError('Please add at least one task to the list');
      return;
    }

    setSaving(true);
    try {
      // TODO 
      console.log('name', name);

      await saveTaskList(name, tasks, variables, isExample);
      onSave();
    } catch (error) {
      console.error('Error saving list:', error);
      onError('Failed to save task list');
    } finally {
      setSaving(false);
    }
  };

  const addTask = (
    text: string,
    isHeadline: boolean,
    codeBlock?: { language: string; code: string },
    richText?: string,
    optional?: boolean
  ) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      isHeadline,
      createdAt: new Date(),
      codeBlock,
      richText,
      optional
    };
    setTasks(prev => [...prev, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter((task) => task.id !== id));
  };

  const editTask = (
    id: string,
    text: string,
    codeBlock?: { language: string; code: string },
    richText?: string,
    optional?: boolean
  ) => {
    setTasks(prev =>
      prev.map((task) =>
        task.id === id ? { ...task, text, codeBlock, richText, optional } : task
      )
    );
  };

  const duplicateTask = (id: string) => {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      const taskToDuplicate = tasks[taskIndex];
      const duplicatedTask: Task = {
        ...taskToDuplicate,
        id: crypto.randomUUID(),
        completed: false,
        createdAt: new Date()
      };
      
      const newTasks = [...tasks];
      newTasks.splice(taskIndex + 1, 0, duplicatedTask);
      setTasks(newTasks);
    }
  };

  const reorderTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  const isImportDataType = (data: any): data is ImportDataType => {
    return Array.isArray(data.tasks) && Array.isArray(data.variables);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const parsed = JSON.parse(content);
            if (parsed.data) {
              if (isImportDataType(parsed.data)) {
                setTasks(parsed.data.tasks);
                setVariables(parsed.data.variables);
              } else {
                setTasks(parsed.data);
                setVariables([]);
              }
              setIsExample(false);
              setMergingVariables(false);
            }
          } catch (error) {
            console.error('Error parsing imported file:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    
    input.click();
  };  
  
  const handleMergeVariables = () => {
    setVariables(variables)
    setShowMergeVariablesModal(false);
    setMergingVariables(!mergingVariables);
  }

  const handleMergeVariableTrigger = () => {
    if (mergingVariables) {
      setMergingVariables(false);
    } else {
      setShowMergeVariablesModal(true);
    }
  }

  const handleOnClear = () => {
    setVariables([]);
    setTasks([]);
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex">
        <div className="px-4 py-12 sm:px-6 lg:px-8 w-[70%]">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-grow">
                  <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Back to list"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter list name"
                    className="inline-block text-2xl font-semibold text-gray-900 focus:outline-none focus:ring-0 bg-transparent border w-full"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleImport}
                    className="import-export-button flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    title="Import tasks"
                  >
                    <Upload size={16} />
                    Import
                  </button>                
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isExample}
                      onChange={(e) => setIsExample(e.target.checked)}
                      className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Save as example</span>
                  </label>
                  <button
                    onClick={handleSave}
                    disabled={saving || !name.trim() || tasks.length === 0}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    <Save size={16} />
                    {saving ? 'Saving...' : 'Save List'}
                  </button>
                  <button
                    onClick={handleOnClear}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                    title="Clear all tasks & variables"
                    disabled={!tasks.length && !variables.length}
                  >
                    <XSquare size={16} />
                    Clear all
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <TaskInput onAddTask={addTask} />
              
              {tasks.length > 0 && (
                <div className="mt-8">
                  <TaskList
                    tasks={tasks}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                    onEdit={editTask}
                    onDuplicate={duplicateTask}
                    onReorder={reorderTasks}
                    onCheckAllSubTasks={() => {}}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="px-4 py-12 sm:px-6 lg:px-8 w-[30%] sticky top-0 self-start">
          <VariableListSection />
          { variables?.length > 0 ? (
            <div className='mb-2 flex gap-2 justify-end'>
              <button
                type="submit"
                className={`text-white px-4 py-2 my-4 rounded-lg flex items-center gap-2 ${hasTokens ? mergingVariables ? 'bg-orange-600 hover:bg-blue-600 transition-colors': 'bg-blue-500 hover:bg-blue-600 transition-colors': 'bg-gray-200'}`}
                onClick={handleMergeVariableTrigger}
                disabled={!hasTokens}
              >
                <Merge size={20} />
                {mergingVariables ? "Disable Merged Variables" : "Show Merged Variables"}
              </button>
            </div>
          ): ''}
        </div>
      </div>
      {showMergeVariablesModal && (
        <MergeVariablesModal
          onClose={() => setShowMergeVariablesModal(false)}
          onMerge={handleMergeVariables}
        />
      )}
    </>
  );
}