'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [terminalText, setTerminalText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [level, setLevel] = useState<'beginner' | 'advanced'>('beginner')

  const command = 'npm install -g @jrdaws/framework'

  useEffect(() => {
    let i = 0
    const typingInterval = setInterval(() => {
      if (i < command.length) {
        setTerminalText(command.slice(0, i + 1))
        i++
      } else {
        clearInterval(typingInterval)
      }
    }, 100)

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => {
      clearInterval(typingInterval)
      clearInterval(cursorInterval)
    }
  }, [])

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Scanline effect */}
      <div className="scanline" />

      {/* Background grid */}
      <div className="fixed inset-0 opacity-10 pointer-events-none"
           style={{
             backgroundImage: 'linear-gradient(#00ff41 1px, transparent 1px), linear-gradient(90deg, #00ff41 1px, transparent 1px)',
             backgroundSize: '50px 50px'
           }} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* ASCII Art Logo */}
          <pre className="text-terminal-text text-xs md:text-sm mb-8 opacity-50 leading-tight">
{`    ___                                     _
   / _|_ __ __ _ _ __ ___   _____      _____  _ __| | __
  | |_| '__/ _\` | '_ \` _ \\ / _ \\ \\ /\\ / / _ \\| '__| |/ /
  |  _| | | (_| | | | | | |  __/\\ V  V / (_) | |  |   <
  |_| |_|  \\__,_|_| |_| |_|\\___| \\_/\\_/ \\___/|_|  |_|\\_\\`}
          </pre>

          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 glow-text">
            From idea to production<br />
            <span className="text-terminal-accent glow-accent">in minutes, not days</span>
          </h1>

          <p className="text-xl md:text-2xl text-terminal-dim mb-12 max-w-3xl mx-auto">
            A CLI scaffolding system with plugins, templates, and provider integrations.
            <br />Ship faster. Stay secure. Scale confidently.
          </p>

          {/* Animated Terminal */}
          <div className="terminal-window max-w-2xl mx-auto mb-8">
            <div className="terminal-header">
              <div className="terminal-dot bg-terminal-error"></div>
              <div className="terminal-dot bg-terminal-warning"></div>
              <div className="terminal-dot bg-terminal-text"></div>
              <span className="text-xs text-terminal-dim ml-2">terminal</span>
            </div>
            <div className="terminal-content text-left">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-terminal-accent">$</span>
                <span className="text-terminal-text">{terminalText}</span>
                {showCursor && <span className="inline-block w-2 h-5 bg-terminal-text animate-blink"></span>}
              </div>
              {terminalText === command && (
                <div className="animate-fade-in">
                  <div className="text-terminal-dim">Installing @jrdaws/framework...</div>
                  <div className="text-terminal-text mt-2">✓ Installation complete</div>
                  <div className="text-terminal-dim mt-4">Run: framework --help</div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="btn-primary">
              Get Started →
            </button>
            <a href="https://github.com/jrdaws/dawson-does-framework"
               target="_blank"
               rel="noopener noreferrer"
               className="btn-secondary">
              View on GitHub ↗
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-terminal-text glow-text">192</div>
              <div className="text-sm text-terminal-dim">Tests Passing</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-terminal-text glow-text">0.3.0</div>
              <div className="text-sm text-terminal-dim">Latest Version</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-terminal-text glow-text">8+</div>
              <div className="text-sm text-terminal-dim">Providers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-4 glow-text">
            Built for Speed, Trust & Scale
          </h2>
          <p className="text-center text-terminal-dim mb-16 max-w-2xl mx-auto">
            Everything you need to ship production-ready applications, from templates to providers
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Templates */}
            <div className="feature-card">
              <div className="text-3xl mb-4">📦</div>
              <h3 className="text-xl font-display font-bold mb-2 text-terminal-text">Template Registry</h3>
              <p className="text-terminal-dim mb-4">
                Production-ready templates for SaaS, directories, and more. Searchable, versioned, and extensible.
              </p>
              <code className="text-xs text-terminal-accent">framework templates list</code>
            </div>

            {/* Feature 2: Plugins */}
            <div className="feature-card">
              <div className="text-3xl mb-4">🔌</div>
              <h3 className="text-xl font-display font-bold mb-2 text-terminal-text">Plugin System</h3>
              <p className="text-terminal-dim mb-4">
                Hook into export, health checks, and more. Extend functionality without forking.
              </p>
              <code className="text-xs text-terminal-accent">framework plugin add</code>
            </div>

            {/* Feature 3: Providers */}
            <div className="feature-card">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-display font-bold mb-2 text-terminal-text">Provider Integrations</h3>
              <p className="text-terminal-dim mb-4">
                Auth, billing, LLMs, and webhooks. Battle-tested implementations you can trust.
              </p>
              <code className="text-xs text-terminal-accent">auth.supabase, billing.stripe</code>
            </div>

            {/* Feature 4: Trust */}
            <div className="feature-card">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="text-xl font-display font-bold mb-2 text-terminal-text">Trust Primitives</h3>
              <p className="text-terminal-dim mb-4">
                Drift detection, health checks, and compliance monitoring built-in from day one.
              </p>
              <code className="text-xs text-terminal-accent">framework drift</code>
            </div>

            {/* Feature 5: CLI */}
            <div className="feature-card">
              <div className="text-3xl mb-4">⌨️</div>
              <h3 className="text-xl font-display font-bold mb-2 text-terminal-text">Powerful CLI</h3>
              <p className="text-terminal-dim mb-4">
                Intuitive commands for export, health checks, doctor, and more. Built for developer experience.
              </p>
              <code className="text-xs text-terminal-accent">framework export saas ./app</code>
            </div>

            {/* Feature 6: Extensible */}
            <div className="feature-card">
              <div className="text-3xl mb-4">🔧</div>
              <h3 className="text-xl font-display font-bold mb-2 text-terminal-text">Fully Extensible</h3>
              <p className="text-terminal-dim mb-4">
                Custom templates, private registries, and capability overrides. Own your stack.
              </p>
              <code className="text-xs text-terminal-accent">.dd/config.json</code>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section with Toggle */}
      <section className="relative py-20 px-4 bg-terminal-text/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 glow-text">
              See It In Action
            </h2>

            {/* Beginner/Advanced Toggle */}
            <div className="inline-flex items-center gap-4 bg-terminal-bg border-2 border-terminal-text/30 rounded-lg p-1">
              <button
                onClick={() => setLevel('beginner')}
                className={`px-6 py-2 rounded-md font-mono transition-all duration-300 ${
                  level === 'beginner'
                    ? 'bg-terminal-text text-terminal-bg font-bold'
                    : 'text-terminal-dim hover:text-terminal-text'
                }`}
              >
                Beginner
              </button>
              <button
                onClick={() => setLevel('advanced')}
                className={`px-6 py-2 rounded-md font-mono transition-all duration-300 ${
                  level === 'advanced'
                    ? 'bg-terminal-text text-terminal-bg font-bold'
                    : 'text-terminal-dim hover:text-terminal-text'
                }`}
              >
                Advanced
              </button>
            </div>
          </div>

          {level === 'beginner' ? (
            <div className="space-y-6">
              <div className="terminal-window">
                <div className="terminal-header">
                  <div className="terminal-dot bg-terminal-error"></div>
                  <div className="terminal-dot bg-terminal-warning"></div>
                  <div className="terminal-dot bg-terminal-text"></div>
                  <span className="text-xs text-terminal-dim ml-2">Quick Start</span>
                </div>
                <div className="terminal-content">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-terminal-accent">$</span>
                      <div>
                        <div className="text-terminal-text">npm install -g @jrdaws/framework</div>
                        <div className="text-terminal-dim text-xs mt-1">Install globally</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-terminal-accent">$</span>
                      <div>
                        <div className="text-terminal-text">framework export saas ./my-app</div>
                        <div className="text-terminal-dim text-xs mt-1">Export SaaS template with auth & billing</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-terminal-accent">$</span>
                      <div>
                        <div className="text-terminal-text">cd my-app && npm install</div>
                        <div className="text-terminal-dim text-xs mt-1">Install dependencies</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-terminal-accent">$</span>
                      <div>
                        <div className="text-terminal-text">npm run dev</div>
                        <div className="text-terminal-dim text-xs mt-1">Start development server</div>
                      </div>
                    </div>
                    <div className="border-l-2 border-terminal-text pl-4 mt-4">
                      <div className="text-terminal-text">✓ Your SaaS app is running at http://localhost:3000</div>
                      <div className="text-terminal-dim text-xs mt-1">Auth, billing, and database configured</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="terminal-window">
                <div className="terminal-header">
                  <div className="terminal-dot bg-terminal-error"></div>
                  <div className="terminal-dot bg-terminal-warning"></div>
                  <div className="terminal-dot bg-terminal-text"></div>
                  <span className="text-xs text-terminal-dim ml-2">Advanced Workflow</span>
                </div>
                <div className="terminal-content">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-terminal-accent">$</span>
                      <div>
                        <div className="text-terminal-text">framework templates search saas</div>
                        <div className="text-terminal-dim text-xs mt-1">Search available templates</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-terminal-accent">$</span>
                      <div>
                        <div className="text-terminal-text">framework export saas ./my-app --name "MyApp"</div>
                        <div className="text-terminal-dim text-xs mt-1">Export with custom name</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-terminal-accent">$</span>
                      <div>
                        <div className="text-terminal-text">cd my-app && framework health</div>
                        <div className="text-terminal-dim text-xs mt-1">Run health checks</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-terminal-accent">$</span>
                      <div>
                        <div className="text-terminal-text">framework drift</div>
                        <div className="text-terminal-dim text-xs mt-1">Check for configuration drift</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-terminal-accent">$</span>
                      <div>
                        <div className="text-terminal-text">framework plugin add ./my-plugin.mjs</div>
                        <div className="text-terminal-dim text-xs mt-1">Add custom plugin</div>
                      </div>
                    </div>
                    <div className="border-l-2 border-terminal-accent pl-4 mt-4">
                      <div className="text-terminal-accent">✓ Advanced features configured</div>
                      <div className="text-terminal-dim text-xs mt-1">Plugins, health monitoring, and drift detection active</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Code Comparison */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-4 glow-text">
            The Before & After
          </h2>
          <p className="text-center text-terminal-dim mb-16 max-w-2xl mx-auto">
            Stop copy-pasting boilerplate. Start with battle-tested foundations.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Before */}
            <div>
              <div className="text-terminal-error mb-3 font-bold flex items-center gap-2">
                <span className="text-2xl">✗</span>
                <span>Without Framework</span>
              </div>
              <div className="code-block">
                <pre className="text-xs leading-relaxed text-terminal-dim">
{`// Hours of setup...
mkdir my-app && cd my-app
npm init -y
npm install next react react-dom
npm install @supabase/supabase-js
npm install stripe
mkdir src app components lib
// Copy-paste auth logic from tutorial
// Copy-paste billing logic from docs
// Hope it all works together
// Debug integration issues
// Add error handling
// Add types
// Add tests (maybe?)
// Configure environment variables
// Set up deployment
// ...still not production-ready`}
                </pre>
              </div>
            </div>

            {/* After */}
            <div>
              <div className="text-terminal-text mb-3 font-bold flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>With Framework</span>
              </div>
              <div className="code-block">
                <pre className="text-xs leading-relaxed text-terminal-text">
{`// 1 command, minutes of work
framework export saas ./my-app

// ✓ Next.js 15 + App Router
// ✓ TypeScript configured
// ✓ Supabase auth integrated
// ✓ Stripe billing connected
// ✓ shadcn/ui components
// ✓ Environment variables templated
// ✓ Health checks built-in
// ✓ Drift detection enabled
// ✓ Error handling included
// ✓ Types generated
// ✓ Tests ready
// ✓ Production-ready from day 1

cd my-app && npm run dev
// Ship it 🚀`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-20 px-4 bg-terminal-text/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-16 glow-text">
            Built by Developers, for Developers
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="terminal-window p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">👨‍💻</div>
                <div>
                  <p className="text-terminal-text mb-3">
                    "Finally, a scaffolding tool that doesn't make me tear out the code after day 1.
                    The provider integrations actually work."
                  </p>
                  <div className="text-terminal-dim text-sm">
                    <div className="font-bold text-terminal-accent">— Early Adopter</div>
                    <div>Full-stack Developer</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="terminal-window p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🚀</div>
                <div>
                  <p className="text-terminal-text mb-3">
                    "The plugin system is genius. I can hook into the export process
                    and add our internal tools without forking."
                  </p>
                  <div className="text-terminal-dim text-sm">
                    <div className="font-bold text-terminal-accent">— Tech Lead</div>
                    <div>Enterprise SaaS</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="terminal-window p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">⚡</div>
                <div>
                  <p className="text-terminal-text mb-3">
                    "Went from idea to deployed MVP in 2 hours. Auth, billing, and database
                    just worked. This is the future."
                  </p>
                  <div className="text-terminal-dim text-sm">
                    <div className="font-bold text-terminal-accent">— Solo Founder</div>
                    <div>Indie Hacker</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="terminal-window p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🛡️</div>
                <div>
                  <p className="text-terminal-text mb-3">
                    "The trust primitives (drift detection, health checks) saved us from
                    a critical config error in production."
                  </p>
                  <div className="text-terminal-dim text-sm">
                    <div className="font-bold text-terminal-accent">— DevOps Engineer</div>
                    <div>Growing Startup</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 glow-text">
            Ready to Ship Faster?
          </h2>
          <p className="text-xl text-terminal-dim mb-12">
            Join developers who are building production apps in minutes, not days
          </p>

          <div className="terminal-window max-w-2xl mx-auto mb-8">
            <div className="terminal-content text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-terminal-accent">$</span>
                <span className="text-terminal-text">npm install -g @jrdaws/framework</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-terminal-accent">$</span>
                <span className="text-terminal-text">framework export saas ./my-app</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="btn-primary text-lg">
              Get Started Now →
            </button>
            <a href="https://www.npmjs.com/package/@jrdaws/framework"
               target="_blank"
               rel="noopener noreferrer"
               className="btn-secondary text-lg">
              View on npm ↗
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-terminal-text/20 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-display font-bold text-terminal-text mb-4">Framework</h3>
              <p className="text-sm text-terminal-dim">
                A CLI scaffolding system for shipping production-ready applications faster.
              </p>
            </div>
            <div>
              <h4 className="font-display font-bold text-terminal-text mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-terminal-dim">
                <li><a href="https://github.com/jrdaws/dawson-does-framework" className="hover:text-terminal-text transition-colors">Documentation</a></li>
                <li><a href="https://github.com/jrdaws/dawson-does-framework/tree/main/templates" className="hover:text-terminal-text transition-colors">Templates</a></li>
                <li><a href="https://github.com/jrdaws/dawson-does-framework/blob/main/docs/PLUGIN_API.md" className="hover:text-terminal-text transition-colors">Plugin API</a></li>
                <li><a href="https://github.com/jrdaws/dawson-does-framework/blob/main/docs/TEMPLATE_REGISTRY.md" className="hover:text-terminal-text transition-colors">Registry</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold text-terminal-text mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-terminal-dim">
                <li><a href="https://github.com/jrdaws/dawson-does-framework" className="hover:text-terminal-text transition-colors">GitHub</a></li>
                <li><a href="https://www.npmjs.com/package/@jrdaws/framework" className="hover:text-terminal-text transition-colors">npm</a></li>
                <li><a href="https://github.com/jrdaws/dawson-does-framework/issues" className="hover:text-terminal-text transition-colors">Issues</a></li>
                <li><a href="https://github.com/jrdaws/dawson-does-framework/blob/main/CHANGELOG.md" className="hover:text-terminal-text transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold text-terminal-text mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-terminal-dim">
                <li><a href="https://github.com/jrdaws/dawson-does-framework/blob/main/LICENSE" className="hover:text-terminal-text transition-colors">License</a></li>
                <li><a href="#" className="hover:text-terminal-text transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-terminal-text transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-terminal-text/20 pt-8 text-center text-sm text-terminal-dim">
            <p>© 2024 @jrdaws/framework. Built with ❤️ and ☕ by developers, for developers.</p>
            <p className="mt-2">
              <code className="text-xs">v0.3.0</code> • <span className="text-terminal-text">192 tests passing</span> • <span className="text-terminal-accent">MIT License</span>
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
