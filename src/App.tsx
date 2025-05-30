import React, { useState, useEffect } from 'react';
import { HelpCircle, Merge } from 'lucide-react';
import { useSettings } from './hooks/useSettings';
import { useTasks } from './hooks/useTasks';
import { useAuth } from './hooks/useAuth';
import { Header } from './components/Header';
import { TaskInput } from './components/TaskInput';
import { TaskListSection } from './components/TaskListSection';
import { VariableListSection } from './components/VariableListSection';
import { Footer } from './components/Footer';
import { ConfirmationModal } from './components/ConfirmationModal';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { ErrorNotification } from './components/ErrorNotification';
// import { IntroModal } from './components/IntroModal';
import { Tour } from './components/tour/Tour';
import { AuthModal } from './components/auth/AuthModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { supabase } from './lib/supabase';
import { Task } from './types/task';
import { MergeVariablesModal } from './components/MergeVariablesModal';
import { useVariables, Variable } from './context/variableContext';
import { ImportDataType } from './types/importData';

export default function App() {
  const [settings, setSettings] = useSettings();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const {
    tasks,
    setTasks,
    addTask,
    duplicateTask,
    toggleTask,
    deleteTask,
    editTask,
    reorderTasks
  } = useTasks();

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showMergeVariablesModal, setShowMergeVariablesModal] = useState(false);
  const [hasTokens, setHasTokens] = useState(false);
  const [isFirstUser, setIsFirstUser] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTour, setShowTour] = useState(() => {
    const hasSeenTour = sessionStorage.getItem('hasSeenTour');
    return !hasSeenTour && !settings.googleApiKey;
  });

  const { variables, setVariables, mergingVariables, setMergingVariables } = useVariables();

  useEffect(() => {
    // Check if this is the first user
    const checkFirstUser = async () => {
      try {
        const { count, error: countError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        if (countError) {
          if (countError.code === '42501') {
            setIsFirstUser(true);
          } else {
            console.error('Error checking user count:', countError);
          }
        } else {
          setIsFirstUser(!count || count === 0);
        }
      } catch (error) {
        console.error('Error checking first user:', error);
      }
    };

    if (!authLoading) {
      checkFirstUser();
    }
  }, [authLoading]);

  useEffect(() => {
    const checker = variables.filter(variable => variable.token.length > 0);
    setHasTokens(checker.length > 0);
  }, [variables]);

  useEffect(() => {
    
  }, [mergingVariables]);

  const handleLogoClick = () => {
    if (tasks.length > 0) {
      setShowConfirmationModal(true);
    } else {
      window.location.reload();
    }
  };

  const handleConfirmReload = () => {
    window.location.reload();
  };

  const handleSettingsSave = (newSettings: typeof settings) => {
    setSettings(newSettings);
    setShowSettingsModal(false);
  };

  const handleTourComplete = () => {
    sessionStorage.setItem('hasSeenTour', 'true');
    setShowTour(false);
  };

  const checkAllSubTasks = (headlineId: string) => {
    setTasks((prevTasks) => {
      const isAllCompleted = prevTasks.every(task => 
        task.isHeadline || task.completed || !isSubTaskOf(task, headlineId, prevTasks)
      );
      
      return prevTasks.map(task => {
        if (task.id === headlineId || isSubTaskOf(task, headlineId, prevTasks)) {
          return { ...task, completed: !isAllCompleted };
        }
        return task;
      });
    });
  };

  const isSubTaskOf = (task: Task, headlineId: string, tasks: Task[]) => {
    if (task.isHeadline) return false;
    const taskIndex = tasks.findIndex(t => t.id === task.id);
    for (let i = taskIndex; i >= 0; i--) {
      if (tasks[i].isHeadline) {
        return tasks[i].id === headlineId;
      }
    }
    return false;
  };

  const handleMergeVariables = () => {
    setVariables(variables)
    setShowMergeVariablesModal(false);
    setMergingVariables(!mergingVariables);
  }

  const handleClearAll = () => {
    setTasks([]);
    setVariables([]);
    setMergingVariables(false);
  }  

  if (showAdminDashboard && isAdmin) {
    return (
      <AdminDashboard 
        onClose={() => setShowAdminDashboard(false)}
        onError={setError}
      />
    );
  }

  const handleMergeVariableTrigger = () => {
    if (mergingVariables) {
      setMergingVariables(false);
    } else {
      setShowMergeVariablesModal(true);
    }
  }

  const isImportDataType = (data: any): data is ImportDataType => {
    return Array.isArray(data.tasks) && Array.isArray(data.variables);
  };
  
  const handleOnImport = (data: ImportDataType | Task[]) => {
    if (isImportDataType(data)) {
      setTasks(data.tasks);
      setVariables(data.variables);
    } else {
      setTasks(data);
      setVariables([]);
    }
    setMergingVariables(false);
  };

  const handleImportTaskList = (tasks: Task[], variables: Variable[]) => {
    setTasks(tasks);
    setVariables(variables);
  }

  return (
    <>
    <div className="min-h-screen bg-gray-50 relative flex">
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="beta-badge">beta</span>
      </div>
      {error && <ErrorNotification message={error} onClose={() => setError(null)} />}

      <div className="px-4 py-12 sm:px-6 lg:px-8 w-[70%]">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-8">
          <Header
            onLogoClick={handleLogoClick}
            onSettingsClick={() => setShowSettingsModal(true)}
            onAdminClick={() => setShowAdminDashboard(true)}
            tasks={tasks}
            onImport={handleOnImport}
            onError={setError}
            onClear={handleClearAll}
            isAdmin={isAdmin}
          />
          <TaskInput onAddTask={addTask} />
        </div>
        <TaskListSection
          tasks={tasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={editTask}
          onDuplicate={duplicateTask}
          onReorder={reorderTasks}
          onCheckAllSubTasks={checkAllSubTasks}
          onImportTaskList={handleImportTaskList}
          googleApiKey={settings.googleApiKey}
          onError={setError}
          isAdmin={isAdmin}
        />
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
    <div className="bg-gray-50 relative">
      <Footer />
      <button
        onClick={() => setShowHelpModal(true)}
        className="fixed bottom-4 right-4 p-2 text-gray-400 hover:text-gray-600"
        title="Help"
      >
        <HelpCircle size={24} />
      </button>

      {showConfirmationModal && (
        <ConfirmationModal
          onConfirm={handleConfirmReload}
          onCancel={() => setShowConfirmationModal(false)}
          tasks={tasks}
        />
      )}
      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
          onSave={handleSettingsSave}
          initialSettings={settings}
          isAdmin={isAdmin}
          user={user}
          onShowAuth={() => setShowAuthModal(true)}
        />
      )}
      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}
      {showTour && (
        <Tour onComplete={handleTourComplete} />
      )}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          isFirstUser={isFirstUser}
        />
      )}
      {showMergeVariablesModal && (
        <MergeVariablesModal
          onClose={() => setShowMergeVariablesModal(false)}
          onMerge={handleMergeVariables}
        />
      )}
    </div>
    </>
  );
}