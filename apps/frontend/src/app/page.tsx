import { Button } from "@/components/ui/button"
import { Rocket, GameController, Users, ShieldCheck } from "@phosphor-icons/react/dist/ssr"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-secondary/20 blur-[100px]" />
      </div>

      {/* Navigation placeholder bar to show UI depth */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <GameController size={20} weight="fill" />
          </div>
          <span className="font-bold text-xl tracking-tight">StreamForge</span>
        </div>
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="sm">Features</Button>
          <Button variant="ghost" size="sm">Community</Button>
          <Button variant="outline" size="sm">Sign In</Button>
          <Button size="sm">Get Started</Button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-3 duration-1000">
          <Rocket size={16} />
          <span>The Next Generation Streamer Platform</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
          Forge Your Streaming <br /> Legacy with Power
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          The all-in-one monorepo powered by Nx, React 19, and Next.js. 
          Beautifully crafted with Shadcn/UI for professional broadcasters.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20">
            Start Building Now
          </Button>
          <Button variant="outline" size="lg" className="h-12 px-8 text-base backdrop-blur-sm">
            View Components
          </Button>
        </div>

        {/* Feature Grid Test */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 max-w-6xl w-full">
          <div className="p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors group">
            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users size={24} weight="bold" />
            </div>
            <h3 className="text-xl font-bold mb-3">Community First</h3>
            <p className="text-muted-foreground">Built-in tools to engage your audience and grow your community effortlessly.</p>
          </div>

          <div className="p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors group">
            <div className="size-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Rocket size={24} weight="bold" />
            </div>
            <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
            <p className="text-muted-foreground">Optimized for speed with Next.js 16 and Turbopack for sub-second responses.</p>
          </div>

          <div className="p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors group">
            <div className="size-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={24} weight="bold" />
            </div>
            <h3 className="text-xl font-bold mb-3">Secure Core</h3>
            <p className="text-muted-foreground">Enterprise-grade security and authentication out of the box.</p>
          </div>
        </div>

        <div className="mt-24 font-mono text-xs text-muted-foreground animate-pulse">
          (Press <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border">d</kbd> to toggle dark mode)
        </div>
      </main>

      <footer className="py-12 border-t border-border/40 text-center text-sm text-muted-foreground">
        <p>&copy; 2026 StreamForge. All rights reserved.</p>
      </footer>
    </div>
  )
}
