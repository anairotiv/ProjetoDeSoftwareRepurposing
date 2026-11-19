import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Play, Pause, Volume2, Settings, PictureInPicture2, Maximize, Download, Scissors } from "lucide-react";
import { AppShell, Badge, btn } from "@/components/AppShell";
import player from "@/assets/player.jpg";

export const Route = createFileRoute("/transcricao")({
  head: () => ({
    meta: [
      { title: "Transcrição e sincronização — Repurposing AI" },
      { name: "description", content: "Transcrição sincronizada gerada por IA, pronta para editar e exportar em .srt." },
      { property: "og:title", content: "Transcrição e sincronização — Repurposing AI" },
      { property: "og:description", content: "Transcrição sincronizada gerada por IA, pronta para editar e exportar em .srt." },
    ],
  }),
  component: Transcricao,
});

const TOTAL = 522;
const fmt = (s: number) => [Math.floor(s / 3600), Math.floor((s % 3600) / 60), Math.floor(s % 60)].map((n) => String(n).padStart(2, "0")).join(":");
const short = (s: number) => fmt(s).slice(3);

type Seg = { t: number; text: string; low?: string | undefined };
const initial: Seg[] = [
  { t: 48, text: "Quando a gente fala de produto, o mais importante é entender profundamente o problema do usuário e como a tecnologia pode realmente ajudar." },
  { t: 72, text: "A experiência do usuário precisa ser simples, intuitiva e estar no centro de todas as decisões." },
  { t: 157, text: "Eu costumo dizer que não é sobre adicionar mais funcionalidades, é sobre tirar o que não faz sentido. Isso torna o produto mais focado e gera mais valor." },
  { t: 238, text: "Hoje, com as ferramentas certas, a gente consegue evoluir muito mais rápido, validando hipóteses e ouvindo o usuário de forma contínua." },
  { t: 321, text: "O maior desafio, na minha visão, é manter o equilíbrio entre inovação e usabilidade. Às vezes a gente se empolga com o novo, mas o usuário ainda prefere", low: "empolga" },
  { t: 436, text: "No fim, o que realmente importa é entregar um produto que resolva o problema de verdade e faça a vida do usuário mais fácil." },
];

