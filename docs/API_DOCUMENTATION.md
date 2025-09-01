# TaskFlow API Documentation

## Overview

The TaskFlow API provides a RESTful interface for managing projects, tasks, users, and dependencies. All endpoints return JSON responses and use standard HTTP status codes.

**Base URL**: `http://localhost:5000/api` (development)

## Authentication

Currently, the API operates without authentication. In production, consider implementing JWT tokens or session-based authentication.

## Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Endpoints

### Health Check

#### GET /health
Check API server status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### User Management

#### GET /api/user
Get all users.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "developer",
      "createdAt": 1705312200000,
      "updatedAt": 1705312200000
    }
  ]
}
```

#### POST /api/user
Create a new user.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "manager"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "manager",
    "createdAt": 1705312200000,
    "updatedAt": 1705312200000
  }
}
```

#### PUT /api/user/:id
Update an existing user.

**Request Body:**
```json
{
  "name": "Jane Smith Updated",
  "role": "developer"
}
```

#### DELETE /api/user/:id
Delete a user.

### Project Management

#### GET /api/projects
Get all projects.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439013",
      "title": "Website Redesign",
      "description": "Modernize company website",
      "owner_id": "507f1f77bcf86cd799439011",
      "deadline": 1708128000000,
      "status": "active",
      "createdAt": 1705312200000,
      "updatedAt": 1705312200000
    }
  ]
}
```

#### GET /api/projects/:id
Get a specific project by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "title": "Website Redesign",
    "description": "Modernize company website",
    "owner_id": "507f1f77bcf86cd799439011",
    "deadline": 1708128000000,
    "status": "active",
    "createdAt": 1705312200000,
    "updatedAt": 1705312200000
  }
}
```

#### POST /api/projects
Create a new project.

**Request Body:**
```json
{
  "title": "Mobile App Development",
  "description": "Build iOS and Android apps",
  "owner_id": "507f1f77bcf86cd799439011",
  "deadline": 1708128000000
}
```

#### PUT /api/projects/:id
Update an existing project.

**Request Body:**
```json
{
  "title": "Mobile App Development Updated",
  "status": "completed"
}
```

#### DELETE /api/projects/:id
Delete a project.

#### GET /api/projects/:id/critical-path
Get critical path analysis for a project.

**Response:**
```json
{
  "success": true,
  "data": {
    "criticalPath": {
      "criticalPath": {
        "tasks": [
          {
            "id": "507f1f77bcf86cd799439014",
            "title": "Design UI"
          }
        ],
        "edges": [
          {
            "source": "507f1f77bcf86cd799439014",
            "target": "507f1f77bcf86cd799439015"
          }
        ],
        "totalDuration": 120
      }
    }
  }
}
```

### Task Management

#### GET /api/tasks
Get all tasks.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439014",
      "project_id": "507f1f77bcf86cd799439013",
      "title": "Design Homepage",
      "description": "Create modern homepage design",
      "status": "in_progress",
      "priority": "high",
      "assignee_id": "507f1f77bcf86cd799439011",
      "estimated_hours": 16,
      "createdAt": 1705312200000,
      "updatedAt": 1705312200000
    }
  ]
}
```

#### GET /api/tasks/:id
Get a specific task by ID.

#### POST /api/tasks
Create a new task.

**Request Body:**
```json
{
  "project_id": "507f1f77bcf86cd799439013",
  "title": "Implement Login",
  "description": "Create user authentication system",
  "priority": "high",
  "assignee_id": "507f1f77bcf86cd799439011",
  "estimated_hours": 24
}
```

#### PUT /api/tasks/:id
Update an existing task.

#### PUT /api/tasks/:id/status
Update task status specifically.

**Request Body:**
```json
{
  "status": "done"
}
```

#### DELETE /api/tasks/:id
Delete a task.

### Data & Analytics

#### GET /api/data/projects/:id/tasks
Get all tasks for a specific project.

#### GET /api/data/projects/:id/dependencies
Get task dependencies for a project.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439016",
      "task_id": "507f1f77bcf86cd799439014",
      "depends_on_task_id": "507f1f77bcf86cd799439015",
      "createdAt": 1705312200000
    }
  ]
}
```

## Data Models

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'developer';
  createdAt: number;
  updatedAt: number;
}
```

### Project
```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  owner_id: string;
  deadline: number;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  createdAt: number;
  updatedAt: number;
}
```

### Task
```typescript
interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id?: string;
  estimated_hours?: number;
  createdAt: number;
  updatedAt: number;
}
```

### TaskDependency
```typescript
interface TaskDependency {
  id: string;
  task_id: string;
  depends_on_task_id: string;
  createdAt: number;
}
```

## Error Handling

The API uses centralized error handling with the following error types:

- **ValidationError**: Invalid request data
- **NotFoundError**: Resource not found
- **DatabaseError**: Database operation failures
- **GenericError**: Unexpected errors

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting for production use.

## CORS

CORS is enabled for all origins in development. Configure appropriately for production.

## Testing

Test the API endpoints using tools like:
- Postman
- Insomnia
- curl commands
- Automated testing frameworks

### Example curl commands

```bash
# Get all projects
curl http://localhost:5000/api/projects

# Create a new project
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Project","description":"Test","owner_id":"123","deadline":1708128000000}'

# Update task status
curl -X PUT http://localhost:5000/api/tasks/123/status \
  -H "Content-Type: application/json" \
  -d '{"status":"done"}'
```
