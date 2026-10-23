/**
 * Laboratorio Interactivo: Animación Dinámica de Muestreo Cuántico (Shots)
 * Con selección de N shots, banda de tolerancia teórica y reporte de error esperado vs observado.
 * Soporte completo HiDPI / Retina.
 */

function initDynamicShots(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 22px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); font-family: system-ui, -apple-system, sans-serif; color: #1e293b;">
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #6366f1; padding-bottom: 10px; margin-bottom: 16px;">
            <h5 style="margin: 0; color: #0f172a; font-weight: 700; font-size: 17px;">
                Convergencia de la Regla de Born para |+⟩ = (|0⟩ + |1⟩)/√2
            </h5>
            <span style="font-size: 13px; color: #64748b; font-weight: 600;">Probabilidad teórica: 50.0%</span>
        </div>

        <!-- Barra de Configuración de Shots y Acciones -->
        <div style="display: flex; flex-wrap: wrap; gap: 14px; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 18px;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <label for="${containerId}_select_shots" style="font-size: 13px; font-weight: 700; color: #334155; margin: 0;">
                    Shots objetivo (N):
                </label>
                <select id="${containerId}_select_shots" class="form-select form-select-sm" style="font-size: 13px; font-weight: 600; padding: 4px 10px; border-radius: 6px; border: 1px solid #cbd5e1; background: #ffffff; color: #0f172a; cursor: pointer;">
                    <option value="100">100 shots (σ ≈ ±5.0%)</option>
                    <option value="500">500 shots (σ ≈ ±2.2%)</option>
                    <option value="1024" selected>1024 shots (σ ≈ ±1.56%) [Default en Qiskit]</option>
                    <option value="2048">2048 shots (σ ≈ ±1.10%)</option>
                    <option value="4096">4096 shots (σ ≈ ±0.78%)</option>
                    <option value="8192">8192 shots (σ ≈ ±0.55%)</option>
                </select>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-left: auto;">
                <button id="${containerId}_btn_play" class="btn btn-primary btn-sm" style="font-weight: 600; display: inline-flex; align-items: center; gap: 4px;" onclick="${containerId}_startAnim()">
                    ▶ Iniciar Animación
                </button>
                <button id="${containerId}_btn_instant" class="btn btn-outline-primary btn-sm" style="font-weight: 600;" onclick="${containerId}_runInstant()">
                    ⚡ Muestreo Rápido
                </button>
                <button class="btn btn-outline-secondary btn-sm" onclick="${containerId}_reset()">
                    ↺ Reiniciar
                </button>
            </div>
        </div>
        
        <div style="display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-start;">
            <!-- Canvas del Histograma -->
            <div style="flex: 1.3; min-width: 320px; text-align: center;">
                <canvas id="${containerId}_canvas" style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; width: 100%; height: auto; box-shadow: 0 1px 4px rgba(0,0,0,0.04);"></canvas>
                <div style="font-size: 11px; color: #64748b; margin-top: 6px; text-align: right;">
                    <span style="display: inline-block; width: 12px; height: 8px; background: rgba(99, 102, 241, 0.18); border: 1px dashed #6366f1; vertical-align: middle; margin-right: 4px;"></span>
                    Banda de tolerancia teórica (±1σ = 1/(2√N))
                </div>
            </div>
            
            <!-- Panel Estadístico y Análisis de Error -->
            <div style="flex: 1; min-width: 270px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
                    <span style="font-size: 13px; color: #64748b; font-weight: 600;">Disparos Realizados:</span>
                    <span id="${containerId}_shots_counter" style="font-size: 24px; font-weight: 800; color: #4f46e5;">0 / 1024</span>
                </div>

                <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span><strong>Estado |0⟩:</strong> <span id="${containerId}_n0" style="color: #64748b;">(0)</span></span>
                        <strong id="${containerId}_f0" style="color: #2563eb; font-size: 14px;">0.0%</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span><strong>Estado |1⟩:</strong> <span id="${containerId}_n1" style="color: #64748b;">(0)</span></span>
                        <strong id="${containerId}_f1" style="color: #dc2626; font-size: 14px;">0.0%</strong>
                    </div>
                </div>

                <!-- Tarjeta Comparativa de Errores -->
                <div style="background: #f1f5f9; border-left: 4px solid #6366f1; padding: 12px 14px; border-radius: 0 8px 8px 0; font-size: 13px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                        <span style="color: #475569;">Error observado (|f₀ - 50%|):</span>
                        <strong id="${containerId}_err_obs" style="color: #0f172a; font-size: 14px;">±0.00%</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                        <span style="color: #475569;">Error esperado (σ = 1/(2√N)):</span>
                        <strong id="${containerId}_err_exp" style="color: #4f46e5; font-size: 14px;">±1.56%</strong>
                    </div>
                    <div id="${containerId}_stat_badge" style="font-size: 11px; padding: 3px 8px; border-radius: 4px; text-align: center; font-weight: 600; background: #e2e8f0; color: #475569; margin-top: 6px;">
                        Esperando inicio del experimento
                    </div>
                </div>
                
                <div id="${containerId}_status_msg" style="font-size: 12px; color: #64748b; font-style: italic; line-height: 1.4;">
                    Elige el número de shots y haz clic en Iniciar Animación o Muestreo Rápido.
                </div>
            </div>
        </div>
    </div>
    `;

    const canvas = document.getElementById(`${containerId}_canvas`);
    const selectShots = document.getElementById(`${containerId}_select_shots`);
    const dpr = window.devicePixelRatio || 2;
    const w = 400, h = 250;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    let count0 = 0;
    let count1 = 0;
    let total = 0;
    let animId = null;

    function getTargetShots() {
        return parseInt(selectShots.value, 10) || 1024;
    }

    function renderHistogram() {
        ctx.clearRect(0, 0, w, h);

        const target = getTargetShots();
        const baseY = h - 35;
        const maxBarH = h - 70;

        // Eje horizontal
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(35, baseY);
        ctx.lineTo(w - 15, baseY);
        ctx.stroke();

        // N actual o target para el cálculo de sigma teórico
        const effectiveN = total > 0 ? total : target;
        const sigmaPct = (1 / (2 * Math.sqrt(effectiveN))) * 100; // en porcentaje

        // Banda de tolerancia teórica de +/- 1 sigma alrededor del 50%
        const y50 = baseY - 0.5 * maxBarH;
        const sigmaHeight = (sigmaPct / 100) * maxBarH;
        const yBandTop = Math.max(10, y50 - sigmaHeight);
        const yBandBottom = Math.min(baseY, y50 + sigmaHeight);

        ctx.fillStyle = 'rgba(99, 102, 241, 0.10)';
        ctx.fillRect(35, yBandTop, (w - 50), yBandBottom - yBandTop);

        ctx.strokeStyle = 'rgba(99, 102, 241, 0.35)';
        ctx.setLineDash([3, 3]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(35, yBandTop);
        ctx.lineTo(w - 15, yBandTop);
        ctx.moveTo(35, yBandBottom);
        ctx.lineTo(w - 15, yBandBottom);
        ctx.stroke();

        // Línea central teórica 50%
        ctx.strokeStyle = '#475569';
        ctx.setLineDash([5, 4]);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(35, y50);
        ctx.lineTo(w - 15, y50);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#475569';
        ctx.font = '600 11px system-ui, sans-serif';
        ctx.fillText('50% Teórico', w - 85, y50 - 5);

        const f0 = total > 0 ? count0 / total : 0;
        const f1 = total > 0 ? count1 / total : 0;

        // Barra |0>
        const barW = 75;
        const x0 = 85;
        const h0 = f0 * maxBarH;
        
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(x0, baseY - h0, barW, h0);
        ctx.strokeStyle = '#1d4ed8';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(x0, baseY - h0, barW, h0);

        // Barra |1>
        const x1 = 230;
        const h1 = f1 * maxBarH;

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(x1, baseY - h1, barW, h1);
        ctx.strokeStyle = '#b91c1c';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(x1, baseY - h1, barW, h1);

        // Etiquetas
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 13px system-ui, sans-serif';
        ctx.fillText('|0⟩', x0 + 28, baseY + 20);
        ctx.fillText('|1⟩', x1 + 28, baseY + 20);

        if (total > 0) {
            ctx.fillStyle = '#1e293b';
            ctx.font = 'bold 12px system-ui, sans-serif';
            ctx.fillText(`${(f0 * 100).toFixed(1)}%`, x0 + 18, baseY - h0 - 8);
            ctx.fillText(`${(f1 * 100).toFixed(1)}%`, x1 + 18, baseY - h1 - 8);
        }

        // Actualizar valores en panel
        document.getElementById(`${containerId}_shots_counter`).innerText = `${total} / ${target}`;
        document.getElementById(`${containerId}_f0`).innerText = total > 0 ? `${(f0 * 100).toFixed(2)}%` : '0.0%';
        document.getElementById(`${containerId}_f1`).innerText = total > 0 ? `${(f1 * 100).toFixed(2)}%` : '0.0%';
        document.getElementById(`${containerId}_n0`).innerText = `(${count0})`;
        document.getElementById(`${containerId}_n1`).innerText = `(${count1})`;

        const errObs = total > 0 ? Math.abs(f0 - 0.5) * 100 : 0;
        const errExpTarget = (1 / (2 * Math.sqrt(target))) * 100;
        const currentSigma = total > 0 ? (1 / (2 * Math.sqrt(total))) * 100 : errExpTarget;

        document.getElementById(`${containerId}_err_obs`).innerText = `±${errObs.toFixed(2)}%`;
        document.getElementById(`${containerId}_err_exp`).innerText = `±${(total > 0 ? currentSigma : errExpTarget).toFixed(2)}%`;

        const badge = document.getElementById(`${containerId}_stat_badge`);
        if (total === 0) {
            badge.style.background = '#e2e8f0';
            badge.style.color = '#475569';
            badge.innerText = 'Esperando inicio del experimento';
        } else if (errObs <= currentSigma) {
            badge.style.background = '#dcfce7';
            badge.style.color = '#15803d';
            badge.innerText = `✓ Dentro del rango ±1σ esperado (68% de confianza)`;
        } else if (errObs <= 2 * currentSigma) {
            badge.style.background = '#fef9c3';
            badge.style.color = '#a16207';
            badge.innerText = `⚠ Fluctuación normal dentro de ±2σ (95% de confianza)`;
        } else {
            badge.style.background = '#fee2e2';
            badge.style.color = '#b91c1c';
            badge.innerText = `⚡ Fluctuación estadística atípica (> 2σ)`;
        }
    }

    selectShots.addEventListener('change', () => {
        if (!animId) {
            renderHistogram();
        }
    });

    window[`${containerId}_startAnim`] = function() {
        if (animId) clearInterval(animId);
        count0 = 0; count1 = 0; total = 0;
        const target = getTargetShots();
        const btnPlay = document.getElementById(`${containerId}_btn_play`);
        const btnInstant = document.getElementById(`${containerId}_btn_instant`);
        const msg = document.getElementById(`${containerId}_status_msg`);
        btnPlay.disabled = true;
        btnInstant.disabled = true;

        // Hitos adaptativos según el target
        const m1 = 1;
        const m2 = Math.max(5, Math.round(target * 0.02));
        const m3 = Math.max(20, Math.round(target * 0.15));
        const m4 = Math.max(50, Math.round(target * 0.50));
        const m5 = target;

        const milestones = [
            { target: m1, step: 1, delay: 450, label: "Shot 1: Colapso binario determinista puro (100% / 0%)" },
            { target: m2, step: Math.max(1, Math.round(m2 / 10)), delay: 120, label: `~${m2} Shots: Fuerte ruido estocástico inicial` },
            { target: m3, step: Math.max(2, Math.round(m3 / 15)), delay: 50, label: `~${m3} Shots: El balance estadístico comienza a converger` },
            { target: m4, step: Math.max(5, Math.round(m4 / 20)), delay: 30, label: `~${m4} Shots: Se aproxima asintóticamente al 50%` },
            { target: m5, step: Math.max(10, Math.round((m5 - m4) / 25)), delay: 20, label: `${m5} Shots: Estabilización final dentro de la cota teórica` }
        ];

        let mIdx = 0;

        function runMilestone() {
            if (mIdx >= milestones.length) {
                btnPlay.disabled = false;
                btnInstant.disabled = false;
                const finalErr = Math.abs((count0 / total) - 0.5) * 100;
                const finalExp = (1 / (2 * Math.sqrt(total))) * 100;
                msg.innerText = `¡Muestreo finalizado! Error observado: ±${finalErr.toFixed(2)}% (esperado: ±${finalExp.toFixed(2)}%).`;
                return;
            }

            const m = milestones[mIdx];
            msg.innerText = m.label;

            animId = setInterval(() => {
                for (let k = 0; k < m.step; k++) {
                    if (total < m.target) {
                        if (Math.random() < 0.5) count0++;
                        else count1++;
                        total++;
                    }
                }
                renderHistogram();

                if (total >= m.target) {
                    clearInterval(animId);
                    mIdx++;
                    setTimeout(runMilestone, 300);
                }
            }, m.delay);
        }

        runMilestone();
    };

    window[`${containerId}_runInstant`] = function() {
        if (animId) clearInterval(animId);
        const target = getTargetShots();
        count0 = 0; count1 = 0; total = target;

        for (let i = 0; i < target; i++) {
            if (Math.random() < 0.5) count0++;
            else count1++;
        }

        renderHistogram();
        const finalErr = Math.abs((count0 / total) - 0.5) * 100;
        const finalExp = (1 / (2 * Math.sqrt(total))) * 100;
        document.getElementById(`${containerId}_btn_play`).disabled = false;
        document.getElementById(`${containerId}_btn_instant`).disabled = false;
        document.getElementById(`${containerId}_status_msg`).innerText = 
            `Muestreo instantáneo completado (${target} shots). Error observado: ±${finalErr.toFixed(2)}% vs esperado: ±${finalExp.toFixed(2)}%.`;
    };

    window[`${containerId}_reset`] = function() {
        if (animId) clearInterval(animId);
        animId = null;
        count0 = 0; count1 = 0; total = 0;
        document.getElementById(`${containerId}_btn_play`).disabled = false;
        document.getElementById(`${containerId}_btn_instant`).disabled = false;
        document.getElementById(`${containerId}_status_msg`).innerText = "Elige el número de shots y haz clic en Iniciar Animación o Muestreo Rápido.";
        renderHistogram();
    };

    renderHistogram();
}
