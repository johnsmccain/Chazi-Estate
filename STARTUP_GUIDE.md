# DeedAI Platform Startup Guide

This guide explains how to start, stop, and monitor the DeedAI platform using the provided bash scripts.

## 🚀 Quick Start

### Start the Full Application
```bash
./start-app.sh
```

### Stop the Application
```bash
./stop-app.sh
```

### Check Application Status
```bash
./status-app.sh
```

## 📋 Available Scripts

### 1. `start-app.sh` - Main Startup Script
**Purpose**: Starts both frontend and backend servers with full monitoring

**Features**:
- ✅ Automatic dependency installation
- ✅ Port conflict detection and resolution
- ✅ Health checks for both services
- ✅ Process monitoring and logging
- ✅ Graceful shutdown on Ctrl+C
- ✅ Colored output and progress indicators

**Usage**:
```bash
./start-app.sh
```

**What it does**:
1. Checks system requirements (Node.js, npm)
2. Stops any existing services on ports 3001 and 5173
3. Installs dependencies if needed
4. Starts backend server (port 3001)
5. Starts frontend server (port 5173)
6. Waits for both services to be ready
7. Shows access URLs and process information
8. Monitors logs in real-time

### 2. `stop-app.sh` - Shutdown Script
**Purpose**: Gracefully stops all DeedAI services

**Features**:
- ✅ Graceful process termination
- ✅ Force kill if needed
- ✅ Port cleanup
- ✅ PID file cleanup
- ✅ Optional log cleanup

**Usage**:
```bash
./stop-app.sh              # Stop services only
./stop-app.sh --clean-logs  # Stop services and clean log files
```

### 3. `status-app.sh` - Status Check Script
**Purpose**: Check the current status of all services

**Features**:
- ✅ Service health checks
- ✅ Process information (PID, CPU, Memory)
- ✅ Port status verification
- ✅ Integration status
- ✅ Access point URLs

**Usage**:
```bash
./status-app.sh
```

## 🌐 Access Points

When the application is running, you can access:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Main application UI |
| **Backend** | http://localhost:3001 | API server |
| **Health Check** | http://localhost:3001/health | Backend health status |
| **Test API** | http://localhost:3001/api/test/contracts | Contract status |
| **Test UI** | http://localhost:5173/backend-test | Backend integration test page |

## 📊 Service Status

### Backend Server (Port 3001)
- **Framework**: Node.js with Express
- **Features**: Hedera integration, AI services, database
- **Health**: Monitored via `/health` endpoint
- **Logs**: `backend.log`

### Frontend Server (Port 5173)
- **Framework**: React with Vite
- **Features**: Wallet integration, UI components
- **Health**: Monitored via HTTP accessibility
- **Logs**: `frontend.log`

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# The scripts automatically handle this, but you can manually check:
lsof -i :3001  # Check backend port
lsof -i :5173  # Check frontend port
```

#### Services Won't Start
```bash
# Check logs for errors:
tail -f backend.log
tail -f frontend.log

# Check system requirements:
node --version  # Should be v16+
npm --version   # Should be v8+
```

#### Dependencies Issues
```bash
# Clean install dependencies:
rm -rf node_modules backend/node_modules
npm install
cd backend && npm install
```

### Manual Service Management

#### Start Backend Only
```bash
cd backend
npm run dev
```

#### Start Frontend Only
```bash
npm run dev
```

#### Stop All Services Manually
```bash
# Kill by port
lsof -ti:3001 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# Or kill by process name
pkill -f "npm run dev"
```

## 📝 Log Files

The startup script creates log files for monitoring:

- **`backend.log`**: Backend server logs
- **`frontend.log`**: Frontend server logs
- **`backend.pid`**: Backend process ID
- **`frontend.pid`**: Frontend process ID

### View Logs
```bash
# View backend logs
tail -f backend.log

# View frontend logs
tail -f frontend.log

# View both logs
tail -f backend.log frontend.log
```

## 🎯 Development Workflow

### Daily Development
1. **Start**: `./start-app.sh`
2. **Develop**: Make changes to code
3. **Test**: Use the test pages and API endpoints
4. **Stop**: `./stop-app.sh` (or Ctrl+C in the startup script)

### Quick Status Check
```bash
./status-app.sh
```

### Clean Restart
```bash
./stop-app.sh --clean-logs
./start-app.sh
```

## 🔒 Security Notes

- Scripts use `set -e` for error handling
- Process cleanup on exit/termination
- No sensitive data in logs
- Port binding to localhost only

## 📋 System Requirements

- **Node.js**: v16 or higher
- **npm**: v8 or higher
- **Operating System**: Linux, macOS, or WSL
- **Ports**: 3001 (backend), 5173 (frontend) must be available
- **Memory**: At least 2GB RAM recommended
- **Disk**: At least 1GB free space for dependencies

## 🆘 Getting Help

If you encounter issues:

1. **Check Status**: `./status-app.sh`
2. **View Logs**: `tail -f backend.log frontend.log`
3. **Restart**: `./stop-app.sh && ./start-app.sh`
4. **Clean Install**: Remove `node_modules` and reinstall dependencies

---

**Happy Development! 🚀**
