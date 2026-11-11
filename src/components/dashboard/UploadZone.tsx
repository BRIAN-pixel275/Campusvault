
import type { RefObject } from 'react'
import { FolderOpen, Upload, CheckCircle2 } from 'lucide-react'

interface UploadZoneProps {
  fileInput: RefObject<HTMLInputElement | null>
  selectedFile: string
  onFileChange: (fileName: string) => void
}

function UploadZone({
  fileInput,
  selectedFile,
  onFileChange,
}: UploadZoneProps) {
  return (
    <section className="mb-10">
      <div className="bg-[#F8FAF8] border border-dashed border-gray-300 rounded-2xl p-8 sm:p-12 text-center">
        <div className="w-14 h-14 bg-white border border-gray-100 rounded-xl flex items-center justify-center mx-auto mb-5">
          <FolderOpen size={26} className="text-vault-green" />
        </div>

        <h3 className="font-heading text-3xl mb-2">
          BUILD YOUR LIBRARY
        </h3>

        <p className="text-xs text-gray-400 mb-6">
          Start organizing your lecture notes and past papers.
        </p>

        <button
          onClick={() => fileInput.current?.click()}
          className="bg-vault-black text-white rounded-full px-6 py-3 text-xs font-semibold hover:bg-vault-green transition inline-flex items-center gap-2"
        >
          <Upload size={15} />
          Choose a document
        </button>

        <input
          ref={fileInput}
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onFileChange(file.name)
          }}
        />

        {selectedFile && (
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-vault-green">
            <CheckCircle2 size={16} />
            Selected: {selectedFile}
            <span className="text-gray-400">
              (Storage integration coming next)
            </span>
          </div>
        )}
      </div>
    </section>
  )
}

export default UploadZone
