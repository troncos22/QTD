/**
 * Explorador Interactivo de Endianness: Qiskit (Little-Endian) vs. Álgebra Lineal (Big-Endian)
 * Permite alternar bits de qubits y observar en tiempo real la cadena de Qiskit, el índice vectorial y la notación de Dirac.
 */

function initEndiannessInteractive(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let qubits = [0, 0, 0]; // [q0, q1, q2]

    container.innerHTML = `
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); font-family: system-ui, -apple-system, sans-serif;">
        <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <h5 style="margin: 0; color: #1e293b; font-weight: 700; font-size: 16px;">
                Explorador de Ordenamiento: Little-Endian (Qiskit) vs. Álgebra Lineal
            </h5>
            <span style="font-size: 12px; background: #dbeafe; color: #1d4ed8; padding: 3px 10px; border-radius: 20px; font-weight: 600;">
                q₀ = Bit Menos Significativo (LSB)
            </span>
        </div>

        <p style="font-size: 13.5px; color: #475569; margin-top: 0; margin-bottom: 16px; line-height: 1.5;">
            Haz clic en los qubits para alternar su estado entre <strong>|0⟩</strong> y <strong>|1⟩</strong>. Observa cómo cambia la cadena de bits en los diccionarios de Qiskit y el índice correspondiente en el vector de estado.
        </p>

        <!-- Selector de Qubits -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; margin-bottom: 18px;">
            <div style="font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 10px;">
                Configura los Qubits (Circuito):
            </div>
            <div style="display: flex; gap: 14px; flex-wrap: wrap; align-items: center;">
                <div style="display: flex; align-items: center; gap: 8px; background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 14px; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.04);">
                    <span style="font-family: monospace; font-weight: 700; color: #2563eb;">q₀ (LSB):</span>
                    <button id="${containerId}_btn_q0" class="btn btn-sm btn-primary" style="font-family: monospace; font-weight: 700; min-width: 44px;" onclick="${containerId}_toggle(0)">|0⟩</button>
                    <span style="font-size: 11px; color: #64748b;">(peso 2⁰ = 1)</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 14px; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.04);">
                    <span style="font-family: monospace; font-weight: 700; color: #7c3aed;">q₁:</span>
                    <button id="${containerId}_btn_q1" class="btn btn-sm btn-primary" style="font-family: monospace; font-weight: 700; min-width: 44px;" onclick="${containerId}_toggle(1)">|0⟩</button>
                    <span style="font-size: 11px; color: #64748b;">(peso 2¹ = 2)</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 14px; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.04);">
                    <span style="font-family: monospace; font-weight: 700; color: #db2777;">q₂ (MSB):</span>
                    <button id="${containerId}_btn_q2" class="btn btn-sm btn-primary" style="font-family: monospace; font-weight: 700; min-width: 44px;" onclick="${containerId}_toggle(2)">|0⟩</button>
                    <span style="font-size: 11px; color: #64748b;">(peso 2² = 4)</span>
                </div>
            </div>

            <div style="margin-top: 10px; display: flex; gap: 6px; flex-wrap: wrap;">
                <span style="font-size: 12px; color: #64748b; align-self: center; margin-right: 4px;">Casos típicos:</span>
                <button class="btn btn-xs btn-outline-secondary" style="font-size: 11px; padding: 3px 8px;" onclick="${containerId}_set([1, 0, 0])">q₀=1 (Qiskit '001')</button>
                <button class="btn btn-xs btn-outline-secondary" style="font-size: 11px; padding: 3px 8px;" onclick="${containerId}_set([0, 1, 0])">q₁=1 (Qiskit '010')</button>
                <button class="btn btn-xs btn-outline-secondary" style="font-size: 11px; padding: 3px 8px;" onclick="${containerId}_set([0, 0, 1])">q₂=1 (Qiskit '100')</button>
                <button class="btn btn-xs btn-outline-secondary" style="font-size: 11px; padding: 3px 8px;" onclick="${containerId}_set([1, 1, 0])">q₀=1, q₁=1 (Qiskit '011')</button>
            </div>
        </div>

        <!-- Comparativa Visual de Resultados -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
            <!-- Caja Qiskit -->
            <div style="background: #0f172a; color: #f8fafc; border-radius: 10px; padding: 16px; font-family: monospace; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="color: #38bdf8; font-weight: 700; font-size: 13px; margin-bottom: 8px; border-bottom: 1px solid #334155; padding-bottom: 4px;">
                    1. Salida en Qiskit (Counts Dict)
                </div>
                <div style="font-size: 12px; color: #94a3b8; margin-bottom: 6px;">
                    Cadena leída de izquierda (MSB) a derecha (LSB):
                </div>
                <div style="background: #1e293b; padding: 10px; border-radius: 6px; font-size: 16px; text-align: center; letter-spacing: 2px;">
                    counts = {'<span id="${containerId}_str_q2" style="color: #f472b6; font-weight: 700;">0</span><span id="${containerId}_str_q1" style="color: #a78bfa; font-weight: 700;">0</span><span id="${containerId}_str_q0" style="color: #60a5fa; font-weight: 700;">0</span>': 1024}
                </div>
                <div style="display: flex; justify-content: space-around; font-size: 10.5px; color: #cbd5e1; margin-top: 6px;">
                    <span style="color: #f472b6;">índice [0] = q₂</span>
                    <span style="color: #a78bfa;">índice [1] = q₁</span>
                    <span style="color: #60a5fa;">índice [2] = q₀</span>
                </div>
            </div>

            <!-- Caja Álgebra Lineal e Índice -->
            <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px;">
                <div style="color: #1e293b; font-weight: 700; font-size: 13px; margin-bottom: 8px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">
                    2. Vector de Estado y Base Computacional
                </div>
                <div style="font-size: 12.5px; color: #334155; margin-bottom: 6px;">
                    Estado tensorial: <strong>|q₂⟩ ⊗ |q₁⟩ ⊗ |q₀⟩</strong> = <strong id="${containerId}_ket_label" style="color: #2563eb;">|000⟩</strong>
                </div>
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; font-size: 12.5px; font-family: monospace;">
                    Índice decimal en Statevector:<br>
                    <span id="${containerId}_math_calc" style="color: #475569;">
                        índice = 0·2² + 0·2¹ + 0·2⁰ = <strong>0</strong>
                    </span>
                </div>
                <div style="margin-top: 8px; font-size: 12px; color: #047857; background: #ecfdf5; padding: 6px 10px; border-radius: 6px; border: 1px solid #a7f3d0;">
                    Posición del valor 1.0 en el vector (tamaño 8): <strong id="${containerId}_vec_pos">[0]</strong>
                </div>
            </div>
        </div>

        <!-- Representación del Vector Completo -->
        <div style="margin-top: 14px; background: #fafafa; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 10px 14px; font-size: 12px; color: #475569;">
            <div style="font-weight: 600; margin-bottom: 4px; color: #1e293b;">
                Estructura del Statevector completo (dimensión 2³ = 8):
            </div>
            <div id="${containerId}_vec_display" style="font-family: monospace; font-size: 11.5px; overflow-x: auto; white-space: nowrap; color: #334155;">
                [1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]ᵀ
            </div>
        </div>
    </div>
    `;

    function update() {
        const q0 = qubits[0];
        const q1 = qubits[1];
        const q2 = qubits[2];

        // Botones
        const btn0 = document.getElementById(`${containerId}_btn_q0`);
        const btn1 = document.getElementById(`${containerId}_btn_q1`);
        const btn2 = document.getElementById(`${containerId}_btn_q2`);
        if (btn0) btn0.textContent = `|${q0}⟩`;
        if (btn1) btn1.textContent = `|${q1}⟩`;
        if (btn2) btn2.textContent = `|${q2}⟩`;

        // Qiskit string: q2 q1 q0
        const str0 = document.getElementById(`${containerId}_str_q0`);
        const str1 = document.getElementById(`${containerId}_str_q1`);
        const str2 = document.getElementById(`${containerId}_str_q2`);
        if (str0) str0.textContent = q0;
        if (str1) str1.textContent = q1;
        if (str2) str2.textContent = q2;

        // Decimal index: q2*4 + q1*2 + q0*1
        const decIndex = q2 * 4 + q1 * 2 + q0 * 1;

        const ketLabel = document.getElementById(`${containerId}_ket_label`);
        if (ketLabel) ketLabel.textContent = `|${q2}${q1}${q0}⟩`;

        const mathCalc = document.getElementById(`${containerId}_math_calc`);
        if (mathCalc) {
            mathCalc.innerHTML = `índice = (${q2} × 2²) + (${q1} × 2¹) + (${q0} × 2⁰) = <strong style="color: #2563eb; font-size: 14px;">${decIndex}</strong>`;
        }

        const vecPos = document.getElementById(`${containerId}_vec_pos`);
        if (vecPos) vecPos.textContent = `vector[${decIndex}] = 1.0 + 0.0j`;

        const vecDisplay = document.getElementById(`${containerId}_vec_display`);
        if (vecDisplay) {
            let vecArr = Array(8).fill("0.0");
            vecArr[decIndex] = "<strong style='color: #2563eb; background: #dbeafe; padding: 1px 4px; border-radius: 3px;'>1.0</strong>";
            vecDisplay.innerHTML = `[${vecArr.join(", ")}]ᵀ &nbsp;⟶ Posición <strong>${decIndex}</strong> (|${q2}${q1}${q0}⟩)`;
        }
    }

    window[`${containerId}_toggle`] = function(idx) {
        qubits[idx] = qubits[idx] === 0 ? 1 : 0;
        update();
    };

    window[`${containerId}_set`] = function(arr) {
        qubits = [...arr];
        update();
    };

    update();
}
