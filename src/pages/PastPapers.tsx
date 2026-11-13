
import { useState } from 'react'
import {
  FileText,
  Bookmark,
  BookmarkCheck,
  Search,
  GraduationCap,
} from 'lucide-react'
import type { Resource } from '../types/resource'

interface PastPapersProps {
  resources: Resource[]
  savedResourceIds: string[]
  onToggleSave: (resourceId: string) => void
}

function PastPapers({
  resources,
  savedResourceIds,
  onToggleSave,
}: PastPapersProps) {
  const [search, setSearch] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('ALL')

  const pastPapers = resources.filter(
    (resource) => resource.category === 'PAST PAPER'
  )

  const units = [
    'ALL',
    ...new Set(pastPapers.map((resource) => resource.unit)),
  ]

  const filteredPapers = pastPapers.filter((paper) => {
    const matchesSearch =
      `${paper.title} ${paper.unit}`.toLowerCase().includes(search.toLowerCase())

    const matchesUnit =
      selectedUnit === 'ALL' || paper.unit === selectedUnit

    return matchesSearch && matchesUnit
  })

  return (
    <div className="space-y-8">
      {/* Heading */}
      <section>
        <div className="flex items-center gap-2 text-vault-green mb-2">
          <GraduationCap size={20} />
          <span className="text-xs font-semibold uppercase tracking-widest">
            Examination Centre
          </span>
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl tracking-wide">
          PAST PAPERS
        </h1>

        <p className="text-sm text-gray-500 mt-2 max-w-xl">
          Prepare for your examinations with past papers shared
          by students across CampusVault.
        </p>
      </section>

      {/* Statistics */}
      <section className="bg-vault-dark text-white rounded-2xl p-6 flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-300 uppercase tracking-wider">
            Available past papers
          </p>
          <h2 className="font-heading text-5xl mt-2">
            {pastPapers.length}
          </h2>
          <p className="text-xs text-gray-400 mt-2">
            Examination resources in the library
          </p>
        </div>

        <FileText size={38} className="text-emerald-400" />
      </section>

      {/* Search and filters */}
      <section className="space-y-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search past papers or course units..."
            className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-vault-green"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {units.map((unit) => (
            <button
              key={unit}
              onClick={() => setSelectedUnit(unit)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition ${
                selectedUnit === unit
                  ? 'bg-vault-green text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {unit}
            </button>
          ))}
        </div>
      </section>

      {/* Past paper cards */}
      <section>
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-heading text-2xl tracking-wide">
            EXAMINATION PAPERS
          </h2>
          <span className="text-xs text-gray-400">
            {filteredPapers.length} found
          </span>
        </div>

        {filteredPapers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredPapers.map((paper) => {
              const isSaved = savedResourceIds.includes(paper.id)

              return (
                <article
                  key={paper.id}
                  className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <FileText size={22} className="text-vault-green" />
                    </div>

                    <button
                      onClick={() => onToggleSave(paper.id)}
                      title={isSaved ? 'Remove bookmark' : 'Save resource'}
                      aria-label={isSaved ? 'Remove bookmark' : 'Save resource'}
                      className="p-2 rounded-lg bg-gray-50 text-vault-green"
                    >
                      {isSaved ? (
                        <BookmarkCheck size={19} />
                      ) : (
                        <Bookmark size={19} />
                      )}
                    </button>
                  </div>

                  <div className="mt-5">
                    <span className="text-[10px] font-semibold tracking-wider text-vault-green bg-emerald-50 px-2.5 py-1 rounded-full">
                      PAST PAPER
                    </span>

                    <h3 className="font-semibold text-sm mt-3">
                      {paper.title}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      {paper.unit}
                    </p>
                  </div>

                  <div className="border-t border-gray-100 mt-5 pt-4 flex justify-between">
                    <span className="text-[11px] text-gray-400">
                      {paper.date}
                    </span>

                    <span className="text-[10px] font-semibold bg-gray-100 px-2.5 py-1 rounded-md">
                      {paper.type}
                    </span>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl">
            <FileText size={32} className="mx-auto text-gray-300 mb-3" />
            <h3 className="font-semibold text-sm">
              No past papers found
            </h3>
            <p className="text-xs text-gray-400 mt-2">
              Try another search or course unit.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default PastPapers
