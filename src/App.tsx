import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Auth from './pages/Auth'
import type { Session } from '@supabase/supabase-js'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Dashboard from './pages/Dashboard'
import PlaceholderPage from './components/layout/PlaceholderPage'
import MyLibrary from './pages/MyLibrary'
import type { Resource } from './types/resource'
import StudentLibrary from './pages/StudentLibrary'
import CourseUnits from './pages/CourseUnits'
import PastPapers from './pages/PastPapers'
import Bookmarks from './pages/Bookmarks'



function App() {

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
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session)
  })

  return () => subscription.unsubscribe()
}, [])

  const [resources, setResources] = useState<Resource[]>([
  {
    id: 'resource-001',
    title: 'Introduction to Microeconomics',
    unit: 'Microeconomics I',
    category: 'LECTURE NOTES',
    date: '10 Nov 2026',
    type: 'PDF',
  },
  {
    id: 'resource-002',
    title: 'Financial Management CAT 1',
    unit: 'Financial Management',
    category: 'CAT PAPER',
    date: '08 Nov 2026',
    type: 'PDF',
  },
  {
    id: 'resource-003',
    title: 'Statistical Methods Revision',
    unit: 'Statistics',
    category: 'REVISION NOTES',
    date: '05 Nov 2026',
    type: 'PDF',
  },
  {
    id: 'resource-004',
    title: 'Macroeconomics Assignment',
    unit: 'Macroeconomics II',
    category: 'ASSIGNMENT',
    date: '03 Nov 2026',
    type: 'PDF',
  },
  {
    id: 'resource-005',
    title: 'Public Finance Examination',
    unit: 'Public Finance',
    category: 'PAST PAPER',
    date: '02 Nov 2026',
    type: 'PDF',
  },
])
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

const handleAddResource = (newResource: Resource) => {
  setResources((currentResources) => [
    newResource,
    ...currentResources,
  ])
}
const handleToggleSave = (resourceId: string) => {
  setSavedResourceIds((currentSaved) =>
    currentSaved.includes(resourceId)
      ? currentSaved.filter((id) => id !== resourceId)
      : [...currentSaved, resourceId]
  )
}
  const filteredResources = resources.filter((resource) =>
    `${resource.title} ${resource.unit} ${resource.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  if (authLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-sm">
        Loading CampusVault...
      </p>
    </div>
  )
}

if (!session) {
  return <Auth />
}

return (
  <div className="min-h-screen bg-white text-vault-black font-body">

     

      <div className="flex min-h-screen">
        {/* SIDEBAR COMPONENT */}
<Sidebar
  activeNav={activeNav}
  setActiveNav={setActiveNav}
  mobileMenu={mobileMenu}
  setMobileMenu={setMobileMenu}
/>


        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 px-5 sm:px-8 lg:px-12 py-7">

      <Topbar
  activeNav={activeNav}
  search={search}
  setSearch={setSearch}
  mobileMenu={mobileMenu}
  setMobileMenu={setMobileMenu}
  userEmail={session.user.email ?? ''}
/>

    

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
        

          {/* FOOTER */}
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
