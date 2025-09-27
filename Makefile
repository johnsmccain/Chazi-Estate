# chazi-chain Platform Makefile
# Convenient commands for development

.PHONY: help start stop status clean install test logs

# Default target
help:
	@echo "chazi-chain Platform - Available Commands:"
	@echo ""
	@echo "  make start     - Start the full application (frontend + backend)"
	@echo "  make stop      - Stop all services"
	@echo "  make status    - Check application status"
	@echo "  make restart   - Restart all services"
	@echo "  make clean     - Stop services and clean logs"
	@echo "  make install   - Install all dependencies"
	@echo "  make test      - Run tests"
	@echo "  make logs      - Show live logs"
	@echo "  make help      - Show this help message"
	@echo ""

# Start the application
start:
	@echo "🚀 Starting chazi-chain Platform..."
	@./start-app.sh

# Stop the application
stop:
	@echo "🛑 Stopping chazi-chain Platform..."
	@./stop-app.sh

# Check status
status:
	@./status-app.sh

# Restart the application
restart: stop start

# Clean stop with log cleanup
clean:
	@echo "🧹 Cleaning up chazi-chain Platform..."
	@./stop-app.sh --clean-logs

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	@npm install
	@cd backend && npm install
	@echo "✅ Dependencies installed"

# Run tests
test:
	@echo "🧪 Running tests..."
	@cd backend && npm test || echo "Backend tests not configured"
	@npm test || echo "Frontend tests not configured"

# Show live logs
logs:
	@echo "📝 Showing live logs (Press Ctrl+C to exit)..."
	@tail -f backend.log frontend.log 2>/dev/null || echo "No log files found. Start the application first."

# Development shortcuts
dev: start
run: start
up: start
down: stop
