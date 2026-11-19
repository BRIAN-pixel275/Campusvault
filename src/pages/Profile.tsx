import { useEffect, useState } from 'react'
import { UserRound } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface ProfileProps {
  userId: string
  email: string
  onSaved: (fullName: string) => void
}

interface Feedback {
  type: 'success' | 'error'
  text: string
}

function Profile({ userId, email, onSaved }: ProfileProps) {
  const [fullName, setFullName] = useState('')
  const [university, setUniversity] = useState('')
  const [course, setCourse] = useState('')
  const [year, setYear] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadProfile = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, university, course, year_of_study')
        .eq('id', userId)
        .maybeSingle()

      if (cancelled) return

      if (error) {
        setFeedback({ type: 'error', text: 'Could not load your profile.' })
      } else if (data) {
        setFullName(data.full_name ?? '')
        setUniversity(data.university ?? '')
        setCourse(data.course ?? '')
        setYear(data.year_of_study ? String(data.year_of_study) : '')
      }

      setLoading(false)
    }

    loadProfile()

    return () => {
      cancelled = true
    }
  }, [userId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFeedback(null)

    const trimmedName = fullName.trim()

    if (!trimmedName) {
      setFeedback({ type: 'error', text: 'Please enter your full name.' })
      return
    }

    setSaving(true)

    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      full_name: trimmedName,
      university: university.trim() || null,
      course: course.trim() || null,
      year_of_study: year ? Number(year) : null,
      updated_at: new Date().toISOString(),
    })

    setSaving(false)

    if (error) {
      console.error('Profile update failed:', error.message)
      setFeedback({
        type: 'error',
        text: 'Could not save your profile. Please try again.',
      })
      return
    }

    setFullName(trimmedName)
    onSaved(trimmedName)
    setFeedback({ type: 'success', text: 'Profile updated.' })
  }

  const inputClass =
    'w-full border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-vault-green'

  return (
    <div className="space-y-8 max-w-2xl">
      <section>
        <div className="flex items-center gap-2 text-vault-green mb-2">
          <UserRound size={20} />
          <span className="text-xs font-semibold uppercase tracking-widest">
            Your account
          </span>
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl tracking-wide">
          PROFILE
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          Other students see your name next to the resources you upload.
        </p>
      </section>

      {loading ? (
        <p className="text-sm text-gray-400">Loading your profile...</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="border border-gray-100 rounded-2xl p-6 sm:p-8 space-y-5 bg-white"
        >
          <div>
            <label className="text-sm font-medium block mb-2">Email</label>
            <input
              value={email}
              disabled
              className={`${inputClass} bg-gray-50 text-gray-400 cursor-not-allowed`}
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Your email is private and isn't shown to other students.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">
              Full name
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              maxLength={80}
              required
              placeholder="Your full name"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">
              University
            </label>
            <input
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              maxLength={100}
              placeholder="e.g. Kenyatta University"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium block mb-2">
                Course / programme
              </label>
              <input
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                maxLength={100}
                placeholder="e.g. Economics and Finance"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">
                Year of study
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={`${inputClass} bg-white`}
              >
                <option value="">Select</option>
                {[1, 2, 3, 4, 5, 6].map((y) => (
                  <option key={y} value={y}>
                    Year {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {feedback && (
            <div
              className={`rounded-xl p-3 text-sm border ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                  : 'bg-red-50 border-red-100 text-red-600'
              }`}
            >
              {feedback.text}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="bg-vault-green text-white rounded-xl px-6 py-3 font-medium text-sm hover:opacity-90 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      )}
    </div>
  )
}

export default Profile