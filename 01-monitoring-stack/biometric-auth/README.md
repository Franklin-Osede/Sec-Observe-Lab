# 🔐 Sec-Observe-Lab Biometric Authentication System

Sistema completo de autenticación biométrica con WebAuthn, reconocimiento de huella dactilar, reconocimiento facial y códigos QR, integrado con stack de monitoreo.

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Monitoring    │
│   (Angular)     │◄──►│   (NestJS)      │◄──►│   (Prometheus)  │
│   Port: 4200    │    │   Port: 3001    │    │   Port: 9090    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Nginx       │    │     Redis       │    │    Grafana      │
│   (Reverse      │    │   (Cache)       │    │  (Dashboards)   │
│    Proxy)       │    │   Port: 6379    │    │   Port: 3000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Inicio Rápido

### Opción 1: Solo Autenticación Biométrica
```bash
# Levantar solo los servicios de autenticación
./scripts/start-biometric-auth.sh auth-only
```

### Opción 2: Sistema Completo con Monitoreo
```bash
# Levantar todo el stack de monitoreo
./scripts/start-biometric-auth.sh
```

### Opción 3: Desarrollo Local
```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend (en otra terminal)
cd frontend
npm install
npm start
```

## 📱 Servicios Disponibles

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:4201 | Interfaz de usuario Angular |
| **Backend API** | http://localhost:3001 | API REST NestJS |
| **API Docs** | http://localhost:3001/api-docs | Documentación Swagger |
| **Health Check** | http://localhost:3001/health | Estado del sistema |
| **Metrics** | http://localhost:3001/metrics | Métricas Prometheus |
| **Grafana** | http://localhost:3000 | Dashboards (admin/admin123) |
| **Prometheus** | http://localhost:9090 | Métricas y alertas |
| **Redis** | localhost:6379 | Cache y sesiones |

## 🔧 Endpoints de la API

### WebAuthn
- `POST /api/v1/webauthn/register/begin` - Iniciar registro
- `POST /api/v1/webauthn/register/complete` - Completar registro
- `POST /api/v1/webauthn/auth/begin` - Iniciar autenticación
- `POST /api/v1/webauthn/auth/complete` - Completar autenticación
- `GET /api/v1/webauthn/health` - Estado del módulo

### Huella Dactilar
- `POST /api/v1/fingerprint/recognize` - Reconocer huella
- `GET /api/v1/fingerprint/health` - Estado del módulo

### Reconocimiento Facial
- `POST /api/v1/face/recognize` - Reconocimiento facial
- `GET /api/v1/face/health` - Estado del módulo

### Códigos QR
- `POST /api/v1/qr/generate` - Generar código QR
- `POST /api/v1/qr/validate` - Validar código QR
- `GET /api/v1/qr/health` - Estado del módulo

### Sistema
- `GET /api/v1/health` - Estado general del sistema
- `GET /api/v1/metrics` - Métricas del sistema

## 🐳 Docker Compose

El sistema incluye los siguientes servicios:

### Servicios de Aplicación
- **biometric-auth-backend**: API NestJS
- **biometric-auth-frontend**: Interfaz Angular con Nginx
- **redis**: Cache y sesiones

### Servicios de Monitoreo
- **prometheus**: Recolección de métricas
- **grafana**: Dashboards y visualización
- **loki**: Logging centralizado
- **fluentd**: Recolección de logs
- **alertmanager**: Gestión de alertas
- **node-exporter**: Métricas del sistema
- **cadvisor**: Métricas de contenedores

## 🔧 Configuración

### Variables de Entorno
```bash
# Copiar archivo de ejemplo
cp env.example .env

# Editar configuración
nano .env
```

### Variables Importantes
- `NODE_ENV`: Entorno de ejecución
- `REDIS_URL`: URL de conexión a Redis
- `WEBAUTHN_RP_ID`: ID del Relying Party para WebAuthn
- `WEBAUTHN_RP_NAME`: Nombre del Relying Party
- `GRAFANA_URL`: URL de Grafana para métricas

## 📊 Monitoreo y Métricas

### Dashboards Disponibles
- **Biometric Auth**: Métricas específicas de autenticación
- **Infrastructure**: Estado de la infraestructura
- **Blockchain**: Métricas de nodos blockchain

### Alertas Configuradas
- Alto uso de CPU/Memoria
- Errores de autenticación
- Servicios caídos
- Latencia alta

## 🧪 Testing

### Pruebas Automatizadas
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run e2e
```

### Pruebas Manuales
1. Abrir http://localhost:4201
2. Probar cada método de autenticación:
   - WebAuthn (requiere HTTPS en producción)
   - Simulación de huella dactilar
   - Simulación de reconocimiento facial
   - Generación y validación de códigos QR

## 🚀 Despliegue en Producción

### Consideraciones de Seguridad
- Usar HTTPS para WebAuthn
- Configurar CORS apropiadamente
- Usar secretos seguros para JWT
- Implementar rate limiting

### Escalabilidad
- Usar Redis Cluster para alta disponibilidad
- Implementar load balancing
- Configurar auto-scaling

## 📝 Logs y Debugging

### Ver logs en tiempo real
```bash
# Todos los servicios
docker-compose logs -f

# Servicio específico
docker-compose logs -f biometric-auth-backend
```

### Debugging
```bash
# Entrar al contenedor
docker exec -it biometric-auth-backend sh

# Ver logs de Redis
docker exec -it redis redis-cli monitor
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch
3. Commit cambios
4. Push al branch
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico o preguntas:
- Crear issue en GitHub
- Contactar al equipo de desarrollo
- Revisar documentación en `/docs`
