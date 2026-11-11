
import { useRef, useState } from 'react'
import StatCard from '../components/dashboard/StatCard'
import RecentResources from '../components/dashboard/RecentResources'
import {
  FileText,
  GraduationCap,
  BookOpen,
  Bookmark,
  FolderOpen,
  Upload,
  Plus,
  CheckCircle2,
} from 'lucide-react'

export interface Resource {
  title: string
  unit: string
  category: string
  date: string
  type: string
}

interface DashboardProps {
  resources: Resource[]
  onNavigate: (page: string) => void
}

function Dashboard({ resources, onNavigate }: DashboardProps) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState('')

  const statistics = [
    { label: 'TOTAL RESOURCES', value: '00', icon: FileText },
    { label: 'COURSE UNITS', value: '00', icon: GraduationCap },
    { label: 'PAST PAPERS', value: '00', icon: BookOpen },
    { label: 'BOOKMARKS', value: '00', icon: Bookmark },
  ]

  return (
    <>
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
              Welcome back. Your academic resources, coursework and
              past papers, all in one place.
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
  {statistics.map((stat) => (
    <StatCard
      key={stat.label}
      label={stat.label}
      value={stat.value}
      icon={stat.icon}
    />
  ))}
</section>

      <RecentResources
  resources={resources}
  onViewLibrary={() => onNavigate('My Library')}
/>

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
    </>
  )
}

export default Dashboard
