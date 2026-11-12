
import { useState } from 'react'
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  FileText,
  GraduationCap,
} from 'lucide-react'
import type { Resource } from '../types/resource'

interface StudentLibraryProps {
  resources: Resource[]
  savedResourceIds: string[]
  onToggleSave: (resourceId: string) => void
}

function StudentLibrary({
  resources,
  savedResourceIds,
  onToggleSave,
}: StudentLibraryProps) {
  const [activeFilter, setActiveFilter] = useState('ALL')

  const filters = [
    'ALL',
    'LECTURE NOTES',
    'CAT PAPER',
    'REVISION NOTES',
    'PAST PAPER',
  ]

  const filteredResources =
    activeFilter === 'ALL'
      ? resources
      : resources.filter(
          (resource) => resource.category === activeFilter
        )

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <section>
        <div className="flex items-center gap-2 text-vault-green mb-2">
          <BookOpen size={20} />
          <span className="text-xs font-semibold uppercase tracking-widest">
            CampusVault Community
          </span>
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl tracking-wide">
          STUDENT LIBRARY
        </h1>

        <p className="text-sm text-gray-500 mt-2 max-w-xl">
          Discover lecture notes, revision materials and examination
          resources shared by students across universities.
        </p>
      </section>

      {/* Library overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-vault-dark text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-300 uppercase tracking-wider">
                Available resources
              </p>
              <h2 className="font-heading text-4xl mt-2">
                {resources.length}
              </h2>
            </div>
            <BookOpen size={25} className="text-emerald-400" />
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Academic materials in the shared library
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Your saved resources
              </p>
              <h2 className="font-heading text-4xl mt-2">
                {savedResourceIds.length}
              </h2>
            </div>
            <Bookmark size={25} className="text-vault-green" />
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Materials you've bookmarked for later
          </p>
        </div>
      </section>

      {/* Filters */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap size={19} className="text-vault-green" />
          <h2 className="font-heading text-2xl tracking-wide">
            EXPLORE RESOURCES
          </h2>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition ${
                activeFilter === filter
                  ? 'bg-vault-green text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* Resource cards */}
      <section>
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredResources.map((resource) => {
              const isSaved = savedResourceIds.includes(resource.id)

              return (
                <article
                  key={resource.id}
                  className="border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-emerald-100 transition bg-white"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <FileText
                        size={22}
                        className="text-vault-green"
                      />
                    </div>

                    <button
                      onClick={() => onToggleSave(resource.id)}
                      aria-label={
                        isSaved ? 'Remove bookmark' : 'Save resource'
                      }
                      title={isSaved ? 'Remove bookmark' : 'Save resource'}
                      className={`p-2 rounded-lg transition ${
                        isSaved
                          ? 'bg-emerald-50 text-vault-green'
                          : 'bg-gray-50 text-gray-400 hover:text-vault-green'
                      }`}
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
                      {resource.category}
                    </span>

                    <h3 className="font-semibold text-sm mt-3 leading-6">
                      {resource.title}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      {resource.unit}
                    </p>
                  </div>

                  <div className="border-t border-gray-100 mt-5 pt-4 flex justify-between items-center">
                    <span className="text-[11px] text-gray-400">
                      {resource.date}
                    </span>

                    <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                      {resource.type}
                    </span>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl">
            <BookOpen size={32} className="mx-auto text-gray-300 mb-3" />
            <h3 className="font-semibold text-sm">
              No resources found
            </h3>
            <p className="text-xs text-gray-400 mt-2">
              Try another category or check back later.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default StudentLibrary
