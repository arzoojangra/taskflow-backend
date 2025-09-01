# TaskFlow Frontend Development Guide

## Overview

The TaskFlow frontend is built with Next.js 15, React 19, and Tailwind CSS v4. It provides an intuitive interface for managing projects, tasks, and dependencies with modern UI components and responsive design.

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19 with hooks
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Charts**: React Force Graph (for dependency visualization)
- **Notifications**: React Toastify

## Project Structure

```
taskflow-frontend/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   ├── page.jsx           # Home page
│   ├── Home.jsx           # Home component
│   └── project/           # Project routes
│       └── [id]/          # Dynamic project route
│           └── page.jsx   # Project detail page
├── components/             # Reusable React components
│   ├── DependencyGraph.jsx    # Task dependency visualization
│   ├── KanbanBoard.jsx        # Drag-and-drop task board
│   ├── ProgressDashboard.jsx  # Project progress charts
│   ├── ProjectCard.jsx        # Project summary card
│   ├── ProjectDashboard.jsx   # Project overview
│   ├── ProjectDetails.jsx     # Project information
│   ├── ProjectForm.jsx        # Create/edit project form
│   ├── ProjectHeader.jsx      # Project navigation header
│   ├── TaskDetails.jsx        # Task information modal
│   └── TaskForm.jsx           # Create/edit task form
├── utils/                 # Utility functions
│   └── functions.js       # Helper functions
├── public/                # Static assets
└── package.json           # Dependencies and scripts
```

## Component Architecture

### Core Components

#### 1. Home.jsx
The main landing page that displays all projects and provides navigation to create new projects and tasks.

**Key Features:**
- Project listing with grid layout
- New project/task creation buttons
- Responsive design for mobile and desktop

**State Management:**
```javascript
const [projects, setProjects] = useState([]);
const [showProjectForm, setShowProjectForm] = useState(false);
const [showTaskForm, setShowTaskForm] = useState(false);
```

#### 2. ProjectCard.jsx
Displays project information in a card format with quick actions.

**Props:**
```javascript
{
  project: Project,
  setProjectUpdated: (boolean) => void
}
```

**Features:**
- Project status indicator
- Deadline display
- Quick edit/delete actions
- Progress visualization

#### 3. KanbanBoard.jsx
Implements a drag-and-drop Kanban board for task management.

**Key Features:**
- Four status columns: Todo, In Progress, Done, Blocked
- Drag-and-drop task movement
- Task priority indicators
- Estimated hours display
- Assignee information

**State Management:**
```javascript
const [draggedTask, setDraggedTask] = useState(null);
const [selectedTask, setSelectedTask] = useState(null);
```

**Drag and Drop:**
```javascript
const handleDragStart = (e, task) => {
  setDraggedTask(task);
  e.dataTransfer.effectAllowed = "move";
};

const handleDrop = async (e, newStatus) => {
  // Update task status via API
  // Refresh project data
};
```

#### 4. DependencyGraph.jsx
Visualizes task dependencies and critical path analysis.

**Features:**
- Interactive dependency graph
- Critical path highlighting
- Task relationship visualization
- Add/remove dependency management

**Critical Path Data:**
```javascript
const [criticalPathData, setCriticalPathData] = useState(null);
const [loading, setLoading] = useState(false);
```

#### 5. ProjectForm.jsx & TaskForm.jsx
Modal forms for creating and editing projects and tasks.

**Form Features:**
- Input validation
- Real-time feedback
- Responsive design
- Error handling

### Component Communication

Components communicate through:
1. **Props**: Parent to child data flow
2. **Callback functions**: Child to parent communication
3. **State lifting**: Shared state in common parent
4. **API calls**: Direct backend communication for data updates

## State Management

### Local State
Each component manages its own local state using React hooks:

```javascript
// Component-specific state
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({});
const [loading, setLoading] = useState(false);
```

### Shared State
State that needs to be shared between components is lifted to common parents:

```javascript
// In Home.jsx
const [projects, setProjects] = useState([]);
const [newProjectCreated, setNewProjectCreated] = useState(false);

// Passed down to ProjectCard
<ProjectCard 
  project={project} 
  setProjectUpdated={setProjectUpdated} 
/>
```

### Data Fetching
Components fetch data independently using useEffect and axios:

