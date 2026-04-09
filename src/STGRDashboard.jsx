import { useState, useEffect, useRef } from "react";

const STEPS = [
  {
    id: 1,
    subsystem: "S1 — Plant Digital Twin",
    label: "Plant Digital Twin",
    color: "#f59e0b",
    icon: "⚛",
    title: "Digital Twin Flags Anomaly",
    desc: "Primary-to-secondary leak detected. Coolant pressure dropping at 0.3 bar/min. Predictive 120-second look-ahead shows critical threshold breach in 4 minutes.",
    metrics: [
      { label: "Reactor Temp", value: "312°C", status: "warn" },
      { label: "Primary Pressure", value: "↓ 14.2 bar", status: "critical" },
      { label: "Coolant Flow", value: "Anomalous", status: "critical" },
      { label: "SG Level", value: "Rising", status: "warn" },
    ],
  },
  {
    id: 2,
    subsystem: "S2 — Human Performance Monitoring",
    label: "Human Performance Monitoring",
    color: "#ef4444",
    icon: "👁",
    title: "Human Performance Monitoring: Operator Distress Detected",
    desc: "Operator gaze locked on Panel C (Turbine). Root cause Panel A (SG Level) unobserved for 38s. Heart rate: 112 bpm. Attention tunneling confirmed via eye-tracking.",
    metrics: [
      { label: "Heart Rate", value: "112 bpm", status: "critical" },
      { label: "Gaze Focus", value: "Panel C ✗", status: "critical" },
      { label: "Response Time", value: "+2.8s delay", status: "warn" },
      { label: "Cognitive State", value: "STRESSED", status: "critical" },
    ],
  },
  {
    id: 3,
    subsystem: "S3 — Situation Assessment",
    label: "Situation Assessment",
    color: "#dc2626",
    icon: "⚠",
    title: "Situation Assessment: Critical Combined Risk Flagged",
    desc: "Combined Risk Score: 9.4/10 — CRITICAL. S1 plant leak data merged with S2 human state. Plant Leak severity + Human Overload = maximum vulnerability window.",
    metrics: [
      { label: "Plant Risk", value: "HIGH", status: "critical" },
      { label: "Human Readiness", value: "LOW", status: "critical" },
      { label: "Combined Score", value: "9.4 / 10", status: "critical" },
      { label: "Alert Priority", value: "CRITICAL", status: "critical" },
    ],
  },
  {
    id: 4,
    subsystem: "S4 — Decision Support",
    label: "Decision Support",
    color: "#8b5cf6",
    icon: "🤖",
    title: "Decision Support: Dual-AI Agent Gating",
    desc: 'Agent B (Action Assistant): "Isolate the Steam Generator." ✓ Technically valid. Agent A (Safety Supervisor): "Operator has NOT verified SG Level gauge. GATE the action button."',
    metrics: [
      { label: "Agent B Proposal", value: "Isolate SG", status: "ok" },
      { label: "Agent A Gate", value: "BLOCKED", status: "critical" },
      { label: "Reason", value: "No SA confirmed", status: "warn" },
      { label: "Mode", value: "GUIDED", status: "warn" },
    ],
  },
  {
    id: 5,
    subsystem: "S5 — Adaptive Interface",
    label: "Adaptive Interface",
    color: "#0ea5e9",
    icon: "🖥",
    title: "Adaptive Interface: Attentional Guidance Activated",
    desc: 'UI dims non-essential panels. Glowing border appears on SG Level Gauge. "Isolate" button grayed out: "Verify SG Levels to Unlock Action." Operator gaze redirected.',
    metrics: [
      { label: "UI Mode", value: "GUIDED", status: "ok" },
      { label: "Dimmed Panels", value: "4 of 6", status: "warn" },
      { label: "Highlighted", value: "SG Level Gauge", status: "ok" },
      { label: "Action Button", value: "LOCKED 🔒", status: "critical" },
    ],
  },
  {
    id: 6,
    subsystem: "S5 + S2 — Adaptive Interface & Human Performance Monitoring",
    label: "Resolution",
    color: "#10b981",
    icon: "✅",
    title: "Adaptive Interface + Human Performance Monitoring: Operator Verified",
    desc: "Human Performance Monitoring confirms gaze on SG Level Gauge. Heart rate: 84 bpm (stable). Adaptive Interface unlocks action button. Isolation executed with full Situation Awareness.",
    metrics: [
      { label: "Gaze Target", value: "SG Gauge ✓", status: "ok" },
      { label: "Heart Rate", value: "84 bpm", status: "ok" },
      { label: "Action Button", value: "UNLOCKED 🔓", status: "ok" },
      { label: "SA Level", value: "FULL", status: "ok" },
    ],
  },
  {
    id: 7,
    subsystem: "S6 — Scenario Evaluation",
    label: "Scenario Evaluation",
    color: "#06b6d4",
    icon: "📊",
    title: "Scenario Evaluation: System Performance Logged",
    desc: "Scenario Evaluation Subsystem records all interactions and generates Resiliency Scores. Recovery time 40% faster vs. unassisted operator. Verification errors reduced 86.6%.",
    metrics: [
      { label: "Recovery Time", value: "↓ 40% faster", status: "ok" },
      { label: "Verify Errors", value: "↓ 86.6%", status: "ok" },
      { label: "SA Recovery", value: "54s → 12s", status: "ok" },
      { label: "Resiliency", value: "+38%", status: "ok" },
    ],
  },
];

