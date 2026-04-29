"use client";

import { useState, useEffect } from "react";

type Tab = "dashboard" | "treinos" | "dietas" | "progresso";
type AuthPage = "login" | "register";

interface User { name: string; email: string; }
interface Exercise { name: string; sets: string; reps: string; rest: string; }
interface WorkoutDay { day: string; focus: string; emoji: string; exercises: Exercise[]; done: boolean; }
interface Meal { name: string; items: string[]; kcal: number; }
interface DietDay { day: string; meals: Meal[]; }

const WORKOUTS: WorkoutDay[] = [
  { day: "Segunda", focus: "Peito + Tríceps", emoji: "💪", done: false, exercises: [
    { name: "Supino Reto", sets: "4", reps: "10-12", rest: "90s" },
    { name: "Supino Inclinado", sets: "3", reps: "10", rest: "90s" },
    { name: "Crucifixo", sets: "3", reps: "12", rest: "60s" },
    { name: "Tríceps Corda", sets: "3", reps: "15", rest: "60s" },
    { name: "Tríceps Francês", sets: "3", reps: "12", rest: "60s" },
  ]},
  { day: "Terça", focus: "Costas + Bíceps", emoji: "🏋️", done: false, exercises: [
    { name: "Barra Fixa", sets: "4", reps: "8-10", rest: "90s" },
    { name: "Remada Curvada", sets: "4", reps: "10", rest: "90s" },
    { name: "Remada Unilateral", sets: "3", reps: "12", rest: "60s" },
    { name: "Rosca Direta", sets: "3", reps: "12", rest: "60s" },
    { name: "Rosca Martelo", sets: "3", reps: "12", rest: "60s" },
  ]},
  { day: "Quarta", focus: "Descanso Ativo", emoji: "🧘", done: false, exercises: [
    { name: "Caminhada", sets: "1", reps: "30 min", rest: "-" },
    { name: "Alongamento", sets: "1", reps: "20 min", rest: "-" },
  ]},
  { day: "Quinta", focus: "Ombros + Abdômen", emoji: "🎯", done: false, exercises: [
    { name: "Desenvolvimento", sets: "4", reps: "10", rest: "90s" },
    { name: "Elevação Lateral", sets: "3", reps: "15", rest: "60s" },
    { name: "Elevação Frontal", sets: "3", reps: "12", rest: "60s" },
    { name: "Prancha", sets: "3", reps: "60s", rest: "45s" },
    { name: "Abdominal Crunch", sets: "3", reps: "20", rest: "45s" },
  ]},
  { day: "Sexta", focus: "Pernas", emoji: "🦵", done: false, exercises: [
    { name: "Agachamento", sets: "4", reps: "10-12", rest: "120s" },
    { name: "Leg Press", sets: "4", reps: "12", rest: "90s" },
    { name: "Cadeira Extensora", sets: "3", reps: "15", rest: "60s" },
    { name: "Mesa Flexora", sets: "3", reps: "12", rest: "60s" },
    { name: "Panturrilha em Pé", sets: "4", reps: "20", rest: "45s" },
  ]},
  { day: "Sábado", focus: "Full Body Funcional", emoji: "⚡", done: false, exercises: [
    { name: "Burpee", sets: "3", reps: "10", rest: "60s" },
    { name: "Swing Kettlebell", sets: "3", reps: "15", rest: "60s" },
    { name: "Polichinelo", sets: "3", reps: "30", rest: "45s" },
    { name: "Escalador", sets: "3", reps: "20", rest: "45s" },
  ]},
  { day: "Domingo", focus: "Descanso Total", emoji: "😴", done: false, exercises: [
    { name: "Recuperação", sets: "-", reps: "Descanso", rest: "-" },
  ]},
];

