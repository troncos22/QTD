/**
 * Simulador Interactivo 3D de la Esfera de Bloch con Aplicador de Compuertas Cuánticas
 * Permite ajustar un estado inicial arbitrario y aplicar sucesivamente compuertas (X, Y, Z, S, T, H)
 * con visualización animada de la rotación 3D, eje de rotación llamativo, conteo de aplicaciones,
 * historial de circuito y probabilidades numéricas continuas.
 */

function initBlochSphereGates(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); font-family: system-ui, -apple-system, sans-serif;">
        <div style="display: flex; flex-wrap: wrap; gap: 28px; justify-content: center; align-items: flex-start;">
            <!-- Columna Canvas 3D -->
            <div style="position: relative; text-align: center;">
                <canvas id="${containerId}_canvas" style="cursor: grab; border-radius: 12px; background: #ffffff; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.04);"></canvas>

                <div style="margin-top: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 11.5px; color: #64748b;">
                    <span>Arrastra para orbitar en 3D</span>
                    <button class="btn btn-sm btn-outline-secondary" style="font-size: 10.5px; padding: 2px 7px;" onclick="${containerId}_resetView()">Resetear Vista</button>
                </div>
            </div>

            <!-- Columna Controles y Resultados -->
            <div style="flex: 1; min-width: 300px; max-width: 480px;">
                <h5 style="margin-top: 0; color: #0f172a; border-bottom: 2px solid #2563eb; padding-bottom: 8px; font-weight: 700; font-size: 16px; display: flex; justify-content: space-between; align-items: center;">
                    <span>Laboratorio de Compuertas Cuánticas</span>
                    <span id="${containerId}_total_gates_badge" style="font-size: 11px; background: #eff6ff; color: #1d4ed8; padding: 2px 8px; border-radius: 12px; border: 1px solid #bfdbfe; font-weight: 600;">0 compuertas</span>
                </h5>
                
                <!-- Sección 1: Ajuste del Estado Inicial -->
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <span style="font-size: 12px; font-weight: 700; color: #334155;">1. Estado Inicial / Presets:</span>
                        <div style="display: flex; gap: 4px;">
                            <button class="btn btn-sm btn-outline-primary" style="font-size: 10.5px; padding: 1px 6px;" onclick="${containerId}_setState(0, 0)">|0⟩</button>
                            <button class="btn btn-sm btn-outline-primary" style="font-size: 10.5px; padding: 1px 6px;" onclick="${containerId}_setState(Math.PI, 0)">|1⟩</button>
                            <button class="btn btn-sm btn-outline-success" style="font-size: 10.5px; padding: 1px 6px;" onclick="${containerId}_setState(Math.PI/2, 0)">|+⟩</button>
                            <button class="btn btn-sm btn-outline-success" style="font-size: 10.5px; padding: 1px 6px;" onclick="${containerId}_setState(Math.PI/2, Math.PI)">|–⟩</button>
                            <button class="btn btn-sm btn-outline-info" style="font-size: 10.5px; padding: 1px 6px;" onclick="${containerId}_setState(Math.PI/2, Math.PI/2)">|+i⟩</button>
                            <button class="btn btn-sm btn-outline-info" style="font-size: 10.5px; padding: 1px 6px;" onclick="${containerId}_setState(Math.PI/2, 3*Math.PI/2)">|–i⟩</button>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 11.5px;">
                        <div>
                            <div style="display: flex; justify-content: space-between; color: #475569;">
                                <span>&theta; (Latitud):</span>
                                <span id="${containerId}_theta_val" style="font-weight: 600; color: #2563eb;">0.00 rad</span>
                            </div>
                            <input type="range" id="${containerId}_theta" min="0" max="3.14159" step="0.02" value="0" style="width: 100%; cursor: pointer;">
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between; color: #475569;">
                                <span>&phi; (Fase):</span>
                                <span id="${containerId}_phi_val" style="font-weight: 600; color: #7c3aed;">0.00 rad</span>
                            </div>
                            <input type="range" id="${containerId}_phi" min="0" max="6.28318" step="0.02" value="0" style="width: 100%; cursor: pointer;">
                        </div>
                    </div>
                </div>

                <!-- Sección 2: Botones de Compuertas Cuánticas con Contadores -->
                <div style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <span style="font-size: 12px; font-weight: 700; color: #1e293b;">2. Aplicar Compuertas Unitarias:</span>
                        <button class="btn btn-sm btn-outline-danger" style="font-size: 10.5px; padding: 1px 6px;" onclick="${containerId}_resetGates()">Resetear</button>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                        <!-- Pauli X -->
                        <button class="btn btn-sm btn-danger" style="font-size: 12px; display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; transition: transform 0.1s;" onclick="${containerId}_applyGate('X')">
                            <span><strong>X</strong> (NOT)</span>
                            <span id="${containerId}_cnt_X" style="background: rgba(255,255,255,0.3); padding: 1px 5px; border-radius: 8px; font-size: 10px;">0</span>
                        </button>
                        <!-- Pauli Y -->
                        <button class="btn btn-sm btn-warning" style="font-size: 12px; color: #000; display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; transition: transform 0.1s;" onclick="${containerId}_applyGate('Y')">
                            <span><strong>Y</strong> (Bit&Phase)</span>
                            <span id="${containerId}_cnt_Y" style="background: rgba(0,0,0,0.15); padding: 1px 5px; border-radius: 8px; font-size: 10px;">0</span>
                        </button>
                        <!-- Pauli Z -->
                        <button class="btn btn-sm btn-secondary" style="font-size: 12px; display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; transition: transform 0.1s;" onclick="${containerId}_applyGate('Z')">
                            <span><strong>Z</strong> (Phase Flip)</span>
                            <span id="${containerId}_cnt_Z" style="background: rgba(255,255,255,0.3); padding: 1px 5px; border-radius: 8px; font-size: 10px;">0</span>
                        </button>
                        <!-- Hadamard H -->
                        <button class="btn btn-sm btn-primary" style="font-size: 12px; display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; transition: transform 0.1s;" onclick="${containerId}_applyGate('H')">
                            <span><strong>H</strong> (Hadamard)</span>
                            <span id="${containerId}_cnt_H" style="background: rgba(255,255,255,0.3); padding: 1px 5px; border-radius: 8px; font-size: 10px;">0</span>
                        </button>
                        <!-- Phase S -->
                        <button class="btn btn-sm btn-info" style="font-size: 12px; color: #fff; display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; transition: transform 0.1s;" onclick="${containerId}_applyGate('S')">
                            <span><strong>S</strong> (&pi;/2 Fase)</span>
                            <span id="${containerId}_cnt_S" style="background: rgba(255,255,255,0.3); padding: 1px 5px; border-radius: 8px; font-size: 10px;">0</span>
                        </button>
                        <!-- Phase T -->
                        <button class="btn btn-sm btn-dark" style="font-size: 12px; display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; transition: transform 0.1s;" onclick="${containerId}_applyGate('T')">
                            <span><strong>T</strong> (&pi;/4 Fase)</span>
                            <span id="${containerId}_cnt_T" style="background: rgba(255,255,255,0.3); padding: 1px 5px; border-radius: 8px; font-size: 10px;">0</span>
                        </button>
                    </div>

                    <!-- Opción de Animación y Eje Visual -->
                    <div style="margin-top: 8px; display: flex; align-items: center; justify-content: space-between; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 6px; padding: 5px 10px;">
                        <label style="font-size: 11.5px; color: #92400e; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; margin: 0;">
                            <input type="checkbox" id="${containerId}_anim_toggle" checked style="cursor: pointer;">
                            <span>Animar rotación y resaltar eje 3D</span>
                        </label>
                    </div>
                </div>

                <!-- Historial de Compuertas Aplicadas -->
                <div style="background: #f1f5f9; border: 1px dashed #cbd5e1; border-radius: 6px; padding: 6px 10px; margin-bottom: 12px; font-size: 11.5px; display: flex; align-items: center; gap: 6px;">
                    <strong style="color: #475569; white-space: nowrap;">Secuencia:</strong>
                    <span id="${containerId}_history" style="color: #1e293b; font-family: monospace; overflow-x: auto; white-space: nowrap; flex: 1;">|&psi;<sub>0</sub>⟩</span>
                </div>

                <!-- Sección 3: Resultados Numéricos y Probabilidades -->
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 12.5px; border-left: 4px solid #2563eb;">
                    <div style="margin-bottom: 6px;">
                        <strong>Vector de Estado |&psi;&rangle;:</strong><br>
                        <span id="${containerId}_state_str" style="color: #1d4ed8; font-weight: 700; font-family: monospace; font-size: 13.5px;">1.00|0⟩ + 0.00|1⟩</span>
                    </div>
                    <div style="display: flex; gap: 20px; margin-top: 6px; padding: 6px 0; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                        <div><strong>P(|0⟩):</strong> <span id="${containerId}_p0" style="color: #059669; font-weight: 800; font-size: 13px;">100.0%</span></div>
                        <div><strong>P(|1⟩):</strong> <span id="${containerId}_p1" style="color: #dc2626; font-weight: 800; font-size: 13px;">0.0%</span></div>
                    </div>
                    <div style="margin-top: 6px; font-size: 11px; color: #64748b; display: flex; justify-content: space-between;">
                        <span>Bloch (x, y, z): [<strong id="${containerId}_xyz" style="color: #334155;">0.00, 0.00, 1.00</strong>]</span>
                        <span>Ángulos: &theta;=<span id="${containerId}_deg_t">0°</span>, &phi;=<span id="${containerId}_deg_p">0°</span></span>
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

    // Amplitudes complejas del Qubit: alpha, beta
    let alpha = { re: 1.0, im: 0.0 };
    let beta = { re: 0.0, im: 0.0 };

    // Contadores e historial
    const gateCounts = { X: 0, Y: 0, Z: 0, H: 0, S: 0, T: 0 };
    let gateHistory = ['|ψ₀⟩'];

    // Configuración de Rotaciones de Compuertas (Eje unitario n y ángulo de giro Omega en radianes)
    const GATE_ROTATIONS = {
        'X': {
            axis: { x: 1, y: 0, z: 0 },
            angle: Math.PI,
            label: 'Eje X (180°)',
            desc: 'Rotación de 180° alrededor del Eje X (Bit-Flip)',
            color: '#dc2626'
        },
        'Y': {
            axis: { x: 0, y: 1, z: 0 },
            angle: Math.PI,
            label: 'Eje Y (180°)',
            desc: 'Rotación de 180° alrededor del Eje Y (Bit & Phase)',
            color: '#d97706'
        },
        'Z': {
            axis: { x: 0, y: 0, z: 1 },
            angle: Math.PI,
            label: 'Eje Z (180°)',
            desc: 'Rotación de 180° alrededor del Eje Z (Phase-Flip)',
            color: '#475569'
        },
        'S': {
            axis: { x: 0, y: 0, z: 1 },
            angle: Math.PI / 2,
            label: 'Eje Z (+90°)',
            desc: 'Rotación de +90° (π/2) alrededor del Eje Z',
            color: '#0284c7'
        },
        'T': {
            axis: { x: 0, y: 0, z: 1 },
            angle: Math.PI / 4,
            label: 'Eje Z (+45°)',
            desc: 'Rotación de +45° (π/4) alrededor del Eje Z',
            color: '#0f172a'
        },
        'H': {
            axis: { x: 1 / Math.SQRT2, y: 0, z: 1 / Math.SQRT2 },
            angle: Math.PI,
            label: 'Eje (X+Z)/√2 (180°)',
            desc: 'Rotación de 180° sobre la diagonal (X+Z)/√2',
            color: '#2563eb'
        }
    };

    // Estado de Animación de Rotación
    let isAnimating = false;
    let animGateKey = null;
    let animStartVec = null;
    let animTargetVec = null;
    let animCurrentVec = null;
    let animStartTime = 0;
    const ANIM_DURATION = 800; // milisegundos
    let animTrail = [];        // Traza del camino recorrido sobre la esfera
    let animAxisOpacity = 0;   // Opacidad para desvanecimiento suave del eje al terminar

    // Orientación de la Cámara 3D (Default: Elevación 30°, Azimut 30°)
    const INIT_ELEVATION = 30 * (Math.PI / 180);
    const INIT_AZIMUTH = 30 * (Math.PI / 180);

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

        const maxElev = 85 * (Math.PI / 180);
        elevation = Math.max(-maxElev, Math.min(maxElev, elevation));

        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        if (!isAnimating) draw();
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
        if (!isAnimating) draw();
    }, { passive: true });

    // =========================================================================
    // PROYECCIÓN 3D EN TERNA DERECHA (+Z = NORTE, +X × +Y = +Z)
    // =========================================================================
    function project3D(x, y, z) {
        const cosAz = Math.cos(azimuth), sinAz = Math.sin(azimuth);
        const cosEl = Math.cos(elevation), sinEl = Math.sin(elevation);

        const xc = -x * sinAz + y * cosAz;
        const yc = z * cosEl - (x * cosAz + y * sinAz) * sinEl;
        const zc = z * sinEl + (x * cosAz + y * sinAz) * cosEl;

        const cameraDist = 3.6;
        const scale = 118;
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

    // Normalizar amplitudes cuánticas
    function normalizeState() {
        const norm2 = alpha.re ** 2 + alpha.im ** 2 + beta.re ** 2 + beta.im ** 2;
        if (norm2 > 1e-15) {
            const norm = Math.sqrt(norm2);
            alpha.re /= norm;
            alpha.im /= norm;
            beta.re /= norm;
            beta.im /= norm;
        }
    }

    // Calcular vector de Bloch 3D a partir de alpha, beta
    function getBlochCoordinates() {
        normalizeState();
        const x = 2 * (alpha.re * beta.re + alpha.im * beta.im);
        const y = 2 * (alpha.re * beta.im - alpha.im * beta.re);
        const z = (alpha.re ** 2 + alpha.im ** 2) - (beta.re ** 2 + beta.im ** 2);

        const clampedZ = Math.max(-1, Math.min(1, z));
        const theta = Math.acos(clampedZ);
        let phi = Math.atan2(y, x);
        if (phi < 0) phi += 2 * Math.PI;

        return { x, y, z: clampedZ, theta, phi };
    }

    // Fórmula de rotación de Rodrigues en 3D alrededor del eje unitario n por ángulo w
    function rodriguesRotate(v0, n, w) {
        const cosW = Math.cos(w);
        const sinW = Math.sin(w);

        // Producto punto n . v0
        const dot = n.x * v0.x + n.y * v0.y + n.z * v0.z;

        // Producto cruz n x v0
        const cross = {
            x: n.y * v0.z - n.z * v0.y,
            y: n.z * v0.x - n.x * v0.z,
            z: n.x * v0.y - n.y * v0.x
        };

        const vx = v0.x * cosW + cross.x * sinW + n.x * dot * (1 - cosW);
        const vy = v0.y * cosW + cross.y * sinW + n.y * dot * (1 - cosW);
        const vz = v0.z * cosW + cross.z * sinW + n.z * dot * (1 - cosW);

        // Normalizar a radio 1
        const len = Math.sqrt(vx * vx + vy * vy + vz * vz);
        return {
            x: len > 1e-10 ? vx / len : vx,
            y: len > 1e-10 ? vy / len : vy,
            z: len > 1e-10 ? vz / len : vz
        };
    }

    function draw() {
        ctx.clearRect(0, 0, size, size);

        const cx = size / 2;
        const cy = size / 2;
        const R = 118;

        // 1. Sombreado esférico volumétrico constante
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

        // 2. Wireframe 3D: Paralelos (Latitudes)
        const latitudes = [-Math.PI / 3, -Math.PI / 6, 0, Math.PI / 6, Math.PI / 3];
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
                ctx.strokeStyle = 'rgba(37, 99, 235, 0.55)';
                ctx.lineWidth = 1.8;
            } else {
                ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
                ctx.lineWidth = 0.9;
            }
            ctx.stroke();
        });

        // 3. Wireframe 3D: Meridianos (Longitudes)
        const longitudes = [0, Math.PI / 4, Math.PI / 2, 3 * Math.PI / 4, Math.PI, 5 * Math.PI / 4, 3 * Math.PI / 2, 7 * Math.PI / 4];
        longitudes.forEach(lon => {
            ctx.beginPath();
            let first = true;
            for (let lat = -Math.PI / 2; lat <= Math.PI / 2 + 0.05; lat += 0.06) {
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

        // 4. Borde del contorno esférico
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, 2 * Math.PI);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // 5. Ejes coordenados 3D estándar (X, Y, Z) con perspectiva
        const axes = [
            { x: 1.35, y: 0, z: 0, label: '+X (|+⟩)', color: '#16a34a', isMain: true },
            { x: -1.35, y: 0, z: 0, label: '-X (|–⟩)', color: '#64748b', isMain: false },
            { x: 0, y: 1.35, z: 0, label: '+Y (|i⟩)', color: '#9333ea', isMain: true },
            { x: 0, y: -1.35, z: 0, label: '-Y (|-i⟩)', color: '#64748b', isMain: false },
            { x: 0, y: 0, z: 1.4, label: '|0⟩ (+Z)', color: '#2563eb', isMain: true },
            { x: 0, y: 0, z: -1.4, label: '|1⟩ (-Z)', color: '#dc2626', isMain: true }
        ];

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

        // =====================================================================
        // 6. EJE DE ROTACIÓN CUÁNTICA ACTIVO (Llamativo, brillante y rotulado)
        // =====================================================================
        if (animGateKey && animAxisOpacity > 0.01) {
            const rotInfo = GATE_ROTATIONS[animGateKey];
            if (rotInfo) {
                const nx = rotInfo.axis.x;
                const ny = rotInfo.axis.y;
                const nz = rotInfo.axis.z;

                const L = 1.75; // Extensión del eje
                const p1 = project3D(-nx * L, -ny * L, -nz * L);
                const p2 = project3D(nx * L, ny * L, nz * L);

                // Halo exterior brillante (Glow)
                ctx.save();
                ctx.globalAlpha = animAxisOpacity * 0.45;
                ctx.beginPath();
                ctx.moveTo(p1.px, p1.py);
                ctx.lineTo(p2.px, p2.py);
                ctx.strokeStyle = '#fbbf24';
                ctx.lineWidth = 8;
                ctx.lineCap = 'round';
                ctx.stroke();

                // Línea principal de alta visibilidad (Dorado Neón / Ámbar)
                ctx.globalAlpha = animAxisOpacity;
                ctx.beginPath();
                ctx.moveTo(p1.px, p1.py);
                ctx.lineTo(p2.px, p2.py);
                ctx.strokeStyle = '#d97706';
                ctx.lineWidth = 3.0;
                ctx.stroke();

                // Línea interior punteada blanca para contraste
                ctx.beginPath();
                ctx.setLineDash([4, 4]);
                ctx.moveTo(p1.px, p1.py);
                ctx.lineTo(p2.px, p2.py);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.6;
                ctx.stroke();
                ctx.setLineDash([]);

                // Nodos terminales brillantes del eje
                [p1, p2].forEach((pt, idx) => {
                    ctx.beginPath();
                    ctx.arc(pt.px, pt.py, 5 * pt.scaleFactor, 0, 2 * Math.PI);
                    ctx.fillStyle = '#f59e0b';
                    ctx.fill();
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 1.8;
                    ctx.stroke();
                });

                // Rótulo del eje de rotación flotante
                const labelPt = p2;
                ctx.fillStyle = '#b45309';
                ctx.font = 'bold 12px system-ui, sans-serif';
                ctx.fillText(`${rotInfo.label}`, labelPt.px + 8, labelPt.py + 4);

                ctx.restore();
            }
        }

        // =====================================================================
        // 7. TRAZA / CAMINO RECORRIDO POR EL VECTOR EN LA ESFERA
        // =====================================================================
        if (animTrail.length > 1) {
            ctx.save();
            ctx.beginPath();
            let first = true;
            for (let i = 0; i < animTrail.length; i++) {
                const pt = project3D(animTrail[i].x, animTrail[i].y, animTrail[i].z);
                if (first) { ctx.moveTo(pt.px, pt.py); first = false; }
                else { ctx.lineTo(pt.px, pt.py); }
            }
            ctx.strokeStyle = 'rgba(236, 72, 153, 0.75)'; // Rosa neón
            ctx.lineWidth = 2.4;
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
        }

        // =====================================================================
        // 8. VECTOR DE ESTADO CUÁNTICO |ψ⟩ (Con volumen y perspectiva)
        // =====================================================================
        const curV = isAnimating && animCurrentVec ? animCurrentVec : (() => {
            const c = getBlochCoordinates();
            return { x: c.x, y: c.y, z: c.z };
        })();

        const vx = curV.x;
        const vy = curV.y;
        const vz = curV.z;

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

        // Vector |ψ⟩ principal (Púrpura / Azul Real vibrante)
        ctx.beginPath();
        ctx.moveTo(o.px, o.py);
        ctx.lineTo(tip.px, tip.py);
        ctx.strokeStyle = '#4f46e5';
        ctx.lineWidth = 3.8 * tip.scaleFactor;
        ctx.stroke();

        // Esfera brillante en la punta del vector
        const tipRadius = 7 * tip.scaleFactor;
        const tipGrad = ctx.createRadialGradient(
            tip.px - tipRadius * 0.3, tip.py - tipRadius * 0.3, 1,
            tip.px, tip.py, tipRadius
        );
        tipGrad.addColorStop(0, '#c7d2fe');
        tipGrad.addColorStop(0.65, '#6366f1');
        tipGrad.addColorStop(1, '#3730a3');

        ctx.beginPath();
        ctx.arc(tip.px, tip.py, tipRadius, 0, 2 * Math.PI);
        ctx.fillStyle = tipGrad;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Etiqueta |ψ⟩
        ctx.fillStyle = '#3730a3';
        ctx.font = 'bold 14px system-ui, sans-serif';
        ctx.fillText('|ψ⟩', tip.px + 9, tip.py - 6);

        // =====================================================================
        // 9. ACTUALIZAR PANEL NUMÉRICO Y ALGEBRAICO
        // =====================================================================
        const clampedZ = Math.max(-1, Math.min(1, vz));
        const curTheta = Math.acos(clampedZ);
        let curPhi = Math.atan2(vy, vx);
        if (curPhi < 0) curPhi += 2 * Math.PI;

        const p0 = Math.cos(curTheta / 2) ** 2;
        const p1 = Math.sin(curTheta / 2) ** 2;
        const thetaDeg = Math.round(curTheta * 180 / Math.PI);
        const phiDeg = Math.round(curPhi * 180 / Math.PI);

        document.getElementById(`${containerId}_theta_val`).innerText = `${curTheta.toFixed(2)} rad (${thetaDeg}°)`;
        document.getElementById(`${containerId}_phi_val`).innerText = `${curPhi.toFixed(2)} rad (${phiDeg}°)`;
        document.getElementById(`${containerId}_deg_t`).innerText = `${thetaDeg}°`;
        document.getElementById(`${containerId}_deg_p`).innerText = `${phiDeg}°`;
        document.getElementById(`${containerId}_p0`).innerText = `${(p0 * 100).toFixed(1)}%`;
        document.getElementById(`${containerId}_p1`).innerText = `${(p1 * 100).toFixed(1)}%`;
        document.getElementById(`${containerId}_xyz`).innerText = `${vx.toFixed(2)}, ${vy.toFixed(2)}, ${vz.toFixed(2)}`;

        // Representación de amplitudes complejas compacta
        function fmtC(c) {
            const r = c.re.toFixed(2);
            const i = Math.abs(c.im).toFixed(2);
            if (Math.abs(c.im) < 0.01) return `${r}`;
            if (Math.abs(c.re) < 0.01) return `${c.im < 0 ? '-' : ''}${i}i`;
            return `(${r} ${c.im >= 0 ? '+' : '-'} ${i}i)`;
        }

        if (!isAnimating) {
            const alphaStr = fmtC(alpha);
            const betaStr = fmtC(beta);
            document.getElementById(`${containerId}_state_str`).innerText = `${alphaStr}|0⟩ + ${betaStr}|1⟩`;
            sliderTheta.value = curTheta;
            sliderPhi.value = curPhi;
        } else {
            const cosT = Math.cos(curTheta / 2).toFixed(2);
            const sinT = Math.sin(curTheta / 2).toFixed(2);
            const phaseStr = curPhi === 0 ? '' : ` · e^(${curPhi.toFixed(2)}i)`;
            document.getElementById(`${containerId}_state_str`).innerText = `${cosT}|0⟩ + ${sinT}${phaseStr}|1⟩`;
        }

        // Actualizar contadores en UI
        let totalGates = 0;
        for (const [k, v] of Object.entries(gateCounts)) {
            const el = document.getElementById(`${containerId}_cnt_${k}`);
            if (el) el.innerText = v;
            totalGates += v;
        }
        document.getElementById(`${containerId}_total_gates_badge`).innerText = `${totalGates} compuerta${totalGates === 1 ? '' : 's'}`;
        document.getElementById(`${containerId}_history`).innerText = gateHistory.join(' → ');
    }

    const sliderTheta = document.getElementById(`${containerId}_theta`);
    const sliderPhi = document.getElementById(`${containerId}_phi`);
    const animToggle = document.getElementById(`${containerId}_anim_toggle`);

    sliderTheta.addEventListener('input', (e) => {
        if (isAnimating) return;
        const t = parseFloat(e.target.value);
        const coords = getBlochCoordinates();
        const p = coords.phi;
        alpha = { re: Math.cos(t / 2), im: 0.0 };
        beta = { re: Math.sin(t / 2) * Math.cos(p), im: Math.sin(t / 2) * Math.sin(p) };
        animGateKey = null;
        animAxisOpacity = 0;
        animTrail = [];
        draw();
    });

    sliderPhi.addEventListener('input', (e) => {
        if (isAnimating) return;
        const p = parseFloat(e.target.value);
        const coords = getBlochCoordinates();
        const t = coords.theta;
        alpha = { re: Math.cos(t / 2), im: 0.0 };
        beta = { re: Math.sin(t / 2) * Math.cos(p), im: Math.sin(t / 2) * Math.sin(p) };
        animGateKey = null;
        animAxisOpacity = 0;
        animTrail = [];
        draw();
    });

    // Fijar estado inicial exacto
    window[`${containerId}_setState`] = function (t, p) {
        if (isAnimating) return;
        alpha = { re: Math.cos(t / 2), im: 0.0 };
        beta = { re: Math.sin(t / 2) * Math.cos(p), im: Math.sin(t / 2) * Math.sin(p) };
        gateHistory = [`|ψ(${t === 0 ? '0' : (t === Math.PI ? '1' : '+')})⟩`];
        for (const k in gateCounts) gateCounts[k] = 0;
        animGateKey = null;
        animAxisOpacity = 0;
        animTrail = [];
        draw();
    };

    // Resetear vista 3D
    window[`${containerId}_resetView`] = function () {
        elevation = INIT_ELEVATION;
        azimuth = INIT_AZIMUTH;
        draw();
    };

    // Resetear compuertas y estado a |0⟩
    window[`${containerId}_resetGates`] = function () {
        if (isAnimating) return;
        alpha = { re: 1.0, im: 0.0 };
        beta = { re: 0.0, im: 0.0 };
        for (const k in gateCounts) gateCounts[k] = 0;
        gateHistory = ['|0⟩'];
        animAxisOpacity = 0;
        animTrail = [];
        draw();
    };

    // =========================================================================
    // LOOP DE ANIMACIÓN SUAVE DE ROTACIÓN 3D
    // =========================================================================
    function stepAnimation(timestamp) {
        if (!isAnimating) return;

        const elapsed = timestamp - animStartTime;
        let progress = Math.min(1.0, elapsed / ANIM_DURATION);

        // Curva EaseInOut cúbica suave
        const ease = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const rotInfo = GATE_ROTATIONS[animGateKey];
        const currentAngle = rotInfo.angle * ease;

        animCurrentVec = rodriguesRotate(animStartVec, rotInfo.axis, currentAngle);
        animTrail.push(animCurrentVec);

        // Mantener opacidad del eje alta durante la rotación
        animAxisOpacity = 1.0;

        draw();

        if (progress < 1.0) {
            requestAnimationFrame(stepAnimation);
        } else {
            // Fin de la animación: mantener el vector, el eje y la curva de trayectoria visibles de forma persistente
            isAnimating = false;
            animCurrentVec = animTargetVec;
            animAxisOpacity = 1.0;
            draw();
        }
    }

    // =========================================================================
    // APLICACIÓN DE COMPUERTAS CUÁNTICAS UNITARIAS
    // =========================================================================
    window[`${containerId}_applyGate`] = function (gate) {
        if (isAnimating) return; // Esperar a que concluya la rotación actual

        const rotInfo = GATE_ROTATIONS[gate];
        if (!rotInfo) return;

        gateCounts[gate] = (gateCounts[gate] || 0) + 1;
        gateHistory.push(gate);
        if (gateHistory.length > 10) {
            gateHistory = ['...', ...gateHistory.slice(-8)];
        }

        const a = { ...alpha };
        const b = { ...beta };
        let nextAlpha, nextBeta;

        switch (gate) {
            case 'X':
                nextAlpha = { re: b.re, im: b.im };
                nextBeta = { re: a.re, im: a.im };
                break;
            case 'Y':
                nextAlpha = { re: b.im, im: -b.re };
                nextBeta = { re: -a.im, im: a.re };
                break;
            case 'Z':
                nextAlpha = { re: a.re, im: a.im };
                nextBeta = { re: -b.re, im: -b.im };
                break;
            case 'H':
                const invSqrt2 = 1 / Math.SQRT2;
                nextAlpha = {
                    re: invSqrt2 * (a.re + b.re),
                    im: invSqrt2 * (a.im + b.im)
                };
                nextBeta = {
                    re: invSqrt2 * (a.re - b.re),
                    im: invSqrt2 * (a.im - b.im)
                };
                break;
            case 'S':
                nextAlpha = { re: a.re, im: a.im };
                nextBeta = { re: -b.im, im: b.re };
                break;
            case 'T':
                const invS2 = 1 / Math.SQRT2;
                nextAlpha = { re: a.re, im: a.im };
                nextBeta = {
                    re: invS2 * (b.re - b.im),
                    im: invS2 * (b.re + b.im)
                };
                break;
        }

        const startCoords = getBlochCoordinates();
        animStartVec = { x: startCoords.x, y: startCoords.y, z: startCoords.z };

        // Actualizar estado final
        alpha = nextAlpha;
        beta = nextBeta;
        normalizeState();

        const endCoords = getBlochCoordinates();
        animTargetVec = { x: endCoords.x, y: endCoords.y, z: endCoords.z };

        const shouldAnimate = animToggle ? animToggle.checked : true;

        if (shouldAnimate) {
            isAnimating = true;
            animGateKey = gate;
            animStartTime = performance.now();
            animTrail = [animStartVec];
            animAxisOpacity = 1.0;

            requestAnimationFrame(stepAnimation);
        } else {
            // Modo instantáneo: calcular arco completo y mantener eje visible
            animGateKey = gate;
            animAxisOpacity = 1.0;
            animTrail = [];
            const steps = 32;
            for (let s = 0; s <= steps; s++) {
                const w = rotInfo.angle * (s / steps);
                animTrail.push(rodriguesRotate(animStartVec, rotInfo.axis, w));
            }
            draw();
        }
    };

    draw();
}

