
import React, { useState } from 'react';
import '../styles/Common.css';
import '../styles/Projects.css'

// Import mock data or API services as needed
import { projects, tasks, createProject } from '../services/api';


const FormState = {
  create_project: {
    projectName: '',
    projectId: '',
    description: '',
  },
  create_task: {
    project: '',
    taskName: '',
    taskId: '',
    description: '',
  },
  edit_project: {
    selectProjectId: '',
    projectName: '',
    description: '',
  },
  edit_task: {
    selectProjectId: '',
    selectTaskId: '',
    taskName: '',
    description: '',
  },
};


// A truly generic handler
function handleGenericChange(formName, e, setFormData) {

  const { name, value } = e.target;
  console.log(`Form: ${formName}, Field: ${name}, Value: ${value}`);

  setFormData(prev => ({
    ...prev,
    [formName]: {
      ...prev[formName],
      [name]: value
    }
  }));
};

function taskOptions(formData) {

  console.log('Generating task options for project ID:', formData.edit_task.selectProjectId); 
  console.log('Selected tasks:', tasks.filter(t => t.projectId === formData.edit_task.selectProjectId));

  return formData.edit_task.selectProjectId && tasks
    .filter(task => task.projectId === formData.edit_task.selectProjectId)
    .map(task => (
      <option key={task.id} value={task.id}>{task.name}</option>
    ));
}

async function handleSubmit(formName, e, formData) {
  console.log(`Submitting form: ${formName}`, formData[formName]);

  let response = null;

  switch (formName) {
    case 'create_project':
      response = await createProject(formData[formName]);
      break;
    case 'create_task':
      // response = await createTask(formData[formName]);
      break;
    case 'edit_project':
      // response = await updateProject(formData[formName]);
      break;
    case 'edit_task':
      // response = await updateTask(formData[formName]);
      break;
    default:
      console.error('Unknown form submission:', formName);
  }

  console.log('API Response:', response);
}

function CreateProjectForm({ formData, setFormData }) {

  return (
    <>
      <div className="form-container">
        <h3 className='form-header'>Create New Project</h3>
        <div className="form-grid">
          <label>Project Name</label>
          <input
            type="text"
            className="input-field-small"
            placeholder={formData.create_project.projectName || "Project Name"}
            name="projectName"
            onChange={e => handleGenericChange('create_project', e, setFormData)}
          />

          <label>Project ID</label>
          <input
            type="text"
            className="input-field-small"
            placeholder={formData.create_project.projectId || "Project ID"}
            name="projectId"
            onChange={e => handleGenericChange('create_project', e, setFormData)}
          />

          <label>Description</label>
          <textarea
            className="input-textarea"
            placeholder={formData.create_project.description || "Project Description"}
            name="description"
            onChange={e => handleGenericChange('create_project', e, setFormData)}
          ></textarea>

        </div>
        <button
          className="apply-button"
          onClick={e => handleSubmit('create_project', e, formData)}
        >
          Apply
        </button>
      </div>
    </>
  );
}

function CreateTaskForm({ formData, setFormData }) {
  return (
    <>
      <div className="form-container">
        <h3 className='form-header'>Create New Task</h3>
        <div className="form-grid">
          <label>Project ID</label>
          <select
            className="input-field-small"
            name="project"
            value={formData.create_task.project}
            onChange={e => handleGenericChange('create_task', e, setFormData)}
          >
            <option>Select Existing Project...</option>
            {projects.map(p => <option key={p.id}>{p.name}</option>)}
          </select>

          <label>Task Name</label>
          <input
            type="text"
            className="input-field-small"
            placeholder={formData.create_task.taskName || "Task Name"}
            name="taskName"
            onChange={e => handleGenericChange('create_task', e, setFormData)}
          />

          <label>Task ID</label>
          <input
            type="text"
            className="input-field-small"
            placeholder={formData.create_task.taskId || "Task ID"}
            name="taskId"
            onChange={e => handleGenericChange('create_task', e, setFormData)}
          />

          <label>Description</label>
          <textarea
            className="input-textarea"
            placeholder={formData.create_task.description || "Description"}
            name="description"
            onChange={e => handleGenericChange('create_task', e, setFormData)}
          ></textarea>
        </div>
        <button
          className="apply-button"
          onClick={e => handleSubmit('create_task', e, formData)}
        >
          Apply
        </button>

      </div>
    </>
  );
}

