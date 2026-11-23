import { supabase } from './supabase'

const BUCKET = 'campusvault-resources'

export async function uploadFile(file: File, userId: string) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `${userId}/${crypto.randomUUID()}-${safeName}`

  const { error } = await supabase.storage
    .from(BUCKET)
        .upload(path, file, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    })
   

  if (error) throw error
  return path
}