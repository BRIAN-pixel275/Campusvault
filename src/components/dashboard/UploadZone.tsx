
import { useState } from 'react'
import { FileText, Upload, X, CheckCircle } from 'lucide-react'
import type { RefObject } from 'react'
import type { Resource } from '../../types/resource'

interface UploadZoneProps {
  fileInput: RefObject<HTMLInputElement | null>
  selectedFile: string
  onFileChange: (fileName: string) => void
  onAddResource: (resource: Resource) => void
}

function UploadZone({
  fileInput,
  selectedFile,
  onFileChange,
  onAddResource,
}: UploadZoneProps) {
  const [title, setTitle] = useState('')
  const [unit, setUnit] = useState('')
  const [category, setCategory] = useState('LECTURE NOTES')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedFile) return

    const extension = selectedFile.split('.').pop()?.toUpperCase() || 'FILE'

    const newResource: Resource = {
      title,
      unit,
      category,
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      type: extension,
    }

    onAddResource(newResource)

    // Reset the form after submission
    setTitle('')
    setUnit('')
    setCategory('LECTURE NOTES')
    onFileChange('')

    if (fileInput.current) {
      fileInput.current.value = ''
    }
  }

  return (
    <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
          <Upload size={20} className="text-vault-green" />
        </div>

        <div>
          <h2 className="font-heading text-2xl tracking-wide">
            ADD A RESOURCE
          </h2>
          <p className="text-xs text-gray-400">
            Share useful academic materials with your library.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Document selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Select document
          </label>

          <input
            ref={fileInput}
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            className="hidden"
            onChange={(event) =>
              onFileChange(event.target.files?.[0]?.name ?? '')
            }
          />

          {selectedFile ? (
            <div className="flex items-center justify-between gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="text-vault-green shrink-0" size={22} />
                <span className="text-sm truncate">{selectedFile}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  onFileChange('')
                  if (fileInput.current) {
                    fileInput.current.value = ''
                  }
                }}
                className="text-gray-400 hover:text-red-500"
                aria-label="Remove selected file"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-vault-green hover:bg-emerald-50/30 transition"
            >
              <Upload size={24} className="mx-auto mb-2 text-vault-green" />
              <p className="text-sm font-medium">
                Choose a document
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PDF, DOC, DOCX, PPT or PPTX
              </p>
            </button>
          )}
        </div>

        {/* Resource title */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Resource title
          </label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Introduction to Microeconomics"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-vault-green focus:ring-2 focus:ring-emerald-50"
          />
        </div>

        {/* Course unit */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Course unit
          </label>
          <input
            type="text"
            value={unit}
            onChange={(event) => setUnit(event.target.value)}
            placeholder="e.g. Microeconomics I"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-vault-green focus:ring-2 focus:ring-emerald-50"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Resource category
          </label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white outline-none focus:border-vault-green"
          >
            <option value="LECTURE NOTES">Lecture Notes</option>
            <option value="CAT PAPER">CAT Paper</option>
            <option value="REVISION NOTES">Revision Notes</option>
            <option value="PAST PAPER">Past Paper</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!selectedFile}
          className="w-full flex items-center justify-center gap-2 bg-vault-green text-white rounded-xl py-3 font-medium text-sm hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <CheckCircle size={18} />
          Add to My Library
        </button>
      </form>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Your resource details will currently be saved in this session only.
      </p>
    </section>
  )
}

export default UploadZone
