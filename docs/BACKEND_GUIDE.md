# TaskFlow Backend Development Guide

## Overview

The TaskFlow backend is a Node.js application built with Express.js and TypeScript. It provides a RESTful API for managing projects, tasks, users, and dependencies with MongoDB as the database and Mongoose as the ODM.

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.x
- **Language**: TypeScript 5.x
- **Database**: MongoDB 6+
- **ODM**: Mongoose 8.x
- **Validation**: Joi 18.x
- **CORS**: cors 2.x
- **Environment**: dotenv 17.x

## Project Structure

```
taskflow-backend/
├── src/
│   ├── config/              # Configuration files
│   │   └── db.ts           # Database connection
│   ├── controllers/         # Request handlers
│   │   ├── dataController.ts    # Data analytics endpoints
│   │   ├── projectController.ts # Project management
│   │   ├── taskController.ts    # Task management
│   │   └── userController.ts    # User management
│   ├── middleware/          # Express middleware
│   │   └── errorHandler.ts # Centralized error handling
│   ├── models/             # MongoDB schemas
│   │   ├── Projects.ts     # Project model
│   │   ├── Task.ts         # Task model
│   │   ├── TaskDependency.ts # Dependency model
│   │   └── User.ts         # User model
│   ├── routes/             # API route definitions
│   │   ├── dataRoutes.ts   # Data endpoints
│   │   ├── projectRoutes.ts # Project endpoints
│   │   ├── taskRoutes.ts   # Task endpoints
│   │   └── userRoutes.ts   # User endpoints
│   ├── services/           # Business logic layer
│   │   ├── dataService.ts  # Data operations
│   │   ├── projectService.ts # Project operations
│   │   ├── taskService.ts  # Task operations
│   │   └── userService.ts  # User operations
│   ├── types/              # TypeScript interfaces
│   │   └── index.ts        # Type definitions
│   ├── utils/              # Utility functions
│   │   └── dependencyValidator.ts # Dependency validation
│   ├── validation/         # Request validation
│   │   └── schema.ts       # Joi validation schemas
│   ├── app.ts              # Express application setup
│   └── index.ts            # Server entry point
├── package.json            # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## Architecture Overview

### Layered Architecture
The backend follows a layered architecture pattern:

1. **Routes Layer**: Define API endpoints and HTTP methods
2. **Controller Layer**: Handle HTTP requests and responses
3. **Service Layer**: Implement business logic
4. **Model Layer**: Database operations and data validation
5. **Middleware Layer**: Cross-cutting concerns (CORS, error handling)

### Data Flow
```
HTTP Request → Routes → Controllers → Services → Models → MongoDB
                ↓
HTTP Response ← Controllers ← Services ← Models ← MongoDB
```

## Database Design

### MongoDB Collections

#### Users Collection
```typescript
interface User {
  _id: ObjectId;
  name: string;
  email: string;
  role: UserRole;
  createdAt: number;
  updatedAt: number;
}
```

**Indexes:**
- `email` (unique)
- `role`
- `createdAt`

#### Projects Collection
```typescript
interface Project {
  _id: ObjectId;
  title: string;
  description: string;
  owner_id: ObjectId;
  deadline: number;
  status: ProjectStatus;
  createdAt: number;
  updatedAt: number;
}
```

**Indexes:**
- `owner_id`
- `status`
- `deadline`
- `createdAt`

#### Tasks Collection
```typescript
interface Task {
  _id: ObjectId;
  project_id: ObjectId;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_id?: ObjectId;
  estimated_hours?: number;
  createdAt: number;
  updatedAt: number;
}
```

**Indexes:**
- `project_id`
- `assignee_id`
- `status`
- `priority`
- `createdAt`

#### TaskDependencies Collection
```typescript
interface TaskDependency {
  _id: ObjectId;
  task_id: ObjectId;
  depends_on_task_id: ObjectId;
  createdAt: number;
}
```

**Indexes:**
- `task_id`
- `depends_on_task_id`
- Compound index on `(task_id, depends_on_task_id)`

### Database Connection
```typescript
// src/config/db.ts
import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
```

## API Development

### Route Definition
Routes are organized by resource type and define HTTP endpoints:

```typescript
// src/routes/projectRoutes.ts
import express from 'express';
import { projectController } from '../controllers/projectController';

const router = express.Router();

router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.get('/:id/critical-path', projectController.getCriticalPath);

export default router;
```

### Controller Implementation
Controllers handle HTTP requests and delegate business logic to services:

```typescript
// src/controllers/projectController.ts
import { Request, Response } from 'express';
import { projectService } from '../services/projectService';