const DIET: DietDay[] = [
  { day: "Segunda", meals: [
    { name: "Café da Manhã", items: ["Ovos mexidos (3 un)", "Pão integral", "Banana", "Café sem açúcar"], kcal: 480 },
    { name: "Almoço", items: ["Frango grelhado 150g", "Arroz integral 1 xíc", "Feijão 1/2 xíc", "Salada verde"], kcal: 620 },
    { name: "Lanche", items: ["Iogurte grego", "Granola 30g", "Morango"], kcal: 280 },
    { name: "Jantar", items: ["Tilápia 150g", "Batata-doce 200g", "Brócolis"], kcal: 420 },
  ]},
  { day: "Terça", meals: [
    { name: "Café da Manhã", items: ["Vitamina de banana com aveia", "Ovos cozidos (2 un)"], kcal: 430 },
    { name: "Almoço", items: ["Carne vermelha magra 150g", "Macarrão integral", "Legumes refogados"], kcal: 650 },
    { name: "Lanche", items: ["Mix de castanhas 30g", "Maçã"], kcal: 250 },
    { name: "Jantar", items: ["Frango 150g", "Quinoa", "Espinafre"], kcal: 400 },
  ]},
  { day: "Quarta", meals: [
    { name: "Café da Manhã", items: ["Tapioca com atum", "Suco de laranja natural"], kcal: 410 },
    { name: "Almoço", items: ["Salmão grelhado 150g", "Arroz branco", "Salada colorida"], kcal: 580 },
    { name: "Lanche", items: ["Whey Protein", "Fruta"], kcal: 220 },
    { name: "Jantar", items: ["Omelete de 3 ovos", "Pão integral", "Queijo branco"], kcal: 450 },
  ]},
  { day: "Quinta", meals: [
    { name: "Café da Manhã", items: ["Açaí com granola e banana"], kcal: 520 },
    { name: "Almoço", items: ["Frango 150g", "Lentilha", "Arroz integral", "Cenoura"], kcal: 600 },
    { name: "Lanche", items: ["Cottage com torrada integral"], kcal: 240 },
    { name: "Jantar", items: ["Atum 120g", "Batata-doce", "Abobrinha grelhada"], kcal: 380 },
  ]},
  { day: "Sexta", meals: [
    { name: "Café da Manhã", items: ["Pão integral com pasta de amendoim", "Banana", "Café"], kcal: 490 },
    { name: "Almoço", items: ["Fraldinha 150g", "Arroz + feijão", "Couve refogada"], kcal: 680 },
    { name: "Lanche", items: ["Iogurte grego + mel + nozes"], kcal: 310 },
    { name: "Jantar", items: ["Frango 130g", "Cuscuz", "Tomate + pepino"], kcal: 420 },
  ]},
  { day: "Sábado", meals: [
    { name: "Café da Manhã", items: ["Panqueca de aveia (3 un)", "Mel", "Frutas vermelhas"], kcal: 460 },
    { name: "Almoço", items: ["Churrasco de frango", "Vinagrete", "Pão de queijo (1 un)"], kcal: 700 },
    { name: "Lanche", items: ["Whey + leite vegetal + banana"], kcal: 280 },
    { name: "Jantar", items: ["Sopa de legumes com frango"], kcal: 360 },
  ]},
  { day: "Domingo", meals: [
    { name: "Café da Manhã", items: ["Ovos beneditinos + torrada", "Suco verde"], kcal: 510 },
    { name: "Almoço", items: ["Arroz, feijão, frango, farofa (refeição livre moderada)"], kcal: 780 },
    { name: "Lanche", items: ["Frutas de época"], kcal: 180 },
    { name: "Jantar", items: ["Frango desfiado + aipim cozido"], kcal: 430 },
  ]},
];

// ─── Ícones ───────────────────────────────────────────────
const IcoGrid = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
const IcoDumbbell = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5h11M6.5 17.5h11M3 9.5h2v5H3zM19 9.5h2v5h-2zM6.5 9.5v5M17.5 9.5v5"/></svg>;
const IcoSalad = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 19h18M3 9c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/><path d="M8 7V5c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const IcoChart = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IcoUser = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcoLock = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IcoMail = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IcoCheck = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoLogout = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

