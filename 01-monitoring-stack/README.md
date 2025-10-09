# 📊 Monitoring & Logging Stack + Biometric Auth

**Stack completo de observabilidad para blockchain con autenticación biométrica**

## 🎯 Objetivo

Crear una infraestructura de observabilidad completa que demuestre expertise en:
- Monitoreo de aplicaciones y infraestructura
- Logging centralizado y análisis
- Alertas inteligentes y dashboards
- Autenticación biométrica para acceso seguro

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Applications  │    │   Blockchain    │    │   Infrastructure│
│   (Node.js,     │    │   Nodes         │    │   (K8s, Docker, │
│    Web3 Apps)   │    │   (Ethereum,    │    │    Servers)      │
│                 │    │    Polygon)     │    │                 │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │     Data Collection       │
                    │   (Prometheus, Fluentd)   │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │     Storage & Processing  │
                    │  (Prometheus, Loki, Redis)│
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   Visualization & Alerts  │
                    │  (Grafana + Biometric Auth)│
                    └───────────────────────────┘
```

## 🛠️ Stack Tecnológico

### **Core Stack**
- **Prometheus**: Métricas y alertas
- **Grafana**: Dashboards y visualización
- **Loki**: Logging centralizado
- **Fluentd**: Recolección de logs
- **Redis**: Cache y sesiones

### **Biometric Authentication**
- **WebAuthn API**: Autenticación biométrica
- **Fingerprint**: Huellas dactilares
- **Face Recognition**: Reconocimiento facial
- **QR Codes**: 2FA dinámico

### **Blockchain Monitoring**
- **Ethereum Exporter**: Métricas de nodos Ethereum
- **Polygon Exporter**: Métricas de nodos Polygon
- **Web3 Metrics**: Métricas de aplicaciones Web3

## 🚀 Quick Start

```bash
# Clonar y navegar al proyecto
cd 01-monitoring-stack

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar el stack
docker-compose up -d

# Verificar servicios
docker-compose ps

# Acceder a Grafana (con autenticación biométrica)
open http://localhost:3000
```

## 📁 Estructura del Proyecto

```
01-monitoring-stack/
├── README.md
├── docker-compose.yml
├── .env.example
├── config/
│   ├── prometheus/
│   │   ├── prometheus.yml
│   │   └── rules/
│   ├── grafana/
│   │   ├── dashboards/
│   │   ├── datasources/
│   │   └── provisioning/
│   └── fluentd/
│       └── fluent.conf
├── biometric-auth/
│   ├── webauthn/
│   ├── fingerprint/
│   └── face-recognition/
├── exporters/
│   ├── ethereum/
│   ├── polygon/
│   └── web3/
└── scripts/
    ├── setup.sh
    └── health-check.sh
```

## 🔐 Autenticación Biométrica

### **WebAuthn Integration**
- Registro de dispositivos biométricos
- Autenticación sin contraseñas
- Soporte para múltiples factores

### **QR Code 2FA**
- Códigos QR dinámicos para 2FA
- Integración con aplicaciones móviles
- Rotación automática de códigos

### **Face Recognition**
- Reconocimiento facial en tiempo real
- Detección de liveness
- Anti-spoofing protection

## 📊 Dashboards Incluidos

- **Infrastructure Overview**: CPU, RAM, Disk, Network
- **Blockchain Nodes**: Estado de nodos, sincronización
- **Application Metrics**: Requests, errors, latency
- **Security Events**: Login attempts, failed authentications
- **Biometric Analytics**: Usage patterns, success rates

## 🚨 Alertas Configuradas

- **High CPU/Memory Usage**: >80% por 5 minutos
- **Node Sync Issues**: Blockchain nodes desincronizados
- **Failed Logins**: Múltiples intentos fallidos
- **Biometric Failures**: Fallos en autenticación biométrica
- **Service Down**: Servicios críticos caídos

## 🔧 Configuración Avanzada

### **Variables de Entorno**
```bash
# Prometheus
PROMETHEUS_RETENTION=30d
PROMETHEUS_STORAGE_PATH=/prometheus

# Grafana
GRAFANA_ADMIN_PASSWORD=secure_password
GRAFANA_SECRET_KEY=your_secret_key

# Biometric Auth
WEBAUTHN_RP_ID=localhost
WEBAUTHN_RP_NAME=Sec-Observe-Lab
```

### **Personalización de Dashboards**
- Editar archivos en `config/grafana/dashboards/`
- Importar dashboards personalizados
- Configurar alertas específicas

## 🧪 Testing

```bash
# Ejecutar tests de salud
./scripts/health-check.sh

# Tests de autenticación biométrica
npm test -- --grep "biometric"

# Tests de métricas
npm test -- --grep "metrics"
```

## 📈 Métricas de Demostración

Este proyecto demuestra:
- **Observabilidad**: Stack completo de monitoreo
- **Seguridad**: Autenticación biométrica avanzada
- **Blockchain**: Monitoreo específico para nodos
- **DevOps**: Automatización y configuración como código

## 🔗 Enlaces Útiles

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [WebAuthn Specification](https://www.w3.org/TR/webauthn/)
- [Blockchain Monitoring Best Practices](https://docs.chain.link/docs/monitoring-nodes/)

## 📝 Próximos Pasos

1. Configurar alertas específicas para tu infraestructura
2. Personalizar dashboards según tus necesidades
3. Integrar con sistemas de notificación (Slack, Discord)
4. Implementar retención de datos personalizada
5. Añadir más exporters para otras blockchains
