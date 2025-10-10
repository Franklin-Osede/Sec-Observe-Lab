#!/bin/bash

# Sec-Observe-Lab Health Check Script
# Comprehensive health check for all monitoring stack services

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

# Function to check if a service is healthy
check_service() {
    local service_name=$1
    local url=$2
    local expected_status=${3:-200}
    
    print_status "Checking $service_name..."
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "$expected_status"; then
        print_success "$service_name is healthy"
        return 0
    else
        print_error "$service_name is not responding correctly"
        return 1
    fi
}

# Function to check Docker containers
check_containers() {
    print_status "Checking Docker containers..."
    
    local containers=(
        "prometheus"
        "grafana"
        "loki"
        "redis"
        "biometric-auth"
        "node-exporter"
        "cadvisor"
        "alertmanager"
    )
    
    local unhealthy_containers=()
    
    for container in "${containers[@]}"; do
        if docker ps --filter "name=$container" --filter "status=running" | grep -q "$container"; then
            print_success "$container is running"
        else
            print_error "$container is not running"
            unhealthy_containers+=("$container")
        fi
    done
    
    if [ ${#unhealthy_containers[@]} -gt 0 ]; then
        print_error "Unhealthy containers: ${unhealthy_containers[*]}"
        return 1
    fi
    
    return 0
}

# Function to check service endpoints
check_endpoints() {
    print_status "Checking service endpoints..."
    
    local services=(
        "Prometheus:http://localhost:9090/-/healthy:200"
        "Grafana:http://localhost:3000/api/health:200"
        "Loki:http://localhost:3100/ready:200"
        "Redis:redis://localhost:6379:0"
        "Biometric Auth:http://localhost:3001/health:200"
        "Node Exporter:http://localhost:9100/metrics:200"
        "cAdvisor:http://localhost:8080/healthz:200"
        "Alertmanager:http://localhost:9093/-/healthy:200"
    )
    
    local failed_services=()
    
    for service in "${services[@]}"; do
        IFS=':' read -r name url expected_status <<< "$service"
        
        if ! check_service "$name" "$url" "$expected_status"; then
            failed_services+=("$name")
        fi
    done
    
    if [ ${#failed_services[@]} -gt 0 ]; then
        print_error "Failed services: ${failed_services[*]}"
        return 1
    fi
    
    return 0
}

# Function to check metrics collection
check_metrics() {
    print_status "Checking metrics collection..."
    
    # Check Prometheus targets
    local targets_url="http://localhost:9090/api/v1/targets"
    local targets_response=$(curl -s "$targets_url")
    
    if echo "$targets_response" | grep -q '"health":"up"'; then
        print_success "Prometheus targets are healthy"
    else
        print_warning "Some Prometheus targets may be unhealthy"
    fi
    
    # Check if metrics are being collected
    local metrics_url="http://localhost:9090/api/v1/query?query=up"
    local metrics_response=$(curl -s "$metrics_url")
    
    if echo "$metrics_response" | grep -q '"result"'; then
        print_success "Metrics are being collected"
    else
        print_warning "No metrics data found"
    fi
}

# Function to check logs
check_logs() {
    print_status "Checking service logs for errors..."
    
    local services=(
        "prometheus"
        "grafana"
        "loki"
        "redis"
        "biometric-auth"
        "node-exporter"
        "cadvisor"
        "alertmanager"
    )
    
    local error_services=()
    
    for service in "${services[@]}"; do
        if docker logs "$service" 2>&1 | grep -i "error\|fatal\|panic" | head -1 | grep -q .; then
            print_warning "$service has errors in logs"
            error_services+=("$service")
        else
            print_success "$service logs look clean"
        fi
    done
    
    if [ ${#error_services[@]} -gt 0 ]; then
        print_warning "Services with errors: ${error_services[*]}"
    fi
}

# Function to check disk space
check_disk_space() {
    print_status "Checking disk space..."
    
    local usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ "$usage" -lt 80 ]; then
        print_success "Disk usage is ${usage}% (healthy)"
    elif [ "$usage" -lt 90 ]; then
        print_warning "Disk usage is ${usage}% (warning)"
    else
        print_error "Disk usage is ${usage}% (critical)"
        return 1
    fi
}

# Function to check memory usage
check_memory() {
    print_status "Checking memory usage..."
    
    local memory_usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    
    if [ "$memory_usage" -lt 80 ]; then
        print_success "Memory usage is ${memory_usage}% (healthy)"
    elif [ "$memory_usage" -lt 90 ]; then
        print_warning "Memory usage is ${memory_usage}% (warning)"
    else
        print_error "Memory usage is ${memory_usage}% (critical)"
        return 1
    fi
}

# Function to generate health report
generate_report() {
    local report_file="health-report-$(date +%Y%m%d-%H%M%S).txt"
    
    print_status "Generating health report: $report_file"
    
    {
        echo "Sec-Observe-Lab Health Report"
        echo "Generated: $(date)"
        echo "=================================="
        echo
        
        echo "Docker Containers:"
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        echo
        
        echo "Service Endpoints:"
        for service in "Prometheus:http://localhost:9090" "Grafana:http://localhost:3000" "Loki:http://localhost:3100" "Biometric Auth:http://localhost:3001"; do
            IFS=':' read -r name url <<< "$service"
            echo -n "$name: "
            if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
                echo "HEALTHY"
            else
                echo "UNHEALTHY"
            fi
        done
        echo
        
        echo "System Resources:"
        echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
        echo "Memory Usage: $(free | awk 'NR==2{printf "%.1f%%", $3*100/$2}')"
        echo "Disk Usage: $(df / | awk 'NR==2 {print $5}')"
        echo
        
        echo "Recent Logs (last 10 lines):"
        docker-compose logs --tail=10
    } > "$report_file"
    
    print_success "Health report saved to $report_file"
}

# Main health check function
main() {
    echo "🔍 Sec-Observe-Lab Health Check"
    echo "================================"
    echo
    
    local exit_code=0
    
    # Run all health checks
    check_containers || exit_code=1
    echo
    
    check_endpoints || exit_code=1
    echo
    
    check_metrics
    echo
    
    check_logs
    echo
    
    check_disk_space || exit_code=1
    echo
    
    check_memory || exit_code=1
    echo
    
    # Generate report
    generate_report
    echo
    
    # Final status
    if [ $exit_code -eq 0 ]; then
        print_success "All health checks passed! 🎉"
    else
        print_error "Some health checks failed! ⚠️"
    fi
    
    exit $exit_code
}

# Run main function
main "$@"