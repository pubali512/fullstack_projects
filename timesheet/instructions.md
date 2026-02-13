
# Windows React App Creation 

## **Create the React App (Timesheet Frontend)**

### **Step 1 — Choose / Create Workspace**

Open **PowerShell** and go to where you keep code.
Example:

```powershell
mkdir C:\dev
cd C:\dev
```

(If `C:\dev` already exists, just `cd` into it.)

---

### **Step 2 — Create React App with Vite**

Run:

```powershell
npm create vite@latest timesheet-frontend
```

When prompted, choose:

1. **Select a framework** → `React`
2. **Select a variant** → `JavaScript`

✔ This creates the project and installs the React template.

---

### **Step 3 — Install Dependencies**

```powershell
cd timesheet-frontend
npm install
```

This installs:

* React
* React DOM
* Vite
* Dev dependencies

---

### **Step 4 — Start Development Server**

```powershell
npm run dev
```

You should see something like:

```text
Local: http://localhost:5173/
```

Open that URL in your browser.

---

### **Step 5 — Verify Everything Works**

You should see:

* Vite + React welcome page
* Page loads fast
* No errors in terminal

Quick test:

1. Open `src/App.jsx`
2. Change some text
3. Save → browser auto-refreshes

✅ Hot reload working.

---

### **What You Have Now**

You’ve successfully created:

* A modern **React frontend**
* Local dev environment
* Cross-platform-ready setup
* Base for:

  * Web app
  * Tauri desktop app
  * Spring Boot backend integration

This is **exactly how production React apps start**.

---

### **Next Logical Step (Choose One)**

We should proceed methodically. Pick **one**:

1️⃣ **Clean up boilerplate**

* Remove demo content
* Prepare folder structure (`components/`, `pages/`, `services/`)

2️⃣ **Add basic layout**

* App shell
* Navigation
* Placeholder pages (Projects, Tasks, Timesheet)

3️⃣ **Prepare backend integration**

* API service
* Environment variables
* Mock data

Tell me **which number** you want next, and we’ll continue.


# React structure creation 

Perfect — this is the *right* moment to slow down and put a **clean, professional structure** in place.
We’ll keep it simple, scalable, and aligned with how React apps are built in real teams.

Below I’ll **explain first**, then give **exact steps**.

---

# **Target Project Structure (Frontend)**

We want to move from Vite’s demo layout to something like this:

```text
timesheet-frontend/
│
├─ public/
│
├─ src/
│  ├─ app/                # App shell & routing
│  │  └─ App.jsx
│  │
│  ├─ pages/              # Top-level screens
│  │  ├─ ProjectsPage.jsx
│  │  ├─ TasksPage.jsx
│  │  └─ TimesheetPage.jsx
│  │
│  ├─ components/         # Reusable UI components
│  │  └─ Header.jsx
│  │
│  ├─ services/           # API / data access (future)
│  │  └─ api.js
│  │
│  ├─ styles/             # Global styles
│  │  └─ main.css
│  │
│  ├─ main.jsx            # React entry point
│  └─ index.css
│
├─ package.json
└─ vite.config.js
```

This structure:

* Scales cleanly
* Separates concerns
* Is easy to explain in interviews

---

## **Step 1 — Clean Up Vite Boilerplate**

Inside `src/`, delete:

* `assets/`
* Any demo images/logos

Edit `src/App.jsx` → replace contents with:

```jsx
function App() {
  return (
    <div>
      <h1>Timesheet App</h1>
    </div>
  );
}

export default App;
```

This confirms we’re in control.

---

## **Step 2 — Create Folders**

From the project root (`timesheet-frontend`):

```powershell
mkdir src\pages
mkdir src\components
mkdir src\services
mkdir src\styles
mkdir src\app
```

---

## **Step 3 — Move App Component**

1. Move `App.jsx` into:

   ```text
   src/app/App.jsx
   ```

2. Update `src/main.jsx`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## **Step 4 — Add Placeholder Pages**

Create these files:

### `src/pages/ProjectsPage.jsx`

```jsx
export default function ProjectsPage() {
  return <h2>Projects</h2>;
}
```

### `src/pages/TasksPage.jsx`

```jsx
export default function TasksPage() {
  return <h2>Tasks</h2>;
}
```

### `src/pages/TimesheetPage.jsx`

```jsx
export default function TimesheetPage() {
  return <h2>Timesheet</h2>;
}
```

---

## **Step 5 — Verify Build Still Works**

Run:

```powershell
npm run dev
```

Open browser → you should see:

```
Timesheet App
```

No errors = clean foundation ✅

---

## **What You’ve Achieved**

You now have:

* A **non-demo React structure**
* Clear separation of concerns
* A foundation ready for:

  * Routing
  * Backend integration
  * Desktop packaging

This is **exactly what interviewers want to see**.

---

## **Next Step (Choose One)**

We proceed *one layer at a time*. Pick one:

1️⃣ **Add routing (React Router)**
2️⃣ **Create a basic layout + navigation**
3️⃣ **Introduce mock data + service layer**

Tell me the number and we’ll continue cleanly.
