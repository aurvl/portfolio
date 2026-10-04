import { execSync } from 'node:child_process'
import { statSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const DEFAULT_PRODUCTION_BASE = '/portfolio/'
const NOW_BUILDING_FILE = 'src/data/now-building.json'

// Date shown as "Updated <month year>" in the homepage "Now building" section:
// the last commit touching the file, or its modification time while it has local edits.
function getNowBuildingUpdatedAt() {
  try {
    const hasLocalChanges = execSync(`git status --porcelain -- ${NOW_BUILDING_FILE}`).toString().trim() !== ''
    const lastCommit = execSync(`git log -1 --format=%cI -- ${NOW_BUILDING_FILE}`).toString().trim()

    if (!hasLocalChanges && lastCommit) {
      return lastCommit
    }
  } catch {
    // Not a git checkout: fall back to the file date.
  }

  return statSync(NOW_BUILDING_FILE).mtime.toISOString()
}

export default defineConfig(({ command }) => ({
  base:
    process.env.VITE_PUBLIC_BASE_PATH ||
    (command === 'build' ? DEFAULT_PRODUCTION_BASE : '/'),
  plugins: [react(), tailwindcss()],
  define: {
    __NOW_BUILDING_UPDATED_AT__: JSON.stringify(getNowBuildingUpdatedAt()),
  },
}))
