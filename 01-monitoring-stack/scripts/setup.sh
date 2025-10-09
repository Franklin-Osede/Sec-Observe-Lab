#!/bin/bash

# Sec-Observe-Lab Monitoring Stack Setup Script
# This script sets up the monitoring stack with biometric authentication

set -e

echo "🚀 Setting up Sec-Observe-Lab Monitoring Stack..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if required ports are available
check_ports() {
    print_status "Checking if required ports are available..."
    
    local ports=(3000 9090 3100 6379 8080 9091 9092 9093)
    local occupied_ports=()
    
    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            occupied_ports+=($port)
        fi
    done
    
    if [ ${#occupied_ports[@]} -gt 0 ]; then
        print_warning "The following ports are already in use: ${occupied_ports[*]}"
        print_warning "Please stop the services using these ports or modify the docker-compose.yml file"
        read -p "Do you want to continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        print_success "All required ports are available"
    fi
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    local dirs=(
        "config/prometheus/rules"
        "config/grafana/dashboards"
        "config/grafana/provisioning/datasources"
        "config/grafana/provisioning/dashboards"
        "config/loki"
        "config/fluentd"
        "config/alertmanager"
        "biometric-auth/src"
        "exporters/ethereum"
        "exporters/polygon"
        "exporters/web3"
        "scripts"
        "logs"
        "data/prometheus"
        "data/grafana"
        "data/loki"
        "data/redis"
        "data/alertmanager"
    )
    
    for dir in "${dirs[@]}"; do
        mkdir -p "$dir"
    done
    
    print_success "Directories created"
}

# Set up environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    if [ ! -f ".env" ]; then
        if [ -f "env.example" ]; then
            cp env.example .env
            print_success "Environment file created from example"
        else
            print_warning "No env.example file found, creating basic .env file"
            cat > .env << EOF
# Prometheus Configuration
PROMETHEUS_RETENTION=30d
PROMETHEUS_STORAGE_PATH=/prometheus

# Grafana Configuration
GRAFANA_ADMIN_PASSWORD=admin123
GRAFANA_SECRET_KEY=your-secret-key-here

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Biometric Authentication
WEBAUTHN_RP_ID=localhost
WEBAUTHN_RP_NAME=Sec-Observe-Lab
WEBAUTHN_ORIGIN=http://localhost:3000

# Security
JWT_SECRET=your-jwt-secret-here
ENCRYPTION_KEY=your-encryption-key-here
EOF
        fi
    else
        print_success "Environment file already exists"
    fi
}

# Set up permissions
setup_permissions() {
    print_status "Setting up permissions..."
    
    # Make scripts executable
    chmod +x scripts/*.sh 2>/dev/null || true
    
    # Set proper permissions for data directories
    chmod 755 data/ 2>/dev/null || true
    chmod 755 logs/ 2>/dev/null || true
    
    print_success "Permissions set"
}

# Build and start services
start_services() {
    print_status "Building and starting services..."
    
    # Build biometric auth service
    print_status "Building biometric authentication service..."
    cd biometric-auth
    if [ -f "package.json" ]; then
        npm install --production
    fi
    cd ..
    
    # Start services with Docker Compose
    print_status "Starting services with Docker Compose..."
    docker-compose up -d --build
    
    print_success "Services started"
}

# Wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    local services=(
        "prometheus:9090"
        "grafana:3000"
        "loki:3100"
        "redis:6379"
        "biometric-auth:3001"
    )
    
    for service in "${services[@]}"; do
        local name=$(echo $service | cut -d: -f1)
        local port=$(echo $service | cut -d: -f2)
        
        print_status "Waiting for $name to be ready..."
        local max_attempts=30
        local attempt=1
        
        while [ $attempt -le $max_attempts ]; do
            if curl -s http://localhost:$port/health >/dev/null 2>&1 || \
               curl -s http://localhost:$port/metrics >/dev/null 2>&1 || \
               curl -s http://localhost:$port >/dev/null 2>&1; then
                print_success "$name is ready"
                break
            fi
            
            if [ $attempt -eq $max_attempts ]; then
                print_warning "$name may not be ready yet, but continuing..."
                break
            fi
            
            sleep 2
            ((attempt++))
        done
    done
}

# Display service URLs
display_urls() {
    print_success "Setup completed! Here are the service URLs:"
    echo
    echo "📊 Monitoring Services:"
    echo "  • Grafana: http://localhost:3000 (admin/admin123)"
    echo "  • Prometheus: http://localhost:9090"
    echo "  • Loki: http://localhost:3100"
    echo "  • Alertmanager: http://localhost:9093"
    echo
    echo "🔐 Biometric Authentication:"
    echo "  • Biometric Auth API: http://localhost:3001"
    echo "  • Health Check: http://localhost:3001/health"
    echo "  • Metrics: http://localhost:3001/metrics"
    echo
    echo "📈 Exporters:"
    echo "  • Node Exporter: http://localhost:9100"
    echo "  • cAdvisor: http://localhost:8080"
    echo "  • Ethereum Exporter: http://localhost:9091"
    echo "  • Polygon Exporter: http://localhost:9092"
    echo
    echo "🗄️ Data Services:"
    echo "  • Redis: localhost:6379"
    echo
    echo "📝 Logs:"
    echo "  • View logs: docker-compose logs -f"
    echo "  • View specific service logs: docker-compose logs -f [service-name]"
    echo
    echo "🛠️ Management:"
    echo "  • Stop services: docker-compose down"
    echo "  • Restart services: docker-compose restart"
    echo "  • View status: docker-compose ps"
    echo
    print_success "Setup completed successfully!"
}

# Main execution
main() {
    echo "🔐 Sec-Observe-Lab Monitoring Stack Setup"
    echo "=========================================="
    echo
    
    check_docker
    check_ports
    create_directories
    setup_environment
    setup_permissions
    start_services
    wait_for_services
    display_urls
}

# Run main function
main "$@"
