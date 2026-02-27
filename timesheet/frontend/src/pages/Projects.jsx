
import React, { useState } from 'react';
import '../styles/Common.css';
import '../styles/Projects.css'

// Import mock data or API services as needed
import { AlertPopup } from '../components/UIComponents';

import {
  createProject,
  createTask,
  updateProject,
  updateTask
} from '../services/Api';

import {
  extractIdFromIdNameTag,
  getTasksForProject,
  getTasksForProjectAndTaskId
} from '../components/Utils';


const FormState = {
  create_project: {
    projectName: '',
    projectId: '',
    description: '',
  },
  create_task: {
    projectId: '',
    taskName: '',
    taskId: '',
    description: '',
  },
  edit_project: {
    projectId: '',
    projectName: '',
    description: '',
  },
  edit_task: {
    projectId: '',
    taskId: '',
    taskName: '',
    description: '',
  },
};




// A truly generic handler
function handleGenericInputChange(formName, e, setFormData) {

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


function getNewProjectName(formData, projects, projectId) {
  const existingProject = projects.find(p => p.projectId === projectId);
  return formData.edit_project.projectName ||
    (existingProject ? existingProject.projectName : '');
}

function getNewProjectDescription(formData, projects, projectId) {
  const existingProject = projects.find(p => p.projectId === projectId);
  return formData.edit_project.description ||
    (existingProject ? existingProject.description : '');
}

function getNewTaskName(formData, projects, projectId, taskId) {
  const task = getTasksForProjectAndTaskId(projects, projectId, taskId);
  return formData.edit_task.taskName ||
    (task ? task.taskName : '');
}

function getNewTaskDescription(formData, projects, projectId, taskId) {
  const task = getTasksForProjectAndTaskId(projects, projectId, taskId);
  return formData.edit_task.description ||
    (task ? task.description : '');
}


function generateTaskOptions(formData, projects) {

  const extractedProjectId = extractIdFromIdNameTag(formData.edit_task.projectId);
  console.log('Generating task options for project ID:', extractedProjectId);

  return formData.edit_task.projectId &&
    getTasksForProject(projects, extractedProjectId).
      map(task => (
        <option key={task.taskId} value={task.taskId}>
          {task.taskId} ({task.taskName})
        </option>
      ));
}

function updateProjectsState(formName, formData, projects, setProjects) {

  const data = formData[formName];

  switch (formName) {
    case 'create_project':
      {
        const updatedData = {
          projectId: data.projectId,
          projectName: data.projectName,
          description: data.description,
          tasks: []
        };
        setProjects(prev => [...prev, updatedData]);
      }
      break;

    case 'create_task':
      {
        const updatedData = {
          taskId: data.taskId,
          taskName: data.taskName,
          description: data.description,
          note: data.note,
          employeeName: '',
          timesheets: [],
        };
        const projectId = extractIdFromIdNameTag(data.projectId);
        setProjects(prev => prev.map(p => {
          if (p.projectId === projectId) {
            return {
              ...p,
              tasks: [...(p.tasks || []), updatedData]
            };
          }
          return p;
        }));
      }
      break;

    case 'edit_project':
      {
        setProjects(prev => prev.map(p => {
          if (p.projectId === extractIdFromIdNameTag(data.projectId)) {
            return {
              ...p,
              projectName: data.projectName || p.projectName,
              description: data.description || p.description,
            };
          }
          return p;
        }));
      }
      break;

    case 'edit_task':
      {
        setProjects(prev => prev.map(p => {
          if (p.projectId === extractIdFromIdNameTag(data.projectId)) {
            return {
              ...p,
              tasks: p.tasks.map(t => {
                if (t.taskId === extractIdFromIdNameTag(data.taskId)) {
                  return {
                    ...t,
                    taskName: data.taskName || t.taskName,
                    description: data.description || t.description,
                  };
                }
                return t;
              })
            };
          }
          return p;
        }));
      }
      break;
  }

  console.log('Updated Projects State:', projects);
}

function validateFormData(formName, formData, projects, showAlert) {
  const data = formData[formName];

  let errMsg = '';
  switch (formName) {
    case 'create_project':
      if (!data.projectId || !data.projectName) {
        errMsg = 'Project ID and Project Name are required.';
      }
      else if (projects.some(p => p.projectId === data.projectId)) {
        errMsg = 'Project ID must be unique. A project with this ID already exists.';
      }
      break;

    case 'create_task':
      if (!data.projectId || !data.taskId || !data.taskName) {
        errMsg = 'Project, Task ID, and Task Name are required.';
      }
      break;

    case 'edit_project':
      if (!data.projectId) {
        errMsg = 'Project selection is required.';
      }
      break;

    case 'edit_task':
      if (!data.projectId || !data.taskId) {
        errMsg = 'Project and Task selection are required.';
      }
      break;
  }

  console.log(`Validating form data for ${formName}:`, errMsg ? `Error - ${errMsg}` : 'Validation passed');

  if (errMsg) {
    showAlert(errMsg);
    return false;
  }
  return true;
}


async function handleSubmit(formName, e, formData, projects, setProjects, showAlert) {
  console.log(`Submitting form: ${formName}`, formData[formName]);

  let response = null;

  if (!validateFormData(formName, formData, projects, showAlert)) {
    return;
  }

  switch (formName) {
    case 'create_project':
      response = await createProject(formData[formName]);
      break;
    case 'create_task':
      response = await createTask(formData[formName]);
      break;
    case 'edit_project':
      response = await updateProject(formData[formName]);
      break;
    case 'edit_task':
      response = await updateTask(formData[formName]);
      break;
    default:
      console.error('Unknown form submission:', formName);
  }

  console.log('API Response:', response);
  updateProjectsState(formName, formData, projects, setProjects);
}


function CreateProjectForm({ projects, setProjects, formData, setFormData, showAlert }) {

  return (
    <>
      <div className="form-container">
        <h3 className='form-header'>Create New Project</h3>
        <div className="form-grid">

          <label>Project ID</label>
          <input
            type="text"
            className="input-field-small"
            placeholder={formData.create_project.projectId || "Project ID"}
            name="projectId"
            onChange={e => handleGenericInputChange('create_project', e, setFormData)}
          />

          <label>Project Name</label>
          <input
            type="text"
            className="input-field-small"
            placeholder={formData.create_project.projectName || "Project Name"}
            name="projectName"
            onChange={e => handleGenericInputChange('create_project', e, setFormData)}
          />

          <label>Description</label>
          <textarea
            className="input-textarea"
            placeholder={formData.create_project.description || "Project Description"}
            name="description"
            onChange={e => handleGenericInputChange('create_project', e, setFormData)}
          ></textarea>

        </div>
        <button
          className="apply-button"
          onClick={e => handleSubmit('create_project', e, formData, projects, setProjects, showAlert)}
        >
          Apply
        </button>
      </div>
    </>
  );
}

function CreateTaskForm({ projects, setProjects, formData, setFormData, showAlert }) {
  return (
    <>
      <div className="form-container">
        <h3 className='form-header'>Create New Task</h3>
        <div className="form-grid">
          <label>Project ID</label>
          <select
            className="input-field-small"
            name="projectId"
            value={formData.create_task.projectId}
            onChange={e => handleGenericInputChange('create_task', e, setFormData)}
          >
            <option>Select Existing Project...</option>
            {projects.map(p => <option key={p.projectId}>{p.projectId} ({p.projectName})</option>)}
          </select>

          <label>Task ID</label>
          <input
            type="text"
            className="input-field-small"
            placeholder={formData.create_task.taskId || "Task ID"}
            name="taskId"
            onChange={e => handleGenericInputChange('create_task', e, setFormData)}
          />

          <label>Task Name</label>
          <input
            type="text"
            className="input-field-small"
            placeholder={formData.create_task.taskName || "Task Name"}
            name="taskName"
            onChange={e => handleGenericInputChange('create_task', e, setFormData)}
          />

          <label>Description</label>
          <textarea
            className="input-textarea"
            placeholder={formData.create_task.description || "Description"}
            name="description"
            onChange={e => handleGenericInputChange('create_task', e, setFormData)}
          ></textarea>
        </div>
        <button
          className="apply-button"
          onClick={e => handleSubmit('create_task', e, formData, projects, setProjects, showAlert)}
        >
          Apply
        </button>

      </div>
    </>
  );
}

function EditProjectForm({ projects, setProjects, formData, setFormData, showAlert }) {
  return (
    <>
      <div className='form-container'>
        <h3 className='form-header'>Edit Project</h3>
        <div className="form-grid">
          <label>Project</label>
          <select
            className="input-field-small"
            name="projectId"
            value={formData.edit_project.projectId}
            onChange={e => handleGenericInputChange('edit_project', e, setFormData)}
          >
            <option>Select Project to Edit...</option>
            {projects.map(p => (
              <option key={p.projectId}>{p.projectId} ({p.projectName})</option>)
            )}
          </select>

          <label>Project Name</label>
          <input
            type="text"
            className="input-field-small"
            placeholder={getNewProjectName(formData,
              projects,
              extractIdFromIdNameTag(formData.edit_project.projectId)) || "New Project Name"}
            name="projectName"
            onChange={e => handleGenericInputChange('edit_project', e, setFormData)}
          />

          <label>Description</label>
          <textarea
            className="input-textarea"
            placeholder={getNewProjectDescription(formData,
              projects,
              extractIdFromIdNameTag(formData.edit_project.projectId)) || "New Description"}
            name="description"
            onChange={e => handleGenericInputChange('edit_project', e, setFormData)}
          ></textarea>
        </div>

        <button
          className="apply-button"
          onClick={e => handleSubmit('edit_project', e, formData, projects, setProjects, showAlert)}
        >
          Apply
        </button>
      </div>
    </>
  );
}

function EditTaskForm({ projects, setProjects, formData, setFormData, showAlert }) {
  return (
    <>
      <div className='form-container'>
        <h3 className='form-header'>Edit Task</h3>
        <div className="form-grid">
          <label>Project</label>
          <select
            className="input-field-small"
            name="projectId"
            value={formData.edit_task.projectId}
            onChange={e => handleGenericInputChange('edit_task', e, setFormData)}
          >
            <option>Select Project...</option>
            {projects.map(p => <option key={p.projectId}>{p.projectId} ({p.projectName})</option>)}
          </select>

          <label>Task</label>
          <select
            className="input-field-small"
            name="taskId"
            value={formData.edit_task.taskId}
            onChange={e => handleGenericInputChange('edit_task', e, setFormData)}
          >
            <option>Select Task...</option>
            {generateTaskOptions(formData, projects)}
          </select>

          <label>Task Name</label>
          <input
            type="text"
            className="input-field-small"
            placeholder={
              getNewTaskName(formData,
                projects,
                extractIdFromIdNameTag(formData.edit_task.projectId),
                extractIdFromIdNameTag(formData.edit_task.taskId)) || "New Task Name"}
            name="taskName"
            onChange={e => handleGenericInputChange('edit_task', e, setFormData)}
          />

          <label>Description</label>
          <textarea
            className="input-textarea"
            placeholder={getNewTaskDescription(formData,
              projects,
              extractIdFromIdNameTag(formData.edit_task.projectId),
              extractIdFromIdNameTag(formData.edit_task.taskId)) || "New Description"}
            name="description"
            onChange={e => handleGenericInputChange('edit_task', e, setFormData)}
          ></textarea>

        </div>

        <button
          className="apply-button"
          onClick={e => handleSubmit('edit_task', e, formData, projects, setProjects, showAlert)}
        >
          Apply
        </button>

      </div>
    </>
  );
}


function RenderForm({ mode, formData, setFormData, projects, setProjects, showAlert }) {
  console.log(`Rendering form for mode: ${mode}`);
  console.log(formData);

  switch (mode) {
    case 'create_project':
      return <CreateProjectForm projects={projects} setProjects={setProjects} formData={formData} setFormData={setFormData} showAlert={showAlert} />;
    case 'create_task':
      return <CreateTaskForm projects={projects} setProjects={setProjects} formData={formData} setFormData={setFormData} showAlert={showAlert} />;
    case 'edit_project':
      return <EditProjectForm projects={projects} setProjects={setProjects} formData={formData} setFormData={setFormData} showAlert={showAlert} />;
    case 'edit_task':
      return <EditTaskForm projects={projects} setProjects={setProjects} formData={formData} setFormData={setFormData} showAlert={showAlert} />;
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



export default function ProjectsPage({ projects, setProjects }) {

  const [mode, setMode] = useState('create_project');
  const [formData, setFormData] = useState(FormState);

  const [alertMsg, setAlertMsg] = useState("");
  function showAlert(msg) {
    setAlertMsg(msg);
  }


  return (
    <div className="container">
      {/* LEFT PANEL: MODE SELECTION */}
      <ModePickerSidebar setMode={setMode} />

      {/* RIGHT PANEL: FORM CONTEXT */}
      <main className='main-form-area'>
        <RenderForm mode={mode}
          formData={formData}
          setFormData={setFormData}
          projects={projects}
          setProjects={setProjects}
          showAlert={showAlert}
        />
      </main>

      <AlertPopup
        message={alertMsg}
        onClose={() => setAlertMsg("")}
      />
    </div>
  );
}