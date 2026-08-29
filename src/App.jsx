import { useEffect, useState } from 'react'
import Loader from './components/Loader.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import Experience from './components/Experience.jsx'
import Projects from './components/Projects.jsx'
import Education from './components/Education.jsx'
import Contact from './components/Contact.jsx'
import Statement from './components/Statement.jsx'
import Grain from './components/Grain.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import Cursor from './components/Cursor.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import { useSmoothScroll } from './hooks/useSmoothScroll.js'
import { useScrollReveal } from './hooks/useScrollReveal.js'
import { useSplitHeadings } from './hooks/useSplitHeadings.js'
import { useTheme } from './hooks/useTheme.js'

export default function App() {
  const [started, setStarted] = useState(false)
  const { theme, toggle } = useTheme()

  // Failsafe so the entrance sequence can't wedge the page shut.
  useEffect(() => {
    const t = window.setTimeout(() => setStarted(true), 2600)
    return () => window.clearTimeout(t)
  }, [])

  useSmoothScroll()
  useScrollReveal([started])
  useSplitHeadings([started])

  return (
    <>
      <Loader onDone={() => setStarted(true)} />
      <Grain />
      <ScrollProgress />
      <Cursor />
      <ThemeToggle theme={theme} onToggle={toggle} />

      <a className="skip-link" href="#about">
        Skip to content
      </a>

      <Nav />

      <main id="main">
        <Hero start={started} />
        <Marquee />
        <Statement id="s1">Interfaces that feel effortless — backed by systems that hold up.</Statement>
        <About />
        <Skills />
        <Experience />
        <Statement id="s2">Fast on the surface. Careful underneath.</Statement>
        <Education />
        <Projects />
        <Contact />
      </main>
    </>
  )
}
