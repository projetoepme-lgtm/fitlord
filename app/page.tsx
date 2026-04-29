"use client";

import { useState } from "react";

// ─── Tipos ───────────────────────────────────────────────
type Tab = "dashboard" | "treinos" | "dietas" | "progresso";
type AuthPage = "login" | "register";

interface User {
  name: string;
  email: string;
}

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
}

interface WorkoutDay {
  day: string;
  focus: string;
  emoji: string;
  exercises: Exercise[];
  done: boolean;
}

interface Meal {
  name: string;
  items: string[];
  kcal: number;
}

interface DietDay {
  day: string;
  meals: Meal[];
}

// ─── Dados ───────────────────────────────────────────────
const WORKOUTS: WorkoutDay[] = [
  {
    day: "Segunda", focus: "Peito + Tríceps", emoji: "💪", done: false,
    exercises: [
      { name: "Supino Reto", sets: "4", reps: "10-12", rest: "90s" },
      { name: "Supino Inclinado", sets: "3", reps: "10", rest: "90s" },
      { name: "Crucifixo", sets: "3", reps: "12", rest: "60s" },
      { name: "Tríceps Corda", sets: "3", reps: "15", rest: "60s" },
      { name: "Tríceps Francês", sets: "3", reps: "12", rest: "60s" },
    ],
  },
  {
    day: "Terça", focus: "Costas + Bíceps", emoji: "🏋️", done: false,
    exercises: [
      { name: "Barra Fixa", sets: "4", reps: "8-10", rest: "90s" },
      { name: "Remada Curvada", sets: "4", reps: "10", rest: "90s" },
      { name: "Remada Unilateral", sets: "3", reps: "12", rest: "60s" },
      { name: "Rosca Direta", sets: "3", reps: "12", rest: "60s" },
      { name: "Rosca Martelo", sets: "3", reps: "12", rest: "60s" },
    ],
  },
  {
    day: "Quarta", focus: "Descanso Ativo", emoji: "🧘", done: false,
    exercises: [
      { name: "Caminhada", sets: "1", reps: "30 min", rest: "-" },
      { name: "Alongamento", sets: "1", reps: "20 min", rest: "-" },
    ],
  },
  {
    day: "Quinta", focus: "Ombros + Abdômen", emoji: "🎯", done: false,
    exercises: [
      { name: "Desenvolvimento", sets: "4", reps: "10", rest: "90s" },
      { name: "Elevação Lateral", sets: "3", reps: "15", rest: "60s" },
      { name: "Elevação Frontal", sets: "3", reps: "12", rest: "60s" },
      { name: "Prancha", sets: "3", reps: "60s", rest: "45s" },
      { name: "Abdominal Crunch", sets: "3", reps: "20", rest: "45s" },
    ],
  },
  {
    day: "Sexta", focus: "Pernas", emoji: "🦵", done: false,
    exercises: [
      { name: "Agachamento", sets: "4", reps: "10-12", rest: "120s" },
      { name: "Leg Press", sets: "4", reps: "12", rest: "90s" },
      { name: "Cadeira Extensora", sets: "3", reps: "15", rest: "60s" },
      { name: "Mesa Flexora", sets: "3", reps: "12", rest: "60s" },
      { name: "Panturrilha em Pé", sets: "4", reps: "20", rest: "45s" },
    ],
  },
  {
    day: "Sábado", focus: "Full Body Funcional", emoji: "⚡", done: false,
    exercises: [
      { name: "Burpee", sets: "3", reps: "10", rest: "60s" },
      { name: "Swing Kettlebell", sets: "3", reps: "15", rest: "60s" },
      { name: "Polichinelo", sets: "3", reps: "30", rest: "45s" },
      { name: "Escalador", sets: "3", reps: "20", rest: "45s" },
    ],
  },
  {
    day: "Domingo", focus: "Descanso Total", emoji: "😴", done: false,
    exercises: [
      { name: "Recuperação", sets: "-", reps: "Descanso", rest: "-" },
    ],
  },
];