function Transcricao() {
  const [time, setTime] = useState(72);
  const [playing, setPlaying] = useState(false);
  const [segs, setSegs] = useState(initial);
  const [editing, setEditing] = useState<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setTime((t) => (t >= TOTAL ? 0 : t + 1)), 1000);
    return () => clearInterval(id);
  }, [playing]);

  const active = useMemo(() => { let a = -1; segs.forEach((s, i) => { if (time >= s.t) a = i; }); return a; }, [time, segs]);
  const bars = useMemo(() => Array.from({ length: 120 }, (_, i) => 20 + Math.abs(Math.sin(i * 1.7) * 50 + Math.sin(i * 0.4) * 30)), []);

  const exportSrt = () => {
    const body = segs.map((s, i) => `${i + 1}\n${fmt(s.t)},000 --> ${fmt(segs[i + 1]?.t ?? TOTAL)},000\n${s.text}\n`).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([body], { type: "text/plain" }));
    a.download = "entrevista-produto.srt";
    a.click();
  };

  const accuracy = <Badge tone="success">Precisão estimada: 97%</Badge>;

  return (
    <AppShell title="Transcrição" back breadcrumb={[{ label: "Projetos", to: "/" }, { label: "Entrevista de produto", to: "/" }, { label: "Transcrição" }]}>
      <div className="grid gap-6 p-4 pb-28 md:p-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <div className="hidden items-center gap-3 md:flex"><h1 className="text-2xl font-bold">Transcrição e sincronização</h1>{accuracy}</div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="relative aspect-video">
              <img src={player} alt="Entrevista de produto" width={1280} height={720} className="h-full w-full object-cover" />
              <button onClick={() => setPlaying(!playing)} aria-label="Reproduzir" className="absolute inset-0" />
            </div>
            <div className="h-1 bg-muted"><div className="h-full bg-primary" style={{ width: `${(time / TOTAL) * 100}%` }} /></div>
            <div className="flex items-center gap-4 px-4 py-3 text-muted-foreground">
              <button onClick={() => setPlaying(!playing)} className="text-foreground" aria-label={playing ? "Pausar" : "Reproduzir"}>{playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}</button>
              <Volume2 className="h-5 w-5" />
              <span className="font-mono text-xs text-foreground">{fmt(time)} / {short(TOTAL)}</span>
              <div className="ml-auto flex gap-4"><Settings className="h-5 w-5" /><PictureInPicture2 className="h-5 w-5" /><Maximize className="h-5 w-5" /></div>
            </div>
          </div>
          <div className="md:hidden">{accuracy}</div>
          <div className="hidden rounded-2xl border border-border bg-card p-4 md:block">
            <div className="relative flex h-24 cursor-pointer items-center gap-[2px]" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setTime(Math.round(((e.clientX - r.left) / r.width) * TOTAL)); }}>
              {bars.map((h, i) => <div key={i} className={`flex-1 rounded-full ${i / bars.length < time / TOTAL ? "bg-primary" : "bg-primary/35"}`} style={{ height: `${h}%` }} />)}
              <div className="absolute inset-y-0 w-0.5 bg-primary" style={{ left: `${(time / TOTAL) * 100}%` }}><div className="-ml-1.5 h-3.5 w-3.5 rounded-full bg-primary" /></div>
            </div>
            <div className="mt-2 flex justify-between font-mono text-xs text-muted-foreground">{["00:00", "01:12", "02:00", "04:00", "06:00", "08:42"].map((m) => <span key={m}>{m}</span>)}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2"><h2 className="font-semibold">Transcrição gerada pela IA</h2><span className="hidden md:inline">{accuracy}</span></div>
            <div className="hidden gap-2 md:flex">
              <button onClick={exportSrt} className={btn.outline}><Download className="h-4 w-4" />Exportar .srt</button>
              <Link to="/cortes" className={btn.primary}><Scissors className="h-4 w-4" />Editar na timeline</Link>
            </div>
          </div>
          <ul className="mt-4 space-y-2">
            {segs.map((s, i) => (
              <li key={s.t} onClick={() => setTime(s.t)} className={`flex cursor-pointer gap-4 rounded-xl p-3 text-sm transition ${i === active ? "bg-primary/25 ring-1 ring-primary" : "hover:bg-accent"}`}>
                <span className="shrink-0 font-mono text-xs text-primary">{fmt(s.t)}</span>
                {editing === i ? (
                  <textarea autoFocus defaultValue={s.text} onClick={(e) => e.stopPropagation()} onBlur={(e) => { const v = e.target.value; setSegs((x) => x.map((y, j) => (j === i ? { ...y, text: v, low: undefined } : y))); setEditing(null); }} className="min-h-24 w-full rounded-lg border border-input bg-background p-2 text-sm" />
                ) : (
                  <p className="leading-relaxed">
                    {s.low && s.text.includes(s.low) ? (
                      <>
                        {s.text.split(s.low)[0]}
                        <button onClick={(e) => { e.stopPropagation(); setEditing(i); }} className="underline decoration-warning decoration-dashed decoration-2 underline-offset-4">{s.low}</button>
                        {s.text.split(s.low).slice(1).join(s.low)}
                        <button onClick={(e) => { e.stopPropagation(); setEditing(i); }} className="ml-2 inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-xs text-warning">↖ baixa confiança</button>
                      </>
                    ) : s.text}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-3 border-t border-border bg-background p-4 md:hidden">
        <Link to="/cortes" className={btn.primary}>Editar na timeline</Link>
        <button onClick={exportSrt} className={btn.outline}>Exportar .srt</button>
      </div>
    </AppShell>
  );
}