function EditProjectForm({ formData, setFormData }) {
  return (
    <>
      <div className='form-container'>
        <h3 className='form-header'>Edit Project</h3>
        <div className="form-grid">
          <label>Project ID</label>
          <select
            className="input-field-small"
            name="selectProjectId"
            value={formData.edit_project.selectProjectId}
            onChange={e => handleGenericChange('edit_project', e, setFormData)}
          >
            <option>Select Project to Edit...</option>
            {projects.map(p => (
              <option key={p.id}>{p.id} ({p.name})</option>
            ))}
          </select>

          <label>Project Name</label>
          <input
            type="text"
            className="input-field-small"
            placeholder={formData.edit_project.projectName || "New Project Name"}
            name="projectName"
            onChange={e => handleGenericChange('edit_project', e, setFormData)}
          />

          <label>Description</label>
          <textarea
            className="input-textarea"
            placeholder={formData.edit_project.description || "New Description"}
            name="description"
            onChange={e => handleGenericChange('edit_project', e, setFormData)}
          ></textarea>
        </div>

        <button
          className="apply-button"
          onClick={e => handleSubmit('edit_project', e, formData)}
        >
          Apply
        </button>
      </div>
    </>
  );
}

function EditTaskForm({ formData, setFormData }) {
  return (
    <>
      <div className='form-container'>
        <h3 className='form-header'>Edit Task</h3>
        <div className="form-grid">
          <label>Project</label>
          <select
            className="input-field-small"
            name="selectProjectId"
            value={formData.edit_task.selectProjectId}
            onChange={e => handleGenericChange('edit_task', e, setFormData)}
          >
            <option>Select Project...</option>
            {projects.map(p => <option key={p.id}>{p.id} ({p.name })</option>)}
          </select>

          <label>Task ID</label>
          <select
            className="input-field-small"
            name="selectTaskId"
            value={formData.edit_task.selectTaskId}
            onChange={e => handleGenericChange('edit_task', e, setFormData)}
          >
            <option>Select Task...</option>
            {taskOptions(formData)}
          </select>

          <label>Task Name</label>
          <input
            type="text"
            className="input-field-small"
            placeholder={formData.edit_task.taskName || "New Task Name"}
            name="taskName"
            onChange={e => handleGenericChange('edit_task', e, setFormData)}
          />

          <label>Description</label>
          <textarea
            className="input-textarea"
            placeholder={formData.edit_task.description || "New Description"}
            name="description"
            onChange={e => handleGenericChange('edit_task', e, setFormData)}
          ></textarea>

        </div>

        <button
          className="apply-button"
          onClick={e => handleSubmit('edit_task', e, formData)}
        >
          Apply
        </button>

      </div>
    </>
  );
}


function RenderForm({ mode, formData, setFormData }) {
  console.log(`Rendering form for mode: ${mode}`);
  console.log(formData);

  switch (mode) {
    case 'create_project':
      return <CreateProjectForm formData={formData} setFormData={setFormData} />;
    case 'create_task':
      return <CreateTaskForm formData={formData} setFormData={setFormData} />;
    case 'edit_project':
      return <EditProjectForm formData={formData} setFormData={setFormData} />;
    case 'edit_task':
      return <EditTaskForm formData={formData} setFormData={setFormData} />;
    default: return null;
  }
}

function ModePickerSidebar({ setMode }) {

  const modes = [
    { key: 'create_project', label: 'Create Project' },
    { key: 'create_task', label: 'Create Task' },
    { key: 'edit_project', label: 'Edit Project' },
    { key: 'edit_task', label: 'Edit Task' },
  ];

  return (
    <aside className='sidebar'>
      <div className="sidebar-cards">
        {modes.map(mode => (
          <button
            key={mode.key}
            className="sidebar-card"
            onClick={() => setMode(mode.key)}
            style={{ width: 'calc(100% - 20px)', margin: '10px' }}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </aside>
  );
}

export default function ProjectsPage() {

  const [mode, setMode] = useState('create_project');
  const [formData, setFormData] = useState(FormState);


  return (
    <div className="container">
      {/* LEFT PANEL: MODE SELECTION */}
      <ModePickerSidebar setMode={setMode} />

      {/* RIGHT PANEL: FORM CONTEXT */}
      <main className='main-form-area'>
        <RenderForm mode={mode} formData={formData} setFormData={setFormData} />
      </main>
    </div>
  );
}