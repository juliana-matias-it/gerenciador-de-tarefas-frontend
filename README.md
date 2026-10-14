# Task Manager Frontend

Frontend application for a task management system built with Angular.

The application allows users to register, log in, manage their tasks, and log out through a responsive interface.

The frontend communicates with a REST API built with ASP.NET Core.

## Features

- User registration
- User login and logout
- Form validation
- API error handling
- Task listing by user
- Separate pending and completed tasks
- Create new tasks
- Edit existing tasks
- Mark tasks as completed
- Delete tasks
- Empty-state messages
- Success and error feedback
- Responsive interface

## Technologies

- Angular
- TypeScript
- HTML
- CSS
- Reactive Forms
- Angular Router
- Angular HttpClient
- RxJS

The application consumes a backend built with:

- .NET 10
- ASP.NET Core Web API
- Entity Framework Core
- SQLite

## Main Features

### User Registration

Allows new users to create an account, with validation for name, email, and password.

### Login and Logout

Allows registered users to log in to access their tasks and log out when finished.

### Task List

Displays tasks associated with the current user, separated into pending and completed tasks.

Available actions include:

- Create a task
- Edit a task
- Mark a task as completed
- Delete a task

### Task Form

A reusable form for creating and editing tasks.

The form contains:

- Title
- Description
- Due date

## API Integration

The frontend communicates with the backend through HTTP requests.

The backend API must be running for registration, login, and task management to work.

The local API address used in the project is:

```text
http://localhost:5161
```

If your backend runs at a different address, update the API URLs configured in the frontend.

## Running the Project

### Requirements

- Node.js
- npm
- Backend API running locally

### 1. Clone the repository

```bash
git clone https://github.com/juliana-matias-it/gerenciador-de-tarefas-frontend.git
```

### 2. Enter the project directory

```bash
cd gerenciador-de-tarefas-frontend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the application

```bash
npm start
```

The application will be available at:

```text
http://localhost:4200
```

## Backend

This frontend depends on the Task Manager backend API, built with ASP.NET Core Web API, Entity Framework Core, and SQLite.

[Backend repository](https://github.com/juliana-matias-it/gerenciador-de-tarefas-backend)

Both applications must be running for the complete system to work.

## Project Background

This project was developed collaboratively during the WoMakersCode bootcamp.

The team organized the work through GitHub issues, feature branches, and pull requests.

This repository is a personal fork synchronized with the final version of the collaborative project and maintained as part of my portfolio.

Original repositories:

- [Frontend](https://github.com/womakers-squad-jaqueline-goes/gerenciador-de-tarefas-frontend)
- [Backend](https://github.com/womakers-squad-jaqueline-goes/gerenciador-de-tarefas-backend)

## Portfolio

**Juliana Matias**

Software Developer

[GitHub](https://github.com/juliana-matias-it)
