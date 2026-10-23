/**
 * Simulador Interactivo 3D de la Esfera de Bloch con Perspectiva y Profundidad
 * Orientación canónica: Polo Norte |0⟩ vertical (+Z).
 * Vista inicial: Elevación 30° y Azimut 30°.
 * Soporte Retina / HiDPI y proyección 3D con perspectiva real.
 */

function initBlochSphere(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); font-family: system-ui, -apple-system, sans-serif;">
        <div style="display: flex; flex-wrap: wrap; gap: 28px; justify-content: center; align-items: center;">
            <div style="position: relative; text-align: center;">
                <canvas id="${containerId}_canvas" style="cursor: grab; border-radius: 12px; background: #ffffff; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.04);"></canvas>
                <div style="margin-top: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 11.5px; color: #64748b;">
                    <span>Arrastra para orbitar en 3D</span>
                    <button class="btn btn-sm btn-outline-secondary" style="font-size: 10.5px; padding: 2px 7px;" onclick="${containerId}_resetView()">Resetear Vista</button>
                </div>
            </div>
            <div style="flex: 1; min-width: 280px; max-width: 420px;">
                <h5 style="margin-top: 0; color: #0f172a; border-bottom: 2px solid #2563eb; padding-bottom: 8px; font-weight: 700; font-size: 16px;">
                    Estado del Qubit: |&psi;&rangle;
                </h5>
                
                <div style="margin-bottom: 14px;">
                    <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; color: #334155;">
                        <span>Ángulo Polar &theta; (Latitud):</span>
                        <span id="${containerId}_theta_val" style="color: #2563eb;">0.00 rad (0°)</span>
                    </div>
                    <input type="range" id="${containerId}_theta" min="0" max="3.14159" step="0.02" value="0" style="width: 100%; margin-top: 4px; cursor: pointer;">
                </div>

                <div style="margin-bottom: 14px;">
                    <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; color: #334155;">
                        <span>Ángulo Azimutal &phi; (Longitud / Fase):</span>
                        <span id="${containerId}_phi_val" style="color: #7c3aed;">0.00 rad (0°)</span>
                    </div>
                    <input type="range" id="${containerId}_phi" min="0" max="6.28318" step="0.02" value="0" style="width: 100%; margin-top: 4px; cursor: pointer;">
                </div>

                <div style="margin-bottom: 16px;">
                    <div style="font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 6px;">Estados Notables (Presets):</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                        <button class="btn btn-sm btn-outline-primary" style="font-size: 11px;" onclick="${containerId}_setState(0, 0)">|0⟩ (Norte)</button>
                        <button class="btn btn-sm btn-outline-primary" style="font-size: 11px;" onclick="${containerId}_setState(Math.PI, 0)">|1⟩ (Sur)</button>
                        <button class="btn btn-sm btn-outline-success" style="font-size: 11px;" onclick="${containerId}_setState(Math.PI/2, 0)">|+⟩ (Eje +X)</button>
                        <button class="btn btn-sm btn-outline-success" style="font-size: 11px;" onclick="${containerId}_setState(Math.PI/2, Math.PI)">|–⟩ (Eje -X)</button>
                        <button class="btn btn-sm btn-outline-info" style="font-size: 11px;" onclick="${containerId}_setState(Math.PI/2, Math.PI/2)">|+i⟩ (Eje +Y)</button>
                        <button class="btn btn-sm btn-outline-info" style="font-size: 11px;" onclick="${containerId}_setState(Math.PI/2, 3*Math.PI/2)">|–i⟩ (Eje -Y)</button>
                    </div>
                </div>

                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; font-size: 13px; border-left: 4px solid #2563eb;">
                    <div style="margin-bottom: 6px;"><strong>Vector de Estado:</strong><br><span id="${containerId}_state_str" style="color: #1d4ed8; font-weight: 700; font-family: monospace; font-size: 14px;">1.00|0⟩ + 0.00|1⟩</span></div>
                    <div style="margin-top: 6px; display: flex; gap: 16px;">
                        <div><strong>P(|0⟩):</strong> <span id="${containerId}_p0" style="color: #059669; font-weight: 800;">100.0%</span></div>
                        <div><strong>P(|1⟩):</strong> <span id="${containerId}_p1" style="color: #dc2626; font-weight: 800;">0.0%</span></div>
                    </div>
                    <div style="margin-top: 8px; font-size: 11.5px; color: #64748b;">
                        Coordenadas Bloch (x, y, z): [<span id="${containerId}_xyz">0.00, 0.00, 1.00</span>]
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    const canvas = document.getElementById(`${containerId}_canvas`);
    const dpr = window.devicePixelRatio || 2;
    const size = 380;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Estado del Qubit (Default: Polo Norte |0⟩)
    let theta = 0; // θ = 0 -> |0⟩
    let phi = 0;   // ϕ = 0

    // Orientación de la Cámara 3D (Default: Elevación 30°, Azimut 30°)
    const INIT_ELEVATION = 30 * (Math.PI / 180);  // 30° de altura
    const INIT_AZIMUTH = 30 * (Math.PI / 180);    // 30° de azimut

    let elevation = INIT_ELEVATION;
    let azimuth = INIT_AZIMUTH;

    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        canvas.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        canvas.style.cursor = 'grab';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        
        azimuth -= dx * 0.01;
        elevation += dy * 0.01;

        // Limitar elevación para no invertir la esfera
        const maxElev = 85 * (Math.PI / 180);
        elevation = Math.max(-maxElev, Math.min(maxElev, elevation));

        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        draw();
    });

    canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            lastMouseX = e.touches[0].clientX;
            lastMouseY = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        const dx = e.touches[0].clientX - lastMouseX;
        const dy = e.touches[0].clientY - lastMouseY;
        
        azimuth -= dx * 0.01;
        elevation += dy * 0.01;
        const maxElev = 85 * (Math.PI / 180);
        elevation = Math.max(-maxElev, Math.min(maxElev, elevation));

        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
        draw();
    }, { passive: true });

    // =========================================================================
    // PROYECCIÓN 3D EN TERNA DERECHA ESTRICTA (+Z = NORTE, +X × +Y = +Z)
    // =========================================================================
    function project3D(x, y, z) {
        const cosAz = Math.cos(azimuth), sinAz = Math.sin(azimuth);
        const cosEl = Math.cos(elevation), sinEl = Math.sin(elevation);

        // Transformación de cámara en terna derecha:
        // xc: Coordenada horizontal de pantalla (positivo = derecha)
        // yc: Coordenada vertical de pantalla (positivo = arriba)
        // zc: Profundidad visual hacia la cámara
        const xc = -x * sinAz + y * cosAz;
        const yc = z * cosEl - (x * cosAz + y * sinAz) * sinEl;
        const zc = z * sinEl + (x * cosAz + y * sinAz) * cosEl;

        // Proyección con perspectiva (Foreshortening cónico)
        const cameraDist = 3.6; // Distancia focal
        const scale = 118;      // Escala base
        const cx = size / 2;
        const cy = size / 2;

        const perspective = cameraDist / (cameraDist + zc);

        return {
            px: cx + xc * scale * perspective,
            py: cy - yc * scale * perspective,
            depth: zc,
            scaleFactor: perspective
        };
    }

    function draw() {
        ctx.clearRect(0, 0, size, size);

        const cx = size / 2;
        const cy = size / 2;
        const R = 118;

        // 1. Sombreado esférico volumétrico constante (fijo en pantalla, opacidad estable)
        const sphereGrad = ctx.createRadialGradient(
            cx - R * 0.3, cy - R * 0.35, R * 0.15,
            cx, cy, R
        );
        sphereGrad.addColorStop(0, '#ffffff');
        sphereGrad.addColorStop(0.55, '#f8fafc');
        sphereGrad.addColorStop(0.85, '#e2e8f0');
        sphereGrad.addColorStop(1, '#cbd5e1');

        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, 2 * Math.PI);
        ctx.fillStyle = sphereGrad;
        ctx.fill();

        // 2. Wireframe 3D con atenuación de profundidad: Paralelos (Latitudes)
        const latitudes = [-Math.PI/3, -Math.PI/6, 0, Math.PI/6, Math.PI/3];
        latitudes.forEach(lat => {
            const rLat = Math.cos(lat);
            const zLat = Math.sin(lat);
            
            ctx.beginPath();
            let first = true;
            for (let lon = 0; lon <= 2 * Math.PI + 0.05; lon += 0.06) {
                const px = rLat * Math.cos(lon);
                const py = rLat * Math.sin(lon);
                const p = project3D(px, py, zLat);
                if (first) { ctx.moveTo(p.px, p.py); first = false; }
                else { ctx.lineTo(p.px, p.py); }
            }
            if (lat === 0) {
                // Ecuador resaltado (Plano XY)
                ctx.strokeStyle = 'rgba(37, 99, 235, 0.55)';
                ctx.lineWidth = 1.8;
            } else {
                ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
                ctx.lineWidth = 0.9;
            }
            ctx.stroke();
        });

        // 3. Wireframe 3D: Meridianos (Longitudes)
        const longitudes = [0, Math.PI/4, Math.PI/2, 3*Math.PI/4, Math.PI, 5*Math.PI/4, 3*Math.PI/2, 7*Math.PI/4];
        longitudes.forEach(lon => {
            ctx.beginPath();
            let first = true;
            for (let lat = -Math.PI/2; lat <= Math.PI/2 + 0.05; lat += 0.06) {
                const px = Math.cos(lat) * Math.cos(lon);
                const py = Math.cos(lat) * Math.sin(lon);
                const pz = Math.sin(lat);
                const p = project3D(px, py, pz);
                if (first) { ctx.moveTo(p.px, p.py); first = false; }
                else { ctx.lineTo(p.px, p.py); }
            }
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
            ctx.lineWidth = 0.9;
            ctx.stroke();
        });

        // 4. Borde sutil del contorno esférico
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, 2 * Math.PI);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // 5. Ejes coordenados 3D (X, Y, Z) con perspectiva
        const axes = [
            { x: 1.35, y: 0, z: 0, label: '+X (|+⟩)', color: '#16a34a', isMain: true },
            { x: -1.35, y: 0, z: 0, label: '-X (|–⟩)', color: '#64748b', isMain: false },
            { x: 0, y: 1.35, z: 0, label: '+Y (|i⟩)', color: '#9333ea', isMain: true },
            { x: 0, y: -1.35, z: 0, label: '-Y (|-i⟩)', color: '#64748b', isMain: false },
            { x: 0, y: 0, z: 1.4, label: '|0⟩ (+Z Norte)', color: '#2563eb', isMain: true },
            { x: 0, y: 0, z: -1.4, label: '|1⟩ (-Z Sur)', color: '#dc2626', isMain: true }
        ];

        // Ordenar ejes por profundidad para renderizado correcto
        axes.forEach(ax => {
            const o = project3D(0, 0, 0);
            const tip = project3D(ax.x, ax.y, ax.z);
            
            ctx.beginPath();
            ctx.moveTo(o.px, o.py);
            ctx.lineTo(tip.px, tip.py);
            ctx.strokeStyle = ax.isMain ? 'rgba(100, 116, 139, 0.8)' : 'rgba(148, 163, 184, 0.4)';
            ctx.lineWidth = ax.isMain ? 1.4 : 0.9;
            if (!ax.isMain) ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = ax.color;
            ctx.font = 'bold 11px system-ui, sans-serif';
            ctx.fillText(ax.label, tip.px + 5, tip.py - 4);
        });

        // 6. Vector de estado cuántico |ψ⟩ en la Esfera de Bloch
        const vx = Math.sin(theta) * Math.cos(phi);
        const vy = Math.sin(theta) * Math.sin(phi);
        const vz = Math.cos(theta);

        const o = project3D(0, 0, 0);
        const tip = project3D(vx, vy, vz);

        // Proyección sobre el plano ecuatorial XY (sombra dorada con profundidad)
        const tipShadow = project3D(vx, vy, 0);
        ctx.beginPath();
        ctx.moveTo(o.px, o.py);
        ctx.lineTo(tipShadow.px, tipShadow.py);
        ctx.lineTo(tip.px, tip.py);
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.7)';
        ctx.setLineDash([3, 3]);
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.setLineDash([]);

        // Vector |ψ⟩ principal (Rojo brillante con volumen)
        ctx.beginPath();
        ctx.moveTo(o.px, o.py);
        ctx.lineTo(tip.px, tip.py);
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 3.8 * tip.scaleFactor;
        ctx.stroke();

        // Esfera brillante en la punta del vector
        const tipRadius = 7 * tip.scaleFactor;
        const tipGrad = ctx.createRadialGradient(
            tip.px - tipRadius * 0.3, tip.py - tipRadius * 0.3, 1,
            tip.px, tip.py, tipRadius
        );
        tipGrad.addColorStop(0, '#fca5a5');
        tipGrad.addColorStop(0.65, '#ef4444');
        tipGrad.addColorStop(1, '#991b1b');

        ctx.beginPath();
        ctx.arc(tip.px, tip.py, tipRadius, 0, 2 * Math.PI);
        ctx.fillStyle = tipGrad;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Etiqueta |ψ⟩
        ctx.fillStyle = '#991b1b';
        ctx.font = 'bold 14px system-ui, sans-serif';
        ctx.fillText('|ψ⟩', tip.px + 9, tip.py - 6);

        // 7. Actualizar panel numérico y algebraico
        const p0 = Math.cos(theta / 2) ** 2;
        const p1 = Math.sin(theta / 2) ** 2;
        const thetaDeg = Math.round(theta * 180 / Math.PI);
        const phiDeg = Math.round(phi * 180 / Math.PI);

        document.getElementById(`${containerId}_theta_val`).innerText = `${theta.toFixed(2)} rad (${thetaDeg}°)`;
        document.getElementById(`${containerId}_phi_val`).innerText = `${phi.toFixed(2)} rad (${phiDeg}°)`;
        document.getElementById(`${containerId}_p0`).innerText = `${(p0 * 100).toFixed(1)}%`;
        document.getElementById(`${containerId}_p1`).innerText = `${(p1 * 100).toFixed(1)}%`;
        document.getElementById(`${containerId}_xyz`).innerText = `${vx.toFixed(2)}, ${vy.toFixed(2)}, ${vz.toFixed(2)}`;

        const cosVal = Math.cos(theta / 2).toFixed(2);
        const sinVal = Math.sin(theta / 2).toFixed(2);
        const phaseStr = phi === 0 ? '' : ` · e^(${phi.toFixed(2)}i)`;
        document.getElementById(`${containerId}_state_str`).innerText = `${cosVal}|0⟩ + ${sinVal}${phaseStr}|1⟩`;
    }

    const sliderTheta = document.getElementById(`${containerId}_theta`);
    const sliderPhi = document.getElementById(`${containerId}_phi`);

    sliderTheta.addEventListener('input', (e) => {
        theta = parseFloat(e.target.value);
        draw();
    });

    sliderPhi.addEventListener('input', (e) => {
        phi = parseFloat(e.target.value);
        draw();
    });

    window[`${containerId}_setState`] = function(t, p) {
        theta = t;
        phi = p;
        sliderTheta.value = t;
        sliderPhi.value = p;
        draw();
    };

    window[`${containerId}_resetView`] = function() {
        elevation = INIT_ELEVATION;
        azimuth = INIT_AZIMUTH;
        draw();
    };

    draw();
}

