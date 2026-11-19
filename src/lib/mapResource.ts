import { supabase } from './supabase'
import type { Resource } from '../types/resource'

export interface ResourceRow {
  id: string
  title: string
  unit: string
  category: string
  file_name: string
  file_path: string
  file_type: string
  file_size: number
  uploaded_by: string
  created_at: string
}

export function mapResource(row: ResourceRow, uploaderName?: string): Resource {
  return {
    id: row.id,
    title: row.title,
    unit: row.unit,
    category: row.category,
    date: new Date(row.created_at).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    type: row.file_name.split('.').pop()?.toUpperCase() || 'FILE',
    filePath: row.file_path,
    fileName: row.file_name,
    uploadedBy: row.uploaded_by,
    fileSize: row.file_size,
    uploaderName,
  }
}

// Maps rows and attaches each uploader's name with one extra query
export async function mapResourcesWithUploaders(
  rows: ResourceRow[]
): Promise<Resource[]> {
  const uploaderIds = Array.from(new Set(rows.map((r) => r.uploaded_by)))
  const names = new Map<string, string>()

  if (uploaderIds.length > 0) {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', uploaderIds)

    data?.forEach((p) => {
      if (p.full_name) names.set(p.id, p.full_name)
    })
  }

  return rows.map((row) => mapResource(row, names.get(row.uploaded_by)))
}