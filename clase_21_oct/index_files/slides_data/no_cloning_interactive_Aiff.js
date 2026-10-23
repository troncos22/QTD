/**
 * Simulador Interactivo del Teorema de No Clonación
 * Compara el intento de copia cuántica con CNOT vs. el estado clonado ideal
 */

function initNoCloningSimulator(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); font-family: system-ui, -apple-system, sans-serif;">
        <div style="border-bottom: 2px solid #6366f1; padding-bottom: 10px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <h5 style="margin: 0; color: #1e293b; font-weight: 700; font-size: 16px;">
                Demostración Interactiva: ¿Por qué falla la copia cuántica?
            </h5>
            <span style="font-size: 12px; background: #e0e7ff; color: #4338ca; padding: 3px 10px; border-radius: 20px; font-weight: 600;">
                Teorema de No Clonación
            </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; align-items: start;">
            <!-- Controles y Circuito -->
            <div>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 14px;">
                    <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px;">
                        <span>Estado a clonar |&psi;&rangle; = cos(&theta;/2)|0⟩ + sin(&theta;/2)|1⟩:</span>
                        <span id="${containerId}_theta_val" style="color: #4f46e5; font-weight: 700;">&theta; = 1.57 rad (|+⟩)</span>
                    </div>
                    <input type="range" id="${containerId}_theta_slider" min="0" max="3.14159" step="0.05" value="1.5708" style="width: 100%; cursor: pointer;">
                    
                    <div style="display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap;">
                        <button class="btn btn-sm btn-outline-secondary" style="font-size: 11px; padding: 2px 8px;" onclick="${containerId}_setPreset(0)">|0⟩ (Base)</button>
                        <button class="btn btn-sm btn-outline-secondary" style="font-size: 11px; padding: 2px 8px;" onclick="${containerId}_setPreset(3.14159)">|1⟩ (Base)</button>
                        <button class="btn btn-sm btn-outline-primary" style="font-size: 11px; padding: 2px 8px;" onclick="${containerId}_setPreset(1.5708)">|+⟩ (Superposición)</button>
                        <button class="btn btn-sm btn-outline-primary" style="font-size: 11px; padding: 2px 8px;" onclick="${containerId}_setPreset(1.0472)">60°</button>
                    </div>
                </div>

                <!-- Circuito -->
                <div style="background: #0f172a; color: #f8fafc; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 13px; box-shadow: inset 0 2px 6px rgba(0,0,0,0.4);">
                    <div style="color: #94a3b8; font-size: 11px; margin-bottom: 8px;">// Circuito de copia clásica (CNOT sobre qubit auxiliar |0⟩)</div>
                    <div style="margin: 6px 0;">q₀: |&psi;⟩ ───────●─────── <span id="${containerId}_cnot_q0" style="color: #38bdf8;">|&psi;⟩ ?</span></div>
                    <div style="margin: 6px 0;">                    │</div>
                    <div style="margin: 6px 0;">q₁: |0⟩ ─────────⊕─────── <span id="${containerId}_cnot_q1" style="color: #f472b6;">Copia ?</span></div>
                </div>
            </div>

            <!-- Comparativa: Deseado vs Obtenido -->
            <div>
                <!-- Estado Obtenido Real -->
                <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong style="color: #991b1b; font-size: 13px;">Estado Real Obtenido (CNOT):</strong>
                        <span id="${containerId}_real_type" style="font-size: 11px; font-weight: 700; background: #fee2e2; color: #b91c1c; padding: 2px 6px; border-radius: 4px;">Entrelazado</span>
                    </div>
                    <div id="${containerId}_real_eq" style="font-family: monospace; font-size: 13px; color: #7f1d1d; margin-top: 4px; font-weight: 600;">
                        |&Psi;<sub>real</sub>⟩ = 0.707|00⟩ + 0.707|11⟩
                    </div>
                    <div style="font-size: 11.5px; color: #991b1b; margin-top: 4px;">
                        <strong>Falta de términos cruzados:</strong> No existen componentes |01⟩ ni |10⟩. Los qubits están correlacionados, no clonados.
                    </div>
                </div>

                <!-- Estado Deseado de Clonación -->
                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong style="color: #166534; font-size: 13px;">Clonación Ideal Deseada |&psi;⟩ ⊗ |&psi;⟩:</strong>
                        <span style="font-size: 11px; font-weight: 700; background: #dcfce7; color: #15803d; padding: 2px 6px; border-radius: 4px;">Separable</span>
                    </div>
                    <div id="${containerId}_ideal_eq" style="font-family: monospace; font-size: 13px; color: #14532d; margin-top: 4px; font-weight: 600;">
                        |&Psi;<sub>ideal</sub>⟩ = 0.50|00⟩ + 0.50|01⟩ + 0.50|10⟩ + 0.50|11⟩
                    </div>
                    <div style="font-size: 11.5px; color: #166534; margin-top: 4px;">
                        Dos copias independientes requieren que la probabilidad conjunta esté distribuida en las 4 ramas.
                    </div>
                </div>

                <!-- Dictamen / Fidelidad -->
                <div id="${containerId}_verdict_box" style="padding: 10px 14px; border-radius: 8px; font-size: 12.5px; font-weight: 600; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                    <span id="${containerId}_verdict_text">Dictamen</span>
                    <span id="${containerId}_fidelity" style="font-family: monospace; font-size: 13px;">Fidelidad: 50.0%</span>
                </div>
            </div>
        </div>

        <!-- Gráfico comparativo de probabilidades -->
        <div style="margin-top: 18px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px;">
            <div style="font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 10px;">
                Comparación de Probabilidades de Medición: Real (CNOT) vs. Clon Ideal
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center;">
                <div style="background: white; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px;">
                    <div style="font-weight: 700; font-size: 12px; color: #475569;">|00⟩</div>
                    <div style="font-size: 11px; margin-top: 4px;">Real: <strong id="${containerId}_p_real_00" style="color: #ef4444;">50%</strong></div>
                    <div style="font-size: 11px;">Ideal: <strong id="${containerId}_p_ideal_00" style="color: #10b981;">25%</strong></div>
                </div>
                <div style="background: white; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px;">
                    <div style="font-weight: 700; font-size: 12px; color: #475569;">|01⟩</div>
                    <div style="font-size: 11px; margin-top: 4px;">Real: <strong id="${containerId}_p_real_01" style="color: #ef4444;">0%</strong></div>
                    <div style="font-size: 11px;">Ideal: <strong id="${containerId}_p_ideal_01" style="color: #10b981;">25%</strong></div>
                </div>
                <div style="background: white; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px;">
                    <div style="font-weight: 700; font-size: 12px; color: #475569;">|10⟩</div>
                    <div style="font-size: 11px; margin-top: 4px;">Real: <strong id="${containerId}_p_real_10" style="color: #ef4444;">0%</strong></div>
                    <div style="font-size: 11px;">Ideal: <strong id="${containerId}_p_ideal_10" style="color: #10b981;">25%</strong></div>
                </div>
                <div style="background: white; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px;">
                    <div style="font-weight: 700; font-size: 12px; color: #475569;">|11⟩</div>
                    <div style="font-size: 11px; margin-top: 4px;">Real: <strong id="${containerId}_p_real_11" style="color: #ef4444;">50%</strong></div>
                    <div style="font-size: 11px;">Ideal: <strong id="${containerId}_p_ideal_11" style="color: #10b981;">25%</strong></div>
                </div>
            </div>
        </div>
    </div>
    `;

    const slider = document.getElementById(`${containerId}_theta_slider`);

    function update() {
        const theta = parseFloat(slider.value);
        const alpha = Math.cos(theta / 2);
        const beta = Math.sin(theta / 2);

        // Update label
        let label = `θ = ${theta.toFixed(2)} rad`;
        if (Math.abs(theta) < 0.05) label += " (|0⟩)";
        else if (Math.abs(theta - Math.PI) < 0.05) label += " (|1⟩)";
        else if (Math.abs(theta - Math.PI/2) < 0.05) label += " (|+⟩)";
        document.getElementById(`${containerId}_theta_val`).innerText = label;

        // Real state: alpha|00> + beta|11>
        const p_real_00 = alpha * alpha;
        const p_real_01 = 0;
        const p_real_10 = 0;
        const p_real_11 = beta * beta;

        // Ideal state: (alpha|0> + beta|1>)(alpha|0> + beta|1>) = alpha^2|00> + alpha*beta|01> + alpha*beta|10> + beta^2|11>
        const p_ideal_00 = Math.pow(alpha * alpha, 2);
        const p_ideal_01 = Math.pow(alpha * beta, 2);
        const p_ideal_10 = Math.pow(alpha * beta, 2);
        const p_ideal_11 = Math.pow(beta * beta, 2);

        // Fidelity: |<Psi_real | Psi_ideal>|^2
        // <Psi_real|Psi_ideal> = alpha * (alpha^2) + beta * (beta^2) = alpha^3 + beta^3
        const overlap = Math.pow(alpha, 3) + Math.pow(beta, 3);
        const fidelity = Math.pow(overlap, 2);

        // Render Equations
        const fmt = (v) => v.toFixed(3);
        document.getElementById(`${containerId}_real_eq`).innerHTML = 
            `|&Psi;<sub>real</sub>⟩ = ${fmt(alpha)}|00⟩ + ${fmt(beta)}|11⟩`;
        document.getElementById(`${containerId}_ideal_eq`).innerHTML = 
            `|&Psi;<sub>ideal</sub>⟩ = ${fmt(alpha*alpha)}|00⟩ + ${fmt(alpha*beta)}|01⟩ + ${fmt(alpha*beta)}|10⟩ + ${fmt(beta*beta)}|11⟩`;

        // Render Probabilities
        document.getElementById(`${containerId}_p_real_00`).innerText = `${(p_real_00 * 100).toFixed(1)}%`;
        document.getElementById(`${containerId}_p_real_01`).innerText = `0.0%`;
        document.getElementById(`${containerId}_p_real_10`).innerText = `0.0%`;
        document.getElementById(`${containerId}_p_real_11`).innerText = `${(p_real_11 * 100).toFixed(1)}%`;

        document.getElementById(`${containerId}_p_ideal_00`).innerText = `${(p_ideal_00 * 100).toFixed(1)}%`;
        document.getElementById(`${containerId}_p_ideal_01`).innerText = `${(p_ideal_01 * 100).toFixed(1)}%`;
        document.getElementById(`${containerId}_p_ideal_10`).innerText = `${(p_ideal_10 * 100).toFixed(1)}%`;
        document.getElementById(`${containerId}_p_ideal_11`).innerText = `${(p_ideal_11 * 100).toFixed(1)}%`;

        // Check if basis state or superposition
        const isBasisState = (Math.abs(alpha) > 0.999 || Math.abs(beta) > 0.999);
        const vBox = document.getElementById(`${containerId}_verdict_box`);
        const vText = document.getElementById(`${containerId}_verdict_text`);
        const vFid = document.getElementById(`${containerId}_fidelity`);
        const realType = document.getElementById(`${containerId}_real_type`);

        vFid.innerText = `Fidelidad: ${(fidelity * 100).toFixed(1)}%`;

        if (isBasisState) {
            vBox.style.background = "#ecfdf5";
            vBox.style.color = "#065f46";
            vBox.style.border = "1px solid #a7f3d0";
            vText.innerHTML = "<strong>Clonación exitosa:</strong> En la base computacional (|0⟩ o |1⟩), la CNOT actúa como copia clásica válida.";
            realType.innerText = "Separable";
            realType.style.background = "#dcfce7";
            realType.style.color = "#15803d";
        } else {
            vBox.style.background = "#fff1f2";
            vBox.style.color = "#9f1239";
            vBox.style.border = "1px solid #fecdd3";
            vText.innerHTML = "<strong>Fallo de clonación (Teorema de No-Clonación):</strong> En superposición, se genera un estado entrelazado indivisible.";
            realType.innerText = "Entrelazado";
            realType.style.background = "#fee2e2";
            realType.style.color = "#b91c1c";
        }
    }

    slider.addEventListener("input", update);

    window[`${containerId}_setPreset`] = function(val) {
        slider.value = val;
        update();
    };

    update();
}
