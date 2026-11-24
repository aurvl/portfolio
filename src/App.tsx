import { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { blogPostPage, homePage, projectsPage, publicationsPage, seriesIndexPage, seriesPage } from './app/pages'

const HomePage = homePage.Page
const ProjectsPage = projectsPage.Page
const BlogPostPage = blogPostPage.Page
const SeriesPage = seriesPage.Page
const SeriesIndexPage = seriesIndexPage.Page
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
        {/* Le blog vit dans le Hub : /blog renvoie sur son bloc « Derniers articles ». Les articles et séries gardent leur URL. */}
        <Route path="/blog" element={<Navigate to="/projects#blog" replace />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/series" element={<SeriesIndexPage />} />
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
