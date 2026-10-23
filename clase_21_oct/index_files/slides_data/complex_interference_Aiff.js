/**
 * Simulador Interactivo Riguroso de Interferencia Cuántica y Conservación de Norma
 * Modelo: |ψ(ϕ)⟩ = 1/√2 |0⟩ + (e^(iϕ)/√2) |1⟩
 * Soporte completo Retina / HiDPI
 */

function initInterferenceVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); font-family: system-ui, -apple-system, sans-serif;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; flex-wrap: wrap; gap: 8px;">
            <h5 style="margin: 0; color: #0f172a; font-weight: 700; font-size: 16px;">
                Fase Relativa y Conservación de Norma en el Qubit
            </h5>
            <span style="background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 9999px; font-size: 12.5px; font-weight: 700;">
                |ψ⟩ = (1/√2)|0⟩ + (e<sup>iϕ</sup>/√2)|1⟩
            </span>
        </div>
        
        <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-top: 16px; justify-content: center;">
            <!-- Canvas Izquierdo: Amplitudes en el Plano Complejo -->
            <div style="flex: 1; min-width: 320px; max-width: 420px; text-align: center;">
                <div style="font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px;">
                    1. Amplitudes en Base Computacional ({|0⟩, |1⟩})
                </div>
                <div style="display: flex; justify-content: center;">
                    <canvas id="${containerId}_canvas_phasor" style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.04);"></canvas>
                </div>
                <div style="font-size: 12px; color: #475569; margin-top: 6px;">
                    α = 1/√2 (fijo en |0⟩) &nbsp;|&nbsp; β = e<sup>iϕ</sup>/√2 (rota con ϕ)
                </div>
            </div>

            <!-- Canvas Derecho: Interferencia Cuántica Proyectiva (Base Hadamard {|+⟩, |-⟩}) -->
            <div style="flex: 1.2; min-width: 340px; max-width: 480px; text-align: center;">
                <div style="font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px;">
                    2. Interferencia Cuántica tras Hadamard (Base {|+⟩, |-⟩})
                </div>
                <div style="display: flex; justify-content: center;">
                    <canvas id="${containerId}_canvas_proj" style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.04);"></canvas>
                </div>
                <div style="font-size: 11.5px; color: #64748b; margin-top: 6px;">
                    P(|+⟩) = cos²(ϕ/2) &nbsp;|&nbsp; P(|-⟩) = sin²(ϕ/2)
                </div>
            </div>
        </div>

        <!-- Controles de Fase -->
        <div style="margin-top: 18px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px;">
            <div style="display: flex; flex-wrap: wrap; gap: 20px; align-items: center;">
                <div style="flex: 1.4; min-width: 280px;">
                    <div style="display: flex; justify-content: space-between; font-size: 13.5px; font-weight: 700; color: #1e293b;">
                        <span>Fase Relativa (ϕ):</span>
                        <span id="${containerId}_phi_val" style="color: #2563eb;">0.00 rad (0°)</span>
                    </div>
                    <input type="range" id="${containerId}_phi_slider" min="0" max="6.28318" step="0.02" value="0" style="width: 100%; margin-top: 8px; cursor: pointer;">
                    
                    <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px;">
                        <button class="btn btn-sm btn-outline-primary" style="font-size: 11px; padding: 4px 8px;" onclick="${containerId}_setPhase(0)">
                            ϕ = 0 (|+)
                        </button>
                        <button class="btn btn-sm btn-outline-danger" style="font-size: 11px; padding: 4px 8px;" onclick="${containerId}_setPhase(Math.PI)">
                            ϕ = π (|-)
                        </button>
                        <button class="btn btn-sm btn-outline-success" style="font-size: 11px; padding: 4px 8px;" onclick="${containerId}_setPhase(Math.PI/2)">
                            ϕ = π/2 (|i)
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" style="font-size: 11px; padding: 4px 8px;" onclick="${containerId}_setPhase(3*Math.PI/2)">
                            ϕ = 3π/2 (|-i)
                        </button>
                    </div>
                </div>

                <!-- Panel de Métricas de Conservación de Norma e Interferencia -->
                <div style="flex: 1; min-width: 260px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px 16px; font-size: 12.5px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span><strong>Norma total ||ψ||²:</strong></span>
                        <span style="color: #059669; font-weight: 800; font-size: 13.5px;">|α|² + |β|² = 1.00 (100%)</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span>P(Medir |0⟩) / P(|1⟩):</span>
                        <span style="color: #475569; font-weight: 700;">50% / 50%</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; border-top: 1px solid #f1f5f9; padding-top: 4px; margin-bottom: 6px;">
                        <span>P(Medir |+⟩ en base X):</span>
                        <span id="${containerId}_prob_plus" style="color: #2563eb; font-weight: 800;">100.0%</span>
                    </div>
                    <div>
                        <span id="${containerId}_badge" class="badge" style="font-size: 11.5px; padding: 6px 8px; border-radius: 6px; display: block; text-align: center; white-space: normal; line-height: 1.35; word-break: break-word;">
                            Estado |+⟩ (ϕ = 0): Interferencia Constructiva
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    const canvasPhasor = document.getElementById(`${containerId}_canvas_phasor`);
    const canvasProj = document.getElementById(`${containerId}_canvas_proj`);
    const slider = document.getElementById(`${containerId}_phi_slider`);

    // Configuración HiDPI / Retina
    const dpr = window.devicePixelRatio || 2;

    const wP = 340, hP = 220;
    canvasPhasor.width = wP * dpr;
    canvasPhasor.height = hP * dpr;
    canvasPhasor.style.width = wP + 'px';
    canvasPhasor.style.height = hP + 'px';
    const ctxP = canvasPhasor.getContext('2d');
    ctxP.scale(dpr, dpr);

    const wJ = 400, hJ = 220;
    canvasProj.width = wJ * dpr;
    canvasProj.height = hJ * dpr;
    canvasProj.style.width = wJ + 'px';
    canvasProj.style.height = hJ + 'px';
    const ctxJ = canvasProj.getContext('2d');
    ctxJ.scale(dpr, dpr);

    function draw() {
        const phi = parseFloat(slider.value);
        const deg = Math.round(phi * 180 / Math.PI);

        document.getElementById(`${containerId}_phi_val`).innerText = `${phi.toFixed(2)} rad (${deg}°)`;

        // =========================================================================
        // 1. DIBUJAR FASORES EN EL PLANO COMPLEJO (CONSERVACIÓN DE NORMA)
        // =========================================================================
        ctxP.clearRect(0, 0, wP, hP);
        const cx = wP / 2;
        const cy = hP / 2 + 5;
        const rScale = 75; // Escala visual para módulo 1/√2

        // Círculo guía de radio 1/√2
        ctxP.beginPath();
        ctxP.arc(cx, cy, rScale, 0, 2 * Math.PI);
        ctxP.strokeStyle = '#e2e8f0';
        ctxP.lineWidth = 1.5;
        ctxP.setLineDash([3, 3]);
        ctxP.stroke();
        ctxP.setLineDash([]);

        // Ejes Re e Im
        ctxP.strokeStyle = '#cbd5e1';
        ctxP.lineWidth = 1.2;
        ctxP.beginPath();
        ctxP.moveTo(25, cy); ctxP.lineTo(wP - 25, cy);
        ctxP.moveTo(cx, 15); ctxP.lineTo(cx, hP - 15);
        ctxP.stroke();

        ctxP.fillStyle = '#94a3b8';
        ctxP.font = '600 11px system-ui, sans-serif';
        ctxP.fillText('Re', wP - 20, cy - 6);
        ctxP.fillText('Im', cx + 6, 22);

        // Amplitud α = 1/√2 (Vector fijo para componente |0⟩)
        ctxP.strokeStyle = '#3b82f6';
        ctxP.lineWidth = 3;
        ctxP.beginPath();
        ctxP.moveTo(cx, cy);
        ctxP.lineTo(cx + rScale, cy);
        ctxP.stroke();

        ctxP.fillStyle = '#2563eb';
        ctxP.beginPath();
        ctxP.arc(cx + rScale, cy, 4, 0, 2*Math.PI);
        ctxP.fill();

        ctxP.font = 'bold 11px system-ui, sans-serif';
        ctxP.fillText('α (|0⟩)', cx + rScale - 5, cy + 18);

        // Amplitud β = (e^{iϕ})/√2 (Vector rotatorio para componente |1⟩)
        const bx = Math.cos(phi) * rScale;
        const by = Math.sin(phi) * rScale;

        ctxP.strokeStyle = '#8b5cf6';
        ctxP.lineWidth = 3;
        ctxP.beginPath();
        ctxP.moveTo(cx, cy);
        ctxP.lineTo(cx + bx, cy - by);
        ctxP.stroke();

        ctxP.fillStyle = '#7c3aed';
        ctxP.beginPath();
        ctxP.arc(cx + bx, cy - by, 4.5, 0, 2*Math.PI);
        ctxP.fill();

        ctxP.fillText('β (|1⟩)', cx + bx + (bx >= 0 ? 6 : -38), cy - by + (by >= 0 ? -6 : 14));

        // Arco de ángulo ϕ
        if (phi > 0.05) {
            ctxP.beginPath();
            ctxP.arc(cx, cy, 28, 0, -phi, true);
            ctxP.strokeStyle = '#f59e0b';
            ctxP.lineWidth = 2;
            ctxP.stroke();

            ctxP.fillStyle = '#b45309';
            ctxP.font = 'bold 10.5px system-ui, sans-serif';
            ctxP.fillText('ϕ', cx + 32 * Math.cos(-phi/2), cy + 32 * Math.sin(-phi/2));
        }

        // =========================================================================
        // 2. DIBUJAR INTERFERENCIA TRAS HADAMARD (PROBABILIDADES EN BASE X)
        // =========================================================================
        ctxJ.clearRect(0, 0, wJ, hJ);

        // Probabilidades de interferencia en base {|+⟩, |-⟩}
        const probPlus = Math.cos(phi / 2) ** 2;
        const probMinus = Math.sin(phi / 2) ** 2;

        document.getElementById(`${containerId}_prob_plus`).innerText = `${(probPlus * 100).toFixed(1)}%`;

        // Dibujar barras de probabilidad
        const barWidth = 70;
        const barMaxH = 120;
        const groundY = 160;

        // Barra para |+⟩ (Interferencia constructiva en ϕ=0)
        const hPlus = probPlus * barMaxH;
        const xPlus = 80;

        ctxJ.fillStyle = '#f1f5f9';
        ctxJ.fillRect(xPlus, groundY - barMaxH, barWidth, barMaxH);
        ctxJ.fillStyle = probPlus > 0.5 ? '#2563eb' : '#60a5fa';
        ctxJ.fillRect(xPlus, groundY - hPlus, barWidth, hPlus);
        ctxJ.strokeStyle = '#1d4ed8';
        ctxJ.strokeRect(xPlus, groundY - barMaxH, barWidth, barMaxH);

        // Barra para |-⟩ (Interferencia constructiva en ϕ=π)
        const hMinus = probMinus * barMaxH;
        const xMinus = 230;

        ctxJ.fillStyle = '#f1f5f9';
        ctxJ.fillRect(xMinus, groundY - barMaxH, barWidth, barMaxH);
        ctxJ.fillStyle = probMinus > 0.5 ? '#ef4444' : '#f87171';
        ctxJ.fillRect(xMinus, groundY - hMinus, barWidth, hMinus);
        ctxJ.strokeStyle = '#b91c1c';
        ctxJ.strokeRect(xMinus, groundY - barMaxH, barWidth, barMaxH);

        // Etiquetas y porcentajes
        ctxJ.font = 'bold 12.5px system-ui, sans-serif';
        ctxJ.fillStyle = '#1e293b';
        ctxJ.fillText('Estado |+⟩', xPlus + 7, groundY + 22);
        ctxJ.fillText('Estado |-⟩', xMinus + 7, groundY + 22);

        ctxJ.font = '800 13px monospace';
        ctxJ.fillStyle = probPlus > 0.2 ? '#ffffff' : '#1e40af';
        ctxJ.fillText(`${(probPlus * 100).toFixed(0)}%`, xPlus + 18, hPlus > 25 ? groundY - hPlus + 18 : groundY - hPlus - 6);

        ctxJ.fillStyle = probMinus > 0.2 ? '#ffffff' : '#991b1b';
        ctxJ.fillText(`${(probMinus * 100).toFixed(0)}%`, xMinus + 18, hMinus > 25 ? groundY - hMinus + 18 : groundY - hMinus - 6);

        // Eje de base
        ctxJ.strokeStyle = '#94a3b8';
        ctxJ.lineWidth = 1.5;
        ctxJ.beginPath();
        ctxJ.moveTo(30, groundY); ctxJ.lineTo(wJ - 30, groundY);
        ctxJ.stroke();

        // Fórmula explicativa arriba
        ctxJ.font = '600 11.5px system-ui, sans-serif';
        ctxJ.fillStyle = '#475569';
        ctxJ.fillText('⟨+|ψ⟩ = (1 + eⁱᵠ)/2   ⟹   P(|+⟩) = cos²(ϕ/2)', 65, 24);

        // =========================================================================
        // 3. BADGE DESCRIPTIVO DE ESTADO
        // =========================================================================
        const badge = document.getElementById(`${containerId}_badge`);
        if (probPlus >= 0.98) {
            badge.innerText = "Estado |+⟩ (ϕ = 0): Interferencia Constructiva";
            badge.style.background = "#dcfce7";
            badge.style.color = "#15803d";
        } else if (probMinus >= 0.98) {
            badge.innerText = "Estado |-⟩ (ϕ = π): Interferencia Destructiva";
            badge.style.background = "#fee2e2";
            badge.style.color = "#b91c1c";
        } else if (Math.abs(probPlus - 0.5) < 0.05) {
            const isPlusI = Math.abs(phi - Math.PI/2) < 0.2;
            badge.innerText = isPlusI ? "Estado |i⟩ (ϕ = π/2): Cuadratura" : "Estado |-i⟩ (ϕ = 3π/2): Cuadratura";
            badge.style.background = "#f3e8ff";
            badge.style.color = "#6b21a8";
        } else {
            badge.innerText = `Interferencia Parcial (ϕ = ${deg}°)`;
            badge.style.background = "#fef3c7";
            badge.style.color = "#92400e";
        }
    }

    slider.addEventListener('input', draw);

    window[`${containerId}_setPhase`] = function(val) {
        slider.value = val;
        draw();
    };

    draw();
}
