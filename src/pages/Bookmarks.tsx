
import { useState } from 'react'
import {
  Bookmark,
  BookmarkX,
  FileText,
  Search,
} from 'lucide-react'
import type { Resource } from '../types/resource'

interface BookmarksProps {
  resources: Resource[]
  savedResourceIds: string[]
  onToggleSave: (resourceId: string) => void
}

function Bookmarks({
  resources,
  savedResourceIds,
  onToggleSave,
}: BookmarksProps) {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('ALL')

  const savedResources = resources.filter((resource) =>
    savedResourceIds.includes(resource.id)
  )

  const filters = [
    'ALL',
    'LECTURE NOTES',
    'CAT PAPER',
    'REVISION NOTES',
    'PAST PAPER',
  ]

  const filteredResources = savedResources.filter((resource) => {
    const matchesSearch =
      `${resource.title} ${resource.unit}`
        .toLowerCase()
        .includes(search.toLowerCase())

    const matchesCategory =
      activeFilter === 'ALL' || resource.category === activeFilter

    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-8">
      {/* Heading */}
      <section>
        <div className="flex items-center gap-2 text-vault-green mb-2">
          <Bookmark size={20} />
          <span className="text-xs font-semibold uppercase tracking-widest">
            Your Personal Collection
          </span>
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl tracking-wide">
          BOOKMARKS
        </h1>

        <p className="text-sm text-gray-500 mt-2 max-w-xl">
          Keep your most useful academic materials close.
          Access everything you've bookmarked in one place.
        </p>
      </section>

      {/* Statistics */}
      <section className="bg-vault-dark text-white rounded-2xl p-6 flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-300 uppercase tracking-wider">
            Saved resources
          </p>
          <h2 className="font-heading text-5xl mt-2">
            {savedResources.length}
          </h2>
          <p className="text-xs text-gray-400 mt-2">
            Materials in your personal collection
          </p>
        </div>

        <Bookmark size={38} className="text-emerald-400" />
      </section>

      {/* Search */}
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
            placeholder="Search your bookmarks..."
            className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-vault-green"
          />
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
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

      {/* Saved resources */}
      <section>
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-heading text-2xl tracking-wide">
            YOUR SAVED RESOURCES
          </h2>

          <span className="text-xs text-gray-400">
            {filteredResources.length} found
          </span>
        </div>

        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredResources.map((resource) => (
              <article
                key={resource.id}
                className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <FileText size={22} className="text-vault-green" />
                  </div>

                  <button
                    onClick={() => onToggleSave(resource.id)}
                    title="Remove bookmark"
                    aria-label="Remove bookmark"
                    className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                  >
                    <BookmarkX size={19} />
                  </button>
                </div>

                <div className="mt-5">
                  <span className="text-[10px] font-semibold tracking-wider text-vault-green bg-emerald-50 px-2.5 py-1 rounded-full">
                    {resource.category}
                  </span>

                  <h3 className="font-semibold text-sm mt-3">
                    {resource.title}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {resource.unit}
                  </p>
                </div>

                <div className="border-t border-gray-100 mt-5 pt-4 flex justify-between">
                  <span className="text-[11px] text-gray-400">
                    {resource.date}
                  </span>

                  <span className="text-[10px] font-semibold bg-gray-100 px-2.5 py-1 rounded-md">
                    {resource.type}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl">
            <Bookmark size={32} className="mx-auto text-gray-300 mb-3" />

            <h3 className="font-semibold text-sm">
              {savedResources.length === 0
                ? 'No bookmarks yet'
                : 'No matching resources'}
            </h3>

            <p className="text-xs text-gray-400 mt-2">
              {savedResources.length === 0
                ? 'Explore Student Library and bookmark resources you find useful.'
                : 'Try another search or category.'}
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default Bookmarks
