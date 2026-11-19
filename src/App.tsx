import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import { mapResource, type ResourceRow } from './lib/mapResource'
import { ResourceContext } from './lib/resourceContext'
import type { Resource } from './types/resource'
import Auth from './pages/Auth'
import ResetPassword from './pages/ResetPassword'
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
  const [recovering, setRecovering] = useState(false)

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
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === 'PASSWORD_RECOVERY') {
        setRecovering(true)
      }
      setSession(newSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  const userId = session?.user.id

  // ---------- Resources ----------
  const [resources, setResources] = useState<Resource[]>([])
  const [resourcesLoading, setResourcesLoading] = useState(true)
  const [resourcesError, setResourcesError] = useState('')

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

  // ---------- Bookmarks ----------
  const [savedResourceIds, setSavedResourceIds] = useState<string[]>([])

  useEffect(() => {
    if (!userId) {
      setSavedResourceIds([])
      return
    }

    const loadBookmarks = async () => {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('resource_id')

      if (error) {
        console.error('Could not load bookmarks:', error.message)
        return
      }

      setSavedResourceIds(data.map((row) => row.resource_id))
    }

    loadBookmarks()
  }, [userId])
  const [displayName, setDisplayName] = useState('')

useEffect(() => {
  if (!userId) {
    setDisplayName('')
    return
  }

  const loadProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.error('Could not load profile:', error.message)
      return
    }

    setDisplayName(data?.full_name ?? '')
  }

  loadProfile()
}, [userId])

  // ---------- UI state ----------
  const [activeNav, setActiveNav] = useState('Overview')
  const [search, setSearch] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)

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

  const handleResourceDeleted = (resourceId: string) => {
    setResources((current) => current.filter((r) => r.id !== resourceId))
    setSavedResourceIds((current) => current.filter((id) => id !== resourceId))
  }

  const handleToggleSave = async (resourceId: string) => {
    if (!userId) return

    const isSaved = savedResourceIds.includes(resourceId)

    // Update the screen immediately so it feels instant
    setSavedResourceIds((current) =>
      isSaved
        ? current.filter((id) => id !== resourceId)
        : [...current, resourceId]
    )

    const { error } = isSaved
      ? await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', userId)
          .eq('resource_id', resourceId)
      : await supabase
          .from('bookmarks')
          .insert({ resource_id: resourceId })

    if (error) {
      console.error('Bookmark update failed:', error.message)

      // Undo the screen change if the database rejected it
      setSavedResourceIds((current) =>
        isSaved
          ? [...current, resourceId]
          : current.filter((id) => id !== resourceId)
      )

      alert('Could not update your bookmark. Please try again.')
    }
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

  if (recovering) {
    return <ResetPassword onDone={() => setRecovering(false)} />
  }

  // ---------- Render ----------
  return (
    <ResourceContext.Provider
      value={{
        currentUserId: userId,
        onResourceDeleted: handleResourceDeleted,
      }}
    >
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
              userName={displayName}
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
                allResources={resources}
                bookmarkCount={savedResourceIds.length}
                onNavigate={setActiveNav}
                onAddResource={handleAddResource}
              />
            ) : activeNav === 'Student Library' ? (
              <StudentLibrary
                search={search}
                resourceCount={resources.length}
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
    </ResourceContext.Provider>
  )
}

export default App