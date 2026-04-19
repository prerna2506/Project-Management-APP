'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LayoutDashboard, Loader2, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // Removed local error text state, we use sonner toast now for a premium feel
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please fill in both email and password.')
      return
    }

    const supabase = createClient()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        toast.error(error.message, { description: 'Please check your credentials and try again.' })
        setIsLoading(false)
        return
      }
      
      // Success feedback!
      toast.success('Successfully logged in!', {
        description: 'Redirecting you to your workspace...',
      })
      
      // Successfully logged in; keep isLoading true to prevent layout flash before redirect
      router.push('/dashboard')
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'An error occurred'
      toast.error('Login Failed', { description: msg })
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0A0A0B] selection:bg-primary/30">
      {/* Premium Background Effects */}
      <div className="absolute top-0 -left-1/4 w-[150%] h-full bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 -right-1/4 w-[150%] h-full bg-gradient-to-tl from-emerald-500/10 via-teal-500/5 to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />

      <div className="w-full max-w-md px-6 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center gap-3 mb-10">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] border border-white/10 relative group">
            <LayoutDashboard className="h-7 w-7 text-white" />
            <div className="absolute inset-0 bg-white/20 blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Welcome back</h1>
            <p className="text-sm text-zinc-400">Enter your credentials to access your workspace</p>
          </div>
        </div>

        {/* Glassmorphic Card Form */}
        <div className="relative backdrop-blur-xl bg-zinc-950/40 border border-white/5 rounded-3xl p-8 shadow-2xl">
          {/* Subtle top border glow */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="h-12 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 transition-all rounded-xl"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Password</Label>
                <Link href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="h-12 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 transition-all rounded-xl"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 mt-2 bg-white text-zinc-950 hover:bg-zinc-200 focus:bg-zinc-200 transition-all rounded-xl text-base font-semibold group disabled:bg-zinc-400 disabled:opacity-80 disabled:cursor-not-allowed overflow-hidden relative" 
              disabled={isLoading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <span className="text-sm text-zinc-400">
              New to TaskFlow?{' '}
              <Link
                href="/auth/sign-up"
                className="text-white hover:text-indigo-400 font-medium transition-colors"
              >
                Create an account
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
