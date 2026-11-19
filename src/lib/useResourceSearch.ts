import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { mapResourcesWithUploaders, type ResourceRow } from './mapResource'
import type { Resource } from '../types/resource'

export type SortOption = 'newest' | 'oldest' | 'title'

const PAGE_SIZE = 12

interface QueryParams {
  search: string
  category: string
  sort: SortOption
}

async function fetchPage(params: QueryParams, from: number) {
  let query = supabase.from('resources').select('*', { count: 'exact' })

  if (params.category !== 'ALL') {
    query = query.eq('category', params.category)
  }

  if (params.search) {
    // Strip characters that have special meaning in the filter syntax
    const term = params.search.replace(/[%,()*\\]/g, ' ').trim()
    if (term) {
      query = query.or(`title.ilike.%${term}%,unit.ilike.%${term}%`)
    }
  }

  if (params.sort === 'oldest') {
    query = query.order('created_at', { ascending: true })
  } else if (params.sort === 'title') {
    query = query.order('title', { ascending: true })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  return query.order('id').range(from, from + PAGE_SIZE - 1)
}

interface Options extends QueryParams {
  refreshKey: number // change this to force a reload (after upload/delete)
}

export function useResourceSearch({
  search,
  category,
  sort,
  refreshKey,
}: Options) {
  const [results, setResults] = useState<Resource[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState(search.trim())

  // Wait 300ms after typing stops before querying
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => clearTimeout(timer)
  }, [search])

  // Load the first page whenever the query changes
  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError('')

      const { data, count, error } = await fetchPage(
        { search: debouncedSearch, category, sort },
        0
      )

      if (cancelled) return

      if (error) {
        setError(error.message)
      } else {
        const mapped = await mapResourcesWithUploaders(data as ResourceRow[])
        if (cancelled) return
        setResults(mapped)
        setTotal(count ?? 0)
      }

      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [debouncedSearch, category, sort, refreshKey])

  const loadMore = async () => {
    setLoadingMore(true)

    const { data, error } = await fetchPage(
      { search: debouncedSearch, category, sort },
      results.length
    )

    if (error) {
      setError(error.message)
    } else {
      const next = await mapResourcesWithUploaders(data as ResourceRow[])
      setResults((current) => {
        const seen = new Set(current.map((r) => r.id))
        return [...current, ...next.filter((r) => !seen.has(r.id))]
      })
    }

    setLoadingMore(false)
  }

  return {
    results,
    total,
    loading,
    loadingMore,
    error,
    hasMore: results.length < total,
    loadMore,
  }
}