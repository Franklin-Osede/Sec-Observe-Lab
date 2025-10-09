# 🔐 Biometric Blockchain Authentication System

**Sistema completo de autenticación biométrica para blockchain**

## 🎯 Objetivo

Crear un sistema de autenticación biométrica que demuestre expertise en:
- Autenticación biométrica multi-modal
- Integración con blockchain y Web3
- QR codes dinámicos para 2FA
- Gestión de identidad descentralizada

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Mobile App    │    │   Web App       │
│   (React, Vue)  │    │   (React Native)│    │   (Next.js)     │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   Biometric Auth API      │
                    │  (WebAuthn, Fingerprint,  │
                    │   Face Recognition, QR)   │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   Blockchain Integration  │
                    │  (Web3, MetaMask,        │
                    │   Smart Contracts)       │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   Identity Management     │
                    │  (DID, Verifiable        │
                    │   Credentials, NFTs)     │
                    └───────────────────────────┘
```

## 🛠️ Stack Tecnológico

### **Frontend**
- **React**: Aplicación web principal
- **Vue.js**: Aplicación web alternativa
- **React Native**: Aplicación móvil
- **Next.js**: Framework full-stack

### **Backend**
- **Node.js**: Servidor principal
- **Express**: Framework web
- **WebSocket**: Comunicación en tiempo real
- **Redis**: Cache y sesiones

### **Biometric Authentication**
- **WebAuthn**: Autenticación biométrica estándar
- **Fingerprint**: Huellas dactilares
- **Face Recognition**: Reconocimiento facial
- **Voice Recognition**: Reconocimiento de voz
- **Behavioral**: Análisis de comportamiento

### **Blockchain Integration**
- **Web3.js**: Interacción con blockchain
- **MetaMask**: Wallet integration
- **Smart Contracts**: Contratos inteligentes
- **IPFS**: Almacenamiento descentralizado

## 🚀 Quick Start

```bash
# Navegar al proyecto
cd 06-biometric-blockchain-auth

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar el servidor de desarrollo
npm run dev

# Acceder a la aplicación
open http://localhost:3000
```

## 📁 Estructura del Proyecto

```
06-biometric-blockchain-auth/
├── README.md
├── package.json
├── .env.example
├── frontend/
│   ├── react-app/
│   ├── vue-app/
│   └── mobile-app/
├── backend/
│   ├── api/
│   ├── auth/
│   └── blockchain/
├── biometric/
│   ├── webauthn/
│   ├── fingerprint/
│   ├── face-recognition/
│   └── voice-recognition/
├── blockchain/
│   ├── smart-contracts/
│   ├── web3/
│   └── ipfs/
├── qr-codes/
│   ├── generator/
│   └── scanner/
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

## 🔐 Características de Seguridad

### **Multi-Modal Biometric**
- **Fingerprint**: Huellas dactilares
- **Face Recognition**: Reconocimiento facial
- **Voice Recognition**: Reconocimiento de voz
- **Behavioral**: Análisis de comportamiento
- **Liveness Detection**: Detección de vida

### **Blockchain Integration**
- **Wallet Connection**: Conexión con MetaMask
- **Smart Contracts**: Autenticación en blockchain
- **DID**: Identidad descentralizada
- **Verifiable Credentials**: Credenciales verificables

### **QR Code 2FA**
- **Dynamic QR**: Códigos QR dinámicos
- **Time-based**: Rotación temporal
- **Location-based**: Validación de ubicación
- **Device-binding**: Vinculación de dispositivos

## 📊 Componentes del Sistema

### **1. Biometric Registration**
```javascript
// Registro de huella dactilar
const fingerprint = await navigator.credentials.create({
  publicKey: {
    challenge: new Uint8Array(32),
    rp: { id: "localhost", name: "Blockchain Auth" },
    user: { id: userId, name: userName },
    pubKeyCredParams: [{ type: "public-key", alg: -7 }],
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      userVerification: "required"
    }
  }
});
```

### **2. Blockchain Integration**
```javascript
// Conexión con MetaMask
const accounts = await window.ethereum.request({
  method: 'eth_requestAccounts'
});

// Firma de transacción
const signature = await window.ethereum.request({
  method: 'personal_sign',
  params: [message, accounts[0]]
});
```

### **3. QR Code Generation**
```javascript
// Generación de QR dinámico
const qrData = {
  timestamp: Date.now(),
  userId: userId,
  sessionId: sessionId,
  challenge: generateChallenge()
};

const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));
```

## 🧪 Testing

```bash
# Tests unitarios
npm test

# Tests de integración
npm run test:integration

# Tests end-to-end
npm run test:e2e

# Tests de seguridad
npm run test:security

# Tests de biometric
npm run test:biometric
```

## 🔧 Configuración Avanzada

### **Variables de Entorno**
```bash
# Backend
NODE_ENV=development
PORT=3000
JWT_SECRET=your-jwt-secret
REDIS_URL=redis://localhost:6379

# Blockchain
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your-key
POLYGON_RPC_URL=https://polygon-rpc.com
IPFS_URL=https://ipfs.infura.io:5001

# Biometric
WEBAUTHN_RP_ID=localhost
WEBAUTHN_RP_NAME=Blockchain Auth
WEBAUTHN_ORIGIN=http://localhost:3000
```

### **Configuración de Biometric**
```javascript
const biometricConfig = {
  webauthn: {
    rpId: process.env.WEBAUTHN_RP_ID,
    rpName: process.env.WEBAUTHN_RP_NAME,
    origin: process.env.WEBAUTHN_ORIGIN
  },
  fingerprint: {
    threshold: 0.8,
    maxAttempts: 3
  },
  face: {
    threshold: 0.85,
    livenessDetection: true
  }
};
```

## 🚨 Alertas Configuradas

- **Biometric Failure**: Fallo en autenticación biométrica
- **Blockchain Connection**: Fallo en conexión blockchain
- **QR Code Expired**: Código QR expirado
- **Security Violation**: Violación de seguridad
- **Audit Event**: Eventos de auditoría

## 📈 Métricas de Demostración

Este proyecto demuestra:
- **Biometría**: Autenticación multi-modal avanzada
- **Blockchain**: Integración con Web3 y smart contracts
- **Security**: Seguridad en autenticación
- **UX**: Experiencia de usuario fluida

## 🔗 Enlaces Útiles

- [WebAuthn Guide](https://webauthn.guide/)
- [Web3.js Documentation](https://web3js.readthedocs.io/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [QR Code Library](https://github.com/soldair/node-qrcode)

## 📝 Próximos Pasos

1. Implementar más tipos de autenticación biométrica
2. Integrar con más blockchains
3. Añadir soporte para dispositivos IoT
4. Implementar análisis de comportamiento
5. Crear SDK para desarrolladores
