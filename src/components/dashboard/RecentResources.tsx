
import {
  File,
  MoreHorizontal,
  ArrowUpRight,
} from 'lucide-react'

import type { Resource } from '../../pages/Dashboard'

interface RecentResourcesProps {
  resources: Resource[]
  onViewLibrary: () => void
}

function RecentResources({
  resources,
  onViewLibrary,
}: RecentResourcesProps) {
  return (
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
          onClick={onViewLibrary}
          className="text-xs font-semibold flex items-center gap-2 hover:text-vault-green"
        >
          View library <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="border-t border-gray-200">
        {resources.map((resource) => (
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

            <button
              aria-label={`More options for ${resource.title}`}
              className="p-2 text-gray-400 hover:text-black"
            >
              <MoreHorizontal size={19} />
            </button>
          </div>
        ))}

        {resources.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-400">
            No matching resources found.
          </p>
        )}
      </div>
    </section>
  )
}

export default RecentResources
