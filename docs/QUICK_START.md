# TaskFlow Quick Start Guide

Get TaskFlow up and running in under 10 minutes! This guide will walk you through setting up both the backend and frontend components.

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download here](https://nodejs.org/))
- **MongoDB** 6+ ([Download here](https://www.mongodb.com/try/download/community))
- **Git** ([Download here](https://git-scm.com/))

## 📋 Quick Setup Steps

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd TaskFlow
```

### 2. Start MongoDB
```bash
# On Windows
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"

# On macOS/Linux
mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:6.0
```

### 3. Backend Setup (5 minutes)
```bash
cd taskflow-backend

# Install dependencies
npm install

# Create environment file
echo "PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
NODE_ENV=development" > .env

# Start development server
npm run dev
```

✅ Backend should now be running on `http://localhost:5000`

### 4. Frontend Setup (3 minutes)
```bash
# Open new terminal
cd taskflow-frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api" > .env.local

# Start development server
npm run dev
```

✅ Frontend should now be running on `http://localhost:3000`

### 5. Verify Installation
- Open `http://localhost:3000` in your browser
- You should see the TaskFlow home page
- Click "New Project" to create your first project

## 🔧 Environment Configuration

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

## 📱 Test the Application

### Create Your First Project
1. Click "New Project" button
2. Fill in project details:
   - Title: "My First Project"
   - Description: "Learning TaskFlow"
   - Deadline: Select a future date
3. Click "Create Project"

### Create Your First Task
1. Click "New Task" button
2. Fill in task details:
   - Title: "Setup Development Environment"
   - Description: "Get everything running locally"
   - Priority: High
   - Estimated Hours: 2
3. Click "Create Task"

### Explore Features
- **Kanban Board**: Drag and drop tasks between columns
- **Dependency Graph**: Visualize task relationships
- **Project Dashboard**: Monitor progress and statistics

## 🐛 Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check if MongoDB is running
mongo --eval "db.runCommand('ping')"

# Check if port 5000 is available
netstat -an | grep 5000

# Verify environment variables
cat .env
```

#### Frontend Won't Start
```bash
# Check if port 3000 is available
netstat -an | grep 3000

# Verify environment variables
cat .env.local

# Clear Next.js cache
rm -rf .next
npm run dev
```

#### Database Connection Issues
```bash
# Test MongoDB connection
mongo mongodb://localhost:27017/taskflow

# Check MongoDB status
systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod
```

### Port Conflicts
If you get port conflicts, change the ports in your environment files:

**Backend (.env):**
```env
PORT=5001
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001/api
```

## 🧪 Development Commands

### Backend
```bash
cd taskflow-backend

# Development with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests (if configured)
npm test
```

### Frontend
```bash
cd taskflow-frontend

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📚 Next Steps

### Explore the Codebase
- **Backend**: Check `src/controllers/` for API endpoints
- **Frontend**: Explore `components/` for UI components
- **Database**: Review `src/models/` for data schemas

### Read the Documentation
- [API Documentation](API_DOCUMENTATION.md)
- [Frontend Guide](FRONTEND_GUIDE.md)
- [Backend Guide](BACKEND_GUIDE.md)

### Try Advanced Features
- Create task dependencies
- Analyze critical paths
- Use the Kanban board for workflow management

## 🔄 Development Workflow

### Making Changes
1. **Backend Changes**: Edit files in `taskflow-backend/src/`
2. **Frontend Changes**: Edit files in `taskflow-frontend/`
3. **Database Changes**: Modify schemas in `src/models/`

### Testing Changes
1. Backend automatically restarts on file changes
2. Frontend hot-reloads for immediate feedback
3. Check browser console for errors
4. Verify API endpoints with tools like Postman

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push and create pull request
git push origin feature/new-feature
```

## 🚀 Production Deployment

### Backend Deployment
```bash
cd taskflow-backend

# Build the application
npm run build

# Set production environment
export NODE_ENV=production
export MONGODB_URI=your-production-mongodb-uri

# Start production server
npm start
```

### Frontend Deployment
```bash
cd taskflow-frontend

# Build for production
npm run build

# Deploy the out directory
# (Upload to your hosting service)
```

## 📞 Need Help?

### Resources
- **Documentation**: Check the `docs/` folder
- **Code Comments**: Inline documentation in source files
- **GitHub Issues**: Report bugs or request features

### Common Questions
- **Q**: How do I add authentication?
- **A**: Check the Backend Guide for authentication patterns

- **Q**: How do I customize the UI?
- **A**: Modify components in `taskflow-frontend/components/`

- **Q**: How do I add new API endpoints?
- **A**: Follow the pattern in `taskflow-backend/src/routes/`

---

🎉 **Congratulations!** You now have TaskFlow running locally and are ready to start building amazing project management solutions.

Happy coding! 🚀
