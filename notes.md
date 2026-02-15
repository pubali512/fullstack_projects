# React for front-end setup 

- Prerequisites:
  - Node.js installed (https://nodejs.org/en/ - LTS))
  - VS code extensions: React, Vite, JavaScript syntax highlighting, Prettier 


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

- Create React app with Vite: 
```powershell
  npm create vite@latest <project-directory> 
```  
Choose React + JavaScript when prompted

- Install dependencies (React, Vite, etc.): 
```powershell
  cd <project-directory>
  npm install
```

- Start development server: 
```powershell
  npm run dev
```

- Open browser at http://localhost:5173/ to see the app running 


## Troubleshooting/issues  

- npm might not run because of execution policy on Windows. To fix, run PowerShell as administrator and execute: 
```powershell
  Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

# Spring boot backend setup 

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

- Project structure: *TBD*

## Setup commands and steps

- Build and run Spring Boot application: 
```powershell
  mvn clean install 
  mvn spring-boot:run
```

- Open

## Troubleshooting/issues