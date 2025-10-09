#!/bin/bash

# Sec-Observe-Lab Health Check Script
# This script checks the health of all monitoring stack services

set -e

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

# Function to check service health
check_service() {
    local service_name=$1
    local url=$2
    local expected_status=${3:-200}
    
    print_status "Checking $service_name..."
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "$expected_status"; then
        print_success "$service_name is healthy"
        return 0
    else
        print_error "$service_name is not responding"
        return 1
    fi
}

# Function to check Docker container
check_container() {
    local container_name=$1
    
    if docker ps --format "table {{.Names}}" | grep -q "^$container_name$"; then
        if docker ps --format "table {{.Status}}" --filter "name=$container_name" | grep -q "Up"; then
            print_success "Container $container_name is running"
            return 0
        else
            print_error "Container $container_name is not running"
            return 1
        fi
    else
        print_error "Container $container_name not found"
        return 1
    fi
}

# Function to check service metrics
check_metrics() {
    local service_name=$1
    local url=$2
    
    print_status "Checking $service_name metrics..."
    
    if curl -s "$url" | grep -q "prometheus"; then
        print_success "$service_name metrics are available"
        return 0
    else
        print_warning "$service_name metrics may not be available"
        return 1
    fi
}

# Function to check biometric authentication
check_biometric_auth() {
    print_status "Checking biometric authentication service..."
    
    # Check if the service is running
    if check_service "Biometric Auth" "http://localhost:3001/health" 200; then
        # Check if metrics are available
        if check_metrics "Biometric Auth" "http://localhost:3001/metrics"; then
            print_success "Biometric authentication service is fully operational"
            return 0
        else
            print_warning "Biometric authentication service is running but metrics may not be available"
            return 1
        fi
    else
        print_error "Biometric authentication service is not responding"
        return 1
    fi
}

# Function to check blockchain exporters
check_blockchain_exporters() {
    print_status "Checking blockchain exporters..."
    
    local exporters=(
        "ethereum-exporter:9091"
        "polygon-exporter:9092"
    )
    
    local all_healthy=true
    
    for exporter in "${exporters[@]}"; do
        local name=$(echo $exporter | cut -d: -f1)
        local port=$(echo $exporter | cut -d: -f2)
        
        if check_service "$name" "http://localhost:$port/metrics" 200; then
            print_success "$name is healthy"
        else
            print_warning "$name may not be configured or running"
            all_healthy=false
        fi
    done
    
    if [ "$all_healthy" = true ]; then
        print_success "All blockchain exporters are healthy"
        return 0
    else
        print_warning "Some blockchain exporters may not be configured"
        return 1
    fi
}

# Function to check system resources
check_system_resources() {
    print_status "Checking system resources..."
    
    # Check CPU usage
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
    if (( $(echo "$cpu_usage < 80" | bc -l) )); then
        print_success "CPU usage is normal: ${cpu_usage}%"
    else
        print_warning "CPU usage is high: ${cpu_usage}%"
    fi
    
    # Check memory usage
    local memory_usage=$(free | grep Mem | awk '{printf "%.2f", $3/$2 * 100.0}')
    if (( $(echo "$memory_usage < 80" | bc -l) )); then
        print_success "Memory usage is normal: ${memory_usage}%"
    else
        print_warning "Memory usage is high: ${memory_usage}%"
    fi
    
    # Check disk usage
    local disk_usage=$(df -h / | awk 'NR==2{print $5}' | sed 's/%//')
    if [ "$disk_usage" -lt 80 ]; then
        print_success "Disk usage is normal: ${disk_usage}%"
    else
        print_warning "Disk usage is high: ${disk_usage}%"
    fi
}