```javascript
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/endpoint`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  fetchData();
}, [dependencies]);
```

## Styling with Tailwind CSS

### Design System
The application uses a consistent design system with Tailwind CSS:

**Colors:**
- Primary: Blue (`bg-blue-600`, `text-blue-600`)
- Success: Green (`bg-green-50`, `text-green-600`)
- Warning: Yellow (`bg-yellow-50`, `text-yellow-600`)
- Error: Red (`bg-red-50`, `text-red-600`)
- Neutral: Gray (`bg-gray-50`, `text-gray-900`)

**Spacing:**
- Consistent spacing scale: `p-4`, `m-6`, `gap-6`
- Responsive spacing: `px-4 sm:px-6 lg:px-8`

**Typography:**
- Headings: `text-2xl font-bold`, `text-lg font-semibold`
- Body: `text-gray-900`, `text-gray-600`

### Responsive Design
Components are built with mobile-first responsive design:

```javascript
// Grid layout responsive classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Responsive padding
<div className="px-4 sm:px-6 lg:px-8">

// Responsive text sizes
<h2 className="text-xl sm:text-2xl font-bold">
```

### Component Styling
Each component follows consistent styling patterns:

```javascript
// Card styling
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

// Button styling
<button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">

// Form input styling
<input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
```

## API Integration

### HTTP Client Setup
Axios is used for all API communication:

```javascript
import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const response = await axios.get(`${baseUrl}/projects`);
```

### Error Handling
API errors are handled gracefully with user feedback:

```javascript
try {
  const response = await axios.post('/api/projects', projectData);
  // Handle success
} catch (error) {
  console.error('Error creating project:', error);
  // Show error message to user
}
```

### Data Flow
1. **Fetch**: Components fetch data on mount
2. **Update**: User actions trigger API calls
3. **Refresh**: Components refresh data after updates
4. **Optimistic Updates**: UI updates immediately, reverts on error

## Performance Optimization

### Code Splitting
Next.js automatically code-splits pages and components.

### Memoization
Use React.memo for expensive components:

```javascript
const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
});
```

### Lazy Loading
Implement lazy loading for heavy components:

```javascript
const DependencyGraph = lazy(() => import('./DependencyGraph'));
```

## Testing Strategy

### Unit Testing
Test individual components in isolation:

```javascript
// Example test structure
describe('ProjectCard', () => {
  it('renders project information correctly', () => {
    // Test implementation
  });
  
  it('handles edit button click', () => {
    // Test implementation
  });
});
```

### Integration Testing
Test component interactions and data flow.

### E2E Testing
Test complete user workflows with Playwright or Cypress.

## Development Workflow

### Component Development
1. **Plan**: Define component purpose and props
2. **Create**: Build component with basic functionality
3. **Style**: Apply Tailwind CSS classes
4. **Test**: Ensure component works as expected
5. **Integrate**: Connect with parent components

### State Management
1. **Identify**: Determine what state is needed
2. **Local vs Shared**: Decide state location
3. **Implement**: Use appropriate hooks
4. **Connect**: Link state to UI updates

### API Integration
1. **Define**: Plan API endpoints and data flow
2. **Implement**: Add API calls to components
3. **Handle**: Implement error handling and loading states
4. **Optimize**: Add caching and optimistic updates

## Best Practices

### Code Organization
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use consistent naming conventions
- Group related components together

### Performance
- Avoid unnecessary re-renders
- Use appropriate dependency arrays in useEffect
- Implement proper loading states
- Optimize bundle size

### Accessibility
- Use semantic HTML elements
- Provide proper ARIA labels
- Ensure keyboard navigation
- Test with screen readers

### Error Handling
- Provide user-friendly error messages
- Implement fallback UI states
- Log errors for debugging
- Graceful degradation

## Common Patterns

### Modal Management
```javascript
const [isOpen, setIsOpen] = useState(false);

{isOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <ModalContent onClose={() => setIsOpen(false)} />
  </div>
)}
```

### Form Handling
```javascript
const [formData, setFormData] = useState({});

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};
```

### Conditional Rendering
```javascript
{loading ? (
  <LoadingSpinner />
) : error ? (
  <ErrorMessage error={error} />
) : (
  <DataDisplay data={data} />
)}
```

## Troubleshooting

### Common Issues
1. **State not updating**: Check dependency arrays in useEffect
2. **API calls failing**: Verify environment variables and CORS
3. **Styling issues**: Check Tailwind CSS classes and responsive breakpoints
4. **Performance problems**: Identify unnecessary re-renders

### Debug Tools
- React Developer Tools
- Next.js debugging
- Browser DevTools
- Console logging

## Future Enhancements

### Planned Features
- Real-time collaboration with WebSockets
- Advanced filtering and search
- Export functionality (PDF, CSV)
- Mobile app with React Native
- Advanced analytics and reporting

### Technical Improvements
- State management with Zustand or Redux Toolkit
- Server-side rendering optimization
- Progressive Web App features
- Advanced caching strategies
