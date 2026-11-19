import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { BookOpen, Eye, EyeOff, Lock, Mail } from 'lucide-react'

type Mode = 'login' | 'signup' | 'forgot'

function Auth() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
    const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')

  const switchMode = (next: Mode) => {
    setMode(next)
    setMessage('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: { data: { full_name: fullName.trim() } },
})
        if (error) throw error

        if (!data.session) {
          setMessage(
            'Account created! Check your email to confirm your account before signing in.'
          )
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        })

        if (error) throw error

        // Same message whether or not the account exists
        setMessage(
          'If an account exists for that email, a reset link is on its way. Check your inbox and spam folder.'
        )
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const heading =
    mode === 'login'
      ? 'Welcome back'
      : mode === 'signup'
        ? 'Create your account'
        : 'Reset your password'

  const subheading =
    mode === 'login'
      ? 'Sign in to access your academic resources.'
      : mode === 'signup'
        ? 'Join CampusVault and organize your academic world.'
        : "Enter your email and we'll send you a link to set a new password."

  const submitLabel =
    mode === 'login'
      ? 'Sign In'
      : mode === 'signup'
        ? 'Create Account'
        : 'Send Reset Link'

  return (
    <div className="min-h-screen bg-[#F5F6F5] flex items-center justify-center px-5 py-10 font-body">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-vault-green rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="text-white" size={28} />
          </div>

          <h1 className="font-heading text-4xl tracking-wide">
            CAMPUS<span className="text-vault-green">VAULT</span>
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Your academic world, organized.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 sm:p-9">
          <div className="mb-7">
            <h2 className="text-2xl font-semibold">{heading}</h2>
            <p className="text-sm text-gray-500 mt-2">{subheading}</p>
          </div>
{mode === 'signup' && (
  <div>
    <label className="text-sm font-medium block mb-2">Full name</label>
    <input
      type="text"
      required
      maxLength={80}
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
      placeholder="Your full name"
      className="w-full border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-vault-green"
    />
  </div>
)}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium block mb-2">
                Email address
              </label>

              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-vault-green"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Password</label>

                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-xs text-vault-green font-medium hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-11 text-sm outline-none focus:border-vault-green"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {message && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-600">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-vault-green text-white rounded-xl py-3 font-medium text-sm hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Please wait...' : submitLabel}
            </button>
          </form>

          <div className="text-center mt-7 text-sm text-gray-500">
            {mode === 'forgot' ? (
              <button
                onClick={() => switchMode('login')}
                className="text-vault-green font-semibold"
              >
                Back to sign in
              </button>
            ) : (
              <>
                {mode === 'login'
                  ? "Don't have an account?"
                  : 'Already have an account?'}

                <button
                  onClick={() =>
                    switchMode(mode === 'login' ? 'signup' : 'login')
                  }
                  className="text-vault-green font-semibold ml-1"
                >
                  {mode === 'login' ? 'Create account' : 'Sign in'}
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-7">
          CAMPUSVAULT © 2026 · YOUR ACADEMIC WORLD
        </p>
      </div>
    </div>
  )
}

export default Auth