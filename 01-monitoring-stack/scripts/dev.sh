#!/bin/bash

# Sec-Observe-Lab Development Script
# Facilitates development workflow for the monitoring stack

set -e

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
    echo -e "${PURPLE}[DEV]${NC} $1"
}

# Function to show help
show_help() {
    echo "Sec-Observe-Lab Development Script"
    echo "==================================="
    echo
    echo "Usage: ./scripts/dev.sh [COMMAND]"
    echo
    echo "Commands:"
    echo "  start       Start the monitoring stack"
    echo "  stop        Stop the monitoring stack"
    echo "  restart     Restart the monitoring stack"
    echo "  status      Show status of all services"
    echo "  logs        Show logs for all services"
    echo "  logs [svc]  Show logs for specific service"
    echo "  test        Run tests for biometric auth"
    echo "  build       Build biometric auth service"
    echo "  clean       Clean up containers and volumes"
    echo "  health      Run comprehensive health check"
    echo "  dev         Start development mode with live reload"
    echo "  help        Show this help message"
    echo
    echo "Examples:"
    echo "  ./scripts/dev.sh start"
    echo "  ./scripts/dev.sh logs grafana"
    echo "  ./scripts/dev.sh test"
    echo "  ./scripts/dev.sh dev"
}

# Function to start services
start_services() {
    print_header "Starting Sec-Observe-Lab Monitoring Stack..."
    
    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    
    # Start services
    print_status "Starting services with Docker Compose..."
    docker-compose up -d --build
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Check health
    print_status "Checking service health..."
    ./scripts/health-check.sh
    
    print_success "Monitoring stack started successfully!"
    echo
    echo "🌐 Service URLs:"
    echo "  • Grafana: http://localhost:3000 (admin/admin123)"
    echo "  • Prometheus: http://localhost:9090"
    echo "  • Biometric Auth: http://localhost:3001"
    echo "  • Loki: http://localhost:3100"
    echo "  • Alertmanager: http://localhost:9093"
}

# Function to stop services
stop_services() {
    print_header "Stopping Sec-Observe-Lab Monitoring Stack..."
    
    docker-compose down
    
    print_success "Monitoring stack stopped!"
}

# Function to restart services
restart_services() {
    print_header "Restarting Sec-Observe-Lab Monitoring Stack..."
    
    docker-compose restart
    
    print_success "Monitoring stack restarted!"
}

# Function to show status
show_status() {
    print_header "Sec-Observe-Lab Service Status"
    echo
    
    print_status "Docker Containers:"
    docker-compose ps
    echo
    
    print_status "Service Health:"
    ./scripts/health-check.sh
}

# Function to show logs
show_logs() {
    local service=$1
    
    if [ -n "$service" ]; then
        print_header "Showing logs for $service..."
        docker-compose logs -f "$service"
    else
        print_header "Showing logs for all services..."
        docker-compose logs -f
    fi
}

# Function to run tests
run_tests() {
    print_header "Running Biometric Authentication Tests..."
    
    cd biometric-auth
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install
    fi
    
    # Run tests
    print_status "Running tests..."
    npm test
    
    cd ..
    
    print_success "Tests completed!"
}

# Function to build service
build_service() {
    print_header "Building Biometric Authentication Service..."
    
    cd biometric-auth
    
    # Install dependencies
    print_status "Installing dependencies..."
    npm install
    
    # Build service
    print_status "Building service..."
    npm run build 2>/dev/null || echo "No build script found, skipping..."
    
    cd ..
    
    print_success "Service built successfully!"
}

# Function to clean up
clean_up() {
    print_header "Cleaning up Sec-Observe-Lab..."
    
    print_warning "This will remove all containers, volumes, and data!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Stopping and removing containers..."
        docker-compose down -v --remove-orphans
        
        print_status "Removing images..."
        docker-compose down --rmi all 2>/dev/null || true
        
        print_status "Cleaning up volumes..."
        docker volume prune -f
        
        print_success "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Function to run health check
run_health_check() {
    print_header "Running Comprehensive Health Check..."
    
    ./scripts/health-check.sh
}

# Function to start development mode
start_dev_mode() {
    print_header "Starting Development Mode..."
    
    # Start services in background
    print_status "Starting monitoring stack..."
    docker-compose up -d
    
    # Start biometric auth in development mode
    print_status "Starting biometric auth in development mode..."
    cd biometric-auth
    
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install
    fi
    
    print_success "Development mode started!"
    echo
    echo "🔧 Development URLs:"
    echo "  • Grafana: http://localhost:3000"
    echo "  • Prometheus: http://localhost:9090"
    echo "  • Biometric Auth: http://localhost:3001"
    echo "  • Health Check: http://localhost:3001/health"
    echo "  • Metrics: http://localhost:3001/metrics"
    echo
    echo "📝 Development Commands:"
    echo "  • View logs: docker-compose logs -f"
    echo "  • Run tests: npm test"
    echo "  • Restart auth: docker-compose restart biometric-auth"
    echo
    echo "Press Ctrl+C to stop development mode"
    
    # Keep running and show logs
    docker-compose logs -f
}

# Main function
main() {
    local command=${1:-help}
    
    case $command in
        start)
            start_services
            ;;
        stop)
            stop_services
            ;;
        restart)
            restart_services
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs "$2"
            ;;
        test)
            run_tests
            ;;
        build)
            build_service
            ;;
        clean)
            clean_up
            ;;
        health)
            run_health_check
            ;;
        dev)
            start_dev_mode
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $command"
            echo
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
