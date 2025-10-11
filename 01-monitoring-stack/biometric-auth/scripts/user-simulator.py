#!/usr/bin/env python3
"""
🎮 Simulador de Usuario Biométrico - Sec-Observe-Lab
Simula usuarios reales probando autenticación biométrica
"""

import requests
import time
import random
import json
from datetime import datetime
import threading
from concurrent.futures import ThreadPoolExecutor

class BiometricUserSimulator:
    def __init__(self, api_base="http://localhost:3001/api/v1"):
        self.api_base = api_base
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})
        
    def make_request(self, method, endpoint, data=None, description=""):
        """Hacer request con manejo de errores"""
        try:
            url = f"{self.api_base}{endpoint}"
            response = self.session.request(method, url, json=data, timeout=10)
            
            if response.status_code in [200, 201]:
                print(f"✅ {description} - HTTP {response.status_code}")
                return True, response.json() if response.content else {}
            else:
                print(f"❌ {description} - HTTP {response.status_code}")
                return False, response.text
        except Exception as e:
            print(f"❌ {description} - Error: {str(e)}")
            return False, str(e)
    
    def simulate_user(self, username, user_type="normal"):
        """Simular un usuario completo"""
        print(f"\n👤 Usuario: {username} (Tipo: {user_type})")
        print("-" * 50)
        
        # Patrones de uso según tipo de usuario
        if user_type == "webauthn_only":
            return self.simulate_webauthn_user(username)
        elif user_type == "qr_only":
            return self.simulate_qr_user(username)
        elif user_type == "mixed":
            return self.simulate_mixed_user(username)
        else:
            return self.simulate_normal_user(username)
    
    def simulate_webauthn_user(self, username):
        """Usuario que solo usa WebAuthn"""
        print(f"🔑 {username} - Usuario WebAuthn")
        
        # Registro WebAuthn
        success, _ = self.make_request("POST", "/webauthn/register/begin", 
            {"username": username, "displayName": f"WebAuthn User {username}"},
            f"WebAuthn Registration - {username}")
        
        if success:
            time.sleep(0.5)
            # Autenticación WebAuthn
            self.make_request("POST", "/webauthn/authenticate/begin",
                {"username": username},
                f"WebAuthn Authentication - {username}")
        
        return success
    
    def simulate_qr_user(self, username):
        """Usuario que solo usa QR"""
        print(f"📱 {username} - Usuario QR")
        
        # Generar QR
        success, response = self.make_request("POST", "/qr/generate",
            {"username": username, "data": f"qr-data-{username}-{int(time.time())}"},
            f"QR Generation - {username}")
        
        if success and 'qrCodeUrl' in response:
            time.sleep(0.5)
            # Validar QR
            self.make_request("POST", "/qr/validate",
                {"username": username, "qrData": f"qr-data-{username}-{int(time.time())}"},
                f"QR Validation - {username}")
        
        return success
    
    def simulate_mixed_user(self, username):
        """Usuario que usa múltiples métodos"""
        print(f"🔐 {username} - Usuario Mixto")
        
        methods = [
            ("WebAuthn", self.simulate_webauthn_user),
            ("Fingerprint", self.simulate_fingerprint_user),
            ("Face", self.simulate_face_user),
            ("QR", self.simulate_qr_user)
        ]
        
        # Usar 2-3 métodos aleatoriamente
        selected_methods = random.sample(methods, random.randint(2, 3))
        
        for method_name, method_func in selected_methods:
            if method_name == "WebAuthn":
                method_func(username)
            elif method_name == "Fingerprint":
                self.simulate_fingerprint_user(username)
            elif method_name == "Face":
                self.simulate_face_user(username)
            elif method_name == "QR":
                self.simulate_qr_user(username)
            
            time.sleep(random.uniform(0.2, 0.8))
        
        return True
    
    def simulate_normal_user(self, username):
        """Usuario normal con todos los métodos"""
        print(f"👤 {username} - Usuario Normal")
        
        # WebAuthn
        self.simulate_webauthn_user(username)
        time.sleep(0.3)
        
        # Fingerprint
        self.simulate_fingerprint_user(username)
        time.sleep(0.3)
        
        # Face Recognition
        self.simulate_face_user(username)
        time.sleep(0.3)
        
        # QR Code
        self.simulate_qr_user(username)
        
        return True
    
    def simulate_fingerprint_user(self, username):
        """Simular usuario con huella dactilar"""
        print(f"👆 {username} - Huella Dactilar")
        
        return self.make_request("POST", "/fingerprint/recognize",
            {"username": username, "fingerprintData": f"fingerprint-{username}-{int(time.time())}"},
            f"Fingerprint Recognition - {username}")
    
    def simulate_face_user(self, username):
        """Simular usuario con reconocimiento facial"""
        print(f"📷 {username} - Reconocimiento Facial")
        
        return self.make_request("POST", "/face/recognize",
            {"username": username, "faceData": f"face-{username}-{int(time.time())}"},
            f"Face Recognition - {username}")
    
    def simulate_load_test(self, num_users=50, max_concurrent=10):
        """Simular prueba de carga"""
        print(f"\n🚀 Iniciando Prueba de Carga")
        print(f"👥 Usuarios: {num_users}")
        print(f"⚡ Concurrente: {max_concurrent}")
        print("=" * 50)
        
        user_types = ["normal", "webauthn_only", "qr_only", "mixed"]
        
        def simulate_single_user(user_id):
            username = f"loaduser{user_id}"
            user_type = random.choice(user_types)
            return self.simulate_user(username, user_type)
        
        # Usar ThreadPoolExecutor para simular usuarios concurrentes
        with ThreadPoolExecutor(max_workers=max_concurrent) as executor:
            futures = [executor.submit(simulate_single_user, i) for i in range(1, num_users + 1)]
            
            results = []
            for future in futures:
                try:
                    result = future.result(timeout=30)
                    results.append(result)
                except Exception as e:
                    print(f"❌ Error en usuario: {e}")
                    results.append(False)
        
        success_rate = sum(results) / len(results) * 100
        print(f"\n📊 Resultados de Prueba de Carga:")
        print(f"✅ Éxito: {success_rate:.1f}%")
        print(f"❌ Fallos: {100 - success_rate:.1f}%")
        
        return success_rate
    
    def check_system_health(self):
        """Verificar salud del sistema"""
        print("\n🏥 Verificando Salud del Sistema")
        print("=" * 40)
        
        # Health Check
        success, response = self.make_request("GET", "/health", None, "System Health")
        if success:
            print(f"📊 Redis: {'OK' if response.get('redis') else 'Error'}")
            print(f"📊 Uptime: {response.get('uptime', 'N/A')}")
        
        # Metrics Check
        self.make_request("GET", "/metrics", None, "Metrics Endpoint")
        
        # API Docs Check
        self.make_request("GET", "/api-docs", None, "API Documentation")
        
        return success
    
    def generate_metrics_report(self):
        """Generar reporte de métricas"""
        print("\n📊 Generando Reporte de Métricas")
        print("=" * 40)
        
        try:
            # Métricas del servicio biométrico
            response = self.session.get(f"{self.api_base}/metrics")
            if response.status_code == 200:
                metrics = response.text
                biometric_metrics = [line for line in metrics.split('\n') if 'biometric' in line]
                print(f"🔍 Métricas Biométricas encontradas: {len(biometric_metrics)}")
                for metric in biometric_metrics[:5]:  # Mostrar primeras 5
                    print(f"   {metric}")
            
            # Métricas de Prometheus
            prometheus_url = "http://localhost:9090/api/v1/query"
            query = "biometric_auth_attempts_total"
            response = self.session.get(prometheus_url, params={"query": query})
            if response.status_code == 200:
                data = response.json()
                if 'data' in data and 'result' in data['data']:
                    print(f"🔍 Prometheus - Métricas biométricas: {len(data['data']['result'])}")
                else:
                    print("🔍 Prometheus - No hay métricas biométricas aún")
            
        except Exception as e:
            print(f"❌ Error obteniendo métricas: {e}")

