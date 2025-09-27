#!/bin/bash

# chazi-chain Platform Stop Script
# This script stops both the backend and frontend servers

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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
    echo -e "${PURPLE}  chazi-chain Platform Shutdown${NC}"
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
        print_status "Stopping $service_name on port $port..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 1
        if check_port $port; then
            print_warning "$service_name still running, force killing..."
            lsof -ti:$port | xargs kill -9 2>/dev/null || true
        else
            print_success "$service_name stopped successfully"
        fi
    else
        print_status "$service_name is not running on port $port"
    fi
}

# Function to stop service by PID file
stop_by_pid() {
    local pid_file=$1
    local service_name=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 $pid 2>/dev/null; then
            print_status "Stopping $service_name (PID: $pid)..."
            kill $pid
            sleep 2
            if kill -0 $pid 2>/dev/null; then
                print_warning "$service_name still running, force killing..."
                kill -9 $pid 2>/dev/null || true
            fi
            print_success "$service_name stopped"
        else
            print_status "$service_name process not found (PID: $pid)"
        fi
        rm -f "$pid_file"
    else
        print_status "No PID file found for $service_name"
    fi
}

# Main execution
main() {
    print_header
    
    print_status "Stopping chazi-chain Platform services..."
    echo ""
    
    # Stop backend
    print_status "Stopping Backend Server..."
    stop_by_pid "backend.pid" "Backend"
    kill_port 3001 "Backend"
    echo ""
    
    # Stop frontend
    print_status "Stopping Frontend Server..."
    stop_by_pid "frontend.pid" "Frontend"
    kill_port 5173 "Frontend"
    echo ""
    
    # Clean up log files if requested
    if [ "$1" = "--clean-logs" ]; then
        print_status "Cleaning up log files..."
        rm -f backend.log frontend.log
        print_success "Log files cleaned up"
    fi
    
    print_success "🎉 All chazi-chain Platform services stopped successfully!"
    echo ""
    print_status "To start the platform again, run: ./start-app.sh"
}

# Run main function
main "$@"
