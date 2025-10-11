#!/bin/bash

# Script para levantar el sistema completo de autenticación biométrica
# Incluye: Backend, Frontend, Redis, Monitoring Stack

echo "🚀 Starting Sec-Observe-Lab Biometric Auth System..."

# Verificar que Docker esté corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Crear directorio de logs si no existe
mkdir -p logs

# Copiar archivo de variables de entorno si no existe
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp biometric-auth/env.example .env
    echo "⚠️  Please edit .env file with your configuration"
fi

# Construir y levantar todos los servicios
echo "🔨 Building and starting all services..."

# Opción 1: Solo servicios de autenticación biométrica
if [ "$1" = "auth-only" ]; then
    echo "🎯 Starting only biometric auth services..."
    docker-compose up --build -d \
        biometric-auth-backend \
        biometric-auth-frontend \
        redis
else
    # Opción 2: Sistema completo con monitoring
    echo "📊 Starting complete monitoring stack..."
    docker-compose up --build -d
fi

# Esperar a que los servicios estén listos
echo "⏳ Waiting for services to be ready..."
sleep 10

# Verificar estado de los servicios
echo "🔍 Checking service status..."

# Backend health check
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend is running at http://localhost:3001"
else
    echo "❌ Backend is not responding"
fi

# Frontend health check
if curl -f http://localhost:4201 > /dev/null 2>&1; then
    echo "✅ Frontend is running at http://localhost:4201"
else
    echo "❌ Frontend is not responding"
fi

# Redis health check
if docker exec redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is running"
else
    echo "❌ Redis is not responding"
fi

# Mostrar URLs importantes
echo ""
echo "🌐 Service URLs:"
echo "   Frontend:     http://localhost:4201"
echo "   Backend API:  http://localhost:3001"
echo "   API Docs:     http://localhost:3001/api-docs"
echo "   Health:       http://localhost:3001/health"
echo "   Metrics:      http://localhost:3001/metrics"

if [ "$1" != "auth-only" ]; then
    echo "   Grafana:      http://localhost:3000 (admin/admin123)"
    echo "   Prometheus:   http://localhost:9090"
    echo "   Loki:         http://localhost:3100"
fi

echo ""
echo "🎉 Biometric Auth System is ready!"
echo "📱 Open http://localhost:4201 to start testing biometric authentication"