export const projectController = {
  getAllProjects: async (req: Request, res: Response) => {
    try {
      const projects = await projectService.getAllProjects();
      res.json({
        success: true,
        data: projects
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch projects'
      });
    }
  },

  createProject: async (req: Request, res: Response) => {
    try {
      const project = await projectService.createProject(req.body);
      res.status(201).json({
        success: true,
        data: project
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
};
```

### Service Layer
Services contain business logic and database operations:

```typescript
// src/services/projectService.ts
import { ProjectModel } from '../models/Projects';
import { Project } from '../types';

export const projectService = {
  getAllProjects: async (): Promise<Project[]> => {
    return await ProjectModel.find().sort({ createdAt: -1 });
  },

  createProject: async (projectData: Partial<Project>): Promise<Project> => {
    const project = new ProjectModel({
      ...projectData,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    return await project.save();
  },

  updateProject: async (id: string, updateData: Partial<Project>): Promise<Project> => {
    const project = await ProjectModel.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    return project;
  }
};
```

### Model Definition
Models define MongoDB schemas with Mongoose:

```typescript
// src/models/Project.ts
import mongoose, { Schema } from 'mongoose';
import { Project, ProjectStatus } from '../types';

const ProjectSchema = new Schema<Project>({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  description: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 500
  },
  owner_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  deadline: { 
    type: Number, 
    required: true,
    min: Date.now()
  },
  status: {
    type: String,
    enum: Object.values(ProjectStatus),
    default: ProjectStatus.PLANNING
  },
  createdAt: { 
    type: Number, 
    default: Date.now 
  },
  updatedAt: { 
    type: Number, 
    default: Date.now 
  }
});

// Pre-save middleware
ProjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// JSON transformation
ProjectSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
});

export const ProjectModel = mongoose.model<Project>('Project', ProjectSchema);
```

## Validation

### Request Validation with Joi
```typescript
// src/validation/schema.ts
import Joi from 'joi';

export const projectSchema = Joi.object({
  title: Joi.string().required().min(1).max(100),
  description: Joi.string().required().min(1).max(500),
  owner_id: Joi.string().required(),
  deadline: Joi.number().required().min(Date.now())
});

export const taskSchema = Joi.object({
  project_id: Joi.string().required(),
  title: Joi.string().required().min(1).max(100),
  description: Joi.string().required().min(1).max(500),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
  assignee_id: Joi.string().optional(),
  estimated_hours: Joi.number().min(0).optional()
});
```

### Validation Middleware
```typescript
// src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

export const validateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }
    
    next();
  };
};
```

## Error Handling

### Centralized Error Handler
```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

### Custom Error Classes
```typescript
// src/utils/errors.ts
export class ValidationError extends Error {
  statusCode = 400;
  
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  statusCode = 404;
  
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = 'NotFoundError';
  }
}
```

## Business Logic

### Dependency Management
```typescript
// src/utils/dependencyValidator.ts
export class DependencyValidator {
  static validateDependencies(tasks: Task[], dependencies: TaskDependency[]): boolean {
    // Check for circular dependencies
    const graph = this.buildDependencyGraph(tasks, dependencies);
    return !this.hasCycle(graph);
  }

  static buildDependencyGraph(tasks: Task[], dependencies: TaskDependency[]): Map<string, string[]> {
    const graph = new Map<string, string[]>();
    
    tasks.forEach(task => {
      graph.set(task.id, []);
    });
    
    dependencies.forEach(dep => {
      const taskDeps = graph.get(dep.task_id) || [];
      taskDeps.push(dep.depends_on_task_id);
      graph.set(dep.task_id, taskDeps);
    });
    
    return graph;
  }

  private static hasCycle(graph: Map<string, string[]>): boolean {
    const visited = new Set<string>();
    const recStack = new Set<string>();
    
    for (const node of graph.keys()) {
      if (this.dfs(node, graph, visited, recStack)) {
        return true;
      }
    }
    
    return false;
  }

  private static dfs(
    node: string, 
    graph: Map<string, string[]>, 
    visited: Set<string>, 
    recStack: Set<string>
  ): boolean {
    if (recStack.has(node)) return true;
    if (visited.has(node)) return false;
    
    visited.add(node);
    recStack.add(node);
    
    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (this.dfs(neighbor, graph, visited, recStack)) {
        return true;
      }
    }
    
    recStack.delete(node);
    return false;
  }
}
```

