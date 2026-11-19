import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { UploadCloud, Play, MoreVertical, AlertTriangle, Clock, ShieldCheck, X, Loader2, ChevronDown } from "lucide-react";
import { AppShell, Badge, btn } from "@/components/AppShell";
import thumbs from "@/assets/thumbs.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Central de Uploads — Repurposing AI" },
      { name: "description", content: "Envie vídeos e áudios longos e transforme em cortes verticais com IA." },
      { property: "og:title", content: "Central de Uploads — Repurposing AI" },
      { property: "og:description", content: "Envie vídeos e áudios longos e transforme em cortes verticais com IA." },
    ],
  }),
  component: Uploads,
});

const media = [
  { name: "entrevista-produto.mp4", size: "482 MB", dur: "04:32", days: 12, pos: "0% 0%" },
  { name: "podcast-lideranca.mp3", size: "96 MB", dur: "08:42", days: 12, pos: "100% 0%" },
  { name: "campanha-verao.mov", size: "1,2 GB", dur: "02:18", days: 12, pos: "50% 0%" },
  { name: "depoimento-cliente.mp4", size: "276 MB", dur: "03:47", days: 12, pos: "100% 0%" },
  { name: "evento-institucional.mov", size: "1,8 GB", dur: "06:15", days: 2, pos: "0% 100%" },
  { name: "paisagem-natureza.mp4", size: "512 MB", dur: "01:24", days: 12, pos: "50% 100%" },
];

function Thumb({ pos, dur, className = "" }: { pos: string; dur: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-lg bg-muted ${className}`} style={{ backgroundImage: `url(${thumbs})`, backgroundSize: "300% 200%", backgroundPosition: pos }}>
      <div className="absolute inset-0 grid place-items-center">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-overlay"><Play className="h-4 w-4 fill-current" /></div>
      </div>
      <span className="absolute bottom-1.5 right-1.5 rounded bg-overlay px-1.5 py-0.5 font-mono text-[10px]">{dur}</span>
    </div>
  );
}

function Expiry({ days }: { days: number }) {
  return days <= 2 ? (
    <Badge tone="destructive"><AlertTriangle className="h-3 w-3" />Expira em {days} dias — baixe agora</Badge>
  ) : (
    <Badge tone="warning"><Clock className="h-3 w-3" />Expira em {days} dias</Badge>
  );
}

function Uploads() {
  const nav = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [modal, setModal] = useState(false);
  const [rights, setRights] = useState(false);
  const [consent, setConsent] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  const submit = () => {
    setModal(false);
    setProgress(0);
    let p = 0;
    const id = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) { clearInterval(id); setTimeout(() => nav({ to: "/transcricao" }), 300); }
    }, 180);
  };

  return (
    <AppShell title="Central de Uploads">
      <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="hidden md:block">
            <h1 className="text-3xl font-bold">Central de Uploads</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">Gerencie seus vídeos e áudios em um só lugar. Faça o upload, acompanhe o processamento e mantenha seus arquivos organizados.</p>
          </div>
          {progress !== null && (
            <div className="w-full rounded-xl border border-border bg-card p-4 md:w-72">
              <div className="flex items-center justify-between text-sm font-semibold"><span>Upload em andamento – 1 de 1</span><Loader2 className="h-4 w-4 animate-spin text-primary" /></div>
              <p className="mt-1 text-xs text-muted-foreground">Processando 1 arquivo... <span className="font-mono">{progress}%</span></p>
              <div className="mt-3 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div>
            </div>
          )}
        </div>

        <button onClick={() => fileRef.current?.click()} className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-primary/60 bg-primary/5 px-6 py-12 text-center transition hover:bg-primary/10">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/20 text-primary"><UploadCloud className="h-7 w-7" /></div>
          <p className="font-medium">Arraste um vídeo ou áudio aqui (MP4, MOV, MKV, MP3 até 2 GB)</p>
          <p className="text-xs text-muted-foreground">Plano Grátis: até 10 min e 3 cortes por arquivo (RN01)</p>
        </button>
        <input ref={fileRef} type="file" accept="video/*,audio/*" className="hidden" onChange={(e) => { if (e.target.files?.length) { setRights(false); setConsent(false); setModal(true); } e.target.value = ""; }} />

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Mídias enviadas</h2>
          <button className={btn.outline + " py-1.5"}>Mais recentes <ChevronDown className="h-4 w-4" /></button>
        </div>

        <div className="grid gap-3 md:grid-cols-3 md:gap-5">
          {media.map((m) => (
            <div key={m.name} onClick={() => nav({ to: "/transcricao" })} className="flex cursor-pointer gap-3 rounded-xl border border-border bg-card p-3 transition hover:border-primary/60 md:flex-col">
              <Thumb pos={m.pos} dur={m.dur} className="aspect-video w-32 shrink-0 md:w-full" />
              <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
                <div className="min-w-0 space-y-1.5">
                  <p className="truncate text-sm font-semibold">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.size} • <span className="font-mono">{m.dur}</span></p>
                  <Expiry days={m.days} />
                </div>
                <button onClick={(e) => e.stopPropagation()} aria-label="Opções" className="text-muted-foreground"><MoreVertical className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
          <div className="absolute inset-0 bg-overlay" onClick={() => setModal(false)} />
          <div className="relative w-full max-w-md rounded-t-3xl border border-border bg-popover p-6 md:rounded-2xl">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted md:hidden" />
            <button onClick={() => setModal(false)} aria-label="Fechar" className="absolute right-4 top-4 hidden text-muted-foreground md:block"><X className="h-5 w-5" /></button>
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/20 text-primary"><ShieldCheck className="h-6 w-6" /></div>
            <h3 className="mt-4 text-xl font-bold">Verificação de direitos</h3>
            <p className="mt-2 text-sm text-muted-foreground">Precisamos verificar os direitos deste conteúdo antes do upload para garantir o uso adequado e seguro.</p>
            <div className="mt-5 space-y-3">
              {[
                [rights, setRights, "Declaro ser o detentor dos direitos deste conteúdo (RN02)"],
                [consent, setConsent, "Este vídeo contém voz/imagem de terceiros com consentimento registrado (LGPD-01)"],
              ].map(([v, set, label], i) => (
                <label key={i} className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 text-sm">
                  <input type="checkbox" checked={v as boolean} onChange={(e) => (set as (b: boolean) => void)(e.target.checked)} className="mt-0.5 h-4 w-4 accent-primary" />
                  <span>{label as string}</span>
                </label>
              ))}
            </div>
            <button disabled={!rights} onClick={submit} className={btn.primary + " mt-6 w-full"}>Enviar e processar</button>
            <button onClick={() => setModal(false)} className="mt-3 w-full text-center text-sm text-muted-foreground hover:text-foreground">Cancelar</button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
