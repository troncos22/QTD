/**
 * Calculadora Interactiva: El Crecimiento de la Memoria en Computación Cuántica
 * Demuestra de forma intuitiva por qué simular muchos qubits satura un computador
 * común y por qué se necesitan supercomputadores con tarjetas gráficas (GPUs).
 */

function initHpcMemoryScaling(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let n = 28; // Valor por defecto

    function formatBytes(bytes) {
        if (bytes < 1024) return bytes + " Bytes";
        const units = ["KB", "MB", "GB", "TB", "PB", "EB"];
        let u = -1;
        let b = bytes;
        do {
            b /= 1024;
            u++;
        } while (b >= 1024 && u < units.length - 1);
        return b.toFixed(b >= 100 ? 0 : (b >= 10 ? 1 : 2)) + " " + units[u];
    }

    function formatNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(1) + " billones";
        if (num >= 1e9) return (num / 1e9).toFixed(1) + " mil millones";
        if (num >= 1e6) return (num / 1e6).toFixed(1) + " millones";
        return num.toLocaleString();
    }

    function getHardwareCategory(qubits) {
        if (qubits <= 16) {
            return {
                badge: "Cualquier laptop o teléfono",
                badgeClass: "background: #dcfce7; color: #15803d;",
                desc: "Se ejecuta en milisegundos en cualquier dispositivo cotidiano sin esfuerzo.",
                icon: "💻"
            };
        } else if (qubits <= 24) {
            return {
                badge: "Laptop estándar (sin problemas)",
                badgeClass: "background: #dbeafe; color: #1d4ed8;",
                desc: "Usa menos de 256 MB de memoria RAM. Ideal para probar y depurar circuitos.",
                icon: "⚡"
            };
        } else if (qubits <= 28) {
            return {
                badge: "Laptop exigida (alto consumo)",
                badgeClass: "background: #fef3c7; color: #b45309;",
                desc: "Ocupa hasta 4 GB de memoria. Se nota que el ventilador del computador empieza a sonar.",
                icon: "🔥"
            };
        } else if (qubits <= 30) {
            return {
                badge: "¡Límite de un computador común!",
                badgeClass: "background: #fee2e2; color: #b91c1c;",
                desc: "Supera los 16 GB de RAM de una laptop común. El sistema se satura y se congela.",
                icon: "🛑"
            };
        } else if (qubits <= 32) {
            return {
                badge: "Supercomputador con GPU de 80 GB",
                badgeClass: "background: #f3e8ff; color: #7e22ce;",
                desc: "Requiere tarjetas gráficas avanzadas para investigación científica (como NVIDIA A100).",
                icon: "🚀"
            };
        } else if (qubits <= 36) {
            return {
                badge: "Clúster de múltiples GPUs en paralelo",
                badgeClass: "background: #fce7f3; color: #be185d;",
                desc: "Requiere varios nodos de supercomputación interconectados por cables de fibra de alta velocidad.",
                icon: "🏢"
            };
        } else {
            return {
                badge: "Imposible de simular en computadores clásicos",
                badgeClass: "background: #334155; color: #ffffff;",
                desc: "Requeriría más memoria que todos los computadores del planeta combinados.",
                icon: "🌌"
            };
        }
    }

    function getPerformanceStats(qubits) {
        if (qubits <= 16) {
            return {
                cpuTime: "0.009 segundos",
                gpuTime: "0.015 segundos",
                speedup: "0.6× (Retardo inicial de GPU)",
                speedupBadge: "background: #f1f5f9; color: #475569;"
            };
        } else if (qubits <= 18) {
            return {
                cpuTime: "0.043 segundos",
                gpuTime: "0.003 segundos",
                speedup: "13× más rápida",
                speedupBadge: "background: #dbeafe; color: #1e40af;"
            };
        } else if (qubits <= 20) {
            return {
                cpuTime: "0.185 segundos",
                gpuTime: "0.004 segundos",
                speedup: "46× más rápida",
                speedupBadge: "background: #d1fae5; color: #065f46;"
            };
        } else if (qubits <= 22) {
            return {
                cpuTime: "0.583 segundos",
                gpuTime: "0.006 segundos",
                speedup: "98× más rápida",
                speedupBadge: "background: #d1fae5; color: #065f46;"
            };
        } else if (qubits <= 24) {
            return {
                cpuTime: "2.34 segundos",
                gpuTime: "0.014 segundos",
                speedup: "172× más rápida",
                speedupBadge: "background: #fef3c7; color: #92400e;"
            };
        } else if (qubits <= 26) {
            return {
                cpuTime: "10.56 segundos",
                gpuTime: "0.047 segundos",
                speedup: "225× más rápida",
                speedupBadge: "background: #fee2e2; color: #991b1b;"
            };
        } else if (qubits <= 28) {
            return {
                cpuTime: "~45 segundos",
                gpuTime: "~0.18 segundos",
                speedup: ">240× más rápida",
                speedupBadge: "background: #fee2e2; color: #991b1b;"
            };
        } else if (qubits <= 30) {
            return {
                cpuTime: "Falla (Memoria RAM agotada)",
                gpuTime: "~0.8 segundos",
                speedup: "¡GPU Habilitante!",
                speedupBadge: "background: #f3e8ff; color: #6b21a8;"
            };
        } else if (qubits <= 32) {
            return {
                cpuTime: "Inviable en PC común",
                gpuTime: "~3.5 segundos",
                speedup: "Exclusivo de GPU HPC",
                speedupBadge: "background: #f3e8ff; color: #6b21a8;"
            };
        } else {
            return {
                cpuTime: "Inviable",
                gpuTime: "Requiere clúster multi-GPU",
                speedup: "Escala masiva",
                speedupBadge: "background: #334155; color: #ffffff;"
            };
        }
    }

    function render() {
        const dim = Math.pow(2, n);
        // Cada amplitud compleja usa 16 bytes (8 bytes parte real + 8 bytes parte imaginaria)
        const bytesNeeded = dim * 16;
        const hw = getHardwareCategory(n);
        const perf = getPerformanceStats(n);

        container.innerHTML = `
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 22px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); font-family: system-ui, -apple-system, sans-serif;">
            
            <!-- Encabezado -->
            <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div>
                    <h5 style="margin: 0; color: #1e293b; font-weight: 700; font-size: 17px;">
                        ¿Por qué simular computación cuántica satura un computador común?
                    </h5>
                    <span style="font-size: 13px; color: #64748b;">
                        Cada qubit que agregas duplica el tamaño del estado y la memoria necesaria
                    </span>
                </div>
                <div>
                    <span style="${hw.badgeClass} padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 12px;">
                        ${hw.icon} ${hw.badge}
                    </span>
                </div>
            </div>

            <!-- Selector con Slider -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label for="${containerId}_slider" style="font-weight: 700; color: #1e293b; font-size: 14.5px;">
                        Número de Qubits a simular (n):
                    </label>
                    <span style="font-size: 20px; font-weight: 800; color: #2563eb; background: #eff6ff; padding: 2px 14px; border-radius: 8px; border: 1px solid #bfdbfe;">
                        ${n} qubits
                    </span>
                </div>
                <input id="${containerId}_slider" type="range" min="4" max="42" value="${n}" step="1" 
                       style="width: 100%; cursor: pointer; accent-color: #2563eb;" />
                <div style="display: flex; justify-content: space-between; font-size: 11.5px; color: #64748b; margin-top: 4px;">
                    <span>4 qubits (juguete)</span>
                    <span>16 qubits (laptop cómoda)</span>
                    <span>30 qubits (límite de PC)</span>
                    <span>32 qubits (GPU)</span>
                    <span>42 qubits (imposible)</span>
                </div>
            </div>

            <!-- Panel de Resultados Comparativos -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 18px;">
                
                <!-- Dimensión -->
                <div style="background: #fafafa; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px;">
                    <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">
                        Estados simultáneos (2ⁿ)
                    </span>
                    <div style="font-size: 20px; font-weight: 800; color: #1e293b; margin-top: 4px;">
                        ${formatNumber(dim)}
                    </div>
                    <span style="font-size: 11.5px; color: #94a3b8;">
                        2 elevado a la ${n}
                    </span>
                </div>

                <!-- Memoria Requerida -->
                <div style="background: #fafafa; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px;">
                    <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">
                        Memoria RAM necesaria
                    </span>
                    <div style="font-size: 20px; font-weight: 800; color: ${n >= 30 ? '#dc2626' : '#2563eb'}; margin-top: 4px;">
                        ${formatBytes(bytesNeeded)}
                    </div>
                    <span style="font-size: 11.5px; color: #94a3b8;">
                        a 16 bytes por cada estado
                    </span>
                </div>

                <!-- Diagnóstico -->
                <div style="background: #fafafa; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px;">
                    <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">
                        ¿Dónde se puede correr?
                    </span>
                    <div style="font-size: 13.5px; font-weight: 700; color: #334155; margin-top: 4px;">
                        ${hw.badge}
                    </div>
                    <span style="font-size: 11.5px; color: #64748b;">
                        ${hw.desc}
                    </span>
                </div>
            </div>

            <!-- Comparativa de Rendimiento y Tiempo Real CPU vs GPU -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 6px;">
                    <span style="font-size: 13px; font-weight: 700; color: #1e293b;">
                        ⏱️ Tiempo de simulación por circuito (Benchmark Real):
                    </span>
                    <span style="${perf.speedupBadge} font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 12px;">
                        ${perf.speedup}
                    </span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; font-size: 12.5px;">
                    <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 9px 12px;">
                        <span style="color: #64748b; font-size: 11px; font-weight: 600;">CPU de estación (16 núcleos):</span>
                        <div style="font-weight: 800; font-size: 15px; color: ${n >= 30 ? '#dc2626' : '#334155'}; margin-top: 2px;">
                            ${perf.cpuTime}
                        </div>
                    </div>
                    <div style="background: #ffffff; border: 1px solid #86efac; border-radius: 8px; padding: 9px 12px;">
                        <span style="color: #047857; font-size: 11px; font-weight: 600;">GPU NVIDIA A100 (cuQuantum):</span>
                        <div style="font-weight: 800; font-size: 15px; color: #059669; margin-top: 2px;">
                            ${perf.gpuTime}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Explicación Conceptual Sencilla -->
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #166534; line-height: 1.5;">
                <strong>💡 La clave intuitiva:</strong> Cada compuerta cuántica obliga a leer y actualizar todos estos millones de números. Una tarjeta gráfica moderna no solo tiene mucha memoria rápida, sino que puede transferir datos a más de <strong>2000 GB por segundo</strong>, permitiendo simular en segundos lo que a un procesador convencional le tomaría horas o directamente le provocaría un colapso.
            </div>
        </div>
        `;

        const slider = document.getElementById(`${containerId}_slider`);
        if (slider) {
            slider.oninput = (e) => {
                n = parseInt(e.target.value);
                render();
            };
        }
    }

    render();
}
