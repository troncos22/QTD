## Módulo 3: Algoritmo de Grover, Hardware Real y Supercómputo Cuántico
*(Prof. Pablo Benítez Llambay)*

El Módulo 3 conecta la teoría algorítmica cuántica con los desafíos de la ingeniería física: transitar desde las simulaciones ideales en computadores clásicos hacia la ejecución en procesadores superconductores ruidosos de IBM Quantum y la aceleración de simulaciones de gran escala mediante GPUs.

---

### Bloque 1: Conexión con IBM Quantum, Primitivas y Gestión de Cuota

#### Del simulador al chip cuántico superconductor
*   **Entorno criogénico:** Los procesadores de IBM Quantum operan dentro de refrigeradores de dilución a temperaturas de **15 milikelvin** para mantener la superconductividad de los transmon qubits. Las instrucciones lógicas se envían vía web y controladores clásicos las traducen en pulsos electromagnéticos de microondas.
*   **Autenticación y servicio:** La conexión se establece con la librería `qiskit_ibm_runtime` a través de `QiskitRuntimeService`. Se recomienda utilizar `save_account()` para guardar el API token localmente en `~/.qiskit/qiskit-ibm.json` en lugar de incluir credenciales dentro de los notebooks.
*   **Primitiva `SamplerV2`:** Diseñada para algoritmos de búsqueda y muestreo probabilístico. Ejecuta el circuito un número fijo de disparos (*shots*) y retorna conteos de cadenas binarias colapsadas. Con la sintaxis moderna `qc.measure_all()`, Qiskit añade automáticamente los bits clásicos en el registro `'meas'`.
*   **Síntesis del estado GHZ (3 qubits):** Extensión del estado entrelazado de Bell hacia 3 qubits correlacionados:
    $$|\text{GHZ}\rangle = \frac{|000\rangle + |111\rangle}{\sqrt{2}}$$
    Se construye mediante una cascada de entrelazamiento: Hadamard en $q_0$ ($H_0$), seguida de $\text{CNOT}_{0 \to 1}$ y $\text{CNOT}_{1 \to 2}$. En un simulador ideal (`StatevectorSampler`), solo colapsa en `'000'` y `'111'`.

#### Física del tiempo cuántico y FinOps (Gestión de Cuota)
*   **Tiempo en cola vs. Tiempo neto de QPU:** IBM ofrece una cuota mensual gratuita de **10 minutos** de procesador. El tiempo en cola (espera en servidores clásicos) es gratuito. Solo se descuenta el tiempo físico en que los pulsos de microondas excitan los qubits en el criostato.
*   **Escalas temporales de las compuertas:**
    *   Compuertas de 1 qubit ($X, H$): $\mathcal{O}(10^{-9}\text{ s})$.
    *   Compuertas de 2 qubits (CZ, CNOT, ECR): $\mathcal{O}(10^{-8}\text{ s})$.
    *   Pulsos de medición/lectura: $\mathcal{O}(10^{-6}\text{ s})$.
    *   Tiempo de relajación térmica entre disparos: $\sim 100\ \mu\text{s}$.
    *   Una corrida de **1024 disparos** consume apenas entre **1 y 3 segundos netos de procesador**, lo que permite realizar entre $\mathcal{O}(10^2)$ experimentos al mes si se valida previamente en local.
*   **Presupuesto de disparos y error estadístico:** La desviación estándar del estimador de probabilidad $\hat{p}$ sigue la ley de los grandes números:
    $$\sigma_{\hat{p}} = \sqrt{\frac{p(1-p)}{N_{\text{disparos}}}} \sim \mathcal{O}\left(\frac{1}{\sqrt{N_{\text{disparos}}}}\right)$$
    Para el peor escenario ($p = 0.5$) y $N = 1024$, el error estadístico con un 95% de confianza ($\pm 2\sigma$) es de solo $\pm 3.1\%$.
*   **Despacho asíncrono temprano:** Selección del procesador menos ocupado con `service.least_busy()`, transpilación con `optimization_level=3` (para mapear a los qubits físicos con menores tasas de error del chip) y registro del `job_id` para continuar la sesión teórica sin bloquear el computador.