### Critical Path Analysis
```typescript
// src/services/projectService.ts
export const getCriticalPath = async (projectId: string) => {
  const tasks = await TaskModel.find({ project_id: projectId });
  const dependencies = await TaskDependencyModel.find({
    $or: [
      { task_id: { $in: tasks.map(t => t.id) } },
      { depends_on_task_id: { $in: tasks.map(t => t.id) } }
    ]
  });
  
  return calculateCriticalPath(tasks, dependencies);
};

function calculateCriticalPath(tasks: Task[], dependencies: TaskDependency[]) {
  // Topological sort
  const sortedTasks = topologicalSort(tasks, dependencies);
  
  // Calculate earliest start times
  const earliestStart = new Map<string, number>();
  sortedTasks.forEach(task => {
    const incomingDeps = dependencies.filter(d => d.task_id === task.id);
    const maxStartTime = incomingDeps.length > 0 
      ? Math.max(...incomingDeps.map(d => 
          earliestStart.get(d.depends_on_task_id) + 
          (tasks.find(t => t.id === d.depends_on_task_id)?.estimated_hours || 0)
        ))
      : 0;
    
    earliestStart.set(task.id, maxStartTime);
  });
  
  // Find critical path
  const criticalPath = [];
  let currentTask = sortedTasks[sortedTasks.length - 1];
  
  while (currentTask) {
    criticalPath.unshift(currentTask);
    const outgoingDeps = dependencies.filter(d => d.depends_on_task_id === currentTask.id);
    
    if (outgoingDeps.length === 0) break;
    
    currentTask = outgoingDeps.reduce((max, dep) => {
      const task = tasks.find(t => t.id === dep.task_id);
      const maxTask = tasks.find(t => t.id === max.task_id);
      return (task?.estimated_hours || 0) > (maxTask?.estimated_hours || 0) ? dep : max;
    });
  }
  
  return {
    criticalPath: criticalPath,
    totalDuration: earliestStart.get(sortedTasks[sortedTasks.length - 1]?.id || '') || 0
  };
}
```

## Security Considerations

### Input Validation
- All user inputs are validated using Joi schemas
- MongoDB injection is prevented through Mongoose
- Request size limits are enforced

### CORS Configuration
```typescript
// src/app.ts
import cors from 'cors';

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### Environment Variables
```env
# .env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
ALLOWED_ORIGINS=http://localhost:3000
```

## Testing

### Unit Testing Setup
```typescript
// tests/unit/projectService.test.ts
import { projectService } from '../../src/services/projectService';
import { ProjectModel } from '../../src/models/Projects';

describe('ProjectService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProject', () => {
    it('should create a new project', async () => {
      const projectData = {
        title: 'Test Project',
        description: 'Test Description',
        owner_id: '507f1f77bcf86cd799439011',
        deadline: Date.now() + 86400000
      };

      const mockProject = { ...projectData, id: '123' };
      jest.spyOn(ProjectModel.prototype, 'save').mockResolvedValue(mockProject);

      const result = await projectService.createProject(projectData);
      
      expect(result).toEqual(mockProject);
      expect(ProjectModel.prototype.save).toHaveBeenCalled();
    });
  });
});
```

### Integration Testing
```typescript
// tests/integration/project.test.ts
import request from 'supertest';
import app from '../../src/app';
import { connectDB, closeDB } from '../testUtils';

describe('Project API', () => {
  beforeAll(async () => await connectDB());
  afterAll(async () => await closeDB());

  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const projectData = {
        title: 'Integration Test Project',
        description: 'Test Description',
        owner_id: '507f1f77bcf86cd799439011',
        deadline: Date.now() + 86400000
      };

      const response = await request(app)
        .post('/api/projects')
        .send(projectData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(projectData.title);
    });
  });
});
```

## Performance Optimization

### Database Indexing
- Strategic indexes on frequently queried fields
- Compound indexes for complex queries
- Regular index analysis and optimization

### Query Optimization
```typescript
// Efficient querying with population
const projects = await ProjectModel.find()
  .populate('owner_id', 'name email')
  .select('title description status deadline')
  .sort({ createdAt: -1 })
  .limit(20);
```

### Caching Strategy
- Consider Redis for frequently accessed data
- Implement response caching for static data
- Use MongoDB query result caching

## Monitoring and Logging

### Logging Setup
```typescript
// src/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### Health Checks
```typescript
// src/app.ts
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await mongoose.connection.db.admin().ping();
    
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      error: error.message
    });
  }
});
```

## Deployment

### Production Build
```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

### Environment Configuration
```env
# Production .env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://production-db:27017/taskflow
ALLOWED_ORIGINS=https://yourdomain.com
```

### Docker Support
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 5000

CMD ["node", "dist/index.js"]
```

## Best Practices

### Code Organization
- Follow single responsibility principle
- Use meaningful names for functions and variables
- Implement proper error handling
- Write comprehensive documentation

### Performance
- Optimize database queries
- Implement proper indexing
- Use connection pooling
- Monitor memory usage

### Security
- Validate all inputs
- Sanitize user data
- Implement rate limiting
- Use HTTPS in production

### Testing
- Write unit tests for business logic
- Implement integration tests
- Use test coverage tools
- Test error scenarios

## Future Enhancements

### Planned Features
- Authentication and authorization
- Real-time updates with WebSockets
- File upload support
- Advanced analytics
- API rate limiting
- GraphQL support

### Technical Improvements
- Microservices architecture
- Event-driven architecture
- Advanced caching strategies
- Performance monitoring
- Automated testing pipeline
