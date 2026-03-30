import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

const HomePage = lazy(() => import('./pages/HomePage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const SeriesPage = lazy(() => import('./pages/SeriesPage'))

function App() {
  return (
    <Suspense
      fallback={
        <div className="section-shell flex min-h-screen items-center justify-center text-[var(--text2-col)]">
          Loading...
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/series/:seriesSlug" element={<SeriesPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