const DIET: DietDay[] = [
  {
    day: "Segunda", meals: [
      { name: "Café da Manhã", items: ["Ovos mexidos (3 un)", "Pão integral", "Banana", "Café sem açúcar"], kcal: 480 },
      { name: "Almoço", items: ["Frango grelhado 150g", "Arroz integral 1 xíc", "Feijão 1/2 xíc", "Salada verde"], kcal: 620 },
      { name: "Lanche", items: ["Iogurte grego", "Granola 30g", "Morango"], kcal: 280 },
      { name: "Jantar", items: ["Tilápia 150g", "Batata-doce 200g", "Brócolis"], kcal: 420 },
    ],
  },
  {
    day: "Terça", meals: [
      { name: "Café da Manhã", items: ["Vitamina de banana com aveia", "Ovos cozidos (2 un)"], kcal: 430 },
      { name: "Almoço", items: ["Carne vermelha magra 150g", "Macarrão integral", "Legumes refogados"], kcal: 650 },
      { name: "Lanche", items: ["Mix de castanhas 30g", "Maçã"], kcal: 250 },
      { name: "Jantar", items: ["Frango 150g", "Quinoa", "Espinafre"], kcal: 400 },
    ],
  },
  {
    day: "Quarta", meals: [
      { name: "Café da Manhã", items: ["Tapioca com atum", "Suco de laranja natural"], kcal: 410 },
      { name: "Almoço", items: ["Salmão grelhado 150g", "Arroz branco", "Salada colorida"], kcal: 580 },
      { name: "Lanche", items: ["Whey Protein", "Fruta"], kcal: 220 },
      { name: "Jantar", items: ["Omelete de 3 ovos", "Pão integral", "Queijo branco"], kcal: 450 },
    ],
  },
  {
    day: "Quinta", meals: [
      { name: "Café da Manhã", items: ["Açaí com granola e banana"], kcal: 520 },
      { name: "Almoço", items: ["Frango 150g", "Lentilha", "Arroz integral", "Cenoura"], kcal: 600 },
      { name: "Lanche", items: ["Cottage com torrada integral"], kcal: 240 },
      { name: "Jantar", items: ["Atum 120g", "Batata-doce", "Abobrinha grelhada"], kcal: 380 },
    ],
  },
  {
    day: "Sexta", meals: [
      { name: "Café da Manhã", items: ["Pão integral com pasta de amendoim", "Banana", "Café"], kcal: 490 },
      { name: "Almoço", items: ["Fraldinha 150g", "Arroz + feijão", "Couve refogada"], kcal: 680 },
      { name: "Lanche", items: ["Iogurte grego + mel + nozes"], kcal: 310 },
      { name: "Jantar", items: ["Frango 130g", "Cuscuz", "Tomate + pepino"], kcal: 420 },
    ],
  },
  {
    day: "Sábado", meals: [
      { name: "Café da Manhã", items: ["Panqueca de aveia (3 un)", "Mel", "Frutas vermelhas"], kcal: 460 },
      { name: "Almoço", items: ["Churrasco de frango", "Vinagrete", "Pão de queijo (1 un)"], kcal: 700 },
      { name: "Lanche", items: ["Whey + leite vegetal + banana"], kcal: 280 },
      { name: "Jantar", items: ["Sopa de legumes com frango"], kcal: 360 },
    ],
  },
  {
    day: "Domingo", meals: [
      { name: "Café da Manhã", items: ["Ovos beneditinos + torrada", "Suco verde"], kcal: 510 },
      { name: "Almoço", items: ["Arroz, feijão, frango, farofa (refeição livre moderada)"], kcal: 780 },
      { name: "Lanche", items: ["Frutas de época"], kcal: 180 },
      { name: "Jantar", items: ["Frango desfiado + aipim cozido"], kcal: 430 },
    ],
  },
];

