/**
 * Visualizador Interactivo: La Geometría del Algoritmo de Grover en 2D
 * Demuestra intuitivamente cómo el algoritmo rota un vector en un plano bidimensional
 * hacia el estado buscado, y qué sucede si nos pasamos (sobre-rotación).
 */

function initGroverGeometricRotation(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let n = 3; // Qubits (por defecto 3 -> N = 8)
    let k = 0; // Iteraciones actuales

    function getParams() {
        const N = Math.pow(2, n);
        const theta = Math.asin(1 / Math.sqrt(N));
        const kOpt = Math.round((Math.PI / 4) * Math.sqrt(N) - 0.5);
        const currentAngle = (2 * k + 1) * theta;
        const probSuccess = Math.pow(Math.sin(currentAngle), 2);
        return { N, theta, kOpt, currentAngle, probSuccess };
    }

    function renderUI() {
        const { N, kOpt, currentAngle, probSuccess } = getParams();
        const probPercent = (probSuccess * 100).toFixed(1);

        let badgeStatus = '';
        if (k === 0) {
            badgeStatus = `<span style="background: #e2e8f0; color: #475569; padding: 4px 10px; border-radius: 20px; font-weight: 600; font-size: 12px;">Estado Inicial (Superposición)</span>`;
        } else if (k === kOpt) {
            badgeStatus = `<span style="background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 20px; font-weight: 700; font-size: 12px;">🎯 ¡Punto Óptimo Alcanzado!</span>`;
        } else if (k > kOpt) {
            badgeStatus = `<span style="background: #fee2e2; color: #b91c1c; padding: 4px 10px; border-radius: 20px; font-weight: 700; font-size: 12px;">⚠️ Sobre-rotación (Nos pasamos)</span>`;
        } else {
            badgeStatus = `<span style="background: #e0e7ff; color: #4338ca; padding: 4px 10px; border-radius: 20px; font-weight: 600; font-size: 12px;">Avanzando hacia el objetivo</span>`;
        }

        container.innerHTML = `
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 22px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); font-family: system-ui, -apple-system, sans-serif;">
            
            <!-- Encabezado -->
            <div style="border-bottom: 2px solid #6366f1; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div>
                    <h5 style="margin: 0; color: #1e293b; font-weight: 700; font-size: 17px;">
                        Rotación Geométrica del Algoritmo de Grover
                    </h5>
                    <span style="font-size: 13px; color: #64748b;">
                        El algoritmo gira el vector en un plano hacia la respuesta correcta
                    </span>
                </div>
                <div>${badgeStatus}</div>
            </div>

            <!-- Selector de Qubits -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span style="font-size: 13px; font-weight: 600; color: #334155; white-space: nowrap;">Espacio:</span>
                    <button id="${containerId}_btn_n2" class="btn btn-sm ${n === 2 ? 'btn-primary' : 'btn-outline-secondary'}" style="font-size: 11.5px; padding: 3px 8px; white-space: nowrap;">2 qubits (N=4)</button>
                    <button id="${containerId}_btn_n3" class="btn btn-sm ${n === 3 ? 'btn-primary' : 'btn-outline-secondary'}" style="font-size: 11.5px; padding: 3px 8px; white-space: nowrap;">3 qubits (N=8)</button>
                    <button id="${containerId}_btn_n4" class="btn btn-sm ${n === 4 ? 'btn-primary' : 'btn-outline-secondary'}" style="font-size: 11.5px; padding: 3px 8px; white-space: nowrap;">4 qubits (N=16)</button>
                </div>
                <div style="font-size: 12.5px; color: #475569; white-space: nowrap; flex-shrink: 0; margin-left: auto;">
                    Paso óptimo teórico: <strong style="color: #1e293b;">${kOpt} ${kOpt === 1 ? 'iteración' : 'iteraciones'}</strong>
                </div>
            </div>

            <!-- Contenedor Gráfico y Métricas -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 20px; align-items: center;">
                
                <!-- Canvas 2D -->
                <div style="text-align: center; background: #fafafa; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px;">
                    <canvas id="${containerId}_canvas" width="340" height="340" style="max-width: 100%; height: auto;"></canvas>
                </div>

                <!-- Panel de Métricas y Controles -->
                <div>
                    <!-- Barra de Probabilidad -->
                    <div style="margin-bottom: 18px;">
                        <div style="display: flex; justify-content: space-between; font-size: 13.5px; margin-bottom: 6px;">
                            <span style="font-weight: 600; color: #334155;">Probabilidad de éxito (medir la respuesta):</span>
                            <span style="font-weight: 700; color: ${probPercent > 80 ? '#15803d' : '#2563eb'}; font-size: 15px;">${probPercent}%</span>
                        </div>
                        <div style="height: 14px; background: #e2e8f0; border-radius: 7px; overflow: hidden;">
                            <div style="width: ${probPercent}%; height: 100%; background: ${probPercent > 80 ? '#22c55e' : (probPercent > 40 ? '#3b82f6' : '#94a3b8')}; transition: width 0.3s ease;"></div>
                        </div>
                    </div>

                    <!-- Datos Numéricos Sencillos -->
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 18px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px;">
                            <div>
                                <span style="color: #64748b;">Paso actual (k):</span>
                                <div style="font-size: 18px; font-weight: 700; color: #1e293b;">${k}</div>
                            </div>
                            <div>
                                <span style="color: #64748b;">Total de elementos (N):</span>
                                <div style="font-size: 18px; font-weight: 700; color: #1e293b;">${N}</div>
                            </div>
                        </div>
                        <div style="margin-top: 10px; font-size: 12.5px; color: #475569; line-height: 1.4; border-top: 1px dashed #cbd5e1; padding-top: 8px;">
                            💡 En cada paso, el oráculo y el difusor hacen girar el vector hacia el eje vertical. Cuando el vector apunta casi vertical, la respuesta está lista para medirse.
                        </div>
                    </div>

                    <!-- Botones de Acción -->
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <button id="${containerId}_btn_prev" class="btn btn-outline-secondary btn-sm" style="flex: 1;" ${k === 0 ? 'disabled' : ''}>
                            ← Paso anterior
                        </button>
                        <button id="${containerId}_btn_next" class="btn btn-primary btn-sm" style="flex: 2; font-weight: 600;">
                            Siguiente paso (Girar ↻)
                        </button>
                        <button id="${containerId}_btn_reset" class="btn btn-outline-danger btn-sm">
                            Reiniciar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;

        drawCanvas();
        attachEvents();
    }

    function drawCanvas() {
        const canvas = document.getElementById(`${containerId}_canvas`);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        const ox = 50;  // Origen X
        const oy = h - 50; // Origen Y
        const radius = 240; // Radio del cuadrante

        // 1. Dibujar Cuadrante (Arco guía)
        ctx.beginPath();
        ctx.arc(ox, oy, radius, -Math.PI / 2, 0);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // 2. Ejes de coordenadas
        // Eje Horizontal: |s'> (no buscados)
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + radius + 30, oy);
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Flecha eje horizontal
        ctx.beginPath();
        ctx.moveTo(ox + radius + 30, oy);
        ctx.lineTo(ox + radius + 22, oy - 5);
        ctx.lineTo(ox + radius + 22, oy + 5);
        ctx.fillStyle = '#64748b';
        ctx.fill();

        // Eje Vertical: |ω> (el buscado)
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox, oy - radius - 30);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Flecha eje vertical
        ctx.beginPath();
        ctx.moveTo(ox, oy - radius - 30);
        ctx.lineTo(ox - 5, oy - radius - 22);
        ctx.lineTo(ox + 5, oy - radius - 22);
        ctx.fillStyle = '#10b981';
        ctx.fill();

        // Etiquetas de los ejes
        ctx.font = 'bold 12.5px system-ui, sans-serif';
        ctx.fillStyle = '#475569';
        ctx.fillText("|s'⟩ (no buscados)", ox + radius - 70, oy + 24);

        ctx.fillStyle = '#047857';
        ctx.fillText("|ω⟩ (¡buscado!)", ox + 10, oy - radius - 15);

        // 3. Vector del Estado Inicial |s> (en gris claro de referencia)
        const { theta, currentAngle } = getParams();
        const initX = ox + radius * Math.cos(theta);
        const initY = oy - radius * Math.sin(theta);

        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(initX, initY);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = '11px system-ui, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText("|s⟩ inicial", initX + 6, initY + 4);

        // 4. Vector de Estado Actual |ψ_k>
        // Limitamos visualmente el ángulo si da muchas vueltas para claridad
        const angleMod = currentAngle % (2 * Math.PI);
        const vx = ox + radius * Math.cos(angleMod);
        const vy = oy - radius * Math.sin(angleMod);

        // Sector angular recorrido
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.arc(ox, oy, 55, -angleMod, 0, false);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
        ctx.fill();

        // Línea del vector actual
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(vx, vy);
        ctx.strokeStyle = '#4f46e5';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        // Flecha del vector actual
        const headLen = 12;
        const angle = -angleMod;
        ctx.beginPath();
        ctx.moveTo(vx, vy);
        ctx.lineTo(vx - headLen * Math.cos(angle - Math.PI / 7), vy - headLen * Math.sin(angle - Math.PI / 7));
        ctx.lineTo(vx - headLen * Math.cos(angle + Math.PI / 7), vy - headLen * Math.sin(angle + Math.PI / 7));
        ctx.fillStyle = '#4f46e5';
        ctx.fill();

        // Punto en la punta del vector
        ctx.beginPath();
        ctx.arc(vx, vy, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#4338ca';
        ctx.fill();

        // Etiqueta del vector actual
        ctx.font = 'bold 13px system-ui, sans-serif';
        ctx.fillStyle = '#312e81';
        ctx.fillText(`|ψ⟩ (paso ${k})`, vx + 10, vy - 6);
    }

    function attachEvents() {
        const btnN2 = document.getElementById(`${containerId}_btn_n2`);
        const btnN3 = document.getElementById(`${containerId}_btn_n3`);
        const btnN4 = document.getElementById(`${containerId}_btn_n4`);
        const btnPrev = document.getElementById(`${containerId}_btn_prev`);
        const btnNext = document.getElementById(`${containerId}_btn_next`);
        const btnReset = document.getElementById(`${containerId}_btn_reset`);

        if (btnN2) btnN2.onclick = () => { n = 2; k = 0; renderUI(); };
        if (btnN3) btnN3.onclick = () => { n = 3; k = 0; renderUI(); };
        if (btnN4) btnN4.onclick = () => { n = 4; k = 0; renderUI(); };

        if (btnPrev) btnPrev.onclick = () => { if (k > 0) { k--; renderUI(); } };
        if (btnNext) btnNext.onclick = () => { if (k < 10) { k++; renderUI(); } };
        if (btnReset) btnReset.onclick = () => { k = 0; renderUI(); };
    }

    renderUI();
}
