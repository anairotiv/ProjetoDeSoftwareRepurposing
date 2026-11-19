import { Link, useRouterState, useRouter } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Home, FolderOpen, UploadCloud, Scissors, ListVideo, BarChart3, Settings, Menu, X, Cloud, ArrowLeft, MoreVertical, Sun,
} from "lucide-react";

const items = [
  { label: "Início", to: "/", icon: Home },
  { label: "Projetos", to: "/transcricao", icon: FolderOpen },
  { label: "Uploads", to: "/", icon: UploadCloud },
  { label: "Cortes", to: "/cortes", icon: Scissors },
  { label: "Fila", to: "/transcricao", icon: ListVideo },
  { label: "Métricas", to: "/cortes", icon: BarChart3 },
] as const;

const activeFor: Record<string, string> = { "/": "Uploads", "/transcricao": "Projetos", "/cortes": "Cortes" };

function Logo() {
  return (
    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
      <Cloud className="h-5 w-5" />
    </div>
  );
}

function NavList({ withLabels, onNavigate }: { withLabels?: boolean; onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <>
      {items.map((it) => {
        const active = activeFor[path] === it.label;
        return (
          <Link
            key={it.label}
            to={it.to}
            onClick={onNavigate}
            title={it.label}
            className={`flex items-center gap-3 rounded-xl p-2.5 text-sm transition-colors ${
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <it.icon className="h-5 w-5 shrink-0" />
            {withLabels && <span>{it.label}</span>}
          </Link>
        );
      })}
    </>
  );
}

export function AppShell({
  title, children, back, breadcrumb,
}: { title: string; children: ReactNode; back?: boolean; breadcrumb?: { label: string; to?: "/" | "/transcricao" | "/cortes" }[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <aside className="sticky top-0 hidden h-screen w-[72px] shrink-0 flex-col items-center gap-2 border-r border-border bg-sidebar py-4 md:flex">
        <Logo />
        <nav className="mt-6 flex flex-col gap-2"><NavList /></nav>
        <div className="mt-auto">
          <button title="Configurações" className="rounded-xl p-2.5 text-muted-foreground hover:bg-accent hover:text-foreground">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-overlay" onClick={() => setOpen(false)} />
          <aside className="relative flex h-full w-64 flex-col gap-2 border-r border-border bg-sidebar p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2"><Logo /><span className="font-semibold">Repurposing AI</span></div>
              <button onClick={() => setOpen(false)} aria-label="Fechar menu"><X className="h-5 w-5" /></button>
            </div>
            <NavList withLabels onNavigate={() => setOpen(false)} />
            <div className="mt-auto flex items-center gap-3 p-2.5 text-sm text-muted-foreground"><Settings className="h-5 w-5" />Configurações</div>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur md:hidden">
          {back ? (
            <button aria-label="Voltar" onClick={() => router.history.back()}><ArrowLeft className="h-5 w-5" /></button>
          ) : (
            <button aria-label="Abrir menu" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
          )}
          <h1 className="flex-1 truncate text-base font-semibold">{title}</h1>
          {back ? <MoreVertical className="h-5 w-5" /> : <Avatar />}
        </header>
        {breadcrumb && (
          <div className="hidden h-14 items-center gap-2 border-b border-border px-8 text-sm text-muted-foreground md:flex">
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span>/</span>}
                {b.to ? <Link to={b.to} className="hover:text-foreground">{b.label}</Link> : <span className="text-foreground">{b.label}</span>}
              </span>
            ))}
            <div className="ml-auto flex items-center gap-4"><Sun className="h-5 w-5" /><Avatar /></div>
          </div>
        )}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

export function Avatar() {
  return <div className="grid h-8 w-8 place-items-center rounded-full bg-accent text-xs font-semibold">MS</div>;
}

export function Badge({ tone = "muted", children }: { tone?: "success" | "warning" | "destructive" | "primary" | "muted"; children: ReactNode }) {
  const t = {
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    destructive: "bg-destructive/15 text-destructive",
    primary: "bg-primary/20 text-primary-foreground",
    muted: "bg-muted text-muted-foreground",
  }[tone];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${t}`}>{children}</span>;
}

export const btn = {
  primary: "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40",
  outline: "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-transparent px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40",
};
