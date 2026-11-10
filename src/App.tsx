
import { useRef, useState } from 'react'
import {
  BookOpen,
  FileText,
  Bookmark,
  Plus,
  Upload,
  FolderOpen,
  ArrowUpRight,
  MoreHorizontal,
  GraduationCap,
  File,
  CheckCircle2,
} from 'lucide-react'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import { useEffect } from 'react'

const resources = [
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
]





function App() {
  const [activeNav, setActiveNav] = useState('Overview')
  const [search, setSearch] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [selectedFile, setSelectedFile] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
  document.body.style.overflow = mobileMenu ? 'hidden' : ''

  return () => {
    document.body.style.overflow = ''
  }
}, [mobileMenu])

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

    

          {/* WELCOME SECTION */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-7 h-px bg-vault-green" />
              <p className="text-[10px] font-bold tracking-[0.25em] text-vault-green uppercase">
                Your academic workspace
              </p>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="font-heading text-6xl sm:text-7xl lg:text-8xl leading-[0.85] tracking-tight">
                  YOUR NOTES.
                  <br />
                  YOUR KNOWLEDGE.
                </h2>

                <p className="text-sm text-gray-500 mt-5 max-w-md leading-relaxed">
                  Welcome back. Your academic resources,
                  coursework and past papers, all in one place.
                </p>
              </div>

              <button
                onClick={() => fileInput.current?.click()}
                className="bg-vault-green text-white px-6 py-3.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 hover:bg-vault-dark transition shrink-0"
              >
                <Plus size={18} />
                Add resource
              </button>
            </div>
          </section>

          {/* STATISTICS */}
          <section className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-12">
            {[
              { label: 'TOTAL RESOURCES', value: '00', icon: FileText },
              { label: 'COURSE UNITS', value: '00', icon: GraduationCap },
              { label: 'PAST PAPERS', value: '00', icon: BookOpen },
              { label: 'BOOKMARKS', value: '00', icon: Bookmark },
            ].map((stat) => {
              const Icon = stat.icon

              return (
                <div
                  key={stat.label}
                  className="border border-gray-100 rounded-xl p-5 hover:border-[#A8D7BD] transition"
                >
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-[9px] font-bold tracking-widest text-gray-400">
                      {stat.label}
                    </p>
                    <Icon size={17} className="text-vault-green" />
                  </div>

                  <p className="font-heading text-5xl">{stat.value}</p>
                </div>
              )
            })}
          </section>

          {/* RECENT RESOURCES */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] tracking-[0.2em] text-vault-green font-bold mb-2">
                  YOUR COLLECTION
                </p>
                <h3 className="font-heading text-4xl">
                  RECENT RESOURCES
                </h3>
              </div>

              <button
                onClick={() => setActiveNav('My Library')}
                className="text-xs font-semibold flex items-center gap-2 hover:text-vault-green"
              >
                View library <ArrowUpRight size={16} />
              </button>
            </div>

            <div className="border-t border-gray-200">
              {filteredResources.map((resource, index) => (
                <div
                  key={resource.title}
                  className="flex items-center gap-4 py-5 border-b border-gray-100 group"
                >
                  <div className="w-11 h-12 bg-[#F5F6F5] rounded-lg flex items-center justify-center shrink-0">
                    <File size={21} className="text-vault-green" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">
                      {resource.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {resource.unit}
                    </p>
                  </div>

                  <div className="hidden sm:block text-right">
                    <p className="text-[9px] font-bold tracking-wider text-vault-green">
                      {resource.category}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {resource.date}
                    </p>
                  </div>

                  <button className="p-2 text-gray-400 hover:text-black">
                    <MoreHorizontal size={19} />
                  </button>
                </div>
              ))}

              {filteredResources.length === 0 && (
                <p className="py-10 text-center text-sm text-gray-400">
                  No matching resources found.
                </p>
              )}
            </div>
          </section>

          {/* UPLOAD AREA */}
          <section className="mb-10">
            <div className="bg-[#F8FAF8] border border-dashed border-gray-300 rounded-2xl p-8 sm:p-12 text-center">
              <div className="w-14 h-14 bg-white border border-gray-100 rounded-xl flex items-center justify-center mx-auto mb-5">
                <FolderOpen size={26} className="text-vault-green" />
              </div>

              <h3 className="font-heading text-3xl mb-2">
                BUILD YOUR LIBRARY
              </h3>

              <p className="text-xs text-gray-400 mb-6">
                Start organizing your lecture notes and past papers.
              </p>

              <button
                onClick={() => fileInput.current?.click()}
                className="bg-vault-black text-white rounded-full px-6 py-3 text-xs font-semibold hover:bg-vault-green transition inline-flex items-center gap-2"
              >
                <Upload size={15} />
                Choose a document
              </button>

              <input
                ref={fileInput}
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setSelectedFile(file.name)
                }}
              />

              {selectedFile && (
                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-vault-green">
                  <CheckCircle2 size={16} />
                  Selected: {selectedFile}
                  <span className="text-gray-400">
                    (Storage integration coming next)
                  </span>
                </div>
              )}
            </div>
          </section>

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
