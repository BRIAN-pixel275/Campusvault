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

export function mapResource(row: ResourceRow): Resource {
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
  }
}