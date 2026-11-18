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

// Deletes the database row first, then the stored file
export async function deleteResource(resource: Resource) {
  const { data, error } = await supabase
    .from('resources')
    .delete()
    .eq('id', resource.id)
    .select('id')

  if (error) throw error

  // RLS silently skips rows you don't own, so check something was deleted
  if (!data || data.length === 0) {
    throw new Error('You can only delete resources you uploaded.')
  }

  if (resource.filePath) {
    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove([resource.filePath])

    if (storageError) {
      console.error('File cleanup failed:', storageError.message)
    }
  }
}