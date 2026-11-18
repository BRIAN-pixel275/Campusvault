import { supabase } from './supabase'
import type { Resource } from '../types/resource'

const BUCKET = 'campusvault-resources'

// Opens the file in a new tab (PDFs preview in the browser)
export async function openResource(resource: Resource) {
  if (!resource.filePath) throw new Error('This resource has no file attached.')

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(resource.filePath, 60)

  if (error || !data) throw error ?? new Error('Could not open the file.')

  window.open(data.signedUrl, '_blank', 'noopener,noreferrer')
}

// Forces a download with the original file name
export async function downloadResource(resource: Resource) {
  if (!resource.filePath) throw new Error('This resource has no file attached.')

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(resource.filePath, 60, {
      download: resource.fileName ?? true,
    })

  if (error || !data) throw error ?? new Error('Could not download the file.')

  window.location.href = data.signedUrl
}