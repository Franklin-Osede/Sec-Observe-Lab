#!/bin/bash

# 🔐 Script de Prueba Biométrica - Sec-Observe-Lab
# Simula usuarios reales probando autenticación biométrica

echo "🚀 Iniciando pruebas biométricas como usuario real..."
echo "=================================================="

API_BASE="http://localhost:3001/api/v1"
TOTAL_USERS=20
DELAY=0.5

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para hacer requests con manejo de errores
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "${BLUE}🔄 $description${NC}"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "%{http_code}" -X $method "$API_BASE$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" 2>/dev/null)
    else
        response=$(curl -s -w "%{http_code}" -X $method "$API_BASE$endpoint" 2>/dev/null)
    fi
    
    http_code="${response: -3}"
    body="${response%???}"
    
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
        echo -e "${GREEN}✅ $description - HTTP $http_code${NC}"
        return 0
    else
        echo -e "${RED}❌ $description - HTTP $http_code${NC}"
        echo -e "${RED}   Response: $body${NC}"
        return 1
    fi
}

# Función para probar un usuario completo
test_user() {
    local username=$1
    local user_num=$2
    
    echo -e "\n${YELLOW}👤 Probando Usuario: $username (${user_num}/${TOTAL_USERS})${NC}"
    echo "----------------------------------------"
    
    # 1. WebAuthn Registration
    make_request "POST" "/webauthn/register/begin" \
        "{\"username\":\"$username\",\"displayName\":\"User $user_num\"}" \
        "WebAuthn Registration Begin"
    
    sleep 0.2
    
    # 2. WebAuthn Authentication
    make_request "POST" "/webauthn/authenticate/begin" \
        "{\"username\":\"$username\"}" \
        "WebAuthn Authentication Begin"
    
    sleep 0.2
    
    # 3. Fingerprint Recognition
    make_request "POST" "/fingerprint/recognize" \
        "{\"username\":\"$username\",\"fingerprintData\":\"fingerprint-$user_num-$(date +%s)\"}" \
        "Fingerprint Recognition"
    
    sleep 0.2
    
    # 4. Face Recognition
    make_request "POST" "/face/recognize" \
        "{\"username\":\"$username\",\"faceData\":\"face-$user_num-$(date +%s)\"}" \
        "Face Recognition"
    
    sleep 0.2
    
    # 5. QR Code Generation
    make_request "POST" "/qr/generate" \
        "{\"username\":\"$username\",\"data\":\"qr-data-$user_num-$(date +%s)\"}" \
        "QR Code Generation"
    
    sleep 0.2
    
    # 6. QR Code Validation
    make_request "POST" "/qr/validate" \
        "{\"username\":\"$username\",\"qrData\":\"qr-data-$user_num-$(date +%s)\"}" \
        "QR Code Validation"
}

# Función para verificar salud del sistema
check_system_health() {
    echo -e "\n${YELLOW}🏥 Verificando Salud del Sistema${NC}"
    echo "=================================="
    
    # Health Check
    make_request "GET" "/health" "" "System Health Check"
    
    # Metrics Check
    make_request "GET" "/metrics" "" "Metrics Endpoint"
    
    # API Docs Check
    make_request "GET" "/api-docs" "" "API Documentation"
}

# Función para generar reporte de métricas
generate_metrics_report() {
    echo -e "\n${YELLOW}📊 Generando Reporte de Métricas${NC}"
    echo "===================================="
    
    # Obtener métricas de Prometheus
    echo "🔍 Métricas de Biometric Auth:"
    curl -s http://localhost:3001/metrics | grep biometric || echo "No se encontraron métricas biométricas"
    
    echo -e "\n🔍 Métricas de Prometheus:"
    curl -s "http://localhost:9090/api/v1/query?query=biometric_auth_attempts_total" 2>/dev/null | jq '.data.result' || echo "Prometheus no disponible"
}

# Función para simular carga realista
simulate_realistic_load() {
    echo -e "\n${YELLOW}🎯 Simulando Carga Realista${NC}"
    echo "=============================="
    
    # Simular diferentes tipos de usuarios
    for i in $(seq 1 $TOTAL_USERS); do
        username="user$i"
        
        # Simular diferentes patrones de uso
        if [ $((i % 3)) -eq 0 ]; then
            # Usuario que solo usa WebAuthn
            make_request "POST" "/webauthn/register/begin" \
                "{\"username\":\"$username\",\"displayName\":\"WebAuthn User $i\"}" \
                "WebAuthn User $i"
        elif [ $((i % 3)) -eq 1 ]; then
            # Usuario que usa múltiples métodos
            test_user "$username" "$i"
        else
            # Usuario que solo usa QR
            make_request "POST" "/qr/generate" \
                "{\"username\":\"$username\",\"data\":\"qr-only-$i-$(date +%s)\"}" \
                "QR Only User $i"
        fi
        
        sleep $DELAY
    done
}

# Función principal
main() {
    echo -e "${GREEN}🔐 Sec-Observe-Lab - Pruebas Biométricas${NC}"
    echo "=============================================="
    
    # Verificar que el servicio esté corriendo
    if ! curl -s http://localhost:3001/health > /dev/null 2>&1; then
        echo -e "${RED}❌ Error: El servicio biométrico no está corriendo en localhost:3001${NC}"
        echo "💡 Ejecuta: docker-compose up -d"
        exit 1
    fi
    
    # Verificar salud del sistema
    check_system_health
    
    # Simular carga realista
    simulate_realistic_load
    
    # Generar reporte de métricas
    generate_metrics_report
    
    echo -e "\n${GREEN}✅ Pruebas completadas${NC}"
    echo "=========================="
    echo "📊 Verifica los dashboards en:"
    echo "   - Grafana: http://localhost:3000 (admin/admin123)"
    echo "   - Prometheus: http://localhost:9090"
    echo "   - Loki: http://localhost:3100"
    echo "   - Web UI: http://localhost:3001"
}

# Ejecutar función principal
main "$@"
