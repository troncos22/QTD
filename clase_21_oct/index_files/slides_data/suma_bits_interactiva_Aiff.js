/**
 * Simulador Interactivo de Sumadores Aritméticos con Diagrama de Circuitos SVG
 * Enfocado en la conexión fundamental entre el Medio Sumador (2 bits) y el Sumador Completo (3 bits).
 */

function initBitAdderSimulator(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const styles = `
        .adder-widget {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
            font-family: system-ui, -apple-system, sans-serif;
            color: #1e293b;
            max-width: 900px;
            margin: 20px auto;
        }
        .adder-header {
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 12px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .adder-badge {
            background: #f0fdf4;
            color: #166534;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        .adder-controls {
            margin-bottom: 20px;
        }
        .adder-select {
            padding: 10px 14px;
            border-radius: 10px;
            border: 1px solid #cbd5e1;
            background-color: #f8fafc;
            color: #0f172a;
            font-size: 0.95rem;
            font-weight: 500;
            outline: none;
            cursor: pointer;
        }
        .adder-layout {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }
        .adder-row-top {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
        }
        .adder-section {
            flex: 1;
            min-width: 280px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 18px;
        }
        .adder-section.circuit-section {
            flex: 2.2;
            min-width: 320px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .adder-section-title {
            margin-top: 0;
            margin-bottom: 14px;
            font-size: 0.95rem;
            font-weight: 700;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.025em;
            width: 100%;
        }
        .inputs-row {
            display: flex;
            gap: 12px;
            justify-content: center;
            margin-bottom: 20px;
        }
        .adder-bit-btn {
            width: 46px;
            height: 46px;
            border-radius: 50%;
            border: 2px solid #cbd5e1;
            background: #ffffff;
            color: #64748b;
            font-weight: 700;
            font-size: 1.15rem;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .adder-bit-btn:hover {
            border-color: #3b82f6;
            color: #3b82f6;
            transform: scale(1.08);
        }
        .adder-bit-btn.on {
            background: #2563eb;
            color: #ffffff;
            border-color: #2563eb;
            box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
        }
        .adder-btn-label {
            font-size: 0.65rem;
            margin-top: -2px;
            opacity: 0.8;
        }
        .result-box {
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            padding: 16px;
            text-align: center;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
            margin-top: 15px;
        }
        .math-expr {
            font-size: 1.25rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 8px;
        }
        .binary-out {
            font-size: 2rem;
            font-weight: 800;
            color: #059669;
            font-family: monospace;
        }
        .circuit-canvas {
            width: 100%;
            max-width: 580px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 10px;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }
        .wire {
            stroke: #cbd5e1;
            stroke-width: 3;
            fill: none;
            transition: stroke 0.25s ease;
        }
        .wire.active {
            stroke: #22c55e; /* Señal 1 activa */
        }
        .gate-shape {
            fill: #f8fafc;
            stroke: #475569;
            stroke-width: 2.5;
            transition: fill 0.25s ease, stroke 0.25s ease;
        }
        .gate-shape.active {
            fill: #eff6ff;
            stroke: #2563eb;
        }
        .gate-text {
            font-size: 11px;
            font-weight: 700;
            fill: #475569;
            text-anchor: middle;
            font-family: system-ui, sans-serif;
            pointer-events: none;
        }
        .gate-text.active {
            fill: #1d4ed8;
        }
        .pin-label {
            font-size: 12px;
            font-weight: 700;
            fill: #64748b;
            font-family: monospace;
        }
        .val-bubble {
            font-size: 10px;
            font-weight: 800;
            fill: #ffffff;
        }
    `;

    // Inyectar estilos
    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);

    // Estado local
    let currentMode = '2'; // '2' o '3' bits
    let bits = [0, 0, 0]; // A, B, C

    container.innerHTML = `
        <div class="adder-widget">
            <div class="adder-header">
                <span class="adder-badge" id="${containerId}_mode_badge">Medio Sumador (2 bits)</span>
            </div>

            <div class="adder-controls">
                <label style="font-size: 0.85rem; font-weight: 600; color: #64748b; margin-right: 8px;">Tipo de circuito sumador:</label>
                <select id="${containerId}_mode_select" class="adder-select">
                    <option value="2" selected>Suma de 2 bits (Medio Sumador / Half Adder)</option>
                    <option value="3">Suma de 3 bits (Sumador Completo / Full Adder)</option>
                </select>
            </div>

            <div class="adder-layout">
                <div class="adder-row-top">
                    <!-- Inputs e interactividad -->
                    <div class="adder-section">
                        <h6 class="adder-section-title">Valores de Entrada</h6>
                        <div class="inputs-row" id="${containerId}_inputs_container"></div>
                        
                        <div class="result-box">
                            <div class="math-expr" id="${containerId}_math_text">0 + 0 = 0</div>
                            <div style="font-size: 0.8rem; color: #64748b; font-weight: 600; margin-top: 4px;">Resultado Binario</div>
                            <div class="binary-out" id="${containerId}_bin_text">00<sub>2</sub></div>
                        </div>

                        <div style="margin-top: 14px; font-size: 0.8rem; color: #64748b; line-height: 1.4; text-align: center;">
                            Haz clic sobre los botones de entrada para alternar entre 0 y 1. Los cables verdes transportan señal activa (<strong style="color: #22c55e;">1</strong>).
                        </div>
                    </div>

                    <!-- Sección del circuito SVG -->
                    <div class="adder-section circuit-section">
                        <h6 class="adder-section-title">Circuito de compuertas lógicas</h6>
                        <div class="circuit-canvas" id="${containerId}_circuit_container"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const modeSelect = document.getElementById(`${containerId}_mode_select`);
    const modeBadge = document.getElementById(`${containerId}_mode_badge`);
    const inputsContainer = document.getElementById(`${containerId}_inputs_container`);
    const mathText = document.getElementById(`${containerId}_math_text`);
    const binText = document.getElementById(`${containerId}_bin_text`);
    const circuitContainer = document.getElementById(`${containerId}_circuit_container`);

    // Dibuja una burbuja de valor (0 o 1) sobre el circuito
    function valBubble(x, y, val) {
        const color = val === 1 ? '#22c55e' : '#64748b';
        return `
            <circle cx="${x}" cy="${y}" r="8" fill="${color}" stroke="#ffffff" stroke-width="1.5"></circle>
            <text x="${x}" y="${y + 3}" text-anchor="middle" class="val-bubble">${val}</text>
        `;
    }

    function drawHalfAdderSVG(valA, valB) {
        const sum = valA ^ valB;
        const carry = valA & valB;

        const wA = valA === 1 ? 'wire active' : 'wire';
        const wB = valB === 1 ? 'wire active' : 'wire';
        const wSum = sum === 1 ? 'wire active' : 'wire';
        const wCarry = carry === 1 ? 'wire active' : 'wire';

        return `
        <svg viewBox="0 0 400 220" width="100%" height="100%">
            <!-- Marco identificador Medio Sumador -->
            <rect x="75" y="20" width="140" height="180" rx="10" fill="#f8fafc" stroke="#3b82f6" stroke-dasharray="5" stroke-width="1.5"></rect>
            <text x="145" y="16" font-size="10" fill="#2563eb" text-anchor="middle" font-weight="700">Medio Sumador</text>

            <!-- Entrada A -->
            <text x="25" y="55" class="pin-label">A</text>
            <path d="M 40 50 L 140 50" class="${wA}"></path>
            <path d="M 80 50 L 80 150 L 140 150" class="${wA}"></path>
            
            <!-- Entrada B -->
            <text x="25" y="95" class="pin-label">B</text>
            <path d="M 40 90 L 100 90 L 100 70 L 140 70" class="${wB}"></path>
            <path d="M 100 90 L 100 170 L 140 170" class="${wB}"></path>

            <!-- Compuerta XOR (Suma) -->
            <path d="M 140 40 L 150 40 Q 180 40 190 60 Q 180 80 150 80 L 140 80 Q 155 60 140 40 Z" class="gate-shape ${sum === 1 ? 'active' : ''}"></path>
            <text x="165" y="64" class="gate-text ${sum === 1 ? 'active' : ''}">XOR</text>
            
            <!-- Compuerta AND (Acarreo) -->
            <path d="M 140 140 L 170 140 A 20 20 0 0 1 170 180 L 140 180 Z" class="gate-shape ${carry === 1 ? 'active' : ''}"></path>
            <text x="157" y="164" class="gate-text ${carry === 1 ? 'active' : ''}">AND</text>

            <!-- Salida XOR (Suma) -->
            <path d="M 190 60 L 320 60" class="${wSum}"></path>
            <text x="330" y="65" class="pin-label" style="fill: #2563eb;">Suma (S)</text>

            <!-- Salida AND (Acarreo) -->
            <path d="M 190 160 L 320 160" class="${wCarry}"></path>
            <text x="330" y="165" class="pin-label" style="fill: #ef4444;">Acarreo (C)</text>

            <!-- Burbujas de valores en tiempo real -->
            ${valBubble(55, 50, valA)}
            ${valBubble(55, 90, valB)}
            ${valBubble(255, 60, sum)}
            ${valBubble(255, 160, carry)}
        </svg>
        `;
    }

    function drawFullAdderSVG(valA, valB, valCin) {
        // Medio Sumador 1 (A y B)
        const sum1 = valA ^ valB;
        const carry1 = valA & valB;

        // Medio Sumador 2 (sum1 y Cin)
        const sumFinal = sum1 ^ valCin;
        const carry2 = sum1 & valCin;

        // Compuerta OR para acarreos
        const carryFinal = carry1 | carry2;

        const wA = valA === 1 ? 'wire active' : 'wire';
        const wB = valB === 1 ? 'wire active' : 'wire';
        const wCin = valCin === 1 ? 'wire active' : 'wire';
        const wSum1 = sum1 === 1 ? 'wire active' : 'wire';
        const wCarry1 = carry1 === 1 ? 'wire active' : 'wire';
        const wSumFinal = sumFinal === 1 ? 'wire active' : 'wire';
        const wCarry2 = carry2 === 1 ? 'wire active' : 'wire';
        const wCarryFinal = carryFinal === 1 ? 'wire active' : 'wire';

        return `
        <svg viewBox="0 0 540 280" width="100%" height="100%">
            <!-- Entradas del circuito -->
            <text x="15" y="45" class="pin-label">A</text>
            <path d="M 30 40 L 90 40" class="${wA}"></path>
            <path d="M 60 40 L 60 100 L 90 100" class="${wA}"></path>

            <text x="15" y="75" class="pin-label">B</text>
            <path d="M 30 70 L 70 70 L 70 50 L 90 50" class="${wB}"></path>
            <path d="M 70 70 L 70 110 L 90 110" class="${wB}"></path>

            <!-- Bloque 1: Medio Sumador 1 (A, B) -->
            <rect x="85" y="24" width="85" height="106" rx="8" fill="#f0f9ff" stroke="#0284c7" stroke-dasharray="4" stroke-width="1.5"></rect>
            <text x="127" y="18" font-size="9" fill="#0369a1" text-anchor="middle" font-weight="700">Medio Sumador 1</text>

            <!-- XOR 1 -->
            <path d="M 95 35 L 105 35 Q 130 35 140 50 Q 130 65 105 65 L 95 65 Q 107 50 95 35 Z" class="gate-shape ${sum1 === 1 ? 'active' : ''}"></path>
            <text x="117" y="53" class="gate-text ${sum1 === 1 ? 'active' : ''}">XOR</text>

            <!-- AND 1 -->
            <path d="M 95 95 L 120 95 A 15 15 0 0 1 120 125 L 95 125 Z" class="gate-shape ${carry1 === 1 ? 'active' : ''}"></path>
            <text x="110" y="113" class="gate-text ${carry1 === 1 ? 'active' : ''}">AND</text>

            <!-- Conexión de sum1 hacia Medio Sumador 2 -->
            <path d="M 140 50 L 250 50" class="${wSum1}"></path>
            <text x="195" y="44" font-size="9" fill="#0284c7" font-weight="700">S₁</text>

            <!-- Entrada C -->
            <text x="15" y="165" class="pin-label">C</text>
            <path d="M 30 160 L 210 160 L 210 70 L 250 70" class="${wCin}"></path>

            <!-- Wires para segundo Medio Sumador -->
            <path d="M 230 50 L 230 140 L 250 140" class="${wSum1}"></path>
            <path d="M 210 160 L 250 160" class="${wCin}"></path>

            <!-- Bloque 2: Medio Sumador 2 (S1, C) -->
            <rect x="245" y="34" width="85" height="142" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-dasharray="4" stroke-width="1.5"></rect>
            <text x="287" y="28" font-size="9" fill="#15803d" text-anchor="middle" font-weight="700">Medio Sumador 2</text>

            <!-- XOR 2 -->
            <path d="M 255 45 L 265 45 Q 290 45 300 60 Q 290 75 265 75 L 255 75 Q 267 60 255 45 Z" class="gate-shape ${sumFinal === 1 ? 'active' : ''}"></path>
            <text x="277" y="63" class="gate-text ${sumFinal === 1 ? 'active' : ''}">XOR</text>

            <!-- AND 2 -->
            <path d="M 255 135 L 280 135 A 15 15 0 0 1 280 165 L 255 165 Z" class="gate-shape ${carry2 === 1 ? 'active' : ''}"></path>
            <text x="270" y="153" class="gate-text ${carry2 === 1 ? 'active' : ''}">AND</text>

            <!-- Salida Suma Final (S) -->
            <path d="M 300 60 L 450 60" class="${wSumFinal}"></path>
            <text x="460" y="65" class="pin-label" style="fill: #2563eb;">Suma (S)</text>

            <!-- Enrutamiento de Acarreos hacia la compuerta OR -->
            <path d="M 135 110 L 370 110 L 370 195 L 390 195" class="${wCarry1}"></path>
            <text x="355" y="104" font-size="9" fill="#ef4444" font-weight="700">C₁</text>

            <path d="M 295 150 L 350 150 L 350 215 L 390 215" class="${wCarry2}"></path>
            <text x="335" y="144" font-size="9" fill="#ef4444" font-weight="700">C₂</text>

            <!-- Compuerta OR -->
            <path d="M 390 185 Q 410 185 425 205 Q 410 225 390 225 Q 402 205 390 185 Z" class="gate-shape ${carryFinal === 1 ? 'active' : ''}"></path>
            <text x="407" y="208" class="gate-text ${carryFinal === 1 ? 'active' : ''}">OR</text>

            <!-- Salida Acarreo Final (C) -->
            <path d="M 425 205 L 450 205" class="${wCarryFinal}"></path>
            <text x="460" y="210" class="pin-label" style="fill: #ef4444;">Acarreo (C)</text>

            <!-- Valores en tiempo real -->
            ${valBubble(45, 40, valA)}
            ${valBubble(45, 70, valB)}
            ${valBubble(195, 50, sum1)}
            ${valBubble(135, 160, valCin)}
            ${valBubble(385, 60, sumFinal)}
            ${valBubble(440, 205, carryFinal)}
        </svg>
        `;
    }

    function update() {
        const numBits = parseInt(currentMode);
        modeBadge.textContent = numBits === 2
            ? "Medio Sumador (2 bits)"
            : "Sumador Completo (3 bits)";

        // Renderizar inputs interactivos
        inputsContainer.innerHTML = '';
        const labels = ['A', 'B', 'C'];
        for (let i = 0; i < numBits; i++) {
            const btn = document.createElement('button');
            btn.className = `adder-bit-btn ${bits[i] === 1 ? 'on' : ''}`;
            btn.innerHTML = `${bits[i]} <span class="adder-btn-label">${labels[i]}</span>`;
            btn.addEventListener('click', () => {
                bits[i] = bits[i] === 0 ? 1 : 0;
                update();
            });
            inputsContainer.appendChild(btn);
        }

        // Realizar cálculos
        const valA = bits[0];
        const valB = bits[1];
        const valCin = bits[2] || 0;

        if (numBits === 2) {
            const totalSum = valA + valB;
            const sumXOR = valA ^ valB;
            const carryAND = valA & valB;

            mathText.innerHTML = `${valA} + ${valB} = ${totalSum}`;
            binText.innerHTML = `${carryAND}${sumXOR}<sub>2</sub>`;

            circuitContainer.innerHTML = drawHalfAdderSVG(valA, valB);

        } else {
            const totalSum = valA + valB + valCin;
            const sum1 = valA ^ valB;
            const carry1 = valA & valB;
            const sumFinal = sum1 ^ valCin;
            const carry2 = sum1 & valCin;
            const carryFinal = carry1 | carry2;

            mathText.innerHTML = `${valA} + ${valB} + ${valCin} = ${totalSum}`;
            binText.innerHTML = `${carryFinal}${sumFinal}<sub>2</sub>`;

            circuitContainer.innerHTML = drawFullAdderSVG(valA, valB, valCin);
        }
    }

    modeSelect.addEventListener('change', (e) => {
        currentMode = e.target.value;
        bits = [0, 0, 0];
        update();
    });

    update();
}
