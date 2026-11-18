import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import { mapResource, type ResourceRow } from './lib/mapResource'
import type { Resource } from './types/resource'
import Auth from './pages/Auth'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import PlaceholderPage from './components/layout/PlaceholderPage'
import Dashboard from './pages/Dashboard'
import StudentLibrary from './pages/StudentLibrary'
import CourseUnits from './pages/CourseUnits'
import PastPapers from './pages/PastPapers'
import Bookmarks from './pages/Bookmarks'
import MyLibrary from './pages/MyLibrary'

function App() {
  // ---------- Auth ----------
  const [session, setSession] = useState<Session | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('Could not retrieve session:', error.message)
      }

      setSession(data.session)
      setAuthLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  // ---------- Resources ----------
  const [resources, setResources] = useState<Resource[]>([])
  const [resourcesLoading, setResourcesLoading] = useState(true)
  const [resourcesError, setResourcesError] = useState('')

  const userId = session?.user.id

  useEffect(() => {
    if (!userId) {
      setResources([])
      return
    }

    const loadResources = async () => {
      setResourcesLoading(true)
      setResourcesError('')

      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setResourcesError(error.message)
      } else {
        setResources((data as ResourceRow[]).map(mapResource))
      }

      setResourcesLoading(false)
    }

    loadResources()
  }, [userId])

  // ---------- UI state ----------
  const [activeNav, setActiveNav] = useState('Overview')
  const [search, setSearch] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [savedResourceIds, setSavedResourceIds] = useState<string[]>([])

  useEffect(() => {
    document.body.style.overflow = mobileMenu ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenu])

  // ---------- Handlers ----------
  const handleAddResource = (newResource: Resource) => {
    setResources((current) => [newResource, ...current])
  }

  const handleToggleSave = (resourceId: string) => {
    setSavedResourceIds((current) =>
      current.includes(resourceId)
        ? current.filter((id) => id !== resourceId)
        : [...current, resourceId]
    )
  }

  const filteredResources = resources.filter((resource) =>
    `${resource.title} ${resource.unit} ${resource.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  // ---------- Early returns (after all hooks) ----------
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading CampusVault...</p>
      </div>
    )
  }

  if (!session) {
    return <Auth />
  }

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-white text-vault-black font-body">
      <div className="flex min-h-screen">
        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          mobileMenu={mobileMenu}
          setMobileMenu={setMobileMenu}
        />

        <main className="flex-1 min-w-0 px-5 sm:px-8 lg:px-12 py-7">
          <Topbar
            activeNav={activeNav}
            search={search}
            setSearch={setSearch}
            mobileMenu={mobileMenu}
            setMobileMenu={setMobileMenu}
            userEmail={session.user.email ?? ''}
          />

          {resourcesLoading && (
            <p className="text-sm text-gray-400 mb-4">
              Loading resources...
            </p>
          )}

          {resourcesError && (
            <p className="text-sm text-red-500 mb-4">
              Could not load resources: {resourcesError}
            </p>
          )}

          {activeNav === 'Overview' ? (
            <Dashboard
              resources={filteredResources}
              onNavigate={setActiveNav}
              onAddResource={handleAddResource}
            />
          ) : activeNav === 'Student Library' ? (
            <StudentLibrary
              resources={filteredResources}
              savedResourceIds={savedResourceIds}
              onToggleSave={handleToggleSave}
            />
          ) : activeNav === 'Course Units' ? (
            <CourseUnits
              resources={resources}
              savedResourceIds={savedResourceIds}
              onToggleSave={handleToggleSave}
            />
          ) : activeNav === 'Past Papers' ? (
            <PastPapers
              resources={resources}
              savedResourceIds={savedResourceIds}
              onToggleSave={handleToggleSave}
            />
          ) : activeNav === 'Bookmarks' ? (
            <Bookmarks
              resources={resources}
              savedResourceIds={savedResourceIds}
              onToggleSave={handleToggleSave}
            />
          ) : activeNav === 'My Library' ? (
            <MyLibrary
              resources={resources}
              savedResourcesIds={savedResourceIds}
            />
          ) : (
            <PlaceholderPage
              title={activeNav}
              description={`Your ${activeNav.toLowerCase()} workspace. We're building this section to help you manage your academic resources more effectively.`}
            />
          )}

          <footer className="border-t border-gray-100 pt-6 pb-4 flex flex-col sm:flex-row justify-between gap-2">
            <p className="font-heading text-xl tracking-wide">
              CAMPUS<span className="text-vault-green">VAULT</span>
            </p>
            <p className="text-[10px] text-gray-400">
              YOUR ACADEMIC WORLD, ORGANIZED.
            </p>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default App