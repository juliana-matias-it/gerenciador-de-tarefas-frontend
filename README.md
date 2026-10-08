# Task Manager Frontend

Frontend application for a task management system built with Angular.

The application allows users to register, create tasks, edit them, mark them as completed, and delete them through a responsive pixel-art inspired interface.

The frontend communicates with a REST API built with ASP.NET Core.

## Preview

![Task Manager application preview](docs/images/task-manager.png)

## Features

- User registration
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
- Pixel-art inspired visual identity

## Technologies

- Angular
- TypeScript
- HTML
- CSS
- Reactive Forms
- Angular Router
- Angular HttpClient
- RxJS
- Local Storage

The application consumes a backend built with:

- .NET 10
- ASP.NET Core Web API
- Entity Framework Core
- SQLite

## Application Routes

| Route | Description |
| --- | --- |
| `/cadastro` | User registration |
| `/tarefas` | Task list |
| `/tarefas/nova` | Create a new task |
| `/tarefas/editar/:id` | Edit an existing task |

## Main Components

### User Registration

`CadastroUsuario`

Responsible for registering users.

The form validates:

- Name: required, between 3 and 50 characters
- Email: required and must have a valid format
- Password: required and at least 8 characters

After a successful registration, the user ID returned by the API is stored in `localStorage`.

This ID is used to retrieve tasks associated with the current user.

### Task List

`ListaTarefas`

Responsible for displaying the tasks associated with the current user.

Tasks are separated into:

- Pending
- Completed

Available actions include:

- Edit
- Complete
- Delete

The list is automatically refreshed after completing or deleting a task.

### Task Form

`FormularioTarefa`

A reusable component responsible for both creating and editing tasks.

It automatically determines the mode based on the current route:

- `/tarefas/nova` → Create mode
- `/tarefas/editar/:id` → Edit mode

The form contains:

- Title
- Description
- Due date

## Services

### UsuarioService

Handles communication with the user endpoints of the API.

Main operations:

- Register a user
- Retrieve a user by ID

### TarefaService

Handles communication with the task endpoints of the API.

Main operations:

- List tasks
- Retrieve a task by ID
- Create a task
- Update a task
- Complete a task
- Delete a task

## API Integration

The frontend communicates with the backend through HTTP requests.

The API is expected to run locally at:

```text
http://localhost:5161
```

The user endpoints use the following base URL:

```text
http://localhost:5161/api/usuarios
```

Task endpoints follow the structure:

```text
/api/usuarios/{usuarioId}/tarefas
```

Example:

```text
GET /api/usuarios/{usuarioId}/tarefas
POST /api/usuarios/{usuarioId}/tarefas
PUT /api/usuarios/{usuarioId}/tarefas/{id}
PATCH /api/usuarios/{usuarioId}/tarefas/{id}
DELETE /api/usuarios/{usuarioId}/tarefas/{id}
```

## Running the Project

### Requirements

Make sure you have installed:

- Node.js
- npm
- Angular CLI

The backend API must also be running.

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

or:

```bash
ng serve
```

The application will be available at:

```text
http://localhost:4200
```

## Backend

This frontend depends on the Task Manager backend API.

Backend repository:

```text
https://github.com/juliana-matias-it/gerenciador-de-tarefas-backend
```

The backend uses ASP.NET Core Web API, Entity Framework Core and SQLite.

Both applications must be running for the complete system to work.

## Current User Handling

The project currently stores the ID of the most recently registered user in the browser's `localStorage`.

This allows the frontend to determine which user's tasks should be loaded without implementing an authentication system.

Authentication and login are outside the current project scope and can be added as future improvements.

## Visual Design

The interface uses a custom pixel-art inspired visual identity.

The main color palette includes:

- Pink
- Lime green
- Purple
- Blue

The UI uses pixel-style typography, hard borders and offset shadows to create a retro game-inspired appearance.

## Project Background

This project originated as a collaborative activity developed during the WoMakersCode bootcamp.

The original project was divided among multiple contributors through GitHub issues and feature branches.

This repository is my personal portfolio version of the frontend. It preserves the collaborative project history while including additional integration, interface and functional work completed for the portfolio version.

## Future Improvements

Possible future improvements include:

- User authentication and login
- Secure session management
- Route guards
- Confirmation before deleting tasks
- Loading indicators
- Improved accessibility
- Additional automated tests
- Shared design styles to reduce duplicated CSS
- Environment-based API configuration

## Author

**Juliana Matias**

Software Developer

GitHub: [juliana-matias-it](https://github.com/juliana-matias-it)