# 🔐 Vault Secrets Management + Biometric Key Management

**Gestión segura de secretos blockchain con desbloqueo biométrico**

## 🎯 Objetivo

Crear un sistema de gestión de secretos que demuestre expertise en:
- Gestión segura de claves blockchain
- Rotación automática de secretos
- Desbloqueo biométrico de secretos críticos
- Integración con Kubernetes y aplicaciones

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Applications  │    │   Kubernetes    │    │   Blockchain    │
│   (Web3, dApps) │    │   (Pods, Jobs)  │    │   (Nodes, APIs) │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   Biometric Unlock       │
                    │  (WebAuthn, Fingerprint, │
                    │   Face Recognition, QR)   │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   HashiCorp Vault        │
                    │  (Secret Engine,         │
                    │   Authentication,        │
                    │   Authorization)        │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   Secret Storage         │
                    │  (Consul, etcd,          │
                    │   Database, Filesystem)  │
                    └───────────────────────────┘
```

## 🛠️ Stack Tecnológico

### **Core Vault**
- **HashiCorp Vault**: Gestión de secretos
- **Consul**: Backend de almacenamiento
- **etcd**: Backend alternativo
- **Database**: Backend de base de datos

### **Biometric Unlock**
- **WebAuthn**: Desbloqueo biométrico
- **Fingerprint**: Huellas dactilares
- **Face Recognition**: Reconocimiento facial
- **QR Codes**: 2FA para desbloqueo remoto

### **Integration**
- **Kubernetes**: Secrets operator
- **Ansible**: Automatización de configuración
- **Terraform**: Infraestructura como código
- **Docker**: Containerización

## 🚀 Quick Start

```bash
# Navegar al proyecto
cd 05-vault-secrets-management

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar Vault
docker-compose up -d

# Inicializar Vault
./scripts/init-vault.sh

# Configurar autenticación biométrica
./scripts/setup-biometric-auth.sh

# Probar el sistema
./scripts/test-secrets.sh
```

## 📁 Estructura del Proyecto

```
05-vault-secrets-management/
├── README.md
├── docker-compose.yml
├── .env.example
├── vault/
│   ├── config/
│   ├── policies/
│   └── scripts/
├── biometric-unlock/
│   ├── webauthn/
│   ├── fingerprint/
│   └── face-recognition/
├── kubernetes/
│   ├── vault-agent/
│   ├── secrets-operator/
│   └── csi-driver/
├── ansible/
│   ├── playbooks/
│   └── roles/
├── terraform/
│   ├── main.tf
│   └── variables.tf
└── scripts/
    ├── init-vault.sh
    ├── setup-biometric-auth.sh
    └── test-secrets.sh
```

## 🔐 Características de Seguridad

### **Secret Management**
- **Dynamic Secrets**: Generación dinámica de secretos
- **Secret Rotation**: Rotación automática
- **Audit Logging**: Registro de acceso a secretos
- **Encryption**: Cifrado en tránsito y reposo

### **Biometric Unlock**
- **WebAuthn**: Desbloqueo sin contraseñas
- **Fingerprint**: Huellas dactilares para desbloqueo
- **Face Recognition**: Reconocimiento facial
- **QR Code**: 2FA para desbloqueo remoto

### **Access Control**
- **RBAC**: Control de acceso basado en roles
- **Policies**: Políticas de acceso granulares
- **MFA**: Autenticación multi-factor
- **Time-based**: Acceso con expiración

## 📊 Secret Engines Incluidos

### **1. KV Secrets Engine**
```yaml
name: "kv-secrets"
type: "kv-v2"
path: "secret/"
description: "Key-Value secrets for applications"
```

### **2. Database Secrets Engine**
```yaml
name: "database-secrets"
type: "database"
path: "database/"
description: "Dynamic database credentials"
```

### **3. PKI Secrets Engine**
```yaml
name: "pki-secrets"
type: "pki"
path: "pki/"
description: "Certificate management"
```

### **4. Blockchain Secrets Engine**
```yaml
name: "blockchain-secrets"
type: "custom"
path: "blockchain/"
description: "Blockchain private keys and RPC endpoints"
```

## 🧪 Testing

```bash
# Tests de Vault
vault status

# Tests de autenticación biométrica
./scripts/test-biometric-auth.sh

# Tests de secretos
./scripts/test-secrets.sh

# Tests de rotación
./scripts/test-rotation.sh

# Tests de integración
./scripts/test-integration.sh
```

## 🔧 Configuración Avanzada

### **Variables de Entorno**
```bash
# Vault
VAULT_ADDR=http://localhost:8200
VAULT_TOKEN=your-vault-token
VAULT_NAMESPACE=blockchain

# Biometric Auth
WEBAUTHN_RP_ID=your-domain.com
WEBAUTHN_RP_NAME=Vault Secrets Management

# Kubernetes
KUBECONFIG_PATH=/path/to/kubeconfig
KUBE_NAMESPACE=vault
```

### **Configuración de Vault**
```hcl
storage "consul" {
  address = "127.0.0.1:8500"
  path    = "vault/"
}

listener "tcp" {
  address = "0.0.0.0:8200"
  tls_disable = true
}

ui = true
```

## 🚨 Alertas Configuradas

- **Vault Unseal**: Vault necesita ser desbloqueado
- **Secret Access**: Acceso a secretos críticos
- **Biometric Failure**: Fallo en desbloqueo biométrico
- **Rotation Failure**: Fallo en rotación de secretos
- **Audit Alert**: Eventos de auditoría críticos

## 📈 Métricas de Demostración

Este proyecto demuestra:
- **Security**: Gestión segura de secretos
- **Biometría**: Desbloqueo biométrico de secretos
- **DevOps**: Automatización de gestión de secretos
- **Blockchain**: Específico para claves blockchain

## 🔗 Enlaces Útiles

- [HashiCorp Vault Documentation](https://www.vaultproject.io/docs/)
- [Vault Kubernetes Integration](https://www.vaultproject.io/docs/platform/k8s)
- [WebAuthn Guide](https://webauthn.guide/)
- [Secret Management Best Practices](https://www.vaultproject.io/docs/concepts/secrets)

## 📝 Próximos Pasos

1. Configurar alertas específicas para tu infraestructura
2. Personalizar la gestión de secretos según tus necesidades
3. Integrar con sistemas de monitoreo
4. Implementar rotación automática de secretos
5. Añadir soporte para más tipos de secretos
