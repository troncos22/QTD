# QTD: Quantum Technologies

## 📌 Motivación
Este repositorio contiene la implementación en Jupyter Notebook de diversos ejercicios desarrollados durante el diplomado de Tecnologías Cuánticas. 

El proyecto abarca desde la construcción de estados fundamentales en la computación cuántica hasta el diseño de circuitos, explorando la intersección entre la algoritmia cuántica y computación tradicional, al igual que problemas en diversas áreas

## 🛠️ Contenido del Repositorio
* **Compuertas y Estados Básicos:** Implementación de compuertas (H, X, S, Z, Toffoli) y creación de Estados de Bell.
* **Protocolos de Comunicación:** Implementación del protocolo de Alice y Bob (Teletransportación Cuántica) y criptografía BB84.
* **Guía de Estudio:** basada en la guía de la Universidad Adolfo Ibáñez.
* **Conección con Hardware cuántico real:** paso a paso de cómo conectarse al QC de ibm y como usar el simulador

## 💻 Requisitos y Entorno
El notebook está diseñado para ejecutarse localmente y también enviar trabajos (jobs) a los procesadores cuánticos de IBM.

### Instalación
Asegúrate de tener Python instalado y configura un entorno virtual. Luego, instala las dependencias mediante la terminal:

```bash
# Actualizar gestor de paquetes y crear entorno virtual
python3 -m venv .venv
source .venv/bin/activate

# Instalar Qiskit y dependencias de ejecución
pip install qiskit qiskit-ibm-runtime matplotlib jupyter

# En el mismo notebook están todas las dependencias que pueden llegar a necesitar 