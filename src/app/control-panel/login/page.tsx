'use client'

import React, { useActionState, useEffect } from 'react'
import { login } from '../actions'
import { Lock, User, AlertCircle, Briefcase } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(login, null)

  useEffect(() => {
    if (state?.success) {
      router.refresh()
      router.push('/control-panel/dashboard')
    }
  }, [state, router])

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#004ac6_0,transparent_50%)] opacity-30"></div>
      
      <div className="w-full max-w-md bg-slate-800/50 border border-slate-700/80 rounded-2xl p-8 shadow-2xl backdrop-blur-md relative z-10 space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
            <Briefcase className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">NewFreeJobAlert Control Panel</h1>
          <p className="text-xs text-slate-400">Please authenticate to access database administration tools</p>
        </div>

        {/* Login Form */}
        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-3.5 rounded-xl flex items-center gap-2 text-xs font-semibold">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <User className="h-4 w-4" />
                </span>
                <input 
                  type="text" 
                  name="username" 
                  required
                  placeholder="admin"
                  className="w-full h-11 pl-10 pr-4 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-white focus:border-primary focus:outline-none transition-all placeholder-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input 
                  type="password" 
                  name="password" 
                  required
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-4 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-white focus:border-primary focus:outline-none transition-all placeholder-slate-600"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-11 bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            {isPending ? "Authenticating..." : "Login to Control Panel"}
          </button>
        </form>
      </div>
    </div>
  );
}
