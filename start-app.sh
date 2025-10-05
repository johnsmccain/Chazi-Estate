#!/bin/bash

# CHAZI ESTATE Platform Startup Script
# This script starts both the backend and frontend servers

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}  CHAZI ESTATE Platform Startup${NC}"
    echo -e "${PURPLE}================================${NC}"
}

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to kill processes on specific ports
kill_port() {
    local port=$1
    local service_name=$2
    
    if check_port $port; then
        print_warning "$service_name is already running on port $port. Stopping it..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    print_status "Waiting for $service_name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            print_success "$service_name is ready!"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "$service_name failed to start within expected time"
    return 1
}

# Function to start backend
start_backend() {
    print_status "Starting Backend Server..."
    
    # Check if backend directory exists
    if [ ! -d "backend" ]; then
        print_error "Backend directory not found!"
        exit 1
    fi
    
    # Kill any existing backend process
    kill_port 3001 "Backend"
    
    # Navigate to backend directory
    cd backend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_status "Installing backend dependencies..."
        npm install
    fi
    
    # Start backend in background
    print_status "Starting backend server on port 3001..."
    npm run dev > ../backend.log 2>&1 &
    BACKEND_PID=$!
    
    # Go back to root directory
    cd ..
    
    # Wait for backend to be ready
    if wait_for_service "http://localhost:3001/health" "Backend"; then
        print_success "Backend started successfully (PID: $BACKEND_PID)"
        echo $BACKEND_PID > backend.pid
    else
        print_error "Backend failed to start"
        exit 1
    fi
}

# Function to start frontend
start_frontend() {
    print_status "Starting Frontend Server..."
    
    # Kill any existing frontend process
    kill_port 5173 "Frontend"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    # Start frontend in background
    print_status "Starting frontend server on port 5173..."
    npm run dev > frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    # Wait for frontend to be ready
    if wait_for_service "http://localhost:5173" "Frontend"; then
        print_success "Frontend started successfully (PID: $FRONTEND_PID)"
        echo $FRONTEND_PID > frontend.pid
    else
        print_error "Frontend failed to start"
        exit 1
    fi
}

# Function to display application info
show_app_info() {
    echo ""
    print_success "🎉 CHAZI ESTATE Platform is now running!"
    echo ""
    echo -e "${CYAN}📱 Frontend:${NC} http://localhost:5173"
    echo -e "${CYAN}🔧 Backend:${NC}  http://localhost:3001"
    echo -e "${CYAN}❤️  Health:${NC}   http://localhost:3001/health"
    echo -e "${CYAN}🧪 Test API:${NC}  http://localhost:3001/api/test/contracts"
    echo -e "${CYAN}🧪 Test UI:${NC}   http://localhost:5173/backend-test"
    echo ""
    echo -e "${YELLOW}📋 Process IDs:${NC}"
    echo -e "   Backend:  $(cat backend.pid 2>/dev/null || echo 'N/A')"
    echo -e "   Frontend: $(cat frontend.pid 2>/dev/null || echo 'N/A')"
    echo ""
    echo -e "${YELLOW}📝 Logs:${NC}"
    echo -e "   Backend:  tail -f backend.log"
    echo -e "   Frontend: tail -f frontend.log"
    echo ""
    echo -e "${GREEN}✨ Ready for development!${NC}"
}

# Function to cleanup on exit
cleanup() {
    print_status "Shutting down services..."
    
    # Kill backend if PID file exists
    if [ -f "backend.pid" ]; then
        BACKEND_PID=$(cat backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            print_status "Stopping backend (PID: $BACKEND_PID)..."
            kill $BACKEND_PID
        fi
        rm -f backend.pid
    fi
    
    # Kill frontend if PID file exists
    if [ -f "frontend.pid" ]; then
        FRONTEND_PID=$(cat frontend.pid)
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            print_status "Stopping frontend (PID: $FRONTEND_PID)..."
            kill $FRONTEND_PID
        fi
        rm -f frontend.pid
    fi
    
    # Force kill any remaining processes on our ports
    kill_port 3001 "Backend"
    kill_port 5173 "Frontend"
    
    print_success "Cleanup completed"
}

# Set up signal handlers
trap cleanup EXIT INT TERM

# Main execution
main() {
    print_header
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
        print_error "Please run this script from the CHAZI ESTATE project root directory"
        exit 1
    fi
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_status "Starting CHAZI ESTATE Platform..."
    echo ""
    
    # Start backend first
    start_backend
    echo ""
    
    # Start frontend
    start_frontend
    echo ""
    
    # Show application info
    show_app_info
    
    # Keep script running and show logs
    print_status "Press Ctrl+C to stop all services"
    print_status "Monitoring logs... (Press Ctrl+C to exit)"
    echo ""
    
    # Show live logs
    tail -f backend.log frontend.log 2>/dev/null || {
        print_warning "Log files not found. Services may still be starting..."
        sleep 5
    }
}

# Run main function
main "$@"