# Function to display service status
display_status() {
    print_status "Service Status Summary:"
    echo
    
    # Core services
    echo "📊 Core Services:"
    check_container "prometheus" && echo "  ✅ Prometheus"
    check_container "grafana" && echo "  ✅ Grafana"
    check_container "loki" && echo "  ✅ Loki"
    check_container "redis" && echo "  ✅ Redis"
    check_container "alertmanager" && echo "  ✅ Alertmanager"
    echo
    
    # Biometric authentication
    echo "🔐 Biometric Authentication:"
    check_container "biometric-auth" && echo "  ✅ Biometric Auth Service"
    echo
    
    # Exporters
    echo "📈 Exporters:"
    check_container "node-exporter" && echo "  ✅ Node Exporter"
    check_container "cadvisor" && echo "  ✅ cAdvisor"
    check_container "ethereum-exporter" && echo "  ✅ Ethereum Exporter"
    check_container "polygon-exporter" && echo "  ✅ Polygon Exporter"
    echo
    
    # Logging
    echo "📝 Logging:"
    check_container "fluentd" && echo "  ✅ Fluentd"
    echo
}

# Function to run comprehensive health check
run_health_check() {
    echo "🔍 Sec-Observe-Lab Health Check"
    echo "==============================="
    echo
    
    local overall_status=0
    
    # Check Docker containers
    print_status "Checking Docker containers..."
    display_status
    
    # Check service endpoints
    print_status "Checking service endpoints..."
    
    # Core services
    check_service "Prometheus" "http://localhost:9090" 200 || overall_status=1
    check_service "Grafana" "http://localhost:3000" 200 || overall_status=1
    check_service "Loki" "http://localhost:3100" 200 || overall_status=1
    check_service "Redis" "http://localhost:6379" 200 || overall_status=1
    check_service "Alertmanager" "http://localhost:9093" 200 || overall_status=1
    
    # Biometric authentication
    check_biometric_auth || overall_status=1
    
    # Blockchain exporters
    check_blockchain_exporters || overall_status=1
    
    # System resources
    check_system_resources
    
    echo
    if [ $overall_status -eq 0 ]; then
        print_success "All services are healthy! 🎉"
    else
        print_warning "Some services may have issues. Check the logs for more details."
        echo
        print_status "To view logs, run:"
        echo "  docker-compose logs -f"
        echo "  docker-compose logs -f [service-name]"
    fi
    
    return $overall_status
}

# Function to show service URLs
show_urls() {
    echo "🌐 Service URLs:"
    echo "==============="
    echo
    echo "📊 Monitoring:"
    echo "  • Grafana: http://localhost:3000 (admin/admin123)"
    echo "  • Prometheus: http://localhost:9090"
    echo "  • Loki: http://localhost:3100"
    echo "  • Alertmanager: http://localhost:9093"
    echo
    echo "🔐 Biometric Auth:"
    echo "  • API: http://localhost:3001"
    echo "  • Health: http://localhost:3001/health"
    echo "  • Metrics: http://localhost:3001/metrics"
    echo
    echo "📈 Exporters:"
    echo "  • Node Exporter: http://localhost:9100"
    echo "  • cAdvisor: http://localhost:8080"
    echo "  • Ethereum Exporter: http://localhost:9091"
    echo "  • Polygon Exporter: http://localhost:9092"
    echo
}

# Main execution
main() {
    case "${1:-health}" in
        "health")
            run_health_check
            ;;
        "urls")
            show_urls
            ;;
        "containers")
            display_status
            ;;
        "metrics")
            print_status "Checking metrics endpoints..."
            check_metrics "Prometheus" "http://localhost:9090/metrics"
            check_metrics "Grafana" "http://localhost:3000/metrics"
            check_metrics "Biometric Auth" "http://localhost:3001/metrics"
            ;;
        *)
            echo "Usage: $0 [health|urls|containers|metrics]"
            echo
            echo "Commands:"
            echo "  health     - Run comprehensive health check (default)"
            echo "  urls       - Show service URLs"
            echo "  containers - Show container status"
            echo "  metrics    - Check metrics endpoints"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