---

### Bloque 2: Búsqueda Cuántica y Algoritmo de Grover

#### El problema de la aguja en el pajar y la aceleración cuántica
*   **Búsqueda desestructurada:** Localizar un elemento objetivo $\omega$ en un espacio no ordenado de $N = 2^n$ estados mediante consultas a un oráculo booleano $f(x)$ que vale $1$ si $x = \omega$ y $0$ si $x \neq \omega$.
*   **Límite clásico vs. cuántico:**
    *   Clásicamente requiere evaluar en promedio $N/2$ candidatos, con complejidad lineal $\mathcal{O}(N)$.
    *   Grover logra una **aceleración cuadrática** resolviendo la búsqueda en $T_{\text{cuántico}} \sim \mathcal{O}(\sqrt{N})$ pasos ($T_{\text{clásico}} \sim T_{\text{cuántico}}^2$).
*   **El mito de la superposición:** Preparar una superposición uniforme $|s\rangle = \frac{1}{\sqrt{N}}\sum |x\rangle$ y medir entrega una probabilidad de acierto de apenas $1/N$, idéntica a adivinar al azar. La ventaja radica en la **interferencia cuántica destructiva** (cancelación de estados incorrectos) y **constructiva** (amplificación de la solución).

#### Intuición geométrica en un plano 2D
Toda la dinámica de Grover ocurre en un subespacio bidimensional ortogonal generado por:
1.  El vector solución $|\omega\rangle$ (eje vertical).
2.  El vector de estados incorrectos $|s'\rangle = \frac{1}{\sqrt{N-1}}\sum_{x \neq \omega}|x\rangle$ (eje horizontal).
*   Se demuestra algebraicamente que $\langle \omega | s'\rangle = 0$.
*   El estado inicial se expresa trigonométricamente como:
    $$|s\rangle = \cos(\theta)|s'\rangle + \sin(\theta)|\omega\rangle, \quad \text{con } \sin(\theta) = \frac{1}{\sqrt{N}} \implies \theta \approx \frac{1}{\sqrt{N}}$$
    Para $N$ grande, $|s\rangle$ inicia casi pegado al eje horizontal.

#### Operadores del algoritmo
1.  **Oráculo de Fase ($U_\omega$):** Invierte el signo del estado objetivo ($U_\omega = I - 2|\omega\rangle\langle\omega|$). Geométricamente representa una **reflexión respecto al eje horizontal $|s'\rangle$**.
    *   *Implementación circuital:* Compuerta multi-controlada $X$ (`mcx`) con compuertas Hadamard en el qubit objetivo ($HXH = Z$), y compuertas $X$ envolventes en los qubits cuyo bit sea `'0'` en la convención *Little-Endian*.
2.  **Operador de Difusión ($D$):** Realiza una inversión respecto a la media de todas las amplitudes:
    $$D = 2|s\rangle\langle s| - I = H^{\otimes n} \left(2|0\rangle^{\otimes n}\langle 0|^{\otimes n} - I\right) H^{\otimes n}$$
    Geométricamente es una **reflexión respecto al vector $|s\rangle$**.
3.  **Rotación combinada e iteraciones óptimas:** La combinación de ambas reflexiones produce una rotación neta hacia $|\omega\rangle$ de ángulo $2\theta$ en cada iteración. Para alcanzar el estado solución se requieren:
    $$k \approx \text{round}\left(\frac{\pi}{4}\sqrt{N}\right)\text{ pasos}$$
    Para 3 qubits ($N = 8$), $k = 2$ iteraciones concentran la probabilidad teórica en $|110\rangle$ en un **$\approx 95\%$**. Iterar más veces provocaría *sobre-rotación*, reduciendo la probabilidad.

---

### Bloque 3: Topología de Hardware, Ruido Físico y Simulación GPU

