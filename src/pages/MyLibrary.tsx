
import { useState } from 'react'
import { FileText, FolderOpen } from 'lucide-react'
import type { Resource } from '../types/resource'

interface MyLibraryProps {
  resources: Resource[]
}

function MyLibrary({ resources }: MyLibraryProps) {
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
    <section className="py-10">
      {/* PAGE HEADER */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-7 h-px bg-vault-green" />
          <p className="text-[10px] font-bold tracking-[0.25em] text-vault-green uppercase">
            Personal collection
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-6xl sm:text-7xl lg:text-8xl leading-[0.9]">
              MY LIBRARY.
            </h2>

            <p className="text-sm text-gray-500 mt-4">
              All your academic resources, organised in one place.
            </p>
          </div>

          <div className="border border-gray-100 rounded-xl px-5 py-4">
            <p className="text-[10px] text-gray-400 tracking-wider">
              TOTAL RESOURCES
            </p>
            <p className="font-heading text-4xl mt-1">
              {resources.length.toString().padStart(2, '0')}
            </p>
          </div>
        </div>
      </div>

      {/* CATEGORY FILTERS */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-[10px] font-semibold tracking-wide transition ${
              activeFilter === filter
                ? 'bg-vault-green text-white'
                : 'bg-[#F5F7F5] text-gray-500 hover:bg-gray-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* RESOURCE LIST */}
      <div>
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-3">
          <h3 className="font-heading text-2xl">
            YOUR DOCUMENTS
          </h3>

          <span className="text-[10px] text-gray-400">
            {filteredResources.length} ITEMS
          </span>
        </div>

        {filteredResources.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredResources.map((resource, index) => (
              <div
                key={`${resource.title}-${index}`}
                className="flex items-center gap-4 py-5 group"
              >
                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#F5F7F5] flex items-center justify-center">
                  <FileText size={21} className="text-vault-green" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold truncate">
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

                <span className="text-[10px] text-gray-400 border border-gray-100 rounded-md px-2 py-1">
                  {resource.type}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-[#F8FAF8] rounded-2xl">
            <FolderOpen
              size={32}
              className="text-vault-green mx-auto mb-4"
            />

            <h3 className="font-heading text-2xl">
              NO RESOURCES FOUND
            </h3>

            <p className="text-xs text-gray-400 mt-2">
              There are no documents in this category yet.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default MyLibrary