// ─── COMPONENTES DE ÍCONES SVG ──────────────────────────
const IconDumbbell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 6.5h11M6.5 17.5h11M3 9.5h2v5H3zM19 9.5h2v5h-2zM6.5 9.5v5M17.5 9.5v5"/>
  </svg>
);
const IconSalad = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 19h18M3 9c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/>
    <path d="M8 7V5c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);
const IconDashboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const IconChart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconLock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconFire = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"/>
  </svg>
);
const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

// ─── TELA DE LOGIN ────────────────────────────────────────
function AuthScreen({ onLogin }: { onLogin: (user: User) => void }) {
  const [page, setPage] = useState<AuthPage>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (page === "login") {
      if (!email || !password) { setError("Preencha todos os campos."); return; }
      onLogin({ name: email.split("@")[0], email });
    } else {
      if (!name || !email || !password) { setError("Preencha todos os campos."); return; }
      if (password.length < 6) { setError("Senha deve ter ao menos 6 caracteres."); return; }
      onLogin({ name, email });
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(135deg, #0a1628 0%, #0d2461 50%, #1a3a8f 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      {/* Círculos decorativos */}
      <div style={{ position: "fixed", top: "-10%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: "rgba(59,130,246,0.08)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-15%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: "rgba(99,102,241,0.06)", pointerEvents: "none" }} />

      <div style={{
        background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24,
        padding: "48px 40px", width: "100%", maxWidth: 420,
        boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg,#3b82f6,#6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28,
          }}>💪</div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#fff", letterSpacing: -0.5 }}>FitPlan</h1>
          <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
            {page === "login" ? "Bem-vindo de volta!" : "Crie sua conta grátis"}
          </p>
        </div>

        {/* Tabs login/cadastro */}
        <div style={{ display: "flex", background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: 4, marginBottom: 28 }}>
          {(["login", "register"] as AuthPage[]).map(p => (
            <button key={p} onClick={() => { setPage(p); setError(""); }} style={{
              flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
              background: page === p ? "rgba(59,130,246,0.9)" : "transparent",
              color: page === p ? "#fff" : "rgba(255,255,255,0.5)",
              transition: "all .2s",
            }}>
              {p === "login" ? "Entrar" : "Cadastrar"}
            </button>
          ))}
        </div>

        {/* Campos */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {page === "register" && (
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Nome</span>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)" }}><IconUser /></span>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome completo"
                  style={{
                    width: "100%", padding: "12px 14px 12px 44px", background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "#fff", fontSize: 15,
                    outline: "none", boxSizing: "border-box",
                  }} />
              </div>
            </label>
          )}
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>E-mail</span>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)" }}><IconMail /></span>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" type="email"
                style={{
                  width: "100%", padding: "12px 14px 12px 44px", background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "#fff", fontSize: 15,
                  outline: "none", boxSizing: "border-box",
                }} />
            </div>
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Senha</span>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)" }}><IconLock /></span>
              <input value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" type="password"
                style={{
                  width: "100%", padding: "12px 14px 12px 44px", background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "#fff", fontSize: 15,
                  outline: "none", boxSizing: "border-box",
                }} />
            </div>
          </label>

          {error && <p style={{ margin: 0, color: "#f87171", fontSize: 13, textAlign: "center" }}>{error}</p>}

          <button onClick={handleSubmit} style={{
            marginTop: 8, padding: "14px", background: "linear-gradient(135deg,#3b82f6,#6366f1)",
            border: "none", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 20px rgba(59,130,246,0.4)", transition: "transform .15s, box-shadow .15s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
          >
            {page === "login" ? "Entrar na conta" : "Criar conta"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────
export default function FitPlanApp() {
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [workouts, setWorkouts] = useState<WorkoutDay[]>(WORKOUTS);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedDiet, setSelectedDiet] = useState<number | null>(null);
  const [weight, setWeight] = useState<number[]>([80, 79.5, 79, 78.2, 78, 77.5, 77.1]);

  if (!user) return <AuthScreen onLogin={u => setUser(u)} />;

  const doneDays = workouts.filter(w => w.done).length;
  const totalKcal = DIET[0].meals.reduce((s, m) => s + m.kcal, 0);

  const toggleDone = (i: number) => {
    setWorkouts(prev => prev.map((w, idx) => idx === i ? { ...w, done: !w.done } : w));
  };

  // Barra lateral
  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <IconDashboard /> },
    { id: "treinos", label: "Treinos", icon: <IconDumbbell /> },
    { id: "dietas", label: "Dietas", icon: <IconSalad /> },
    { id: "progresso", label: "Progresso", icon: <IconChart /> },
  ];

  const s = {
    app: {
      display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif",
      background: "#f0f4ff",
    } as React.CSSProperties,
    sidebar: {
      width: 240, background: "linear-gradient(180deg, #0d2461 0%, #1a3a8f 100%)",
      display: "flex", flexDirection: "column" as const, padding: "24px 16px",
      position: "fixed" as const, top: 0, left: 0, height: "100vh", zIndex: 100,
      boxShadow: "4px 0 24px rgba(13,36,97,0.3)",
    },
    main: { marginLeft: 240, flex: 1, padding: "32px 36px", minHeight: "100vh" } as React.CSSProperties,
    navBtn: (active: boolean): React.CSSProperties => ({
      display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12,
      border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, textAlign: "left",
      background: active ? "rgba(255,255,255,0.15)" : "transparent",
      color: active ? "#fff" : "rgba(255,255,255,0.55)",
      borderLeft: active ? "3px solid #60a5fa" : "3px solid transparent",
      transition: "all .2s", width: "100%",
    }),
    card: {
      background: "#fff", borderRadius: 16, padding: "20px 24px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.05)",
    } as React.CSSProperties,
    badge: (color: string): React.CSSProperties => ({
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
      background: color === "blue" ? "#dbeafe" : color === "green" ? "#dcfce7" : "#fef3c7",
      color: color === "blue" ? "#1d4ed8" : color === "green" ? "#15803d" : "#92400e",
    }),
  };

  // ─── DASHBOARD ──────────────────────────────────────────
  const Dashboard = () => (
    <div>
      <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700, color: "#0f172a" }}>
        Olá, {user.name.charAt(0).toUpperCase() + user.name.slice(1)}! 👋
      </h1>
      <p style={{ margin: "0 0 28px", color: "#64748b", fontSize: 15 }}>Aqui está um resumo da sua semana</p>

      {/* Cards de stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Treinos feitos", value: `${doneDays}/7`, sub: "esta semana", color: "#3b82f6", bg: "#eff6ff", icon: "💪" },
          { label: "Calorias hoje", value: `${totalKcal} kcal`, sub: "meta: 1800 kcal", color: "#10b981", bg: "#f0fdf4", icon: "🔥" },
          { label: "Peso atual", value: `${weight[weight.length - 1]} kg`, sub: `↓ ${(weight[0] - weight[weight.length - 1]).toFixed(1)} kg`, color: "#6366f1", bg: "#f5f3ff", icon: "⚖️" },
          { label: "Sequência", value: `${doneDays} dias`, sub: "em alta!", color: "#f59e0b", bg: "#fffbeb", icon: "🏆" },
        ].map(c => (
          <div key={c.label} style={{ ...s.card, borderTop: `4px solid ${c.color}` }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginTop: 2 }}>{c.label}</div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Treinos desta semana */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={s.card}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#0f172a" }}>📅 Treinos da Semana</h3>
          {workouts.map((w, i) => (
            <div key={i} onClick={() => { setSelectedDay(i); setTab("treinos"); }} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
              borderRadius: 10, marginBottom: 6, cursor: "pointer",
              background: w.done ? "#f0fdf4" : "#f8fafc",
              border: `1px solid ${w.done ? "#bbf7d0" : "#e2e8f0"}`,
              transition: "all .15s",
            }}>
              <span style={{ fontSize: 20 }}>{w.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{w.day}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{w.focus}</div>
              </div>
              {w.done && <span style={{ color: "#10b981" }}><IconCheck /></span>}
            </div>
          ))}
        </div>

        <div style={s.card}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#0f172a" }}>🥗 Dieta de Hoje</h3>
          {DIET[0].meals.map((m, i) => (
            <div key={i} style={{
              padding: "10px 12px", borderRadius: 10, marginBottom: 8,
              background: "#f8fafc", border: "1px solid #e2e8f0",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{m.name}</span>
                <span style={{ ...s.badge("blue"), fontSize: 11 }}>{m.kcal} kcal</span>
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{m.items.slice(0, 2).join(" · ")}...</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── TREINOS ─────────────────────────────────────────────
  const Treinos = () => (
    <div>
      <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700, color: "#0f172a" }}>Plano de Treinos 💪</h1>
      <p style={{ margin: "0 0 24px", color: "#64748b" }}>Semana completa — clique para ver os exercícios</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
        {workouts.map((w, i) => (
          <div key={i} style={{
            ...s.card, cursor: "pointer", transition: "all .2s",
            border: selectedDay === i ? "2px solid #3b82f6" : "1px solid rgba(0,0,0,0.05)",
            transform: selectedDay === i ? "translateY(-2px)" : "none",
          }} onClick={() => setSelectedDay(selectedDay === i ? null : i)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 30, marginBottom: 4 }}>{w.emoji}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#0f172a" }}>{w.day}</div>
                <div style={{ fontSize: 13, color: "#6366f1", fontWeight: 600 }}>{w.focus}</div>
              </div>
              <button onClick={e => { e.stopPropagation(); toggleDone(i); }} style={{
                padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer",
                fontWeight: 700, fontSize: 12,
                background: w.done ? "#dcfce7" : "#dbeafe",
                color: w.done ? "#15803d" : "#1d4ed8",
              }}>
                {w.done ? "✓ Feito" : "Marcar"}
              </button>
            </div>
            {selectedDay === i && (
              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" as const }}>Exercícios</div>
                {w.exercises.map((ex, j) => (
                  <div key={j} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 10px", background: "#f8fafc", borderRadius: 8, marginBottom: 6,
                    border: "1px solid #e2e8f0",
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{ex.name}</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <span style={s.badge("blue")}>{ex.sets}×{ex.reps}</span>
                      <span style={{ ...s.badge("blue"), background: "#f1f5f9", color: "#64748b" }}>{ex.rest}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ─── DIETAS ──────────────────────────────────────────────
  const Dietas = () => (
    <div>
      <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700, color: "#0f172a" }}>Plano de Dieta 🥗</h1>
      <p style={{ margin: "0 0 24px", color: "#64748b" }}>Cardápio semanal — clique para expandir</p>
      {DIET.map((d, i) => (
        <div key={i} style={{ ...s.card, marginBottom: 12, cursor: "pointer" }} onClick={() => setSelectedDiet(selectedDiet === i ? null : i)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#3b82f6,#6366f1)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14,
              }}>{d.day.slice(0, 3)}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{d.day}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{d.meals.length} refeições</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, color: "#f59e0b", fontSize: 16 }}>{d.meals.reduce((s, m) => s + m.kcal, 0)} kcal</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>total do dia</div>
              </div>
              <span style={{ color: "#94a3b8", fontSize: 20 }}>{selectedDiet === i ? "▲" : "▼"}</span>
            </div>
          </div>
          {selectedDiet === i && (
            <div style={{ marginTop: 16, borderTop: "1px solid #f1f5f9", paddingTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10 }}>
              {d.meals.map((m, j) => (
                <div key={j} style={{ background: "#f8fafc", borderRadius: 12, padding: "12px 14px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{m.name}</span>
                    <span style={s.badge("green")}>{m.kcal}</span>
                  </div>
                  <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
                    {m.items.map((item, k) => (
                      <li key={k} style={{ fontSize: 12, color: "#475569", marginBottom: 2 }}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // ─── PROGRESSO ───────────────────────────────────────────
  const Progresso = () => {
    const max = Math.max(...weight);
    const min = Math.min(...weight);
    const days = ["D1", "D2", "D3", "D4", "D5", "D6", "D7"];
    const H = 140, W = 400;
    const pts = weight.map((v, i) => {
      const x = 30 + (i / (weight.length - 1)) * (W - 60);
      const y = H - 20 - ((v - min) / (max - min + 0.1)) * (H - 40);
      return { x, y, v };
    });
    const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

    return (
      <div>
        <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700, color: "#0f172a" }}>Progresso 📊</h1>
        <p style={{ margin: "0 0 24px", color: "#64748b" }}>Acompanhe sua evolução semanal</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ ...s.card, gridColumn: "1/-1" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Evolução do Peso (kg)</h3>
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${path} L${pts[pts.length - 1].x},${H - 10} L${pts[0].x},${H - 10} Z`} fill="url(#grad)" />
              <path d={path} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {pts.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="5" fill="#fff" stroke="#3b82f6" strokeWidth="2" />
                  <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fill="#64748b">{p.v}</text>
                  <text x={p.x} y={H - 2} textAnchor="middle" fontSize="10" fill="#94a3b8">{days[i]}</text>
                </g>
              ))}
            </svg>
          </div>

          <div style={s.card}>
            <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Treinos Concluídos</h3>
            <div style={{ display: "flex", gap: 8 }}>
              {workouts.map((w, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: "100%", height: 60, borderRadius: 8,
                    background: w.done ? "linear-gradient(135deg,#3b82f6,#6366f1)" : "#f1f5f9",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                  }}>{w.done ? "✓" : w.emoji}</div>
                  <span style={{ fontSize: 9, color: "#94a3b8" }}>{w.day.slice(0, 3)}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: "12px 16px", background: "#f0fdf4", borderRadius: 10, border: "1px solid #bbf7d0" }}>
              <span style={{ fontWeight: 700, color: "#15803d" }}>{doneDays} de 7 treinos</span>
              <span style={{ color: "#64748b", fontSize: 13 }}> concluídos esta semana</span>
            </div>
          </div>

          <div style={s.card}>
            <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Calorias por Dia</h3>
            {DIET.slice(0, 5).map((d, i) => {
              const total = d.meals.reduce((s, m) => s + m.kcal, 0);
              const pct = Math.round((total / 2000) * 100);
              return (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: "#374151" }}>{d.day}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#3b82f6" }}>{total} kcal</span>
                  </div>
                  <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#3b82f6,#6366f1)", borderRadius: 4, transition: "width 1s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const tabContent: Record<Tab, React.ReactNode> = {
    dashboard: <Dashboard />,
    treinos: <Treinos />,
    dietas: <Dietas />,
    progresso: <Progresso />,
  };

  return (
    <div style={s.app}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36, padding: "0 4px" }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#3b82f6,#6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
          }}>💪</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>FitPlan</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Treino & Dieta</div>
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} style={s.navBtn(tab === n.id)}>
              {n.icon}
              {n.label}
            </button>
          ))}
        </nav>

        {/* Perfil */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16, marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 4px 12px" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
            }}><IconUser /></div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
            </div>
          </div>
          <button onClick={() => setUser(null)} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10,
            border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
            background: "rgba(239,68,68,0.15)", color: "#f87171", width: "100%",
          }}>
            <IconLogout /> Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main style={s.main}>
        {tabContent[tab]}
      </main>
    </div>
  );
}
