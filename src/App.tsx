import { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { blogPage, blogPostPage, homePage, projectsPage, publicationsPage, seriesPage } from './app/pages'

const HomePage = homePage.Page
const ProjectsPage = projectsPage.Page
const BlogPage = blogPage.Page
const BlogPostPage = blogPostPage.Page
const SeriesPage = seriesPage.Page
const PublicationsPage = publicationsPage.Page

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
        <Route path="/publications" element={<PublicationsPage />} />
        {/* The V1 research page was replaced by the homepage section and /publications. */}
        <Route path="/research" element={<Navigate to="/publications" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