def main():
    """Función principal"""
    print("🎮 Simulador de Usuario Biométrico")
    print("=" * 40)
    
    simulator = BiometricUserSimulator()
    
    # Verificar que el servicio esté corriendo
    try:
        response = requests.get("http://localhost:3001/health", timeout=5)
        if response.status_code != 200:
            raise Exception("Servicio no disponible")
    except Exception as e:
        print(f"❌ Error: El servicio biométrico no está corriendo")
        print("💡 Ejecuta: docker-compose up -d")
        return
    
    # Verificar salud del sistema
    simulator.check_system_health()
    
    # Simular usuarios individuales
    print("\n👥 Simulando Usuarios Individuales")
    print("=" * 40)
    
    for i in range(1, 6):
        username = f"user{i}"
        user_type = random.choice(["normal", "webauthn_only", "qr_only", "mixed"])
        simulator.simulate_user(username, user_type)
        time.sleep(1)
    
    # Simular prueba de carga
    print("\n🚀 Iniciando Prueba de Carga")
    print("=" * 40)
    
    success_rate = simulator.simulate_load_test(num_users=20, max_concurrent=5)
    
    # Generar reporte de métricas
    simulator.generate_metrics_report()
    
    print(f"\n✅ Simulación completada")
    print("=" * 40)
    print("📊 Verifica los dashboards en:")
    print("   - Grafana: http://localhost:3000 (admin/admin123)")
    print("   - Prometheus: http://localhost:9090")
    print("   - Web UI: http://localhost:3001")

if __name__ == "__main__":
    main()

