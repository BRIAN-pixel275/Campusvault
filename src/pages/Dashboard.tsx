
import { useRef, useState } from 'react'
import StatCard from '../components/dashboard/StatCard'
import RecentResources from '../components/dashboard/RecentResources'
import UploadZone from '../components/dashboard/UploadZone'
import {
  FileText,
  GraduationCap,
  BookOpen,
  Bookmark,
  Plus,
} from 'lucide-react'

import type { Resource } from '../types/resource'

interface DashboardProps {
  resources: Resource[]
  allResources: Resource[]
  bookmarkCount: number
  onNavigate: (page: string) => void
  onAddResource: (resource: Resource) => void
}

function Dashboard({
  resources,
  allResources,
  bookmarkCount,
  onNavigate,
  onAddResource,
}: DashboardProps) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState('')
const pad = (n: number) => String(n).padStart(2, '0')

const unitCount = new Set(
  allResources.map((r) => r.unit.trim().toLowerCase())
).size

const pastPaperCount = allResources.filter(
  (r) => r.category === 'PAST PAPER'
).length

const statistics = [
  { label: 'TOTAL RESOURCES', value: pad(allResources.length), icon: FileText },
  { label: 'COURSE UNITS', value: pad(unitCount), icon: GraduationCap },
  { label: 'PAST PAPERS', value: pad(pastPaperCount), icon: BookOpen },
  { label: 'BOOKMARKS', value: pad(bookmarkCount), icon: Bookmark },
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
  resources={resources.slice(0, 5)}
  onViewLibrary={() => onNavigate('Student Library')}
/>

      <UploadZone
  fileInput={fileInput}
  selectedFile={selectedFile}
  onFileChange={setSelectedFile}
  onAddResource={onAddResource}
/>
    </>
  )
}

export default Dashboard
