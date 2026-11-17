
import { useState } from 'react'
import { FileText, Upload, X, CheckCircle } from 'lucide-react'
import type { RefObject } from 'react'
import type { Resource } from '../../types/resource'
import { supabase } from '../../lib/supabase'

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
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleFileSelection = (selected: File | undefined) => {
    if (!selected) return

    if (selected.size > 20 * 1024 * 1024) {
      setMessage('The file must not exceed 20 MB.')
      return
    }

    setFile(selected)
    onFileChange(selected.name)
    setMessage('')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')

    if (!file) {
      setMessage('Please select a document first.')
      return
    }

    setUploading(true)

    let uploadedFilePath = ''

    try {
      // Get the currently signed-in student
      const { data: userData, error: userError } =
        await supabase.auth.getUser()

      if (userError) throw userError

      const user = userData.user

      if (!user) {
        throw new Error('Please sign in before uploading a resource.')
      }

      // Create a unique storage path for this document
      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      uploadedFilePath = `${user.id}/${crypto.randomUUID()}-${safeFileName}`

      // Upload the actual document to Supabase Storage
      const { error: storageError } = await supabase.storage
        .from('campusvault-resources')
        .upload(uploadedFilePath, file, {
          contentType: file.type || 'application/octet-stream',
          upsert: false,
        })

      if (storageError) throw storageError

      // Save the document details in the database
      const { data: resourceData, error: databaseError } = await supabase
        .from('resources')
        .insert({
          title: title.trim(),
          unit: unit.trim(),
          category,
          file_name: file.name,
          file_path: uploadedFilePath,
          file_type: file.type || 'application/octet-stream',
          file_size: file.size,
          uploaded_by: user.id,
        })
        .select()
        .single()

      if (databaseError) throw databaseError

      // Convert the database record into our frontend Resource type
      const newResource: Resource = {
        id: resourceData.id,
        title: resourceData.title,
        unit: resourceData.unit,
        category: resourceData.category,
        date: new Date(resourceData.created_at).toLocaleDateString(
          'en-GB',
          {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }
        ),
        type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        filePath: resourceData.file_path,
        fileName: resourceData.file_name,
        uploadedBy: resourceData.uploaded_by,
        fileSize: resourceData.file_size,
      }

      onAddResource(newResource)

      // Reset the form after a successful upload
      setTitle('')
      setUnit('')
      setCategory('LECTURE NOTES')
      setFile(null)
      onFileChange('')

      if (fileInput.current) {
        fileInput.current.value = ''
      }

      setMessage('Resource uploaded successfully!')
    } catch (error) {
      // Remove the uploaded file if saving its details failed
      if (uploadedFilePath) {
        await supabase.storage
          .from('campusvault-resources')
          .remove([uploadedFilePath])
      }

      setMessage(
        error instanceof Error
          ? error.message
          : 'Upload failed. Please try again.'
      )
    } finally {
      setUploading(false)
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
              handleFileSelection(event.target.files?.[0])
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
                  setFile(null)
                  onFileChange('')
                  setMessage('')

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
                PDF, DOC, DOCX, PPT or PPTX · Maximum 20 MB
              </p>
            </button>
          )}
        </div>

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

        {message && (
          <p className={`text-sm ${
            message === 'Resource uploaded successfully!'
              ? 'text-emerald-600'
              : 'text-red-500'
          }`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={!selectedFile || uploading}
          className="w-full flex items-center justify-center gap-2 bg-vault-green text-white rounded-xl py-3 font-medium text-sm hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <CheckCircle size={18} />
          {uploading ? 'Uploading resource...' : 'Add to Student Library'}
        </button>
      </form>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Your document and its details will be stored securely.
      </p>
    </section>
  )
}

export default UploadZone
