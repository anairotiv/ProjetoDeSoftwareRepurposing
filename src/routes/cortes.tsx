import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Play, Star, Check, X, Lock, Crown, ChevronDown, Loader2 } from "lucide-react";
import { AppShell, Badge, btn } from "@/components/AppShell";
import cutsImg from "@/assets/cuts.jpg";

export const Route = createFileRoute("/cortes")({
  head: () => ({
    meta: [
      { title: "Sugestões de cortes verticais — Repurposing AI" },
      { name: "description", content: "Cortes 9:16 recomendados pelo motor de retenção semântica." },
      { property: "og:title", content: "Sugestões de cortes verticais — Repurposing AI" },
      { property: "og:description", content: "Cortes 9:16 recomendados pelo motor de retenção semântica." },
    ],
  }),
  component: Cortes,
});

const LIMIT = 3;
type Cut = { id: number; dur: string; secs: number; score?: number; status: "ready" | "processing" | "locked"; progress?: number; title: string; desc: string; pos: string; accepted?: boolean; leaving?: boolean };

const initial: Cut[] = [
  { id: 1, dur: "00:42", secs: 42, score: 92, status: "ready", title: "O poder da simplicidade na tecnologia", desc: "A fala direta sobre como tecnologia pode ser simples e poderosa, gerando alto engajamento.", pos: "0% 0%" },
  { id: 2, dur: "00:58", secs: 58, score: 87, status: "processing", progress: 60, title: "Decisões difíceis constroem grandes resultados", desc: "Momento de reflexão sobre tomada de decisão e coragem, com forte apelo emocional.", pos: "33.33% 0%" },
  { id: 3, dur: "00:36", secs: 36, status: "locked", title: "Liderança é sobre pessoas, não sobre ego", desc: "Uma lição valiosa sobre liderança e empatia, ideal para cortes motivacionais.", pos: "66.66% 0%" },
  { id: 4, dur: "00:48", secs: 48, score: 69, status: "ready", title: "Sobre escolhas e independência", desc: "Um trecho inspirador sobre liberdade de escolha e crescimento pessoal.", pos: "100% 0%" },
];

