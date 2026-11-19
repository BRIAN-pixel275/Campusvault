import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { BookOpen, Eye, EyeOff, Lock } from 'lucide-react'

interface ResetPasswordProps {
  onDone: () => void
}

function ResetPassword({ onDone }: ResetPasswordProps) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage('')

    if (password !== confirm) {
      setMessage('The two passwords do not match.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (error) {
      setMessage(error.message)
      return
    }

    setSuccess(true)
    setMessage('Password updated! Taking you to your dashboard...')

    // Clear the recovery token from the address bar, then continue
    window.history.replaceState({}, document.title, window.location.pathname)
    setTimeout(onDone, 1500)
  }

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
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 sm:p-9">
          <div className="mb-7">
            <h2 className="text-2xl font-semibold">Set a new password</h2>
            <p className="text-sm text-gray-500 mt-2">
              Choose a new password for your CampusVault account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium block mb-2">
                New password
              </label>

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
                  placeholder="Enter a new password"
                  className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-11 text-sm outline-none focus:border-vault-green"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">
                Confirm new password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />

                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat the new password"
                  className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-vault-green"
                />
              </div>
            </div>

            {message && (
              <div
                className={`rounded-xl p-3 text-sm border ${
                  success
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600'
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-vault-green text-white rounded-xl py-3 font-medium text-sm hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Please wait...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword