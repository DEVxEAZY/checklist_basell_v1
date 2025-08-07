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

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Disable auth for now
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
})

// Test connection
supabase.from('checklists').select('count', { count: 'exact', head: true })
  .then(({ error, count }) => {
    if (error) {
      console.error('Supabase connection error:', error)
    } else {
      console.log('Supabase connected successfully. Checklists count:', count)
    }
  })

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
  const byteCharacters = atob(base64.split(',')[1])
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type })
}