// ─── CSS Responsivo ───────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:#f0f4ff;font-family:'Segoe UI',system-ui,sans-serif;}
    input{font-family:inherit;}
    input::placeholder{color:rgba(255,255,255,0.3);}
    input:focus{outline:none;border-color:rgba(99,102,241,0.6)!important;}

    .sidebar{
      width:240px;background:linear-gradient(180deg,#0d2461 0%,#1a3a8f 100%);
      display:flex;flex-direction:column;padding:24px 16px;
      position:fixed;top:0;left:0;height:100vh;z-index:100;
      box-shadow:4px 0 24px rgba(13,36,97,0.3);
    }
    .top-bar{display:none;}
    .bottom-nav{display:none;}
    .main-wrap{margin-left:240px;padding:32px 36px;min-height:100vh;}

    .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px;}
    .dash-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
    .workout-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;}
    .progress-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
    .meals-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px;margin-top:14px;padding-top:14px;border-top:1px solid #f1f5f9;}

    .card{background:#fff;border-radius:16px;padding:20px 24px;box-shadow:0 2px 12px rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.05);}
    .wcard{background:#fff;border-radius:16px;padding:20px;box-shadow:0 2px 12px rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.05);cursor:pointer;transition:all .2s;}
    .wcard:hover{transform:translateY(-2px);box-shadow:0 6px 24px rgba(0,0,0,0.1);}
    .wcard.sel{border:2px solid #3b82f6;transform:translateY(-2px);}
    .diet-row{background:#fff;border-radius:14px;padding:16px 18px;margin-bottom:10px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.05);border:1px solid rgba(0,0,0,0.05);transition:box-shadow .15s;}
    .diet-row:hover{box-shadow:0 4px 16px rgba(0,0,0,0.1);}

    .nav-btn{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:12px;border:none;cursor:pointer;font-size:14px;font-weight:600;text-align:left;transition:all .2s;width:100%;background:transparent;color:rgba(255,255,255,0.55);border-left:3px solid transparent;}
    .nav-btn.act{background:rgba(255,255,255,0.15);color:#fff;border-left:3px solid #60a5fa;}
    .nav-btn:hover{background:rgba(255,255,255,0.08);color:#fff;}

    .bbtn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10px 4px 14px;border:none;background:transparent;cursor:pointer;gap:3px;font-size:10px;font-weight:600;color:#94a3b8;transition:color .15s;}
    .bbtn.act{color:#3b82f6;}

    .auth-input{width:100%;padding:12px 14px 12px 44px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:12px;color:#fff;font-size:15px;outline:none;transition:border-color .2s;}
    .auth-input:focus{border-color:rgba(99,102,241,0.7);}

    .badge-b{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background:#dbeafe;color:#1d4ed8;}
    .badge-g{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background:#dcfce7;color:#15803d;}

    .pri-btn{padding:14px;background:linear-gradient(135deg,#3b82f6,#6366f1);border:none;border-radius:12px;color:#fff;font-size:16px;font-weight:700;cursor:pointer;box-shadow:0 4px 20px rgba(59,130,246,0.4);transition:transform .15s;width:100%;}
    .pri-btn:hover{transform:translateY(-2px);}
    .pri-btn:active{transform:scale(0.98);}

    /* ─── MOBILE ─── */
    @media(max-width:768px){
      .sidebar{display:none!important;}
      .top-bar{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:linear-gradient(135deg,#0d2461,#1a3a8f);position:sticky;top:0;z-index:200;box-shadow:0 2px 12px rgba(13,36,97,0.3);}
      .bottom-nav{display:flex;position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid #e2e8f0;z-index:200;box-shadow:0 -4px 20px rgba(0,0,0,0.08);}
      .main-wrap{margin-left:0;padding:16px 16px 88px;}
      .stats-grid{grid-template-columns:1fr 1fr;gap:12px;}
      .dash-grid{grid-template-columns:1fr;}
      .workout-grid{grid-template-columns:1fr;}
      .progress-grid{grid-template-columns:1fr;}
      .meals-grid{grid-template-columns:1fr 1fr;}
      .page-h1{font-size:20px!important;}
    }
    @media(max-width:400px){
      .meals-grid{grid-template-columns:1fr;}
    }
  `}</style>
);

// ─── TELA DE LOGIN ────────────────────────────────────────
function AuthScreen({ onLogin }: { onLogin: (u: User) => void }) {
  const [page, setPage] = useState<AuthPage>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (page === "login") {
      if (!email || !password) { setError("Preencha todos os campos."); return; }
      onLogin({ name: email.split("@")[0], email });
    } else {
      if (!name || !email || !password) { setError("Preencha todos os campos."); return; }
      if (password.length < 6) { setError("Senha mínimo 6 caracteres."); return; }
      onLogin({ name, email });
    }
  };

  return (
    <>
      <GlobalStyles />
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a1628 0%,#0d2461 50%,#1a3a8f 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 16px" }}>
        <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "40px 28px", width: "100%", maxWidth: 420, boxShadow: "0 25px 50px rgba(0,0,0,0.4)" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg,#3b82f6,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 28 }}>💪</div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>FitPlan</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 4 }}>{page === "login" ? "Bem-vindo de volta!" : "Crie sua conta grátis"}</p>
          </div>

          <div style={{ display: "flex", background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: 4, marginBottom: 24 }}>
            {(["login", "register"] as AuthPage[]).map(p => (
              <button key={p} onClick={() => { setPage(p); setError(""); }} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, background: page === p ? "rgba(59,130,246,0.9)" : "transparent", color: page === p ? "#fff" : "rgba(255,255,255,0.5)", transition: "all .2s" }}>
                {p === "login" ? "Entrar" : "Cadastrar"}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {page === "register" && (
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Nome</span>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", display: "flex" }}><IcoUser /></span>
                  <input className="auth-input" value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome completo" />
                </div>
              </label>
            )}
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>E-mail</span>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", display: "flex" }}><IcoMail /></span>
                <input className="auth-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" type="email" />
              </div>
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Senha</span>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", display: "flex" }}><IcoLock /></span>
                <input className="auth-input" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" type="password" />
              </div>
            </label>
            {error && <p style={{ color: "#f87171", fontSize: 13, textAlign: "center" }}>{error}</p>}
            <button className="pri-btn" onClick={submit} style={{ marginTop: 8 }}>
              {page === "login" ? "Entrar na conta" : "Criar conta"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────
export default function FitPlanApp() {
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [workouts, setWorkouts] = useState<WorkoutDay[]>(WORKOUTS);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedDiet, setSelectedDiet] = useState<number | null>(null);
  const weight = [80, 79.5, 79, 78.2, 78, 77.5, 77.1];

  if (!user) return <AuthScreen onLogin={u => setUser(u)} />;

  const doneDays = workouts.filter(w => w.done).length;
  const todayKcal = DIET[0].meals.reduce((s, m) => s + m.kcal, 0);
  const toggleDone = (i: number) => setWorkouts(prev => prev.map((w, idx) => idx === i ? { ...w, done: !w.done } : w));
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const navItems = [
    { id: "dashboard" as Tab, label: "Dashboard", icon: <IcoGrid /> },
    { id: "treinos"   as Tab, label: "Treinos",   icon: <IcoDumbbell /> },
    { id: "dietas"    as Tab, label: "Dietas",    icon: <IcoSalad /> },
    { id: "progresso" as Tab, label: "Progresso", icon: <IcoChart /> },
  ];

  // ── Dashboard ──
  const Dashboard = () => (
    <div>
      <h1 className="page-h1" style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Olá, {cap(user.name)}! 👋</h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>Resumo da sua semana</p>

      <div className="stats-grid">
        {[
          { label: "Treinos feitos", value: `${doneDays}/7`, color: "#3b82f6", icon: "💪" },
          { label: "Calorias hoje",  value: `${todayKcal}`, color: "#10b981", icon: "🔥" },
          { label: "Peso atual",     value: `${weight[weight.length-1]}kg`, color: "#6366f1", icon: "⚖️" },
          { label: "Sequência",      value: `${doneDays}d`,  color: "#f59e0b", icon: "🏆" },
        ].map(c => (
          <div key={c.label} style={{ background: "#fff", borderRadius: 14, padding: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", borderTop: `4px solid ${c.color}` }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{c.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2, lineHeight: 1.3 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 14 }}>📅 Treinos da Semana</h3>
          {workouts.map((w, i) => (
            <div key={i} onClick={() => { setSelectedDay(i); setTab("treinos"); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, marginBottom: 6, cursor: "pointer", background: w.done ? "#f0fdf4" : "#f8fafc", border: `1px solid ${w.done ? "#bbf7d0" : "#e2e8f0"}` }}>
              <span style={{ fontSize: 18 }}>{w.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{w.day}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{w.focus}</div>
              </div>
              {w.done && <span style={{ color: "#10b981" }}><IcoCheck /></span>}
            </div>
          ))}
        </div>
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 14 }}>🥗 Dieta de Hoje</h3>
          {DIET[0].meals.map((m, i) => (
            <div key={i} style={{ padding: "10px 12px", borderRadius: 10, marginBottom: 8, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{m.name}</span>
                <span className="badge-b">{m.kcal} kcal</span>
              </div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{m.items.slice(0, 2).join(" · ")}…</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Treinos ──
  const Treinos = () => (
    <div>
      <h1 className="page-h1" style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Plano de Treinos 💪</h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>Toque no card para ver os exercícios</p>
      <div className="workout-grid">
        {workouts.map((w, i) => (
          <div key={i} className={`wcard${selectedDay === i ? " sel" : ""}`} onClick={() => setSelectedDay(selectedDay === i ? null : i)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 28, marginBottom: 4 }}>{w.emoji}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{w.day}</div>
                <div style={{ fontSize: 12, color: "#6366f1", fontWeight: 600 }}>{w.focus}</div>
              </div>
              <button onClick={e => { e.stopPropagation(); toggleDone(i); }} style={{ padding: "8px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 12, background: w.done ? "#dcfce7" : "#dbeafe", color: w.done ? "#15803d" : "#1d4ed8", whiteSpace: "nowrap" }}>
                {w.done ? "✓ Feito" : "Marcar"}
              </button>
            </div>
            {selectedDay === i && (
              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" as const }}>Exercícios</div>
                {w.exercises.map((ex, j) => (
                  <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 6, padding: "8px 10px", background: "#f8fafc", borderRadius: 8, marginBottom: 6, border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{ex.name}</span>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                      <span className="badge-b">{ex.sets}×{ex.reps}</span>
                      <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "#f1f5f9", color: "#64748b" }}>{ex.rest}</span>
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

  // ── Dietas ──
  const Dietas = () => (
    <div>
      <h1 className="page-h1" style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Plano de Dieta 🥗</h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>Toque para ver o cardápio do dia</p>
      {DIET.map((d, i) => (
        <div key={i} className="diet-row" onClick={() => setSelectedDiet(selectedDiet === i ? null : i)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: "linear-gradient(135deg,#3b82f6,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>{d.day.slice(0, 3)}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{d.day}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{d.meals.length} refeições</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, color: "#f59e0b", fontSize: 15 }}>{d.meals.reduce((s, m) => s + m.kcal, 0)} kcal</div>
                <div style={{ fontSize: 10, color: "#94a3b8" }}>total</div>
              </div>
              <span style={{ color: "#94a3b8", fontSize: 16 }}>{selectedDiet === i ? "▲" : "▼"}</span>
            </div>
          </div>
          {selectedDiet === i && (
            <div className="meals-grid">
              {d.meals.map((m, j) => (
                <div key={j} style={{ background: "#f8fafc", borderRadius: 10, padding: 12, border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 12, color: "#0f172a" }}>{m.name}</span>
                    <span className="badge-g" style={{ fontSize: 10 }}>{m.kcal}</span>
                  </div>
                  <ul style={{ paddingLeft: 14 }}>
                    {m.items.map((item, k) => <li key={k} style={{ fontSize: 11, color: "#475569", marginBottom: 2 }}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // ── Progresso ──
  const Progresso = () => {
    const max = Math.max(...weight), min = Math.min(...weight);
    const H = 140, W = 360;
    const pts = weight.map((v, i) => ({ x: 30 + (i / (weight.length - 1)) * (W - 50), y: H - 20 - ((v - min) / (max - min + 0.1)) * (H - 40), v }));
    const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    const wkDays = ["D1","D2","D3","D4","D5","D6","D7"];
    return (
      <div>
        <h1 className="page-h1" style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Progresso 📊</h1>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>Sua evolução semanal</p>
        <div className="progress-grid">
          <div className="card" style={{ gridColumn: "1 / -1" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 14 }}>Evolução do Peso (kg)</h3>
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
              <defs><linearGradient id="grd" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/><stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/></linearGradient></defs>
              <path d={`${path} L${pts[pts.length-1].x},${H-10} L${pts[0].x},${H-10} Z`} fill="url(#grd)"/>
              <path d={path} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              {pts.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="5" fill="#fff" stroke="#3b82f6" strokeWidth="2"/>
                  <text x={p.x} y={p.y-10} textAnchor="middle" fontSize="9" fill="#64748b">{p.v}</text>
                  <text x={p.x} y={H-2} textAnchor="middle" fontSize="9" fill="#94a3b8">{wkDays[i]}</text>
                </g>
              ))}
            </svg>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 14 }}>Treinos Concluídos</h3>
            <div style={{ display: "flex", gap: 6 }}>
              {workouts.map((w, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 4 }}>
                  <div style={{ width: "100%", height: 48, borderRadius: 8, background: w.done ? "linear-gradient(135deg,#3b82f6,#6366f1)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{w.done ? "✓" : w.emoji}</div>
                  <span style={{ fontSize: 8, color: "#94a3b8" }}>{w.day.slice(0,3)}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: "10px 14px", background: "#f0fdf4", borderRadius: 10, border: "1px solid #bbf7d0" }}>
              <span style={{ fontWeight: 700, color: "#15803d", fontSize: 14 }}>{doneDays} de 7 treinos</span>
              <span style={{ color: "#64748b", fontSize: 12 }}> esta semana</span>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 14 }}>Calorias por Dia</h3>
            {DIET.slice(0, 5).map((d, i) => {
              const total = d.meals.reduce((s, m) => s + m.kcal, 0);
              return (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "#374151" }}>{d.day}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#3b82f6" }}>{total} kcal</span>
                  </div>
                  <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.round((total/2000)*100)}%`, background: "linear-gradient(90deg,#3b82f6,#6366f1)", borderRadius: 4 }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const tabContent: Record<Tab, React.ReactNode> = { dashboard: <Dashboard />, treinos: <Treinos />, dietas: <Dietas />, progresso: <Progresso /> };

  return (
    <>
      <GlobalStyles />
      <div style={{ minHeight: "100vh", background: "#f0f4ff" }}>

        {/* Sidebar — desktop */}
        <aside className="sidebar">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36, padding: "0 4px" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: "linear-gradient(135deg,#3b82f6,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💪</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>FitPlan</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Treino & Dieta</div>
            </div>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
            {navItems.map(n => (
              <button key={n.id} className={`nav-btn${tab === n.id ? " act" : ""}`} onClick={() => setTab(n.id)}>{n.icon}{n.label}</button>
            ))}
          </nav>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16, marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 4px 12px" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><IcoUser /></div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{cap(user.name)}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{user.email}</div>
              </div>
            </div>
            <button onClick={() => setUser(null)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: "rgba(239,68,68,0.15)", color: "#f87171", width: "100%" }}>
              <IcoLogout /> Sair
            </button>
          </div>
        </aside>

        {/* Top bar — mobile */}
        <div className="top-bar">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#3b82f6,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💪</div>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>FitPlan</span>
          </div>
          <button onClick={() => setUser(null)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: "rgba(239,68,68,0.2)", color: "#fca5a5" }}>
            <IcoLogout /> Sair
          </button>
        </div>

        {/* Conteúdo */}
        <main className="main-wrap">{tabContent[tab]}</main>

        {/* Bottom nav — mobile */}
        <nav className="bottom-nav">
          {navItems.map(n => (
            <button key={n.id} className={`bbtn${tab === n.id ? " act" : ""}`} onClick={() => setTab(n.id)}>
              {n.icon}{n.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
