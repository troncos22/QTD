from qiskit import QuantumCircuit
import numpy as np

# primero ántes de ver compuertas, necesitamos vectores sobre los que actuar

# Paso 1: inicializar circuito 

qc = QuantumCircuit(2) # circuito de 2 qbits


"""
compuerta Hadamard
aplicamos la compuerta hadamard al sqbit 0 para dejarlo en superposición 
"""

qc.h(0)
# dibujamos el circuito y 
# lo guardamos en una carpeta ya
# creada para no interferir con el resto de imagenes de los circuitos

qc.draw('mpl', filename='imagenes/circuito_1.png') 
"""
Compuerta CNOT
"""
qc.cx(0,1)
# qué pasará cuando dibuje el circuito?
# será un nuevo circuito al cual apliqué la compuerta CNOT? 
# o será el mismo con la compuerta CNOT aplicada al Qbit 0?
qc.draw('mpl', filename='imagenes/dibujo_2.png') # dibujamos el circuito 2
