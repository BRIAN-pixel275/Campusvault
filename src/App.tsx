
import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Dashboard from './pages/Dashboard'
import PlaceholderPage from './components/layout/PlaceholderPage'
import MyLibrary from './pages/MyLibrary'
import type { Resource } from './types/resource'
import { useEffect } from 'react'


function App() {

  const [resources, setResources] = useState<Resource[]>([
  {
    title: 'Introduction to Microeconomics',
    unit: 'Microeconomics I',
    category: 'LECTURE NOTES',
    date: '10 Nov 2026',
    type: 'PDF',
  },
  {
    title: 'Financial Management CAT 1',
    unit: 'Financial Management',
    category: 'CAT PAPER',
    date: '08 Nov 2026',
    type: 'PDF',
  },
  {
    title: 'Statistical Methods Revision',
    unit: 'Statistics',
    category: 'REVISION NOTES',
    date: '05 Nov 2026',
    type: 'PDF',
  },
  {
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

  const filteredResources = resources.filter((resource) =>
    `${resource.title} ${resource.unit} ${resource.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

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
/>

    

     {activeNav === 'Overview' ? (
  <Dashboard
    resources={filteredResources}
    onNavigate={setActiveNav}
    onAddResource={handleAddResource}
  />
) : activeNav === 'My Library' ? (
  <MyLibrary resources={filteredResources} />
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
