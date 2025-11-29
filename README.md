# Sec-Observe-Lab

**Advanced Security & Observability Laboratory for Blockchain Infrastructure**

A comprehensive portfolio demonstrating expertise in blockchain infrastructure security, observability, and automation with cutting-edge biometric authentication integration.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Development](#development)
- [Security Features](#security-features)
- [Monitoring & Observability](#monitoring--observability)
- [Project Portfolio](#project-portfolio)
- [Demonstrated Expertise](#demonstrated-expertise)
- [Business Value](#business-value)
- [Service URLs](#service-urls)
- [Documentation](#documentation)
- [License](#license)
- [Contact](#contact)

## Overview

Sec-Observe-Lab is a production-ready demonstration portfolio showcasing advanced technical capabilities in building enterprise-grade blockchain infrastructure. The repository combines traditional DevOps practices with blockchain-specific requirements and next-generation biometric security.

### Key Features

- **Complete Observability Stack**: Prometheus, Grafana, Loki, and Fluentd for comprehensive monitoring
- **Biometric Authentication**: Multi-modal authentication including WebAuthn, fingerprint, face recognition, and QR 2FA
- **Blockchain Monitoring**: Specialized exporters for Ethereum, Polygon, and other blockchain networks
- **Security Gateway**: Advanced RPC gateway with mTLS, WAF, and rate limiting
- **CI/CD Automation**: Full pipeline implementation with infrastructure as code
- **Secrets Management**: Secure credential storage and rotation with HashiCorp Vault
- **Infrastructure Hardening**: Automated security hardening with CIS compliance

### Project Status

- **01-monitoring-stack**: Production Ready - Fully implemented and operational
- **02-secure-rpc-gateway**: Under Construction
- **03-cicd-blockchain-pipeline**: Under Construction
- **04-infrastructure-hardening**: Under Construction
- **05-vault-secrets-management**: Under Construction
- **06-biometric-blockchain-auth**: Under Construction

## Architecture

This lab demonstrates production-ready infrastructure patterns for blockchain environments, combining traditional DevOps practices with blockchain-specific requirements and next-generation biometric security.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Sec-Observe-Lab Architecture                │
├─────────────────────────────────────────────────────────────────┤
│  Biometric Auth Layer (WebAuthn, Fingerprint, Face, QR)       │
├─────────────────────────────────────────────────────────────────┤
│  Observability Stack (Prometheus, Grafana, Loki, Alerting)     │
├─────────────────────────────────────────────────────────────────┤
│  Security Layer (mTLS, WAF, Rate Limiting, Hardening)         │
├─────────────────────────────────────────────────────────────────┤
│  Automation Layer (CI/CD, IaC, Secrets Management)             │
├─────────────────────────────────────────────────────────────────┤
│  Blockchain Layer (Ethereum, Polygon, BSC, Arbitrum)           │
└─────────────────────────────────────────────────────────────────┘
```

### Monitoring Stack Architecture

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
                    │   (Prometheus, Fluentd)    │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │     Storage & Processing   │
                    │  (Prometheus, Loki, Redis) │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   Visualization & Alerts  │
                    │  (Grafana + Biometric Auth)│
                    └───────────────────────────┘
```

## Project Structure

```
sec-observe-lab/
├── 01-monitoring-stack/              # Complete observability stack
│   ├── biometric-auth/                # Biometric authentication service
│   │   ├── backend/                   # NestJS backend API
│   │   │   ├── src/
│   │   │   │   ├── modules/
│   │   │   │   │   ├── webauthn/      # WebAuthn implementation
│   │   │   │   │   ├── fingerprint/   # Fingerprint recognition
│   │   │   │   │   └── qr/            # QR code 2FA
│   │   │   │   └── common/            # Shared utilities
│   │   │   └── Dockerfile
│   │   └── frontend/                  # Angular frontend
│   ├── config/
│   │   ├── prometheus/                # Prometheus configuration
│   │   │   ├── prometheus.yml
│   │   │   └── rules/                 # Alerting rules
│   │   ├── grafana/                   # Grafana provisioning
│   │   │   ├── dashboards/            # Pre-configured dashboards
│   │   │   └── provisioning/          # Auto-provisioning configs
│   │   ├── loki/                      # Loki configuration
│   │   └── fluentd/                    # Fluentd configuration
│   ├── scripts/                       # Automation scripts
│   │   ├── setup.sh                   # Initial setup
│   │   ├── health-check.sh              # Health validation
│   │   └── start-dev.sh               # Development startup
│   └── docker-compose.yml             # Stack orchestration
│
├── 02-secure-rpc-gateway/             # RPC gateway with security
│   └── README.md
│
├── 03-cicd-blockchain-pipeline/       # CI/CD automation
│   └── README.md
│
├── 04-infrastructure-hardening/      # Security hardening
│   └── README.md
│
├── 05-vault-secrets-management/       # Secrets management
│   └── README.md
│
└── 06-biometric-blockchain-auth/      # Advanced biometric auth
    └── README.md
```

## Technology Stack

### Observability & Monitoring

- **Prometheus**: Metrics collection, storage, and alerting
- **Grafana**: Visualization dashboards and analytics
- **Loki**: Log aggregation and analysis
- **Fluentd**: Log collection and processing
- **Alertmanager**: Alert routing and notification management
- **Redis**: Caching and session management

### Security & Authentication

- **WebAuthn**: FIDO2 standard biometric authentication
- **NestJS**: Enterprise-grade Node.js framework
- **JWT**: Token-based authentication
- **Passport**: Authentication middleware
- **Helmet**: Security headers
- **Rate Limiting**: Request throttling and DDoS protection

### Automation & Infrastructure

- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Terraform**: Infrastructure as Code (planned)
- **Ansible**: Configuration management (planned)
- **GitHub Actions**: CI/CD automation (planned)
- **Kubernetes**: Container orchestration (planned)

### Blockchain Integration

- **Web3.js**: Ethereum blockchain interaction
- **Custom Exporters**: Blockchain node metrics
- **Smart Contracts**: Solidity contract monitoring
- **Node Monitoring**: Ethereum, Polygon, BSC, Arbitrum support

### Frontend

- **Angular**: Frontend framework for biometric auth UI
- **TypeScript**: Type-safe development
- **RxJS**: Reactive programming

## Getting Started

### Prerequisites

- **Docker**: Version 20.10+ and Docker Compose
- **Node.js**: Version 18+ and npm
- **Git**: For version control

### Installation

```bash
# Clone the repository
git clone https://github.com/Franklin-Osede/sec-observe-lab.git
cd sec-observe-lab

# Navigate to monitoring stack
cd 01-monitoring-stack

# Copy environment variables
cp env.example .env

# Edit .env with your configurations
# Configure passwords, API keys, and service URLs

# Start the stack
docker-compose up -d

# Verify services are running
docker-compose ps

# Check service health
./scripts/health-check.sh
```

### Access Services

Once the stack is running, access the services:

- **Grafana**: http://localhost:3000 (default: admin/admin123)
- **Prometheus**: http://localhost:9090
- **Loki**: http://localhost:3100
- **Alertmanager**: http://localhost:9093
- **Biometric Auth API**: http://localhost:3001
- **Biometric Auth Frontend**: http://localhost:4200

### Quick Health Check

```bash
# Run comprehensive health check
cd 01-monitoring-stack
./scripts/health-check.sh

# Check individual services
curl http://localhost:3001/health
curl http://localhost:9090/-/healthy
curl http://localhost:3000/api/health
```

## Development

### Local Development Setup

#### Backend Development

```bash
cd 01-monitoring-stack/biometric-auth/backend

# Install dependencies
npm install

# Start development server
npm run start:dev

# Run tests
npm run test

# Run tests with coverage
npm run test:cov

# Lint code
npm run lint
```

#### Frontend Development

```bash
cd 01-monitoring-stack/biometric-auth/frontend

# Install dependencies
npm install

# Start development server
npm run start

# Run tests
npm run test

# Build for production
npm run build
```

### Development Stack

For development with hot-reload and debugging:

```bash
cd 01-monitoring-stack

# Start development stack
./scripts/start-dev.sh

# Or use docker-compose for development
docker-compose -f docker-compose.dev.yml up
```

### Testing

```bash
# Run all tests
cd 01-monitoring-stack
npm test

# Run biometric authentication tests
cd biometric-auth
npm run test -- --grep "biometric"

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

### Building

```bash
# Build backend
cd 01-monitoring-stack/biometric-auth/backend
npm run build

# Build frontend
cd 01-monitoring-stack/biometric-auth/frontend
npm run build

# Build Docker images
docker-compose build
```

## Security Features

### Multi-Modal Biometric Authentication

The platform supports multiple biometric authentication methods:

- **WebAuthn**: FIDO2 standard implementation for passwordless authentication
- **Fingerprint Recognition**: High-accuracy fingerprint scanning and verification
- **Face Recognition**: Real-time face detection with liveness detection and anti-spoofing
- **Voice Recognition**: Voice pattern analysis for authentication
- **Behavioral Analysis**: Typing patterns and usage analytics
- **QR Code 2FA**: Dynamic two-factor authentication with time-based rotation

### Advanced Security Controls

- **Mutual TLS (mTLS)**: Encrypted communication between all services
- **Rate Limiting**: Intelligent rate limiting with Redis-backed throttling
- **Web Application Firewall (WAF)**: Protection against common attacks
- **Audit Logging**: Comprehensive audit trails for all security events
- **Secrets Management**: Secure key rotation and storage
- **Infrastructure Hardening**: CIS-compliant security policies
- **JWT Authentication**: Token-based authentication with secure storage
- **Session Management**: Secure session handling with Redis

### Security Best Practices

- All sensitive data encrypted at rest and in transit
- Least-privilege access control
- Regular security audits and vulnerability scanning
- Automated security policy enforcement
- Comprehensive audit logging

## Monitoring & Observability

### Pre-configured Dashboards

The monitoring stack includes several pre-configured Grafana dashboards:

- **Infrastructure Overview**: CPU, RAM, disk, and network metrics
- **Blockchain Nodes**: Node status, synchronization, and health metrics
- **Application Metrics**: Request rates, errors, latency, and throughput
- **Security Events**: Login attempts, failed authentications, and security alerts
- **Biometric Analytics**: Usage patterns, success rates, and authentication metrics

### Alerting Rules

Prometheus alerting rules are configured for:

- **High Resource Usage**: CPU or memory exceeding 80% for 5 minutes
- **Node Sync Issues**: Blockchain nodes out of sync
- **Failed Logins**: Multiple failed authentication attempts
- **Biometric Failures**: Unusual patterns in biometric authentication
- **Service Down**: Critical services unavailable
- **High Error Rates**: Application error rates exceeding thresholds

### Metrics Collection

The stack collects metrics from:

- **Node Exporter**: System-level metrics (CPU, memory, disk, network)
- **cAdvisor**: Container metrics
- **Application Metrics**: Custom Prometheus metrics from applications
- **Blockchain Exporters**: Ethereum, Polygon, and other blockchain node metrics
- **Redis Metrics**: Cache and session metrics

### Log Aggregation

- **Loki**: Centralized log storage and querying
- **Fluentd**: Log collection from all services
- **Structured Logging**: JSON-formatted logs for easy parsing
- **Log Retention**: Configurable retention policies

## Project Portfolio

### Core Infrastructure Projects

#### 01-monitoring-stack

**Complete Observability Stack with Biometric Authentication**

- **Status**: Production Ready
- **Stack**: Prometheus + Grafana + Loki + Fluentd + Redis
- **Biometrics**: WebAuthn, Fingerprint, Face Recognition, QR 2FA
- **Blockchain**: Ethereum & Polygon node monitoring
- **Features**: Real-time dashboards, intelligent alerting, biometric access control
- **Demonstrates**: Full-stack observability, biometric security integration

#### 02-secure-rpc-gateway

**Advanced RPC Gateway with Biometric Protection**

- **Status**: Under Construction
- **Stack**: Envoy/Nginx + Lua + Redis + WAF
- **Security**: mTLS, API Key auth, rate limiting, DDoS protection
- **Biometrics**: Multi-factor authentication for RPC access
- **Features**: Load balancing, request filtering, audit logging
- **Demonstrates**: API security, traffic management, biometric access control

### Automation & Security Projects

#### 03-cicd-blockchain-pipeline

**Complete CI/CD Pipeline with Biometric Approval**

- **Status**: Under Construction
- **Stack**: GitHub Actions + Terraform + Docker + Kubernetes
- **Biometrics**: Biometric approval for critical deployments
- **Features**: Automated testing, infrastructure deployment, health validation
- **Demonstrates**: DevOps automation, deployment security, infrastructure management

#### 04-infrastructure-hardening

**Automated Security Hardening with Biometric Access**

- **Status**: Under Construction
- **Stack**: Ansible + UFW + Fail2ban + Auditd
- **Compliance**: CIS benchmarks, security policies
- **Biometrics**: Biometric access control for servers
- **Features**: Automated hardening, compliance reporting, audit trails
- **Demonstrates**: Security automation, compliance management, access control

### Advanced Security Projects

#### 05-vault-secrets-management

**Secure Secrets Management with Biometric Unlock**

- **Status**: Under Construction
- **Stack**: HashiCorp Vault + Ansible + Kubernetes Secrets
- **Biometrics**: Biometric unlock for critical secrets
- **Features**: Secret rotation, audit logging, policy management
- **Demonstrates**: Secrets management, security policies, biometric access

#### 06-biometric-blockchain-auth

**Multi-Modal Biometric Authentication for Blockchain**

- **Status**: Under Construction
- **Stack**: React + WebAuthn + Node.js + Web3 + MetaMask
- **Biometrics**: Fingerprint, Face, Voice, Behavioral analysis
- **Blockchain**: Web3 integration, smart contracts, DID
- **Features**: Multi-modal auth, blockchain identity, verifiable credentials
- **Demonstrates**: Advanced biometrics, blockchain identity, Web3 integration

## Demonstrated Expertise

This portfolio demonstrates advanced capabilities in:

### Site Reliability Engineering (SRE)

- Complete observability stack implementation
- Automated monitoring and alerting
- Infrastructure automation and scaling
- Incident response and recovery procedures
- Performance optimization and capacity planning

### Security Engineering

- Multi-layered security architecture
- Biometric authentication systems
- Infrastructure hardening and compliance
- Secrets management and rotation
- Threat detection and response

### Blockchain Infrastructure

- Blockchain node monitoring and management
- Web3 application security
- Decentralized identity systems
- Smart contract deployment and monitoring
- Cross-chain integration patterns

### DevOps & Automation

- Full CI/CD pipeline implementation
- Infrastructure as Code practices
- Automated testing and deployment
- Configuration management
- Container orchestration

## Business Value

### For Organizations

- **Reduced Security Risks**: Multi-layered security with biometric authentication reduces attack surface
- **Improved Observability**: Complete visibility into blockchain infrastructure enables proactive issue detection
- **Automated Operations**: Reduced manual intervention and human error through automation
- **Compliance Ready**: Built-in security policies and audit capabilities support regulatory compliance
- **Scalable Architecture**: Cloud-native and containerized solutions support growth

### For Teams

- **Faster Development**: Automated CI/CD pipelines accelerate delivery cycles
- **Better Monitoring**: Real-time insights enable data-driven decisions
- **Enhanced Security**: Biometric access control and audit trails improve security posture
- **Scalable Infrastructure**: Cloud-native solutions support dynamic scaling

## Service URLs

### Monitoring Stack

- **Grafana**: http://localhost:3000 (default: admin/admin123)
- **Prometheus**: http://localhost:9090
- **Loki**: http://localhost:3100
- **Alertmanager**: http://localhost:9093

### Biometric Authentication

- **API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **Metrics**: http://localhost:3001/metrics
- **API Documentation**: http://localhost:3001/api
- **Frontend**: http://localhost:4200

### Exporters

- **Node Exporter**: http://localhost:9100
- **cAdvisor**: http://localhost:8080
- **Ethereum Exporter**: http://localhost:9091
- **Polygon Exporter**: http://localhost:9092

## Documentation

### Technical Documentation

- **Monitoring Stack README**: Detailed setup and configuration guide
- **API Documentation**: OpenAPI/Swagger documentation available at `/api` endpoint
- **Architecture Diagrams**: Visual representations of system architecture
- **Security Policies**: Security configuration and best practices

### Development Guides

- **Local Development Setup**: Step-by-step development environment setup
- **Testing Guide**: Testing strategies and execution
- **Deployment Guide**: Production deployment procedures
- **Troubleshooting**: Common issues and solutions

## License

MIT License - See [LICENSE](./LICENSE) for details.

## Contact

**Franklin Osede**

- **GitHub**: [@Franklin-Osede](https://github.com/Franklin-Osede)
- **LinkedIn**: [Franklin Osede](https://linkedin.com/in/franklin-osede)
- **Email**: franklin.osede@example.com

---

*This repository demonstrates advanced technical capabilities in blockchain infrastructure, security, and automation. Each project is production-ready and showcases enterprise-grade solutions.*