function Cortes() {
  const [cuts, setCuts] = useState(initial);
  const [used, setUsed] = useState(2);
  const [sort, setSort] = useState<"score" | "dur">("score");
  const [upgrade, setUpgrade] = useState(false);
  const [preview, setPreview] = useState<Cut | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setCuts((cs) => cs.map((c) => c.status === "processing" ? ((c.progress ?? 0) >= 100 ? { ...c, status: "ready" } : { ...c, progress: (c.progress ?? 0) + 5 }) : c));
    }, 400);
    return () => clearInterval(id);
  }, []);

  const full = used >= LIMIT;
  const sorted = [...cuts].sort((a, b) => sort === "score" ? (b.score ?? 0) - (a.score ?? 0) : b.secs - a.secs);

  const accept = (id: number) => { if (full) return; setUsed((u) => u + 1); setCuts((cs) => cs.map((c) => (c.id === id ? { ...c, accepted: true } : c))); };
  const discard = (id: number) => { setCuts((cs) => cs.map((c) => (c.id === id ? { ...c, leaving: true } : c))); setTimeout(() => setCuts((cs) => cs.filter((c) => c.id !== id)), 350); };

  return (
    <AppShell title="Cortes verticais" back>
      <div className="space-y-6 p-4 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Sugestões de cortes verticais</h1>
            <p className="mt-1 text-sm text-muted-foreground">Cortes recomendados pelo motor de retenção semântica</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="relative">
              <select value={sort} onChange={(e) => setSort(e.target.value as "score" | "dur")} className={btn.outline + " appearance-none pr-9"}>
                <option value="score">Pontuação de Retenção</option>
                <option value="dur">Duração</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            </label>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs">
              <span className={`h-2 w-2 rounded-full ${full ? "bg-warning" : "bg-success"}`} />Cortes usados: {used} de {LIMIT} (Plano Grátis - RN01)
            </span>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {sorted.map((c) => {
            const locked = c.status === "locked";
            const blocked = locked || (full && !c.accepted);
            return (
              <div key={c.id} className={`flex flex-col rounded-2xl border bg-card p-3 ${c.accepted ? "border-success" : "border-border"} ${c.leaving ? "animate-discard" : ""}`}>
                <button onClick={() => setPreview(c)} className="relative aspect-[9/16] overflow-hidden rounded-xl bg-muted" style={{ backgroundImage: `url(${cutsImg})`, backgroundSize: "400% 100%", backgroundPosition: c.pos }} aria-label={`Pré-visualizar ${c.title}`}>
                  <span className="absolute inset-0 grid place-items-center"><span className="grid h-12 w-12 place-items-center rounded-full bg-overlay"><Play className="h-5 w-5 fill-current" /></span></span>
                  <span className="absolute bottom-2 right-2 rounded bg-overlay px-1.5 py-0.5 font-mono text-xs">{c.dur}</span>
                </button>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-mono">{c.dur}</span>
                  {c.score && <Badge tone="primary"><Star className="h-3 w-3 fill-current" />{c.score}</Badge>}
                  {c.accepted ? <Badge tone="success"><Check className="h-3 w-3" />Aceito</Badge>
                    : c.status === "ready" ? <Badge tone="success">Pronto</Badge>
                    : c.status === "processing" ? <Badge tone="warning"><Loader2 className="h-3 w-3 animate-spin" />Processando {c.progress}%</Badge>
                    : <Badge tone="muted"><Lock className="h-3 w-3" />Bloqueado - Faça upgrade</Badge>}
                </div>
                {c.status === "processing" && <div className="mt-2 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-warning transition-all" style={{ width: `${c.progress}%` }} /></div>}
                <h3 className="mt-3 font-semibold">{c.title}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{c.desc}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button disabled={blocked || c.accepted} onClick={() => accept(c.id)} className={btn.primary}><Check className="h-4 w-4" />{c.accepted ? "Aceito" : "Aceitar"}</button>
                  <button disabled={locked} onClick={() => discard(c.id)} className={btn.outline}><X className="h-4 w-4" />Descartar</button>
                </div>
                {blocked && !c.accepted && (
                  <button onClick={() => setUpgrade(true)} className="mt-3 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-primary hover:underline"><Crown className="h-4 w-4" />Faça upgrade para liberar</button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {upgrade && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-overlay" onClick={() => setUpgrade(false)} />
          <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-popover p-6">
            <button onClick={() => setUpgrade(false)} aria-label="Fechar" className="absolute right-4 top-4 text-muted-foreground"><X className="h-5 w-5" /></button>
            <h3 className="flex items-center gap-2 text-xl font-bold"><Crown className="h-5 w-5 text-primary" />Escolha seu plano</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[["Grátis", "R$ 0", "10 min • 3 cortes por arquivo"], ["Criador", "R$ 49/mês", "60 min • 15 cortes por arquivo"], ["Estúdio", "R$ 149/mês", "Ilimitado • equipe"]].map(([n, p, d], i) => (
                <div key={n} className={`rounded-xl border p-4 ${i === 1 ? "border-primary bg-primary/10" : "border-border"}`}>
                  <p className="font-semibold">{n}</p><p className="mt-1 text-2xl font-bold">{p}</p><p className="mt-2 text-xs text-muted-foreground">{d}</p>
                  <button onClick={() => setUpgrade(false)} className={(i === 1 ? btn.primary : btn.outline) + " mt-4 w-full"}>{i === 0 ? "Atual" : "Assinar"}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-overlay" onClick={() => setPreview(null)} />
          <div className="relative w-full max-w-xs">
            <button onClick={() => setPreview(null)} aria-label="Fechar" className="absolute -top-10 right-0"><X className="h-6 w-6" /></button>
            <div className="aspect-[9/16] rounded-2xl" style={{ backgroundImage: `url(${cutsImg})`, backgroundSize: "400% 100%", backgroundPosition: preview.pos }} />
            <p className="mt-3 text-center font-semibold">{preview.title} <span className="font-mono text-sm text-muted-foreground">{preview.dur}</span></p>
          </div>
        </div>
      )}
    </AppShell>
  );
}
