# 🛡️ Infrastructure Hardening + Biometric Access Control

**Automatización de hardening CIS con control de acceso biométrico**

## 🎯 Objetivo

Crear un playbook de hardening que demuestre expertise en:
- Automatización de seguridad de infraestructura
- Compliance CIS (Center for Internet Security)
- Control de acceso biométrico para servidores
- Auditoría y reporting de seguridad

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Ansible       │    │   Target        │    │   Biometric     │
│   Controller    │    │   Servers       │    │   Access        │
│   (Playbooks)   │    │   (Linux/Unix)  │    │   Control       │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   Security Hardening      │
                    │  (UFW, Fail2ban, Auditd,  │
                    │   SSH, TLS, Certificates) │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   Compliance Reporting    │
                    │  (CIS Benchmarks,        │
                    │   Security Reports)      │
                    └───────────────────────────┘
```

## 🛠️ Stack Tecnológico

### **Core Hardening**
- **Ansible**: Automatización de configuración
- **UFW**: Firewall uncomplicated
- **Fail2ban**: Protección contra ataques
- **Auditd**: Auditoría del sistema
- **SSH**: Configuración segura de SSH

### **Biometric Access Control**
- **WebAuthn**: Autenticación biométrica
- **Fingerprint**: Huellas dactilares
- **Face Recognition**: Reconocimiento facial
- **QR Codes**: 2FA para acceso remoto

### **Compliance & Reporting**
- **CIS Benchmarks**: Estándares de seguridad
- **HTML Reports**: Reportes de compliance
- **Molecule**: Testing de playbooks
- **Testinfra**: Validación de configuración

## 🚀 Quick Start

```bash
# Navegar al proyecto
cd 04-infrastructure-hardening

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar playbook de hardening
ansible-playbook -i inventory/hosts playbooks/hardening.yml

# Generar reporte de compliance
ansible-playbook -i inventory/hosts playbooks/compliance-report.yml
```

## 📁 Estructura del Proyecto

```
04-infrastructure-hardening/
├── README.md
├── requirements.txt
├── .env.example
├── playbooks/
│   ├── hardening.yml
│   ├── compliance-report.yml
│   └── biometric-setup.yml
├── roles/
│   ├── firewall/
│   ├── fail2ban/
│   ├── auditd/
│   ├── ssh/
│   └── biometric-auth/
├── inventory/
│   ├── hosts
│   └── group_vars/
├── tests/
│   ├── molecule/
│   └── testinfra/
├── reports/
│   └── templates/
└── scripts/
    ├── setup.sh
    └── health-check.sh
```

## 🔐 Características de Seguridad

### **Hardening CIS**
- **CIS Level 1**: Configuración básica de seguridad
- **CIS Level 2**: Configuración avanzada de seguridad
- **Custom Rules**: Reglas personalizadas específicas
- **Compliance Reporting**: Reportes de cumplimiento

### **Biometric Access Control**
- **WebAuthn**: Autenticación biométrica para SSH
- **Fingerprint**: Huellas dactilares para acceso
- **Face Recognition**: Reconocimiento facial
- **QR Code**: 2FA para acceso remoto

### **Security Tools**
- **UFW**: Firewall con reglas personalizadas
- **Fail2ban**: Protección contra ataques
- **Auditd**: Auditoría completa del sistema
- **SSH**: Configuración segura con claves

## 📊 Playbooks Incluidos

### **1. Hardening Básico**
```yaml
name: Basic Hardening
tasks:
  - Update system packages
  - Configure firewall (UFW)
  - Setup fail2ban
  - Secure SSH configuration
  - Install security tools
```

### **2. Hardening Avanzado**
```yaml
name: Advanced Hardening
tasks:
  - CIS Level 1 compliance
  - CIS Level 2 compliance
  - Custom security rules
  - Biometric access control
  - Audit configuration
```

### **3. Compliance Reporting**
```yaml
name: Compliance Report
tasks:
  - Run CIS benchmarks
  - Generate HTML report
  - Send email notification
  - Upload to monitoring system
```

## 🧪 Testing

```bash
# Tests de playbooks
molecule test

# Tests de compliance
testinfra tests/

# Tests de seguridad
ansible-playbook -i inventory/hosts playbooks/security-test.yml

# Tests de biometric
ansible-playbook -i inventory/hosts playbooks/biometric-test.yml
```

## 🔧 Configuración Avanzada

### **Variables de Entorno**
```bash
# Ansible
ANSIBLE_HOST_KEY_CHECKING=False
ANSIBLE_SSH_RETRIES=3

# Biometric Auth
WEBAUTHN_RP_ID=your-domain.com
WEBAUTHN_RP_NAME=Infrastructure Hardening

# Compliance
CIS_LEVEL=2
REPORT_FORMAT=html
EMAIL_NOTIFICATIONS=true
```

### **Configuración de Hardening**
```yaml
hardening:
  cis_level: 2
  firewall:
    default_policy: deny
    allow_ssh: true
    allow_http: false
  fail2ban:
    enabled: true
    max_retry: 3
    ban_time: 3600
  ssh:
    port: 22
    permit_root_login: no
    password_authentication: no
```

## 🚨 Alertas Configuradas

- **Hardening Failure**: Fallo en aplicación de hardening
- **Compliance Failure**: Incumplimiento de estándares CIS
- **Biometric Failure**: Fallo en autenticación biométrica
- **Security Violation**: Violación de políticas de seguridad
- **Audit Alert**: Eventos de auditoría críticos

## 📈 Métricas de Demostración

Este proyecto demuestra:
- **Security**: Hardening automatizado y compliance
- **Biometría**: Control de acceso biométrico
- **DevOps**: Automatización de configuración
- **Compliance**: Cumplimiento de estándares CIS

## 🔗 Enlaces Útiles

- [Ansible Documentation](https://docs.ansible.com/)
- [CIS Benchmarks](https://www.cisecurity.org/benchmark/)
- [UFW Documentation](https://help.ubuntu.com/community/UFW)
- [Fail2ban Documentation](https://www.fail2ban.org/wiki/index.php/Main_Page)

## 📝 Próximos Pasos

1. Configurar alertas específicas para tu infraestructura
2. Personalizar el hardening según tus necesidades
3. Integrar con sistemas de monitoreo
4. Implementar rotación automática de certificados
5. Añadir soporte para más sistemas operativos
