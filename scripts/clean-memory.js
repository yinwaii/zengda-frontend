import { rm } from 'fs/promises'
import { resolve } from 'path'

async function cleanMemory() {
  const directories = [
    '.nuxt/cache',
    '.nuxt/dist',
    '.nuxt/dev',
    '.output/public/_nuxt',
    'node_modules/.vite'
  ]

  for (const dir of directories) {
    try {
      await rm(resolve(process.cwd(), dir), { recursive: true, force: true })
      console.log(`✅ Cleaned ${dir}`)
    } catch (error) {
      console.error(`❌ Failed to clean ${dir}:`, error)
    }
  }
}

cleanMemory() 