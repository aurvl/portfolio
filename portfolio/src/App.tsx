import { Routes, Route } from 'react-router-dom'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
    </Routes>
  )
}

export default App
