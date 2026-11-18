import { useState } from 'react'
import { Download, ExternalLink, Trash2 } from 'lucide-react'
import type { Resource } from '../../types/resource'
import {
  openResource,
  downloadResource,
  deleteResource,
} from '../../lib/files'
import { useResourceContext } from '../../lib/resourceContext'

interface ResourceActionsProps {
  resource: Resource
  compact?: boolean // icon-only buttons for row layouts
}

function ResourceActions({ resource, compact = false }: ResourceActionsProps) {
  const { currentUserId, onResourceDeleted } = useResourceContext()
  const [deleting, setDeleting] = useState(false)

  const isOwner = Boolean(currentUserId) && resource.uploadedBy === currentUserId

  const run = async (action: (r: Resource) => Promise<void>) => {
    try {
      await action(resource)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Something went wrong.')
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete "${resource.title}"? This removes the file for everyone and cannot be undone.`
    )
    if (!confirmed) return

    setDeleting(true)
    try {
      await deleteResource(resource)
      onResourceDeleted(resource.id)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Could not delete.')
      setDeleting(false)
    }
  }

  const deleteButton = isOwner && (
    <button
      onClick={handleDelete}
      disabled={deleting}
      title="Delete"
      aria-label="Delete resource"
      className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 disabled:opacity-40 transition"
    >
      <Trash2 size={compact ? 15 : 14} />
    </button>
  )

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
        {deleteButton}
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
      {deleteButton}
    </div>
  )
}

export default ResourceActions