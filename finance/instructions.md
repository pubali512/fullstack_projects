# React for front-end setup 

- Prerequisites:
  - Node.js installed (https://nodejs.org/en/ - LTS)
  - VS code extensions: React, Vite, JavaScript syntax highlighting, Prettier, Tailwind CSS IntelliSense 


- Project structure:
  - src/
    - app/ (App shell, routing)
    - pages/ (e.g., Projects, Tasks, Timesheet)
    - components/ (Header, etc.)
    - services/ (API calls)
    - styles/ (CSS files)
    - main.jsx (entry point)
    - index.css (global styles)
  - index.html (Vite template) 
  - package.json (dependencies, scripts)
  - vite.config.js (Vite configuration)
  - package-lock.json (dependency tree) 


## Setup commands and steps

==============================================================
- First time React installation
    - Create React app with Vite: 
    ```powershell
      npm create vite@latest <project-directory> 
    ```  
    Choose React + JavaScript when prompted
- Otherwise 
    - Initialize Vite with the React JavaScript template
    ```powershell
      cd <project-directory>
      npm init vite . -- --template react 
    ``` 
==============================================================
- Install base dependencies (React, Vite, etc.): 
```powershell
  cd <project-directory>
  npm install
```
==============================================================
- Create files tailwind.config.js in frontend folder and 
  update the content
- Add Tailwind Directives in src/index.css
- Remove App.css from src folder as Tailwind css is used 
  globally
-  Install Vite Plugin (In Tailwind v4, postcss is no longer 
  used. Instead, a dedicated Vite plugin is used.)
  - npm install @tailwindcss/vite

==============================================================
- Verify the CSS Import
    - src/main.jsx
==============================================================
- Start development server: 
```powershell
  npm run dev
```

- Open browser at http://localhost:5173/ to see the app running 

==============================================================
- Install Routing & Icons
    - npm install react-router-dom lucide-react

==============================================================
- Organize the Folder Structure
│ timesheet/frontend/
│
├─ public/
│
├─ src/
│  ├─ app/                # App shell & routing
│  │  └─ App.jsx
│  │
│  ├─ pages/              # Top-level screens
│  │  ├─ Dashboard.jsx     # Current balance, check transaction history on selected period for all categories statement
│  │  ├─ Transactions.jsx  # Date, Description, Category, Amount
│  │  └─ Categories.jsx.   # Category, Total expense, Selected Month for selected Year
│  │
│  ├─ components/         
│  │  └─ Navbar.jsx      # Navigation Sidebar: This uses Link from react-router-dom to change pages without a browser refresh.
│  │  └─ StatCard.jsx    # Reusable UI components
│  │
│  ├─ services/           # API / data access 
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
==============================================================
- Transactions.jsx
export default function Transactions() {
  // 1. STATE DEFINITIONS
  const [transactions, setTransactions] = useState(INITIAL_DATA);
  const [editId, setEditId] = useState(null); 
  const [editFormData, setEditFormData] = useState({});

  // 2. INTERACTION LOGIC 
  const handleEditClick = (transaction) => {
    setEditId(transaction.id);      // Tells React which row to turn into inputs
    setEditFormData(transaction);   // Pre-fills the inputs with current data
  };

  // 3. OTHER LOGIC (Save, Delete, Fetch)
  const handleSave = () => {
    setTransactions(transactions.map(t => t.id === editId ? editFormData : t));
    setEditId(null);
  };

  // 4. THE RENDER (JSX)
  return (
    <div className="space-y-6">
      {/* ... your table code ... */}
    </div>
  );
}
==============================================================
- Categories.jsx
    Logic:

        Filter transactions by the selected Month/Year.

        Group them by Category.

        Sum only the negative values (Expenses).
==============================================================
- OldloadData

const loadData = async () => {
    setLoading(true);
    try {
      const data = await transactionService.getAll();
      // If the service returns data (even from its own internal fallback), set it
      setTransactions(data);
    } catch (error) {
      console.error("API Error, using local mockData fallback:", error);
      // Manual fallback to the imported mockData if the service fails entirely
      setTransactions(mockData);
    } finally {
      setLoading(false);
    }
  };
==============================================================
- Old handleSave

const handleSave = async () => {
    try {
      await transactionService.update(editId, editFormData);
      setEditId(null);
      await loadData(); // Refresh list
    } catch (error) {
      // If API fails, update local state only so you can still test the UI
      setTransactions(transactions.map(t => t.id === editId ? editFormData : t));
      setEditId(null);
      console.warn("Saved to local state only (Flask offline)");
    }
  };
==============================================================
- Old handleDelete

const handleDelete = async (id) => {
    if (window.confirm("Delete this transaction?")) {
      try {
        await transactionService.delete(id);
        await loadData();
      } catch (error) {
        setTransactions(transactions.filter(t => t.id !== id));
        console.warn("Deleted from local state only (Flask offline)");
      }
    }
  };


## Troubleshooting/issues  

- npm might not run because of execution policy on Windows. To fix, run PowerShell as administrator and execute: 
```powershell
  Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

# Flask backend setup 

- Prerequisites:
  - Java JDK installed (https://adoptium.net/ - JDK 21) 
    - JAVA_HOME environment variable set to JDK installation path 
    - Path extended to include JDK bin directory 
  - Maven installed (https://maven.apache.org/download.cgi) (Maven 3.9.x or later)
    - MAVEN_HOME environment variable set to Maven installation path 
    - Path extended to include Maven bin directory
    - Test with mvn -v in terminal to confirm installation
  - VS code extensions: Java Extension Pack, Spring Boot Extension Pack, Java Test Runner, Maven for Java 
  - Optional: Postman for API testing (https://www.postman.com/downloads/) 

- Backend Directory structure
  finance-app/ (Root)
  ├── backend/ (Flask)
      ├── venv/ (All your libraries are hidden here)
      ├── app/
      ├── requirements.txt
      └── run.py

## Setup commands and steps

- Build and run Spring Boot application: 
```powershell
  mvn clean install 
  mvn spring-boot:run
```

==============================================================
- Migration 
  - Step 1: # Ensure one should be in the 'backend' folder  
            # and venv is active before running
            export FLASK_APP=run.py
            flask db init
  - Step 2: Generate the Migration Script (The "Commit")
            flask db migrate -m "Added category and 
            transaction tables for analytics"
  - Step 3: Apply the Migration (The "Push")
            flask db upgrade
==============================================================
==============================================================
==============================================================
==============================================================
==============================================================
==============================================================
==============================================================
==============================================================


## Troubleshooting/issues