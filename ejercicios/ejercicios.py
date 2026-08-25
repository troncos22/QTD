import numpy as np
import os

from qiskit.quantum_info import Operator
from qiskit import QuantumCircuit
from tabulate import tabulate

# Esta funcion su unico trabajo es facilitarme la visualización de la matriz 
# debido a que estamos trabajado en .py
def Revisando_compuerta(circuit: QuantumCircuit, title: str):
    """Muestra el diagrama del circuito y su matriz unitaria calculada."""
    print("=" * 60)
    print(f"COMPUERTA / CIRCUITO: {title}")
    print("=" * 60)
    print(circuit.draw(output="text"))
    print("\nMatriz Unitaria (Operator):")
    # Redondeamos para limpiar errores de precisión de punto flotante
    matrix = np.round(Operator(circuit).data, 3)
    print(matrix)
    print("\n")


def matriz_a_tabla(matriz, decimales: int = 3) -> str:
    tabla = []
    for fila in matriz:
        fila_str = []
        for val in fila:
            r, i = round(val.real, decimales), round(val.imag, decimales)
            if abs(r) == 0 and abs(i) == 0:
                txt = "0"
            elif abs(i) == 0:
                txt = f"{r:g}"
            elif abs(r) == 0:
                txt = f"{i:g}j"
            else:
                signo = "+" if i > 0 else "-"
                txt = f"{r:g}{signo}{abs(i):g}j"
            fila_str.append(txt)
        tabla.append(fila_str)

    # Formatos populares: 'rounded_outline', 'fancy_grid', 'simple'
    return tabulate(tabla, tablefmt="rounded_outline")

def representar(qc: QuantumCircuit,nombre_archivo: str = None ):

    print("Diagrama del circuito:")
    print(qc.draw(output = 'text'))

    print("\nMatriz Unitaria:")
    matrix = np.round(Operator(qc).data, 3)
    print(matriz_a_tabla(matrix))

    print("\n circuito del Qubit \n circuito guardado en 'imagenes'")
    ruta_completa = os.path.join("imagenes", nombre_archivo)
    qc.draw(output="mpl", filename=ruta_completa)


# primero ántes de ver compuertas, necesitamos vectores sobre los que actuar
# =============================================
# compuertas 1 Qubit
# =============================================
# Paso 1: inicializar circuito 
qc_pauli = QuantumCircuit(1)


"""
compuerta de idenatidad
"""
qc_pauli.id(0)
representar(qc_pauli,nombre_archivo='1_qbit_identidad')

qc_pauli.clear

"""
compuertas de pauli X-Y-Z
"""
Qc = QuantumCircuit(1)

Qc.x(0)
representar(Qc,nombre_archivo='1_qbit_G_x')
Qc.clear()

Qc.y(0)
representar(Qc,nombre_archivo='1_qbit_G_y')
Qc.clear()

Qc.z(0)
representar(Qc, nombre_archivo='1_qbit_G_z')


# ===============================================
# Compuertas de superposición y Fase
# ===============================================

qc_1q = QuantumCircuit(1)
theta, phi, lam = np.pi / 4, np.pi / 2, np.pi / 3


# Hadamard
qc_1q.h(0)       
representar(qc_1q, nombre_archivo='1qbit_hadamard')
qc_1q.clear()

# S Gate (Phase pi/2)
qc_1q.s(0)           
representar(qc_1q, nombre_archivo='1qbit_SG')
qc_1q.clear()


# S Dagger (-pi/2)
qc_1q.sdg(0)         
representar(qc_1q, nombre_archivo='1qbit_SdaggerG')
qc_1q.clear()



# T Gate (Phase pi/4)
qc_1q.t(0)            
representar(qc_1q, nombre_archivo='1qbit_TG')
qc_1q.clear()


# Phase(phi)
qc_1q.p(phi, 0)       
representar(qc_1q, nombre_archivo='1qbit_PhaseG')
qc_1q.clear()


# Rx(theta)
qc_1q.rx(theta, 0)    
representar(qc_1q, nombre_archivo='1qbit_RX_theta_G')
qc_1q.clear()


# Ry(theta)
qc_1q.ry(theta, 0)    
representar(qc_1q, nombre_archivo='1qbit_RY_theta_G')
qc_1q.clear()


# Rz(theta)
qc_1q.rz(theta, 0)    
representar(qc_1q, nombre_archivo='1qbit_RZ_theta_G')
qc_1q.clear()



# U3 Universal Gate
qc_1q.u(theta, phi, lam, 0)  
representar(qc_1q, nombre_archivo='1qbit_Universal_G')
qc_1q.clear()



# ===============================================
# Compuertas de 2 Qubits
# ===============================================

"""
compuerta Hadamard (H)
aplicamos la compuerta hadamard al sqbit 0 para dejarlo en superposición 
"""
qc = QuantumCircuit(2)
qc.h(0)
# dibujamos el circuito y 
# lo guardamos en una carpeta ya
# creada para no interferir con el resto de imagenes de los circuitos

qc.draw('mpl', filename='imagenes/circuito_1.png') 


"""
Compuerta CNOT/CX
"""
qc.cx(0,1)
# qué pasará cuando dibuje el circuito?
# será un nuevo circuito al cual apliqué la compuerta CNOT? 
# o será el mismo con la compuerta CNOT aplicada al Qbit 0?
qc.draw('mpl', filename='imagenes/dibujo_2.png') # dibujamos el circuito 2

"""
Controled Z CZ
"""
"""
Controled Y CY
"""

"""
Controled H CH
"""

"""
Control Rotation
"""
#CRY
#CRZ
#CRX
#CP(phi/angulo)

# ===============================================
# Compuertas Unitaria universal U(l,p,d)
# ===============================================





# ===============================================
# Intercambio y Compuertas Nativas de Hardware
# ===============================================
"""
SWAP
"""

"""
sqrt(SWAP)
"""

"""
iSWAP
"""



"""
Toffoli CCNOT/CCX

"""
"""
Fredkin CSWAP
"""
"""
CCZ
"""