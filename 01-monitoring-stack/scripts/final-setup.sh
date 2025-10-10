#!/bin/bash

# Sec-Observe-Lab Final Setup Script
# Completes the monitoring stack setup with all components

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
    echo -e "${PURPLE}[SETUP]${NC} $1"
}

# Function to check prerequisites
check_prerequisites() {
    print_header "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    print_success "All prerequisites are installed"
}

# Function to setup environment
setup_environment() {
    print_header "Setting up environment..."
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        print_status "Creating .env file..."
        cp env.example .env
        print_success ".env file created"
    else
        print_success ".env file already exists"
    fi
    
    # Create necessary directories
    print_status "Creating directories..."
    mkdir -p data/{prometheus,grafana,loki,redis,alertmanager}
    mkdir -p logs
    mkdir -p biometric-auth/{docs,tests,coverage}
    
    print_success "Directories created"
}

# Function to install dependencies
install_dependencies() {
    print_header "Installing dependencies..."
    
    # Install biometric auth dependencies
    print_status "Installing biometric auth dependencies..."
    cd biometric-auth
    
    if [ ! -d "node_modules" ]; then
        npm install
        print_success "Dependencies installed"
    else
        print_success "Dependencies already installed"
    fi
    
    cd ..
}

# Function to build services
build_services() {
    print_header "Building services..."
    
    # Build biometric auth service
    print_status "Building biometric auth service..."
    cd biometric-auth
    npm run build 2>/dev/null || echo "No build script found, skipping..."
    cd ..
    
    print_success "Services built"
}

# Function to start services
start_services() {
    print_header "Starting services..."
    
    # Start with Docker Compose
    print_status "Starting monitoring stack..."
    docker-compose up -d --build
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 15
    
    print_success "Services started"
}

# Function to run tests
run_tests() {
    print_header "Running tests..."
    
    cd biometric-auth
    
    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        print_status "Running biometric auth tests..."
        npm test
        print_success "Tests completed"
    else
        print_warning "No tests found, skipping..."
    fi
    
    cd ..
}

# Function to verify services
verify_services() {
    print_header "Verifying services..."
    
    # Run health check
    print_status "Running health check..."
    ./scripts/health-check.sh
    
    print_success "Services verified"
}

# Function to display final information
display_final_info() {
    print_header "Setup completed successfully! 🎉"
    echo
    echo "🌐 Service URLs:"
    echo "  • Grafana: http://localhost:3000 (admin/admin123)"
    echo "  • Prometheus: http://localhost:9090"
    echo "  • Biometric Auth: http://localhost:3001"
    echo "  • API Documentation: http://localhost:3001/api-docs"
    echo "  • Health Check: http://localhost:3001/health"
    echo "  • Metrics: http://localhost:3001/metrics"
    echo "  • Loki: http://localhost:3100"
    echo "  • Alertmanager: http://localhost:9093"
    echo
    echo "📊 Dashboards Available:"
    echo "  • Infrastructure Overview"
    echo "  • Blockchain Monitoring"
    echo "  • Biometric Authentication"
    echo
    echo "🔧 Development Commands:"
    echo "  • View logs: ./scripts/dev.sh logs"
    echo "  • Run tests: ./scripts/dev.sh test"
    echo "  • Health check: ./scripts/dev.sh health"
    echo "  • Stop services: ./scripts/dev.sh stop"
    echo "  • Restart: ./scripts/dev.sh restart"
    echo
    echo "📚 API Documentation:"
    echo "  • OpenAPI YAML: http://localhost:3001/api-docs"
    echo "  • OpenAPI JSON: http://localhost:3001/api-docs.json"
    echo
    echo "🚀 Next Steps:"
    echo "  1. Access Grafana and explore dashboards"
    echo "  2. Test biometric authentication endpoints"
    echo "  3. Review API documentation"
    echo "  4. Configure alerts for your environment"
    echo "  5. Start developing the next phase (RPC Gateway)"
    echo
    print_success "Sec-Observe-Lab Monitoring Stack is ready! 🚀"
}

# Function to create development documentation
create_dev_docs() {
    print_header "Creating development documentation..."
    
    cat > DEVELOPMENT.md << 'EOF'
# Sec-Observe-Lab Development Guide

## 🚀 Quick Start

```bash
# Start the monitoring stack
./scripts/dev.sh start

# Run tests
./scripts/dev.sh test

# View logs
./scripts/dev.sh logs

# Health check
./scripts/dev.sh health
```

## 📊 Available Services

- **Grafana**: http://localhost:3000 (admin/admin123)
- **Prometheus**: http://localhost:9090
- **Biometric Auth**: http://localhost:3001
- **API Docs**: http://localhost:3001/api-docs

## 🔧 Development Workflow

1. Start services: `./scripts/dev.sh start`
2. Make changes to code
3. Run tests: `./scripts/dev.sh test`
4. Check health: `./scripts/dev.sh health`
5. View logs: `./scripts/dev.sh logs`

## 📚 API Documentation

The API follows OpenAPI 3.0.3 specification with proper versioning:

- **Current Version**: v1
- **Base URL**: http://localhost:3001/api/v1
- **Documentation**: http://localhost:3001/api-docs

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --grep "webauthn"

# Run with coverage
npm test -- --coverage
```

## 📈 Monitoring

- **Metrics**: Prometheus format at `/metrics`
- **Health**: Health check at `/health`
- **Logs**: Structured logging with Fluentd

## 🔐 Security Features

- Rate limiting (100 requests/15 minutes)
- Input validation with express-validator
- JWT token authentication
- Biometric authentication (WebAuthn, Fingerprint, Face, QR)

## 🚀 Next Development Phase

1. **RPC Gateway** (02-secure-rpc-gateway)
2. **CI/CD Pipeline** (03-cicd-blockchain-pipeline)
3. **Infrastructure Hardening** (04-infrastructure-hardening)
4. **Secrets Management** (05-vault-secrets-management)
5. **Advanced Biometric Auth** (06-biometric-blockchain-auth)
EOF

    print_success "Development documentation created"
}

# Main execution
main() {
    echo "🔐 Sec-Observe-Lab Final Setup"
    echo "==============================="
    echo
    
    check_prerequisites
    echo
    
    setup_environment
    echo
    
    install_dependencies
    echo
    
    build_services
    echo
    
    start_services
    echo
    
    run_tests
    echo
    
    verify_services
    echo
    
    create_dev_docs
    echo
    
    display_final_info
}

# Run main function
main "$@"