#### Restricciones físicas y transpilación
*   **Conectividad del chip:** Los procesadores superconductores no poseen conectividad *all-to-all*; disponen de topologías fijas (mallas pesadas o líneas). Para interactuar qubits no adyacentes, el compilador debe insertar compuertas **SWAP** (equivalentes a 3 CNOTs cada una).
*   **Niveles de optimización:**
    *   `optimization_level=0`: Mapeo directo y expansión de compuertas sin simplificación.
    *   `optimization_level=3`: Reordena conmutaciones, cancela compuertas redundantes y ubica los qubits virtuales en el subgrafo físico de menor ruido y mayor coherencia ($T_1, T_2$).

#### Modelado de ruido físico
*   Las compuertas de 2 qubits son las principales fuentes de error (tasas de error de despolarización de $1\%$ a $3\%$, frente a $<0.1\%$ en compuertas de 1 qubit).
*   Al inyectar un modelo de ruido de despolarización de $2.0\%$ en las compuertas CX, la fidelidad de Grover decae significativamente (la probabilidad de éxito en simulación cae del $\sim 95\%$ teórico a valores en torno al $60\%-70\%$), elevando el piso de ruido de los estados espurios.

#### El muro de memoria clásica y aceleración GPU
*   **Crecimiento exponencial:** Almacenar el vector de estado cuántico en una computadora clásica requiere $2^n \times 16\text{ bytes}$.
    *   10 qubits $\to 16\text{ KB}$
    *   20 qubits $\to 16\text{ MB}$
    *   30 qubits $\to 16\text{ GB}$
    *   40 qubits $\to 16\text{ TB}$
*   A partir de 24-26 qubits, un procesador clásico monohilo agota la memoria RAM y sufre severos cuellos de botella por ancho de banda de memoria.
*   **Aceleración con cuQuantum / NVIDIA A100:** Utilizando `AerSimulator(method="statevector", device="GPU")`, el paralelismo masivo de hilos de la GPU y el ancho de banda de la memoria HBM aceleran la aplicación de operadores unitarios, logrando factores de aceleración (*speedup*) medibles de hasta varios órdenes de magnitud frente a un núcleo de CPU.

---

### Bloque 4: Mitigación de Errores y Hardware Real

#### Análisis de resultados en QPUs físicas
*   Al recuperar el trabajo de Grover ejecutado en un procesador real (ej. *IBM Heron* / *ibm_torino* con 4096 disparos), la distribución se encuentra degradada por decoherencia y errores de lectura (SPAM):
    *   Probabilidad ideal: $\sim 95.5\%$
    *   Probabilidad cruda en chip real: $\sim 48.4\%$
    *   Piso de ruido medio en estados espurios: $\sim 7.4\%$
    *   **Contraste señal/ruido (SNR):** A pesar del ruido, la señal domina por un factor de **$\approx 6.6\times$** sobre el fondo aleatorio, confirmando que la interferencia constructiva de Grover sobrevive en hardware NISQ.

#### Mitigación matricial de lectura (*Readout Mitigation*)
*   **Modelado de la matriz de asignación ($A$):** Sean $\epsilon_0$ y $\epsilon_1$ las tasas de error de falso positivo y falso negativo al leer un qubit:
    $$A_{1q} = \begin{pmatrix} 1 - \epsilon_0 & \epsilon_1 \\ \epsilon_0 & 1 - \epsilon_1 \end{pmatrix}$$
*   **Extensión a $n$ qubits:** Asumiendo errores de medición independientes, la matriz de confusión del registro completo se obtiene por productos de Kronecker:
    $$A_{3q} = A_{1q} \otimes A_{1q} \otimes A_{1q}$$
*   **Inversión lineal:** Se corrige el vector de probabilidades observado aplicando la inversa matricial:
    $$P_{\text{mitigado}} = A_{3q}^{-1} P_{\text{real}}$$
    Tras normalizar y recortar componentes negativas espurias, la probabilidad del estado solución $|110\rangle$ pasa de $48.4\%$ a **$54.3\%$** ($+5.9$ puntos porcentuales de visibilidad), demostrando cómo el post-procesamiento clásico de datos permite rescatar fidelidad sin alterar el procesador cuántico.
