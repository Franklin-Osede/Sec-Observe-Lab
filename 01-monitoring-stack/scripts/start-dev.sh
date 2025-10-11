#!/bin/bash

echo "🚀 Iniciando entorno de desarrollo con auto-reload..."

# Parar contenedores existentes
echo "🛑 Parando contenedores existentes..."
docker-compose -f docker-compose.dev.yml down

# Construir y levantar servicios
echo "🔨 Construyendo y levantando servicios..."
docker-compose -f docker-compose.dev.yml up --build -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Verificar estado de los servicios
echo "🔍 Verificando estado de los servicios..."

# Backend health check
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend is running at http://localhost:3001"
else
    echo "❌ Backend is not responding"
fi

# Frontend health check
if curl -f http://localhost:4202 > /dev/null 2>&1; then
    echo "✅ Frontend is running at http://localhost:4202"
else
    echo "❌ Frontend is not responding"
fi

# Grafana health check
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Grafana is running at http://localhost:3000"
else
    echo "❌ Grafana is not responding"
fi

echo ""
echo "🌐 Service URLs:"
echo "   Frontend:     http://localhost:4202 (con auto-reload)"
echo "   Backend:      http://localhost:3001 (con auto-reload)"
echo "   Grafana:      http://localhost:3000"
echo "   Prometheus:   http://localhost:9090"
echo "   Loki:         http://localhost:3100"
echo ""
echo "📱 Open http://localhost:4202 to start testing biometric authentication"
echo "🔄 Los cambios en el código se reflejarán automáticamente"
echo ""
echo "Para parar los servicios: docker-compose -f docker-compose.dev.yml down"
