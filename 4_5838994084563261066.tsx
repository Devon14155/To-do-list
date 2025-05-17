import React, { useState, useEffect } from 'react';
import { PlusCircle, CheckCircle, Circle, Trash2, Calendar, Flag, Tag, MoreHorizontal, Edit3, Search, ChevronDown, Inbox, BarChart2, Clock, Sun, Menu, X } from 'lucide-react';

// Main App Component
export default function TodoistClone() {
  // Check if localStorage is available
  const isLocalStorageAvailable = () => {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };

  const storageAvailable = isLocalStorageAvailable();
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      return savedTasks ? JSON.parse(savedTasks) : [
        { id: 1, title: 'Complete project proposal', completed: false, project: 'Work', priority: 'high', due: '2025-05-15', labels: ['important'] },
        { id: 2, title: 'Buy groceries', completed: false, project: 'Personal', priority: 'medium', due: '2025-05-12', labels: ['shopping'] },
        { id: 3, title: 'Go for a run', completed: true, project: 'Health', priority: 'low', due: '2025-05-11', labels: ['exercise'] }
      ];
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      return [
        { id: 1, title: 'Complete project proposal', completed: false, project: 'Work', priority: 'high', due: '2025-05-15', labels: ['important'] },
        { id: 2, title: 'Buy groceries', completed: false, project: 'Personal', priority: 'medium', due: '2025-05-12', labels: ['shopping'] },
        { id: 3, title: 'Go for a run', completed: true, project: 'Health', priority: 'low', due: '2025-05-11', labels: ['exercise'] }
      ];
    }
  });
  
  const [projects, setProjects] = useState(() => {
    try {
      const savedProjects = localStorage.getItem('projects');
      return savedProjects ? JSON.parse(savedProjects) : ['Inbox', 'Work', 'Personal', 'Health'];
    } catch (error) {
      console.error('Error loading projects from localStorage:', error);
      return ['Inbox', 'Work', 'Personal', 'Health'];
    }
  });
  
  const [labels, setLabels] = useState(() => {
    try {
      const savedLabels = localStorage.getItem('labels');
      return savedLabels ? JSON.parse(savedLabels) : ['important', 'shopping', 'exercise'];
    } catch (error) {
      console.error('Error loading labels from localStorage:', error);
      return ['important', 'shopping', 'exercise'];
    }
  });
  
  const [newTask, setNewTask] = useState('');
  const [selectedProject, setSelectedProject] = useState('Inbox');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showToday, setShowToday] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newProject, setNewProject] = useState('');
  const [newLabel, setNewLabel] = useState('');

  // Save to localStorage when data changes
  // Save to localStorage when data changes with error handling
  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }, [tasks]);
  
  useEffect(() => {
    try {
      localStorage.setItem('projects', JSON.stringify(projects));
    } catch (error) {
      console.error('Error saving projects to localStorage:', error);
    }
  }, [projects]);
  
  useEffect(() => {
    try {
      localStorage.setItem('labels', JSON.stringify(labels));
    } catch (error) {
      console.error('Error saving labels to localStorage:', error);
    }
  }, [labels]);

  // Task Management Functions
  const addTask = () => {
    if (newTask.trim()) {
      const newTaskObj = {
        id: Date.now(),
        title: newTask,
        completed: false,
        project: selectedProject,
        priority: 'medium',
        due: '',
        labels: []
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask('');
    }
  };

  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    setEditingTask(null);
  };

  const startEditTask = (task) => {
    setEditingTask({...task});
  };

  // Project Management Functions
  const addProject = () => {
    if (newProject.trim() && !projects.includes(newProject.trim())) {
      setProjects([...projects, newProject.trim()]);
      setNewProject('');
    }
  };

  // Label Management Functions
  const addLabel = () => {
    if (newLabel.trim() && !labels.includes(newLabel.trim())) {
      setLabels([...labels, newLabel.trim()]);
      setNewLabel('');
    }
  };

  // Filter Tasks
  const getFilteredTasks = () => {
    let filteredTasks = tasks;
    
    // Check if Today filter is active
    if (showToday) {
      const today = getTodayDate();
      filteredTasks = filteredTasks.filter(task => task.due === today);
    }
    // Otherwise apply project filter
    else if (selectedProject !== 'Inbox') {
      filteredTasks = filteredTasks.filter(task => task.project === selectedProject);
    }
    
    // Then apply completion filter
    if (activeFilter === 'active') {
      filteredTasks = filteredTasks.filter(task => !task.completed);
    } else if (activeFilter === 'completed') {
      filteredTasks = filteredTasks.filter(task => task.completed);
    }
    
    // Then apply search filter if there is any
    if (searchQuery) {
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filteredTasks;
  };

  // Get counts for sidebar
  const getProjectCount = (projectName) => {
    return tasks.filter(task => task.project === projectName && !task.completed).length;
  };

  const getLabelCount = (labelName) => {
    return tasks.filter(task => task.labels.includes(labelName) && !task.completed).length;
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayCount = tasks.filter(task => 
    task.due === getTodayDate() && !task.completed
  ).length;

  const inboxCount = tasks.filter(task => !task.completed).length;

  // Priority color mapping
  const priorityColors = {
    low: 'bg-blue-200',
    medium: 'bg-yellow-200',
    high: 'bg-red-200'
  };

  // Render the Task Edit Form
  const renderTaskEditForm = () => {
    if (!editingTask) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Edit Task</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={editingTask.title}
                onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Project</label>
              <select
                className="w-full p-2 border rounded"
                value={editingTask.project}
                onChange={(e) => setEditingTask({...editingTask, project: e.target.value})}
              >
                {projects.map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                className="w-full p-2 border rounded"
                value={editingTask.priority}
                onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={editingTask.due}
                onChange={(e) => setEditingTask({...editingTask, due: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Labels</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {labels.map(label => (
                  <div key={label} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`label-${label}`}
                      checked={editingTask.labels.includes(label)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEditingTask({
                            ...editingTask, 
                            labels: [...editingTask.labels, label]
                          });
                        } else {
                          setEditingTask({
                            ...editingTask, 
                            labels: editingTask.labels.filter(l => l !== label)
                          });
                        }
                      }}
                      className="mr-1"
                    />
                    <label htmlFor={`label-${label}`} className="text-sm">{label}</label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setEditingTask(null)} 
                className="px-4 py-2 border rounded text-gray-600"
              >
                Cancel
              </button>
              <button 
                onClick={() => updateTask(editingTask)} 
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-30 bg-white p-2 rounded-full shadow"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`bg-gray-100 w-64 flex-shrink-0 overflow-y-auto transition-all ${
        sidebarOpen ? "transform-none" : "-translate-x-full"
      } md:transform-none fixed md:static h-full z-20 shadow-lg md:shadow-none`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-red-500">Todoist</h1>
          </div>
          
          <nav>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => {
                    setSelectedProject('Inbox'); 
                    setActiveFilter('all');
                    setShowToday(false);
                  }}
                  className={`flex items-center w-full p-2 rounded hover:bg-gray-200 ${selectedProject === 'Inbox' && !showToday ? 'bg-gray-200 font-medium' : ''}`}
                >
                  <Inbox size={18} className="mr-2 text-blue-500" />
                  <span>Inbox</span>
                  <span className="ml-auto bg-gray-200 px-2 rounded-full text-xs">{inboxCount}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setShowToday(true);
                    setSelectedProject('Inbox');
                    setActiveFilter('all');
                  }}
                  className={`flex items-center w-full p-2 rounded hover:bg-gray-200 ${showToday ? 'bg-gray-200 font-medium' : ''}`}
                >
                  <Sun size={18} className="mr-2 text-green-500" />
                  <span>Today</span>
                  <span className="ml-auto bg-gray-200 px-2 rounded-full text-xs">{todayCount}</span>
                </button>
              </li>
              <li>
                <button className="flex items-center w-full p-2 rounded hover:bg-gray-200">
                  <BarChart2 size={18} className="mr-2 text-purple-500" />
                  <span>Productivity</span>
                </button>
              </li>
            </ul>
            
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-medium text-gray-600">Projects</h2>
                <button className="text-gray-500 hover:text-gray-700">
                  <PlusCircle size={16} />
                </button>
              </div>
              <ul className="space-y-1">
                {projects.filter(p => p !== 'Inbox').map(project => (
                  <li key={project}>
                    <button 
                      onClick={() => {
                        setSelectedProject(project); 
                        setActiveFilter('all');
                        setShowToday(false);
                      }}
                      className={`flex items-center w-full p-2 rounded hover:bg-gray-200 ${selectedProject === project && !showToday ? 'bg-gray-200 font-medium' : ''}`}
                    >
                      <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                      <span>{project}</span>
                      <span className="ml-auto bg-gray-200 px-2 rounded-full text-xs">
                        {getProjectCount(project)}
                      </span>
                    </button>
                  </li>
                ))}
                <li>
                  <div className="flex mt-2">
                    <input
                      type="text"
                      placeholder="New project"
                      value={newProject}
                      onChange={(e) => setNewProject(e.target.value)}
                      className="flex-1 p-2 text-sm border rounded-l"
                    />
                    <button 
                      onClick={addProject}
                      className="bg-blue-500 text-white px-3 rounded-r"
                    >
                      +
                    </button>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-medium text-gray-600">Labels</h2>
                <button className="text-gray-500 hover:text-gray-700">
                  <PlusCircle size={16} />
                </button>
              </div>
              <ul className="space-y-1">
                {labels.map(label => (
                  <li key={label}>
                    <button className="flex items-center w-full p-2 rounded hover:bg-gray-200">
                      <Tag size={16} className="mr-2 text-yellow-500" />
                      <span>{label}</span>
                      <span className="ml-auto bg-gray-200 px-2 rounded-full text-xs">
                        {getLabelCount(label)}
                      </span>
                    </button>
                  </li>
                ))}
                <li>
                  <div className="flex mt-2">
                    <input
                      type="text"
                      placeholder="New label"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      className="flex-1 p-2 text-sm border rounded-l"
                    />
                    <button 
                      onClick={addLabel}
                      className="bg-blue-500 text-white px-3 rounded-r"
                    >
                      +
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b p-4 flex items-center">
          <div className="flex-1 ml-8 md:ml-0">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-full w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900">
              <PlusCircle size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
              <span className="text-sm font-medium">JD</span>
            </div>
          </div>
        </header>
        
        {/* Task Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <header className="mb-6">
              <h1 className="text-2xl font-bold">{showToday ? "Today" : selectedProject}</h1>
              <div className="flex mt-2 space-x-2">
                <button 
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1 text-sm rounded ${activeFilter === 'all' ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setActiveFilter('active')}
                  className={`px-3 py-1 text-sm rounded ${activeFilter === 'active' ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`}
                >
                  Active
                </button>
                <button 
                  onClick={() => setActiveFilter('completed')}
                  className={`px-3 py-1 text-sm rounded ${activeFilter === 'completed' ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`}
                >
                  Completed
                </button>
              </div>
            </header>
            
            {/* Task List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <ul>
                {getFilteredTasks().map(task => (
                  <li key={task.id} className="border-b last:border-b-0">
                    <div className="p-4 flex items-start group">
                      <button 
                        onClick={() => toggleTaskCompletion(task.id)}
                        className="mt-1 mr-3 flex-shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle size={18} className="text-green-500" />
                        ) : (
                          <Circle size={18} className="text-gray-300 group-hover:text-gray-400" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start">
                          <p className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                          </p>
                          <div className="flex items-center ml-2 opacity-0 group-hover:opacity-100">
                            <button 
                              onClick={() => startEditTask(task)}
                              className="p-1 text-gray-500 hover:text-gray-700"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button 
                              onClick={() => deleteTask(task.id)}
                              className="p-1 text-gray-500 hover:text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          {task.project && (
                            <div className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                              <span>{task.project}</span>
                            </div>
                          )}
                          {task.due && (
                            <div className="flex items-center">
                              <Calendar size={12} className="mr-1" />
                              <span>{task.due}</span>
                            </div>
                          )}
                          {task.priority && (
                            <div className={`px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
                              {task.priority}
                            </div>
                          )}
                          {task.labels.length > 0 && task.labels.map(label => (
                            <div key={label} className="bg-gray-100 px-2 py-0.5 rounded flex items-center">
                              <Tag size={10} className="mr-1 text-yellow-500" />
                              <span>{label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
                <li>
                  <div className="p-4 flex items-center">
                    <PlusCircle size={18} className="text-gray-400 mr-3" />
                    <input
                      type="text"
                      placeholder="Add task..."
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTask()}
                      className="flex-1 bg-transparent outline-none"
                    />
                    <button 
                      onClick={addTask}
                      className="ml-2 px-3 py-1 bg-red-500 text-white rounded text-sm"
                    >
                      Add
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
      
      {/* Task Edit Modal */}
      {renderTaskEditForm()}
    </div>
  );
}