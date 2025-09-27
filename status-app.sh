#!/bin/bash

# chazi-chain Platform Status Script
# This script checks the status of both frontend and backend servers

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
    echo -e "${PURPLE}  chazi-chain Platform Status${NC}"
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

# Function to check service health
check_service_health() {
    local url=$1
    local service_name=$2
    
    if curl -s "$url" > /dev/null 2>&1; then
        print_success "$service_name is healthy"
        return 0
    else
        print_error "$service_name is not responding"
        return 1
    fi
}

# Function to get process info
get_process_info() {
    local port=$1
    local service_name=$2
    
    if check_port $port; then
        local pid=$(lsof -ti:$port)
        local cpu=$(ps -p $pid -o %cpu= 2>/dev/null | tr -d ' ' || echo "N/A")
        local mem=$(ps -p $pid -o %mem= 2>/dev/null | tr -d ' ' || echo "N/A")
        echo -e "   ${CYAN}Status:${NC} Running (PID: $pid)"
        echo -e "   ${CYAN}CPU:${NC} $cpu%"
        echo -e "   ${CYAN}Memory:${NC} $mem%"
        return 0
    else
        echo -e "   ${RED}Status:${NC} Not running"
        return 1
    fi
}

# Main execution
main() {
    print_header
    echo ""
    
    # Check Backend
    print_status "Backend Server (Port 3001):"
    if check_port 3001; then
        get_process_info 3001 "Backend"
        echo ""
        print_status "Backend Health Check:"
        if check_service_health "http://localhost:3001/health" "Backend"; then
            # Get detailed health info
            echo -e "   ${CYAN}Health Data:${NC}"
            curl -s "http://localhost:3001/health" | jq -r '.data | "   Hedera: \(.services.hedera.connected), Contracts: \(.services.hedera.contracts), AI: \(.services.ai), DB: \(.services.database)"' 2>/dev/null || echo "   Unable to parse health data"
        fi
    else
        echo -e "   ${RED}Status:${NC} Not running"
    fi
    echo ""
    
    # Check Frontend
    print_status "Frontend Server (Port 5173):"
    if check_port 5173; then
        get_process_info 5173 "Frontend"
        echo ""
        print_status "Frontend Health Check:"
        if check_service_health "http://localhost:5173" "Frontend"; then
            print_success "Frontend is accessible"
        fi
    else
        echo -e "   ${RED}Status:${NC} Not running"
    fi
    echo ""
    
    # Check Integration
    print_status "Integration Status:"
    if check_port 3001 && check_port 5173; then
        print_success "Both services are running"
        echo ""
        echo -e "${CYAN}🌐 Access Points:${NC}"
        echo -e "   Frontend: http://localhost:5173"
        echo -e "   Backend:  http://localhost:3001"
        echo -e "   Health:   http://localhost:3001/health"
        echo -e "   Test API: http://localhost:3001/api/test/contracts"
        echo -e "   Test UI:  http://localhost:5173/backend-test"
    else
        print_warning "Some services are not running"
        echo ""
        echo -e "${YELLOW}💡 To start the platform:${NC}"
        echo -e "   ./start-app.sh"
    fi
    echo ""
}

# Run main function
main "$@"
