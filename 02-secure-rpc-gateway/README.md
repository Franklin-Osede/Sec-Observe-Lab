# 🔐 Secure RPC Gateway + Biometric Protection

**Gateway seguro para RPC blockchain con autenticación biométrica y rate limiting**

## 🎯 Objetivo

Crear un proxy seguro que demuestre expertise en:
- Seguridad de APIs blockchain
- Autenticación biométrica avanzada
- Rate limiting y protección DDoS
- mTLS y certificados mutuos
- WAF (Web Application Firewall)

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Apps   │    │   Mobile Apps   │    │   Web Apps      │
│   (Web3, dApps) │    │   (React Native)│    │   (React, Vue)  │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   Biometric Auth Layer    │
                    │  (WebAuthn, Fingerprint,    │
                    │   Face Recognition, QR)     │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │     Envoy Proxy          │
                    │  (Rate Limiting, mTLS,   │
                    │   WAF, Load Balancing)   │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   Blockchain Nodes       │
                    │  (Ethereum, Polygon,     │
                    │   BSC, Arbitrum)        │
                    └───────────────────────────┘
```

## 🛠️ Stack Tecnológico

### **Core Gateway**
- **Envoy Proxy**: Load balancing y routing
- **Nginx**: Reverse proxy y SSL termination
- **Lua Scripts**: Lógica de negocio personalizada
- **Redis**: Rate limiting y cache

### **Seguridad**
- **mTLS**: Certificados mutuos para comunicación
- **API Keys**: Autenticación por clave
- **JWT**: Tokens de sesión seguros
- **WAF**: Protección contra ataques web

### **Biometric Authentication**
- **WebAuthn**: Autenticación biométrica estándar
- **Fingerprint**: Huellas dactilares
- **Face Recognition**: Reconocimiento facial
- **QR Codes**: 2FA dinámico

### **Rate Limiting**
- **Redis-based**: Rate limiting distribuido
- **IP-based**: Límites por IP
- **User-based**: Límites por usuario
- **Method-based**: Límites por método RPC

## 🚀 Quick Start

```bash
# Navegar al proyecto
cd 02-secure-rpc-gateway

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Generar certificados mTLS
./scripts/generate-certs.sh

# Iniciar el gateway
docker-compose up -d

# Verificar servicios
docker-compose ps

# Probar el gateway
curl -X POST http://localhost:8080/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

## 📁 Estructura del Proyecto

```
02-secure-rpc-gateway/
├── README.md
├── docker-compose.yml
├── .env.example
├── envoy/
│   ├── envoy.yaml
│   └── config/
├── nginx/
│   ├── nginx.conf
│   └── lua/
├── biometric-auth/
│   ├── webauthn/
│   ├── fingerprint/
│   └── face-recognition/
├── rate-limiting/
│   ├── redis/
│   └── lua-scripts/
├── certificates/
│   ├── ca/
│   ├── server/
│   └── client/
└── scripts/
    ├── generate-certs.sh
    ├── setup.sh
    └── health-check.sh
```

## 🔐 Características de Seguridad

### **Autenticación Multi-Factor**
- **API Key**: Autenticación básica
- **Biometric**: WebAuthn + Fingerprint + Face
- **QR Code**: 2FA dinámico
- **mTLS**: Certificados mutuos

### **Rate Limiting Avanzado**
- **Por IP**: 100 requests/minuto
- **Por Usuario**: 1000 requests/hora
- **Por Método**: Límites específicos por RPC method
- **Burst Protection**: Protección contra picos de tráfico

### **WAF Protection**
- **SQL Injection**: Detección y bloqueo
- **XSS**: Protección contra cross-site scripting
- **CSRF**: Protección contra cross-site request forgery
- **DDoS**: Protección contra ataques distribuidos

## 📊 Métricas y Monitoreo

### **Métricas de Seguridad**
- Intentos de autenticación fallidos
- Rate limiting activado
- WAF blocks
- mTLS handshake failures

### **Métricas de Performance**
- Latencia de requests
- Throughput por segundo
- Error rates
- Connection pool status

## 🧪 Testing

```bash
# Tests de seguridad
npm test -- --grep "security"

# Tests de rate limiting
npm test -- --grep "rate-limiting"

# Tests de autenticación biométrica
npm test -- --grep "biometric"

# Load testing
k6 run load-tests/rpc-gateway.js
```

## 🔧 Configuración Avanzada

### **Variables de Entorno**
```bash
# Envoy
ENVOY_ADMIN_PORT=9901
ENVOY_LISTENER_PORT=8080

# Rate Limiting
RATE_LIMIT_REQUESTS_PER_MINUTE=100
RATE_LIMIT_BURST_SIZE=50

# Biometric Auth
WEBAUTHN_RP_ID=your-domain.com
WEBAUTHN_RP_NAME=Secure RPC Gateway
```

### **Configuración de Rate Limiting**
```yaml
rate_limits:
  - name: "rpc_requests"
    requests_per_unit: 100
    unit: "MINUTE"
  - name: "eth_getBalance"
    requests_per_unit: 10
    unit: "MINUTE"
```

## 🚨 Alertas Configuradas

- **High Error Rate**: >5% de errores por minuto
- **Rate Limit Exceeded**: Múltiples IPs bloqueadas
- **WAF Blocks**: Ataques detectados
- **mTLS Failures**: Fallos en certificados
- **Biometric Failures**: Fallos en autenticación

## 📈 Demostración de Expertise

Este proyecto demuestra:
- **Seguridad Avanzada**: mTLS, WAF, rate limiting
- **Biometría**: Integración de autenticación biométrica
- **Blockchain**: Específico para RPC de blockchain
- **DevOps**: Automatización y configuración como código

## 🔗 Enlaces Útiles

- [Envoy Documentation](https://www.envoyproxy.io/docs/)
- [WebAuthn Guide](https://webauthn.guide/)
- [Rate Limiting Best Practices](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)
- [mTLS Configuration](https://www.envoyproxy.io/docs/envoy/latest/configuration/other_protocols/tls)

## 📝 Próximos Pasos

1. Configurar alertas específicas para tu infraestructura
2. Personalizar rate limiting según tus necesidades
3. Integrar con sistemas de monitoreo
4. Implementar rotación automática de certificados
5. Añadir soporte para más blockchains