const statusColor = { ok: "#10b981", warn: "#f59e0b", critical: "#ef4444" };
const statusBg = { ok: "#052e16", warn: "#1c1209", critical: "#1f0909" };

export default function SGTRDashboard() {
  const [activeStep, setActiveStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [glowSG, setGlowSG] = useState(false);
  const [locked, setLocked] = useState(true);
  const [hr, setHr] = useState(112);
  const intervalRef = useRef(null);

  const step = STEPS[activeStep];

  useEffect(() => {
    setGlowSG(activeStep === 4 || activeStep === 5);
    setLocked(activeStep < 5);
    setHr(activeStep >= 5 ? 84 : activeStep >= 1 ? 112 : 72);
  }, [activeStep]);

  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 600);
    return () => clearTimeout(t);
  }, [activeStep]);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setActiveStep((s) => {
          if (s >= STEPS.length - 1) { setPlaying(false); return s; }
          return s + 1;
        });
      }, 3200);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  const go = (i) => { setPlaying(false); setActiveStep(i); };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#070c14",
      color: "#e2e8f0",
      fontFamily: "'Courier New', 'Lucida Console', monospace",
      padding: "0",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(90deg, #0a1628 0%, #0f1f3d 50%, #0a1628 100%)",
        borderBottom: "1px solid #1e3a5f",
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            background: activeStep >= 2 ? "#ef4444" : "#10b981",
            boxShadow: `0 0 12px ${activeStep >= 2 ? "#ef4444" : "#10b981"}`,
            animation: "blink 1.2s ease-in-out infinite",
          }} />
          <span style={{ fontSize: 11, letterSpacing: 4, color: "#64748b", textTransform: "uppercase" }}>SMR-DualGuard</span>
          <span style={{ fontSize: 11, letterSpacing: 4, color: "#3b82f6" }}>// SGTR Simulation</span>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 11, color: "#475569", letterSpacing: 2 }}>
          <span>UNIT 1 — ONTARIO SMR</span>
          <span style={{ color: activeStep >= 2 ? "#ef4444" : "#10b981" }}>
            {activeStep >= 3 ? "⚠ CRITICAL RISK" : activeStep >= 1 ? "⚠ ELEVATED" : "● NOMINAL"}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, gap: 0 }}>

        {/* Left: Step Timeline */}
        <div style={{
          width: 260,
          background: "#080e1a",
          borderRight: "1px solid #1e3a5f",
          padding: "24px 0",
          flexShrink: 0,
        }}>
          <div style={{ padding: "0 16px 16px", fontSize: 9, letterSpacing: 4, color: "#475569", textTransform: "uppercase" }}>
            Scenario Sequence
          </div>
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              onClick={() => go(i)}
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                background: i === activeStep ? "#0f1f3d" : "transparent",
                borderLeft: i === activeStep ? `3px solid ${s.color}` : "3px solid transparent",
                borderRight: i < activeStep ? `3px solid ${s.color}33` : "3px solid transparent",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: i < activeStep ? s.color + "33" : i === activeStep ? s.color + "22" : "#0f172a",
                border: `1px solid ${i <= activeStep ? s.color : "#1e3a5f"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12,
                flexShrink: 0,
              }}>
                {i < activeStep ? "✓" : s.id}
              </div>
              <div>
                <div style={{ fontSize: 9, color: i <= activeStep ? s.color : "#475569", letterSpacing: 2, textTransform: "uppercase" }}>
                  {s.subsystem}
                </div>
                <div style={{ fontSize: 11, color: i === activeStep ? "#e2e8f0" : "#64748b", marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Center: Main Stage */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Step Header */}
          <div style={{
            padding: "24px 32px 20px",
            background: `linear-gradient(135deg, #080e1a 0%, ${step.color}08 100%)`,
            borderBottom: "1px solid #1e3a5f",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{
                  fontSize: 9, letterSpacing: 4, textTransform: "uppercase",
                  color: step.color, marginBottom: 8, display: "flex", alignItems: "center", gap: 8
                }}>
                  <span>{step.icon}</span>
                  <span>{step.subsystem}</span>
                </div>
                <h2 style={{
                  margin: 0, fontSize: 22, fontWeight: "bold",
                  color: "#f1f5f9", letterSpacing: 1,
                  animation: pulse ? "fadeIn 0.4s ease" : "none",
                }}>
                  {step.title}
                </h2>
                <p style={{ margin: "10px 0 0", fontSize: 13, color: "#94a3b8", lineHeight: 1.7, maxWidth: 600 }}>
                  {step.desc}
                </p>
              </div>
              <div style={{
                background: step.color + "18",
                border: `1px solid ${step.color}44`,
                borderRadius: 8,
                padding: "8px 16px",
                fontSize: 11,
                color: step.color,
                letterSpacing: 2,
                textAlign: "center",
                flexShrink: 0,
              }}>
                STEP {activeStep + 1} / {STEPS.length}
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div style={{ padding: "20px 32px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {step.metrics.map((m) => (
              <div key={m.label} style={{
                background: statusBg[m.status],
                border: `1px solid ${statusColor[m.status]}44`,
                borderRadius: 8,
                padding: "14px 16px",
                transition: "all 0.4s",
              }}>
                <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>{m.label}</div>
                <div style={{ fontSize: 16, fontWeight: "bold", color: statusColor[m.status] }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Reactor Panel */}
          <div style={{ padding: "0 32px 20px", flex: 1 }}>
            <div style={{
              background: "#080e1a",
              border: "1px solid #1e3a5f",
              borderRadius: 12,
              padding: 24,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16,
            }}>
              {/* SG Level Gauge - highlighted in step 5 */}
              <div style={{
                gridColumn: "1",
                background: "#0a1220",
                border: glowSG
                  ? "2px solid #0ea5e9"
                  : "1px solid #1e3a5f",
                borderRadius: 10,
                padding: 18,
                boxShadow: glowSG ? "0 0 24px #0ea5e944, inset 0 0 16px #0ea5e911" : "none",
                transition: "all 0.6s",
                position: "relative",
              }}>
                {glowSG && (
                  <div style={{
                    position: "absolute", top: -1, left: -1, right: -1, bottom: -1,
                    borderRadius: 10,
                    border: "2px solid #0ea5e9",
                    animation: "sgGlow 1.2s ease-in-out infinite alternate",
                  }} />
                )}
                <div style={{ fontSize: 9, color: glowSG ? "#0ea5e9" : "#475569", letterSpacing: 3, marginBottom: 8 }}>
                  {glowSG ? "▶ SG LEVEL GAUGE ◀" : "SG LEVEL GAUGE"}
                </div>
                <GaugeBar value={activeStep >= 1 ? 78 : 52} max={100} color="#0ea5e9" label="Secondary Level" unit="%" />
                <div style={{ marginTop: 10, fontSize: 10, color: "#64748b" }}>Status: <span style={{ color: "#f59e0b" }}>RISING</span></div>
              </div>

              {/* Primary Pressure */}
              <div style={{
                background: "#0a1220",
                border: activeStep >= 1 ? "1px solid #ef444444" : "1px solid #1e3a5f",
                borderRadius: 10,
                padding: 18,
                opacity: glowSG && activeStep === 4 ? 0.35 : 1,
                transition: "all 0.6s",
              }}>
                <div style={{ fontSize: 9, color: "#475569", letterSpacing: 3, marginBottom: 8 }}>PRIMARY PRESSURE</div>
                <GaugeBar value={activeStep >= 1 ? 62 : 88} max={100} color={activeStep >= 1 ? "#ef4444" : "#10b981"} label="Pressure" unit="bar" maxVal={160} />
                <div style={{ marginTop: 10, fontSize: 10, color: "#64748b" }}>Status: <span style={{ color: activeStep >= 1 ? "#ef4444" : "#10b981" }}>{activeStep >= 1 ? "DROPPING" : "NOMINAL"}</span></div>
              </div>

              {/* Reactor Temp */}
              <div style={{
                background: "#0a1220",
                border: "1px solid #1e3a5f",
                borderRadius: 10,
                padding: 18,
                opacity: glowSG && activeStep === 4 ? 0.35 : 1,
                transition: "all 0.6s",
              }}>
                <div style={{ fontSize: 9, color: "#475569", letterSpacing: 3, marginBottom: 8 }}>REACTOR TEMP</div>
                <GaugeBar value={activeStep >= 1 ? 74 : 65} max={100} color="#f59e0b" label="Core Temp" unit="°C" maxVal={420} />
                <div style={{ marginTop: 10, fontSize: 10, color: "#64748b" }}>Status: <span style={{ color: "#f59e0b" }}>ELEVATED</span></div>
              </div>

              {/* Operator Panel */}
              <div style={{
                gridColumn: "1 / 3",
                background: "#0a1220",
                border: "1px solid #1e3a5f",
                borderRadius: 10,
                padding: 18,
              }}>
                <div style={{ fontSize: 9, color: "#475569", letterSpacing: 3, marginBottom: 14 }}>OPERATOR BIOMETRICS</div>
                <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                  <HeartRateViz bpm={hr} />
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>Gaze Target</div>
                      <div style={{
                        fontSize: 13,
                        color: activeStep >= 5 ? "#10b981" : activeStep >= 1 ? "#ef4444" : "#10b981",
                        fontWeight: "bold",
                      }}>
                        {activeStep >= 5 ? "✓ SG Level Gauge (Panel A)" : activeStep >= 1 ? "✗ Turbine Panel (Panel C)" : "Panel A — Normal"}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>Cognitive State</div>
                      <div style={{
                        fontSize: 13,
                        color: activeStep >= 5 ? "#10b981" : activeStep >= 1 ? "#ef4444" : "#10b981",
                        fontWeight: "bold",
                      }}>
                        {activeStep >= 5 ? "STABLE — Full Situation Awareness" : activeStep >= 1 ? "STRESSED — Attention Tunneling" : "NORMAL"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div style={{
                background: "#0a1220",
                border: "1px solid #1e3a5f",
                borderRadius: 10,
                padding: 18,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}>
                <div style={{ fontSize: 9, color: "#475569", letterSpacing: 3 }}>RECOMMENDED ACTION</div>
                <div style={{ fontSize: 12, color: "#8b5cf6", textAlign: "center" }}>
                  Agent B: Isolate Steam Generator
                </div>
                <button
                  disabled={locked}
                  style={{
                    padding: "12px 24px",
                    borderRadius: 8,
                    border: locked ? "1px solid #374151" : "1px solid #10b981",
                    background: locked ? "#111827" : "#052e16",
                    color: locked ? "#4b5563" : "#10b981",
                    fontSize: 12,
                    letterSpacing: 2,
                    cursor: locked ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.5s",
                    boxShadow: locked ? "none" : "0 0 16px #10b98144",
                    width: "100%",
                  }}
                >
                  {locked && activeStep >= 3
                    ? "🔒 VERIFY SG LEVELS TO UNLOCK"
                    : locked
                    ? "ISOLATE SG"
                    : "🔓 ISOLATE STEAM GENERATOR"}
                </button>
                {locked && activeStep >= 3 && (
                  <div style={{ fontSize: 10, color: "#ef4444", textAlign: "center", letterSpacing: 1 }}>
                    Agent A: Gate active — awaiting operator SA confirmation
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: System Log */}
        <div style={{
          width: 260,
          background: "#080e1a",
          borderLeft: "1px solid #1e3a5f",
          padding: "24px 0",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{ padding: "0 16px 16px", fontSize: 9, letterSpacing: 4, color: "#475569", textTransform: "uppercase" }}>
            System Log
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: "0 16px" }}>
            {STEPS.slice(0, activeStep + 1).reverse().map((s, i) => (
              <div key={s.id} style={{
                marginBottom: 14,
                padding: "10px 12px",
                background: i === 0 ? s.color + "14" : "#0a1220",
                border: `1px solid ${i === 0 ? s.color + "44" : "#1e3a5f"}`,
                borderRadius: 8,
                opacity: i === 0 ? 1 : 0.6,
              }}>
                <div style={{ fontSize: 8, color: s.color, letterSpacing: 3, marginBottom: 4 }}>{s.subsystem}</div>
                <div style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.5 }}>{s.title}</div>
              </div>
            ))}
          </div>

          {/* Evaluation Results (show on last step) */}
          {activeStep === 6 && (
            <div style={{
              margin: "0 16px",
              padding: 16,
              background: "#052e16",
              border: "1px solid #10b98144",
              borderRadius: 10,
            }}>
              <div style={{ fontSize: 9, color: "#10b981", letterSpacing: 3, marginBottom: 10 }}>FINAL EVALUATION</div>
              {[
                ["Recovery Time", "↓ 40%"],
                ["Verify Errors", "↓ 86.6%"],
                ["SA Recovery", "54s→12s"],
                ["Resiliency", "+38%"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 10, color: "#64748b" }}>{k}</span>
                  <span style={{ fontSize: 10, color: "#10b981", fontWeight: "bold" }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div style={{
        background: "#080e1a",
        borderTop: "1px solid #1e3a5f",
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}>
        <div style={{ display: "flex", gap: 10 }}>
          <CtrlBtn onClick={() => go(Math.max(0, activeStep - 1))} disabled={activeStep === 0}>◀ Prev</CtrlBtn>
          <CtrlBtn
            onClick={() => setPlaying((p) => !p)}
            accent={playing}
          >
            {playing ? "⏸ Pause" : "▶ Play"}
          </CtrlBtn>
          <CtrlBtn onClick={() => go(Math.min(STEPS.length - 1, activeStep + 1))} disabled={activeStep === STEPS.length - 1}>Next ▶</CtrlBtn>
          <CtrlBtn onClick={() => { setPlaying(false); go(0); }}>↺ Reset</CtrlBtn>
        </div>

        {/* Progress */}
        <div style={{ flex: 1, maxWidth: 400 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 9, color: "#475569", letterSpacing: 2 }}>
            <span>SCENARIO PROGRESS</span>
            <span>{Math.round(((activeStep + 1) / STEPS.length) * 100)}%</span>
          </div>
          <div style={{ height: 4, background: "#1e293b", borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${((activeStep + 1) / STEPS.length) * 100}%`,
              background: `linear-gradient(90deg, #3b82f6, ${step.color})`,
              borderRadius: 4,
              transition: "width 0.5s ease",
            }} />
          </div>
        </div>

        <div style={{ fontSize: 9, color: "#334155", letterSpacing: 2 }}>CITech 2026 — SMR-DualGuard</div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes sgGlow { from{box-shadow:0 0 16px #0ea5e966} to{box-shadow:0 0 32px #0ea5e9cc} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
      `}</style>
    </div>
  );
}

function GaugeBar({ value, max = 100, color, label, unit, maxVal }) {
  const pct = (value / max) * 100;
  const display = maxVal ? Math.round((value / max) * maxVal) : value;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 10, color: "#94a3b8" }}>
        <span>{label}</span>
        <span style={{ color, fontWeight: "bold" }}>{display}{unit}</span>
      </div>
      <div style={{ height: 8, background: "#1e293b", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 4,
          transition: "width 0.8s ease",
          boxShadow: `0 0 8px ${color}66`,
        }} />
      </div>
    </div>
  );
}

function HeartRateViz({ bpm }) {
  return (
    <div style={{ textAlign: "center", flexShrink: 0 }}>
      <div style={{
        fontSize: 28,
        fontWeight: "bold",
        color: bpm > 100 ? "#ef4444" : "#10b981",
        animation: "pulse 0.6s ease-in-out infinite",
        display: "inline-block",
        transition: "color 0.5s",
      }}>♥</div>
      <div style={{ fontSize: 20, fontWeight: "bold", color: bpm > 100 ? "#ef4444" : "#10b981", transition: "color 0.5s" }}>{bpm}</div>
      <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 2 }}>BPM</div>
    </div>
  );
}

function CtrlBtn({ children, onClick, disabled, accent }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "8px 16px",
        background: accent ? "#1e3a5f" : "#0f172a",
        border: `1px solid ${accent ? "#3b82f6" : "#1e3a5f"}`,
        borderRadius: 6,
        color: disabled ? "#334155" : accent ? "#3b82f6" : "#94a3b8",
        fontSize: 11,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        letterSpacing: 1,
        transition: "all 0.2s",
      }}
    >
      {children}
    </button>
  );
}