import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  console.log('Current env vars:', {
    VITE_SUPABASE_URL: supabaseUrl ? 'Set' : 'Missing',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'Set' : 'Missing'
  })
}

// Create a mock client if environment variables are missing
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Disable auth for now
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
}) : {
  from: () => ({
    select: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.' } }),
    insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    update: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    delete: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
  })
}

// Test connection
if (supabaseUrl && supabaseAnonKey) {
  supabase.from('checklists').select('count', { count: 'exact', head: true })
    .then(({ error, count }) => {
      if (error) {
        console.error('Supabase connection error:', error)
      } else {
        console.log('Supabase connected successfully. Checklists count:', count)
      }
    })
} else {
  console.warn('Supabase client not initialized due to missing environment variables')
}

// Helper function to convert blob to base64
export const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    console.log('Converting blob to base64:', {
      size: blob.size,
      type: blob.type
    })
    
    const reader = new FileReader()
    reader.onloadend = () => {
      console.log('Base64 conversion completed, result length:', reader.result?.length || 0)
      resolve(reader.result)
    }
    reader.onerror = (error) => {
      console.error('Base64 conversion error:', error)
      reject(error)
    }
    reader.readAsDataURL(blob)
  })
}

// Helper function to convert base64 to blob
export const base64ToBlob = (base64, type = 'video/webm') => {
  // Validate input
  if (!base64 || typeof base64 !== 'string') {
    console.warn('Invalid base64 input:', base64)
    return new Blob([], { type })
  }

  // Check if it has the expected data URL prefix
  if (!base64.includes(',')) {
    console.warn('Base64 string missing data URL prefix:', base64.substring(0, 50) + '...')
    return new Blob([], { type })
  }

  try {
    const base64Data = base64.split(',')[1]
    
    // Additional validation for base64 data
    if (!base64Data || base64Data.length === 0) {
      console.warn('Empty base64 data after splitting')
      return new Blob([], { type })
    }

    const byteCharacters = atob(base64Data)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type })
  } catch (error) {
    console.error('Failed to decode base64 string:', error)
    console.warn('Problematic base64 string:', base64.substring(0, 100) + '...')
    return new Blob([], { type })
  }
}