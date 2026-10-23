/**
 * Simulador Interactivo de Compuertas Lógicas y Tablas de Verdad
 * Diseñado con estética premium, animaciones suaves y soporte para compuertas de 1 y 2 bits.
 */

function initGateTruthTable(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Estilos CSS incrustados para no contaminar el CSS global
    const styles = `
        .gate-widget {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
            font-family: system-ui, -apple-system, sans-serif;
            color: #1e293b;
            max-width: 800px;
            margin: 20px auto;
        }
        .gate-header {
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 12px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
        }
        .gate-title {
            margin: 0;
            font-size: 1.25rem;
            font-weight: 700;
            color: #0f172a;
        }
        .gate-badge {
            background: #e0f2fe;
            color: #0369a1;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .gate-controls {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        .gate-select-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex: 1;
            min-width: 200px;
        }
        .gate-select-label {
            font-size: 0.85rem;
            font-weight: 600;
            color: #64748b;
        }
        .gate-select {
            padding: 10px 14px;
            border-radius: 10px;
            border: 1px solid #cbd5e1;
            background-color: #f8fafc;
            color: #0f172a;
            font-size: 0.95rem;
            font-weight: 500;
            outline: none;
            transition: all 0.2s ease;
            cursor: pointer;
        }
        .gate-select:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }
        .gate-layout {
            display: flex;
            flex-wrap: wrap;
            gap: 24px;
            margin-top: 20px;
        }
        .gate-section {
            flex: 1;
            min-width: 300px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 18px;
        }
        .gate-section-title {
            margin-top: 0;
            margin-bottom: 14px;
            font-size: 0.95rem;
            font-weight: 700;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.025em;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .table-truth {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
            text-align: center;
        }
        .table-truth th {
            background-color: #f1f5f9;
            color: #475569;
            font-weight: 600;
            padding: 8px;
            border-bottom: 2px solid #e2e8f0;
        }
        .table-truth td {
            padding: 8px;
            border-bottom: 1px solid #e2e8f0;
            transition: all 0.2s ease;
        }
        .table-truth tr.active-row td {
            background-color: #dbeafe;
            color: #1e40af;
            font-weight: 700;
        }
        .visual-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            min-height: 160px;
        }
        .circuit-row {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            width: 100%;
        }
        .input-block {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .bit-toggle {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            border: 2px solid #cbd5e1;
            background: #ffffff;
            color: #64748b;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            user-select: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .bit-toggle:hover {
            border-color: #3b82f6;
            color: #3b82f6;
            transform: scale(1.08);
        }
        .bit-toggle.on {
            background: #2563eb;
            color: #ffffff;
            border-color: #2563eb;
            box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
        }
        .wire-arrow {
            height: 4px;
            background: #cbd5e1;
            position: relative;
            flex-grow: 1;
            min-width: 40px;
            max-width: 80px;
            transition: background-color 0.3s ease;
        }
        .wire-arrow.active {
            background: #3b82f6;
        }
        .wire-arrow.active-on {
            background: #22c55e;
        }
        .gate-box-visual {
            width: 80px;
            height: 80px;
            background: #3b82f6;
            color: #ffffff;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 1.2rem;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
            transition: all 0.3s ease;
            position: relative;
        }
        .gate-box-visual.active {
            animation: pulse-glow 0.4s ease;
        }
        .output-block {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .bit-output {
            width: 44px;
            height: 44px;
            border-radius: 8px;
            background: #f1f5f9;
            border: 2px solid #cbd5e1;
            color: #475569;
            font-weight: 800;
            font-size: 1.15rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .bit-output.on {
            background: #22c55e;
            color: #ffffff;
            border-color: #22c55e;
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
        }
        .gate-description {
            margin-top: 14px;
            font-size: 0.85rem;
            line-height: 1.4;
            color: #64748b;
            font-style: italic;
        }
        @keyframes pulse-glow {
            0% { transform: scale(1); }
            50% { transform: scale(1.08); box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); }
            100% { transform: scale(1); }
        }
    `;

    // Inyectar estilos en el DOM
    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);

    // Definición de las compuertas
    const gates = {
        // 1-Bit Gates
        id: {
            name: "Identidad (Buffer)",
            inputs: 1,
            description: "No altera el estado de entrada. Mantiene el valor original.",
            fn: (a) => a,
            table: [
                { inputs: [0], output: 0 },
                { inputs: [1], output: 1 }
            ]
        },
        not: {
            name: "NOT (Inversor)",
            inputs: 1,
            description: "Invierte el bit de entrada. Transforma 0 en 1, y viceversa.",
            fn: (a) => a === 0 ? 1 : 0,
            table: [
                { inputs: [0], output: 1 },
                { inputs: [1], output: 0 }
            ]
        },
        const0: {
            name: "Constante 0 (Reset)",
            inputs: 1,
            description: "Siempre produce un output de 0, independientemente de la entrada.",
            fn: (a) => 0,
            table: [
                { inputs: [0], output: 0 },
                { inputs: [1], output: 0 }
            ]
        },
        const1: {
            name: "Constante 1 (Set)",
            inputs: 1,
            description: "Siempre produce un output de 1, independientemente de la entrada.",
            fn: (a) => 1,
            table: [
                { inputs: [0], output: 1 },
                { inputs: [1], output: 1 }
            ]
        },
        // 2-Bit Gates
        and: {
            name: "AND (Y)",
            inputs: 2,
            description: "Produce 1 únicamente si ambas entradas son 1.",
            fn: (a, b) => a & b,
            table: [
                { inputs: [0, 0], output: 0 },
                { inputs: [0, 1], output: 0 },
                { inputs: [1, 0], output: 0 },
                { inputs: [1, 1], output: 1 }
            ]
        },
        or: {
            name: "OR (O)",
            inputs: 2,
            description: "Produce 1 si al menos una de las entradas es 1.",
            fn: (a, b) => a | b,
            table: [
                { inputs: [0, 0], output: 0 },
                { inputs: [0, 1], output: 1 },
                { inputs: [1, 0], output: 1 },
                { inputs: [1, 1], output: 1 }
            ]
        },
        xor: {
            name: "XOR (O Exclusiva)",
            inputs: 2,
            description: "Produce 1 si las entradas son diferentes entre sí.",
            fn: (a, b) => a ^ b,
            table: [
                { inputs: [0, 0], output: 0 },
                { inputs: [0, 1], output: 1 },
                { inputs: [1, 0], output: 1 },
                { inputs: [1, 1], output: 0 }
            ]
        },
        nand: {
            name: "NAND (No Y)",
            inputs: 2,
            description: "Produce 0 únicamente si ambas entradas son 1 (inversa de AND).",
            fn: (a, b) => (a & b) === 1 ? 0 : 1,
            table: [
                { inputs: [0, 0], output: 1 },
                { inputs: [0, 1], output: 1 },
                { inputs: [1, 0], output: 1 },
                { inputs: [1, 1], output: 0 }
            ]
        },
        nor: {
            name: "NOR (No O)",
            inputs: 2,
            description: "Produce 1 únicamente si ambas entradas son 0 (inversa de OR).",
            fn: (a, b) => (a | b) === 0 ? 1 : 0,
            table: [
                { inputs: [0, 0], output: 1 },
                { inputs: [0, 1], output: 0 },
                { inputs: [1, 0], output: 0 },
                { inputs: [1, 1], output: 0 }
            ]
        },
        // 3-Bit Gates
        and3: {
            name: "AND de 3 entradas (Y3)",
            inputs: 3,
            description: "Produce 1 únicamente si las tres entradas son 1.",
            fn: (a, b, c) => a & b & c,
            table: [
                { inputs: [0, 0, 0], output: 0 },
                { inputs: [0, 0, 1], output: 0 },
                { inputs: [0, 1, 0], output: 0 },
                { inputs: [0, 1, 1], output: 0 },
                { inputs: [1, 0, 0], output: 0 },
                { inputs: [1, 0, 1], output: 0 },
                { inputs: [1, 1, 0], output: 0 },
                { inputs: [1, 1, 1], output: 1 }
            ]
        },
        majority: {
            name: "Mayoría (Majority)",
            inputs: 3,
            description: "Produce 1 si la mayoría de las entradas (al menos dos de ellas) son 1.",
            fn: (a, b, c) => (a + b + c) >= 2 ? 1 : 0,
            table: [
                { inputs: [0, 0, 0], output: 0 },
                { inputs: [0, 0, 1], output: 0 },
                { inputs: [0, 1, 0], output: 0 },
                { inputs: [0, 1, 1], output: 1 },
                { inputs: [1, 0, 0], output: 0 },
                { inputs: [1, 0, 1], output: 1 },
                { inputs: [1, 1, 0], output: 1 },
                { inputs: [1, 1, 1], output: 1 }
            ]
        }
    };

    // Estado del widget
    let currentGateKey = 'not';
    let inputStates = [0, 0, 0]; // [A, B, C]

    // Renderizar esqueleto básico
    container.innerHTML = `
        <div class="gate-widget">
            <div class="gate-header">
                <span class="gate-badge" id="${containerId}_gate_badge">1 Bit</span>
            </div>
            
            <div class="gate-controls">
                <div class="gate-select-group">
                    <label class="gate-select-label" for="${containerId}_select">Selecciona la compuerta:</label>
                    <select id="${containerId}_select" class="gate-select">
                        <optgroup label="Compuertas de 1 Bit (Clásicas)">
                            <option value="not" selected>NOT (Inversor)</option>
                            <option value="id">Identidad (Buffer)</option>
                            <option value="const0">Constante 0 (Reset)</option>
                            <option value="const1">Constante 1 (Set)</option>
                        </optgroup>
                        <optgroup label="Compuertas de 2 Bits">
                            <option value="and">AND (Y)</option>
                            <option value="or">OR (O)</option>
                            <option value="xor">XOR (O Exclusiva)</option>
                            <option value="nand">NAND (No Y)</option>
                            <option value="nor">NOR (No O)</option>
                        </optgroup>
                        <optgroup label="Compuertas de 3 Bits">
                            <option value="and3">AND3 (Y de 3 entradas)</option>
                            <option value="majority">Mayoría (Majority)</option>
                        </optgroup>
                    </select>
                </div>
            </div>

            <div class="gate-layout">
                <!-- Sección Izquierda: Tabla de Verdad -->
                <div class="gate-section">
                    <h6 class="gate-section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3zM3 9h18M9 3v18"/></svg>
                        Tabla de Verdad
                    </h6>
                    <div id="${containerId}_table_container"></div>
                    <div class="gate-description" id="${containerId}_description"></div>
                </div>

                <!-- Sección Derecha: Probador Lógico -->
                <div class="gate-section">
                    <h6 class="gate-section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                        Prueba interactiva
                    </h6>
                    <div class="visual-container">
                        <div class="circuit-row">
                            <!-- Bloque de Entradas -->
                            <div class="input-block" id="${containerId}_input_block"></div>
                            
                            <!-- Cables de entrada -->
                            <div style="display: flex; flex-direction: column; gap: 14px; justify-content: center; height: 100px;">
                                <div class="wire-arrow" id="${containerId}_wire_a"></div>
                                <div class="wire-arrow" id="${containerId}_wire_b"></div>
                                <div class="wire-arrow" id="${containerId}_wire_c"></div>
                            </div>
                            
                            <!-- Caja de la compuerta -->
                            <div class="gate-box-visual" id="${containerId}_gate_visual">NOT</div>
                            
                            <!-- Cable de salida -->
                            <div class="wire-arrow" id="${containerId}_wire_out"></div>
                            
                            <!-- Bloque de Salida -->
                            <div class="output-block">
                                <div class="bit-output" id="${containerId}_output_visual">1</div>
                            </div>
                        </div>
                        <div style="margin-top: 14px; font-size: 0.8rem; color: #64748b; font-weight: 500;">
                            Haz clic en los botones de entrada (0/1) para testear.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const selectEl = document.getElementById(`${containerId}_select`);
    const badgeEl = document.getElementById(`${containerId}_gate_badge`);
    const descEl = document.getElementById(`${containerId}_description`);
    const tableContainer = document.getElementById(`${containerId}_table_container`);
    const inputBlock = document.getElementById(`${containerId}_input_block`);
    const gateVisual = document.getElementById(`${containerId}_gate_visual`);
    const outputVisual = document.getElementById(`${containerId}_output_visual`);

    const wireA = document.getElementById(`${containerId}_wire_a`);
    const wireB = document.getElementById(`${containerId}_wire_b`);
    const wireC = document.getElementById(`${containerId}_wire_c`);
    const wireOut = document.getElementById(`${containerId}_wire_out`);

    // Actualiza la UI
    function updateWidget() {
        const gate = gates[currentGateKey];
        const numInputs = gate.inputs;

        // Actualizar Badge y Descripción
        if (numInputs === 1) {
            badgeEl.textContent = "1 Bit";
            badgeEl.style.background = "#e0f2fe";
            badgeEl.style.color = "#0369a1";
        } else if (numInputs === 2) {
            badgeEl.textContent = "2 Bits";
            badgeEl.style.background = "#f3e8ff";
            badgeEl.style.color = "#6b21a8";
        } else {
            badgeEl.textContent = "3 Bits";
            badgeEl.style.background = "#fef3c7";
            badgeEl.style.color = "#d97706";
        }
        descEl.textContent = gate.description;

        // Actualizar visual de la compuerta
        gateVisual.textContent = currentGateKey.toUpperCase();
        gateVisual.className = "gate-box-visual";
        setTimeout(() => gateVisual.classList.add("active"), 10);

        // Ajustar color de la caja de compuerta según el tipo
        if (numInputs === 1) {
            gateVisual.style.background = "#3b82f6"; // Azul
            gateVisual.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.25)";
        } else if (numInputs === 2) {
            gateVisual.style.background = "#8b5cf6"; // Violeta
            gateVisual.style.boxShadow = "0 4px 12px rgba(139, 92, 246, 0.25)";
        } else {
            gateVisual.style.background = "#f59e0b"; // Naranja / Ámbar
            gateVisual.style.boxShadow = "0 4px 12px rgba(245, 158, 11, 0.25)";
        }

        // Renderizar entradas interactivas
        inputBlock.innerHTML = '';
        for (let i = 0; i < numInputs; i++) {
            const btn = document.createElement('button');
            btn.className = `bit-toggle ${inputStates[i] === 1 ? 'on' : ''}`;
            btn.textContent = inputStates[i];
            
            let label = 'x';
            if (numInputs === 2) label = i === 0 ? 'A' : 'B';
            else if (numInputs === 3) label = i === 0 ? 'A' : (i === 1 ? 'B' : 'C');
            
            btn.title = `Alternar Entrada ${label}`;
            btn.addEventListener('click', () => {
                inputStates[i] = inputStates[i] === 0 ? 1 : 0;
                updateWidget();
            });
            inputBlock.appendChild(btn);
        }

        // Gestionar cables visualmente
        wireA.className = "wire-arrow " + (inputStates[0] === 1 ? 'active active-on' : 'active');
        
        if (numInputs >= 2) {
            wireB.style.display = 'block';
            wireB.className = "wire-arrow " + (inputStates[1] === 1 ? 'active active-on' : 'active');
        } else {
            wireB.style.display = 'none';
        }
        
        if (numInputs >= 3) {
            wireC.style.display = 'block';
            wireC.className = "wire-arrow " + (inputStates[2] === 1 ? 'active active-on' : 'active');
        } else {
            wireC.style.display = 'none';
        }

        // Calcular output
        let output = 0;
        if (numInputs === 1) output = gate.fn(inputStates[0]);
        else if (numInputs === 2) output = gate.fn(inputStates[0], inputStates[1]);
        else if (numInputs === 3) output = gate.fn(inputStates[0], inputStates[1], inputStates[2]);

        // Actualizar visualización del output
        outputVisual.textContent = output;
        if (output === 1) {
            outputVisual.classList.add('on');
            wireOut.className = "wire-arrow active active-on";
        } else {
            outputVisual.classList.remove('on');
            wireOut.className = "wire-arrow active";
        }

        // Renderizar tabla de verdad
        let tableHtml = `
            <table class="table-truth">
                <thead>
                    <tr>
                        ${numInputs === 1 ? '<th>Input x</th>' : ''}
                        ${numInputs === 2 ? '<th>Input A</th><th>Input B</th>' : ''}
                        ${numInputs === 3 ? '<th>Input A</th><th>Input B</th><th>Input C</th>' : ''}
                        <th>Output y</th>
                    </tr>
                </thead>
                <tbody>
        `;

        gate.table.forEach((row, idx) => {
            // Verificar si esta fila corresponde al input actual del probador
            let isActive = false;
            if (numInputs === 1) {
                isActive = (row.inputs[0] === inputStates[0]);
            } else if (numInputs === 2) {
                isActive = (row.inputs[0] === inputStates[0] && row.inputs[1] === inputStates[1]);
            } else if (numInputs === 3) {
                isActive = (row.inputs[0] === inputStates[0] && row.inputs[1] === inputStates[1] && row.inputs[2] === inputStates[2]);
            }
                
            tableHtml += `
                <tr class="${isActive ? 'active-row' : ''}">
                    ${row.inputs.map(val => `<td>${val}</td>`).join('')}
                    <td><strong>${row.output}</strong></td>
                </tr>
            `;
        });

        tableHtml += `
                </tbody>
            </table>
        `;
        tableContainer.innerHTML = tableHtml;
    }

    // Evento de cambio de compuerta
    selectEl.addEventListener('change', (e) => {
        currentGateKey = e.target.value;
        // Resetear entradas por comodidad
        inputStates = [0, 0, 0];
        updateWidget();
    });

    // Inicializar
    updateWidget();
}
