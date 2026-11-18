import { Download, ExternalLink } from 'lucide-react'
import type { Resource } from '../../types/resource'
import { openResource, downloadResource } from '../../lib/files'

interface ResourceActionsProps {
  resource: Resource
  compact?: boolean // icon-only buttons for row layouts
}

function ResourceActions({ resource, compact = false }: ResourceActionsProps) {
  const run = async (action: (r: Resource) => Promise<void>) => {
    try {
      await action(resource)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Something went wrong.')
    }
  }

  if (compact) {
    return (
      <div className="flex gap-1.5">
        <button
          onClick={() => run(openResource)}
          title="Open"
          aria-label="Open resource"
          className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-vault-green hover:text-vault-green transition"
        >
          <ExternalLink size={15} />
        </button>
        <button
          onClick={() => run(downloadResource)}
          title="Download"
          aria-label="Download resource"
          className="p-2 rounded-lg bg-vault-green text-white hover:bg-emerald-700 transition"
        >
          <Download size={15} />
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={() => run(openResource)}
        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium rounded-lg border border-gray-200 py-2 hover:border-vault-green hover:text-vault-green transition"
      >
        <ExternalLink size={14} />
        Open
      </button>
      <button
        onClick={() => run(downloadResource)}
        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium rounded-lg bg-vault-green text-white py-2 hover:bg-emerald-700 transition"
      >
        <Download size={14} />
        Download
      </button>
    </div>
  )
}

export default ResourceActions