import React, { useState } from 'react';

import '../styles/Common.css';
import '../styles/Timesheet.css';
import { getProjects, getTasks, getTimeEntriesForWeek } from '../services/Api';
import { getMondayOfWeek, getMondayOfCurrentWeek, } from '../components/Utils';



function convertDayToDate(selectedDateOfMonday, dayName) {
  const dayOffsets = {
    'Monday': 0,
    'Tuesday': 1,
    'Wednesday': 2,
    'Thursday': 3,
    'Friday': 4,
    'Saturday': 5,
    'Sunday': 6
  };

  console.log(`Converting ${dayName} with offset ${dayOffsets[dayName]} from base date ${selectedDateOfMonday}`);

  const convDate = new Date(selectedDateOfMonday);
  convDate.setDate(convDate.getDate() + dayOffsets[dayName]);
  return convDate.toISOString().split('T')[0];
}

function handleDateSelection(e, setSelectedDateOfMonday) {
  const selectedDateOfMonday = getMondayOfWeek(e.target.value);

  console.log(`Selected week starting date: ${selectedDateOfMonday}`);
  setSelectedDateOfMonday(selectedDateOfMonday);
}

function handleTimeEntryChange(field, e, entryIdx, selectedDay, timesheetData, setTimesheetData) {
  const { name, value } = e.target;

  console.log(`Updating entry ${entryIdx} for ${selectedDay}: ${field} = ${value}`);

  const dayEntries = timesheetData[selectedDay];
  const entry = dayEntries[entryIdx];

  const updatedEntry = {
    ...entry,
    [field]: value
  };

  const updatedDayEntries = [
    ...dayEntries.slice(0, entryIdx),
    updatedEntry,
    ...dayEntries.slice(entryIdx + 1)
  ];

  setTimesheetData(prev => ({
    ...prev,
    [selectedDay]: updatedDayEntries
  }));

  console.log(`Updated timesheet data for ${selectedDay}:`, timesheetData[selectedDay]);

}


function DayPickerSidebar({ selectedDay, setSelectedDay, setSelectedDateOfMonday, timesheetData }) {
  return (
    <aside className="sidebar">
      <div className="week-selector">
        <label>Week Of </label>
        <input 
          type="date" 
          setdate={getMondayOfCurrentWeek()} 
          onChange={e => handleDateSelection(e, setSelectedDateOfMonday)} 
        />
      </div>

      <div className="day-list">
        {Object.keys(timesheetData).map(day => (
          <div
            key={day}
            className={`sidebar-card ${selectedDay === day ? 'active' : ''}`}
            onClick={() => setSelectedDay(day)}
          >
            <div className="sidebar-info">
              <span className="day-name">{day}</span>
              <span className="day-total">
                {timesheetData[day].reduce((sum, t) => 
                  sum + Number(t.hours || 0), 0)}h
              </span>
            </div>
          </div>
        ))}
      </div>

      <div>
        <center>
          <button className="apply-button">Apply</button>
        </center>
      </div>
    </aside>
  );
}

function TaskDetailsArea({ timesheetData, setTimesheetData, selectedDay, selectedDateOfMonday, addTask }) {

  console.log(selectedDay);

  return (
    <main className="task-details-area">
      <h2>
        <center>
          Log {selectedDay} ({convertDayToDate(selectedDateOfMonday, selectedDay)})
        </center>
      </h2>

      <div className="task-header-row">
        <span>Project</span>
        <span>Task</span>
        <span>Hours</span>
        <span>Notes</span>
      </div>

      {timesheetData[selectedDay].map((entry, index) => (
        <div key={entry.id} className="task-row">
          {/* PROJECT SELECT */}
          <select
            value={entry.projectId || ''}
            onChange={(e) =>
              handleTimeEntryChange(
                'projectId',
                e,
                index,
                selectedDay,
                timesheetData,
                setTimesheetData
              )
            }
          >
            <option value="">Select Project</option>
            {getProjects().map(p => (
              <option key={p.id} value={p.id}>
                {p.id} ({p.name})
              </option>
            ))}
          </select>

          {/* TASK SELECT (Dependent) */}
          <select
            value={entry.taskId || ''}
            disabled={!entry.projectId}
            onChange={(e) =>
              handleTimeEntryChange(
                'taskId',
                e,
                index,
                selectedDay,
                timesheetData,
                setTimesheetData
              )
            }
          >
            <option value="">Select Task</option>
            {getTasks({ projectId: entry.projectId }).map(t => (
              <option key={t.id} value={t.id}>
                {t.id} ({t.name})
              </option>
            ))}
          </select>

          {/* HOURS & NOTES */}
          <input
            type="number"
            value={entry.hours || ''}
            name="hours"
            onChange={(e) =>
              handleTimeEntryChange(
                'hours',
                e,
                index,
                selectedDay,
                timesheetData,
                setTimesheetData
              )
            }
            className="hrs-input"
          />
          <input
            type="text"
            value={entry.notes || ''}
            name="notes"
            onChange={(e) =>
              handleTimeEntryChange(
                'notes',
                e,
                index,
                selectedDay,
                timesheetData,
                setTimesheetData
              )
            }
            className="note-input"
          />
        </div>
      ))}

      <center>
        <button
          className="add-task-button"
          onClick={addTask}
        >
          + Add Task
        </button>
      </center>
    </main>
  );
}


export default function TimesheetPage() {

  // Date of year selected
  const [selectedDateOfMonday, setSelectedDateOfMonday] = useState(getMondayOfCurrentWeek());

  // Currently selected day of the week 
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Data structure: An object where keys are days, containing arrays of tasks
  const [timesheetData, setTimesheetData] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  });


  const addTask = () => {
    const newTask = { projectId: '', taskId: '', hours: '', notes: '' };
    setTimesheetData(prev => ({
      ...prev,
      [selectedDay]: [...prev[selectedDay], newTask]
    }));
  };

  

  return (
    <div className="container">
      {/* LEFT: Week Picker & Day Summary */}
      <DayPickerSidebar
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        setSelectedDateOfMonday={setSelectedDateOfMonday}
        timesheetData={timesheetData}
      />

      {/* RIGHT: Task List for selected day */}
      <TaskDetailsArea
        timesheetData={timesheetData}
        setTimesheetData={setTimesheetData}
        selectedDay={selectedDay}
        selectedDateOfMonday={selectedDateOfMonday}
        addTask={addTask}
      />
    </div>
  );
}