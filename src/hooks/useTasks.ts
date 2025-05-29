import { useState } from 'react';
import { Task } from '../types/task';
import { Variable } from '../types/variable';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [variables, setVariables] = useState<Variable[]>([]);

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

  const reorderTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  const addVariable = (token: string, value: string) => {
    const newVariable: Variable = {
      id: crypto.randomUUID(),
      token,
      value,
    };
    setVariables(prev => [...prev, newVariable]);
  };

  const deleteVariable = (id: string) => {
    setVariables(prev => prev.filter((variable) => variable.id !== id));
  };

  const editVariable = (id: string, token: string, value: string) => {
    setVariables(prev =>
      prev.map((variable) =>
        variable.id === id ? { ...variable, token, value } : variable
      )
    );
  };

  return {
    tasks,
    setTasks,
    addTask,
    duplicateTask,
    toggleTask,
    deleteTask,
    editTask,
    variables,
    setVariables,
    addVariable,
    deleteVariable,
    editVariable,
    reorderTasks
  };
}