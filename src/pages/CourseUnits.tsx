
import { useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  FileText,
  GraduationCap,
} from 'lucide-react'
import type { Resource } from '../types/resource'

interface CourseUnitsProps {
  resources: Resource[]
  savedResourceIds: string[]
  onToggleSave: (resourceId: string) => void
}

function CourseUnits({
  resources,
  savedResourceIds,
  onToggleSave,
}: CourseUnitsProps) {
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)

  // Get unique course units from available resources
  const units = [...new Set(resources.map((resource) => resource.unit))]

  // Find resources belonging to the selected unit
  const unitResources = resources.filter(
    (resource) => resource.unit === selectedUnit
  )

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <section>
        <div className="flex items-center gap-2 text-vault-green mb-2">
          <GraduationCap size={20} />
          <span className="text-xs font-semibold uppercase tracking-widest">
            Academic Organization
          </span>
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl tracking-wide">
          COURSE UNITS
        </h1>

        <p className="text-sm text-gray-500 mt-2 max-w-xl">
          Explore academic resources organized by course unit.
          Find notes, revision materials and examination papers.
        </p>
      </section>

      {/* Unit view */}
      {selectedUnit ? (
        <section>
          <button
            onClick={() => setSelectedUnit(null)}
            className="flex items-center gap-2 text-sm text-vault-green hover:underline mb-6"
          >
            <ArrowLeft size={17} />
            Back to course units
          </button>

          <div className="mb-6">
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              Selected course unit
            </p>
            <h2 className="font-heading text-3xl mt-1">
              {selectedUnit}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {unitResources.length} available resources
            </p>
          </div>

          {unitResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {unitResources.map((resource) => {
                const isSaved = savedResourceIds.includes(resource.id)

                return (
                  <article
                    key={resource.id}
                    className="border border-gray-100 rounded-2xl p-5 bg-white hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <FileText size={22} className="text-vault-green" />
                      </div>

                      <button
                        onClick={() => onToggleSave(resource.id)}
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

                    <span className="inline-block text-[10px] font-semibold text-vault-green bg-emerald-50 px-2.5 py-1 rounded-full mt-5">
                      {resource.category}
                    </span>

                    <h3 className="font-semibold text-sm mt-3">
                      {resource.title}
                    </h3>

                    <div className="border-t border-gray-100 mt-5 pt-4 flex justify-between">
                      <span className="text-[11px] text-gray-400">
                        {resource.date}
                      </span>
                      <span className="text-[10px] font-semibold bg-gray-100 px-2 py-1 rounded-md">
                        {resource.type}
                      </span>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-10 text-center">
              No resources available for this unit yet.
            </p>
          )}
        </section>
      ) : (
        <>
          {/* Unit statistics */}
          <section className="bg-vault-dark text-white rounded-2xl p-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-300 uppercase tracking-wider">
                Available course units
              </p>
              <h2 className="font-heading text-5xl mt-2">
                {units.length}
              </h2>
              <p className="text-xs text-gray-400 mt-2">
                Units represented in the shared library
              </p>
            </div>

            <BookOpen size={38} className="text-emerald-400" />
          </section>

          {/* Course unit cards */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-2xl tracking-wide">
                EXPLORE YOUR UNITS
              </h2>
              <span className="text-xs text-gray-400">
                {resources.length} resources
              </span>
            </div>

            {units.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {units.map((unit) => {
                  const count = resources.filter(
                    (resource) => resource.unit === unit
                  ).length

                  return (
                    <button
                      key={unit}
                      onClick={() => setSelectedUnit(unit)}
                      className="text-left border border-gray-100 rounded-2xl p-6 hover:border-emerald-200 hover:shadow-md transition group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition">
                          <GraduationCap size={23} className="text-vault-green" />
                        </div>

                        <span className="text-xs text-gray-400">
                          {count} {count === 1 ? 'resource' : 'resources'}
                        </span>
                      </div>

                      <h3 className="font-semibold text-base mt-5">
                        {unit}
                      </h3>

                      <div className="flex items-center justify-between mt-5">
                        <span className="text-xs font-medium text-vault-green">
                          View resources
                        </span>
                        <ArrowLeft
                          size={17}
                          className="rotate-180 text-vault-green"
                        />
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl">
                <GraduationCap size={32} className="mx-auto text-gray-300 mb-3" />
                <h3 className="font-semibold text-sm">
                  No course units yet
                </h3>
                <p className="text-xs text-gray-400 mt-2">
                  Course units will appear as students share resources.
                </p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default CourseUnits
