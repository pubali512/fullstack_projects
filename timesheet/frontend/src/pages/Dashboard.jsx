import React, { useState } from 'react';
import '../styles/Common.css';
import '../styles/Dashboard.css'
import '../styles/Projects.css'

import { getMondayOfWeek, getSundayOfWeek, getFirstDayOfCurrMonth, getLastDayOfCurrMonth, getMondayOfCurrentWeek, getSundayOfCurrentWeek } from '../components/Utils'; 

// Import mock data or API services as needed
import { timeEntries } from '../services/Api';

const modes = ["Current week", "Current month", "Selected dates"];

function handleFilterChange(e, setMode, setStartDate, setEndDate) {
  const selectedMode = e.target.value;
  setMode(selectedMode);

  if (selectedMode === modes[0]) {
    setStartDate(getMondayOfCurrentWeek());
    setEndDate(getSundayOfCurrentWeek());
  } else if (selectedMode === modes[1]) {

    setStartDate(getFirstDayOfCurrMonth());
    setEndDate(getLastDayOfCurrMonth());

  } else {
    setStartDate('');
    setEndDate('');
  }

}

function DateSelectionInputs({ mode, setStartDate, setEndDate }) {

  if (mode === modes[2]) {
    return (
      <>
        <div className='dashboard-input'>
          <label className='dashboard-label'>Start </label>
          <input type="date" id="startDate" onChange={e => setStartDate(e.target.value)} />
        </div>
        <div className='dashboard-input'>
          <label className='dashboard-label'>End </label>
          <input type="date" id="endDate" onChange={e => setEndDate(e.target.value)} />
        </div></>);
  } else {
    return (<></>);
  }
}

function DateSelectorSidebar({ mode, setMode, setStartDate, setEndDate }) {
  return (
    <>
      <aside className='sidebar'>
        <div className='dashboard-input'>
          <label className='dashboard-label'>Show Details for</label>
          <select
            id="dateFilter"
            onChange={e => handleFilterChange(e, setMode, setStartDate, setEndDate)}
          >
            {modes.map(m =>
              <option key={m}>{m}</option>
            )}
          </select>
        </div>
        <DateSelectionInputs mode={mode} setStartDate={setStartDate} setEndDate={setEndDate} />
      </aside>
    </>
  )
}


function DetailsArea({ startDate, endDate }) {

  console.log (`Rendering DetailsArea with Start Date: ${startDate} and End Date: ${endDate}`); 

  // Calculate Total Hours for the Percentage denominator
  const totalHoursOverall = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);

  // Group entries by Project and Task
  const groupedData = timeEntries.reduce((acc, entry) => {
    const key = `${entry.projectId}-${entry.taskId}`;
    if (!acc[key]) {
      acc[key] = {
        projectId: entry.projectId,
        taskId: entry.taskId,
        hours: 0
      };
    }
    acc[key].hours += entry.hours;
    return acc;
  }, {});

  // Convert to array and calculate percentage
  const tableRows = Object.values(groupedData).map(row => ({
    ...row,
    percentage: ((row.hours / totalHoursOverall) * 100).toFixed(1)
  }));


  console.log(tableRows);


  return (
    <>
      <main className="dashboard-content">
        <div className="table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Task</th>
                <th style={{ textAlign: 'right' }}>Hours</th>
                <th style={{ textAlign: 'right' }}>% of Total</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr key={`${row.projectId}-${row.taskId}`}>
                  <td>{row.projectId}</td>
                  <td>{row.taskId}</td>
                  <td style={{ textAlign: 'right' }}>{row.hours}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                      <span>{row.percentage}%</span>
                      {/* Visual spark-bar */}
                      <div style={{ width: '50px', backgroundColor: '#eee', height: '8px', borderRadius: '4px' }}>
                        <div style={{
                          width: `${row.percentage}%`,
                          backgroundColor: '#0056b3',
                          height: '100%',
                          borderRadius: '4px'
                        }}></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>
                <td colSpan="2">Total</td>
                <td style={{ textAlign: 'right' }}>{totalHoursOverall}</td>
                <td style={{ textAlign: 'right' }}>100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </main>
    </>
  )
}


export default function DashboardPage() {
  const [mode, setMode] = useState(modes[0]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className='container'>
      <DateSelectorSidebar
        mode={mode}
        setMode={setMode}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      <DetailsArea
        startDate={startDate} endDate={endDate} />
    </div>
  );
}