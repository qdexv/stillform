import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Search,
  X,
  Sun,
  Moon
} from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { artworks, collections, type Artwork } from './data/gallery'

gsap.registerPlugin(ScrollTrigger)

const categories = ['All Works', 'Cinematic', 'Architecture', 'Nature', 'Portraits', 'Abstract', 'Urban']

const STATEMENT_TEXT =
  'Through light, stillness and deliberate framing, we take visual art on a journey of discovery and transformation, creating emotional experiences that leave a lasting impression and drive a deeper way to see.'
const STATEMENT_WORDS = STATEMENT_TEXT.split(' ')

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('stillform-theme')
    if (saved === 'dark' || saved === 'light') return saved
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })
  const [activeCategory, setActiveCategory] = useState('All Works')
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeArt, setActiveArt] = useState<Artwork | null>(null)
  const [imageErrors, setImageErrors] = useState<number[]>([])
  const [navScrolled, setNavScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const heroRef = useRef<HTMLElement>(null)
  const statementRef = useRef<HTMLElement>(null)
  const statementTextRef = useRef<HTMLParagraphElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLDivElement>(null)
  const line2Ref = useRef<HTMLDivElement>(null)
  const line3Ref = useRef<HTMLDivElement>(null)
  const downRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('stillform-theme', theme)
  }, [theme])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setNavScrolled(scrollY > 40)
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      if (maxScroll > 0) {
        setScrollProgress(Math.min(1, Math.max(0, scrollY / maxScroll)))
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!heroRef.current || !statementRef.current || !mediaRef.current) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(mediaRef.current, { scale: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      const isDesktop = window.matchMedia('(min-width: 650px)').matches

      if (isDesktop) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            endTrigger: statementRef.current,
            start: 'top top',
            end: 'top bottom',
            scrub: true,
          },
        })

        tl.fromTo(
          mediaRef.current,
          {
            scale: 0.72,
            y: 0,
            transformOrigin: 'top left',
          },
          {
            scale: 1.0,
            y: 0,
            ease: 'power1.inOut',
          },
          0
        )

        if (downRef.current) {
          tl.fromTo(
            downRef.current,
            { yPercent: 0, opacity: 1 },
            { yPercent: -100, opacity: 0, ease: 'power1.inOut' },
            0
          )
        }

        if (line1Ref.current) tl.fromTo(line1Ref.current, { xPercent: 0 }, { xPercent: 4, ease: 'none' }, 0)
        if (line2Ref.current) tl.fromTo(line2Ref.current, { xPercent: 0 }, { xPercent: -4, ease: 'none' }, 0)
        if (line3Ref.current) tl.fromTo(line3Ref.current, { xPercent: 0 }, { xPercent: 4, ease: 'none' }, 0)
      } else {

        gsap.fromTo(
          mediaRef.current,
          { scale: 0.88, transformOrigin: 'top left' },
          {
            scale: 1,
            ease: 'power1.inOut',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top 20%',
              end: 'bottom 80%',
              scrub: true,
            },
          }
        )
      }
    }, heroRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!statementTextRef.current) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(statementTextRef.current.querySelectorAll('.statement-char'), { opacity: 1 })
      return
    }

    const chars = statementTextRef.current.querySelectorAll('.statement-char')
    if (!chars.length) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { opacity: 0.18 },
        {
          opacity: 1,
          ease: 'none',
          stagger: {
            each: 0.02,
          },
          duration: 0.03,
          scrollTrigger: {
            trigger: statementTextRef.current,
            start: 'top 80%',
            end: 'bottom 45%',
            scrub: 0.3,
          },
        }
      )
    }, statementTextRef)

    return () => ctx.revert()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = artworks.filter((art) => {
      const categoryMatch = activeCategory === 'All Works' || art.category === activeCategory
      const queryMatch =
        !q || [art.title, art.category, art.creator, art.collection, art.description].some((v) => v.toLowerCase().includes(q))
      return categoryMatch && queryMatch
    })

    if (activeCategory === 'All Works' && !q) {
      return matches.slice(0, 5)
    }

    return matches
  }, [activeCategory, query])

  useEffect(() => {
    if (!galleryRef.current) return
    const cards = galleryRef.current.querySelectorAll('.outpost-project')
    if (cards.length) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.035, ease: 'power2.out' }
      )
    }
  }, [activeCategory, query])

  const openArt = useCallback((art: Artwork) => setActiveArt(art), [])
  const moveArt = useCallback(
    (direction: number) => {
      if (!activeArt) return
      const index = filtered.findIndex((art) => art.id === activeArt.id)
      if (index === -1 || !filtered.length) return
      setActiveArt(filtered[(index + direction + filtered.length) % filtered.length])
    },
    [activeArt, filtered]
  )

  useEffect(() => {
    if (!activeArt) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveArt(null)
      if (event.key === 'ArrowRight') moveArt(1)
      if (event.key === 'ArrowLeft') moveArt(-1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeArt, moveArt])

  const scrollToWork = () => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
  const scrollToGallery = scrollToWork
  const markImageError = (id: number) =>
    setImageErrors((current) => (current.includes(id) ? current : [...current, id]))

  return (
    <div className="site-shell" ref={containerRef}>

      <header className="nav">
        <a className="brand" href="#top" aria-label="Stillform home">
          <span className="brand-mark">
            <svg width="20" height="20" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="50" cy="50" r="43.5" />
              <line x1="60.05" y1="32.6" x2="85.02" y2="75.84" />
              <line x1="39.95" y1="32.6" x2="89.89" y2="32.6" />
              <line x1="29.9" y1="50" x2="54.87" y2="6.76" />
              <line x1="39.95" y1="67.4" x2="14.98" y2="24.16" />
              <line x1="60.05" y1="67.4" x2="10.11" y2="67.4" />
              <line x1="70.1" y1="50" x2="45.13" y2="93.24" />
            </svg>
          </span>
          <span>STILLFORM</span>
        </a>

        <div className="nav-actions">
          <button
            className="icon-button"
            aria-label="Search gallery"
            onClick={() => {
              setSearchOpen((v) => !v)
              setTimeout(() => document.getElementById('gallery-search')?.focus(), 40)
            }}
          >
            <Search size={17} />
          </button>
          <button
            className="icon-button theme-toggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </header>

      <main id="top">
                <section className="outpost-hero" ref={heroRef}>
          <div className="outpost-hero-head">
            <h1 className="outpost-hero-title">
              <div className="outpost-line line-1" ref={line1Ref}>
                <span>SEEING</span>
              </div>
              <div className="outpost-line line-2" ref={line2Ref}>
                <span>BEYOND</span>
              </div>
              <div className="outpost-line line-3" ref={line3Ref}>
                <span>THE ORDINARY</span>
              </div>
            </h1>
          </div>

          <div className="outpost-hero-media-wrap">
            <div
              className="outpost-media-frame"
              ref={mediaRef}
              onClick={() => openArt(artworks[0])}
              role="button"
              tabIndex={0}
              aria-label="View featured artwork"
            >
              <img src={artworks[0].image} alt="Featured cinematic artwork" />
              <div className="outpost-media-cue">
                <span>01 / The Quiet Between — View Artwork ↗</span>
              </div>
            </div>
            <button ref={downRef} className="outpost-scroll-cue" onClick={scrollToWork} aria-label="Scroll to work">
              <svg viewBox="0 0 104 103" fill="none">
                <path d="M1 50.5L52 101.5L103 50.5" stroke="currentColor" strokeWidth="2.5" />
                <path d="M52 101.5V0" stroke="currentColor" strokeWidth="2.5" />
              </svg>
            </button>
          </div>
        </section>
                <section className="outpost-statement" ref={statementRef}>
          <div className="outpost-statement-container">
            <p
              className="outpost-statement-text"
              ref={statementTextRef}
              aria-label={STATEMENT_TEXT}
            >
              {STATEMENT_WORDS.map((word, wIdx) => (
                <span key={wIdx}>
                  <span className="statement-word">
                    {word.split('').map((char, cIdx) => (
                      <span key={cIdx} className="statement-char">
                        {char}
                      </span>
                    ))}
                  </span>
                  {wIdx < STATEMENT_WORDS.length - 1 ? ' ' : ''}
                </span>
              ))}
            </p>
            <a href="#about" className="outpost-btn">
              <span className="outpost-btn-text">About Stillform</span>
              <span className="outpost-btn-icon">
                <svg viewBox="0 0 15 13" fill="none">
                  <path d="M7.02 0.535156L12.18 5.73516L0 5.73516L0 7.15516L12.24 7.15516L7.02 12.4152H9L14.92 6.47516L9 0.535156L7.02 0.535156Z" fill="currentColor"/>
                </svg>
              </span>
            </a>
          </div>
        </section>

                <section className="outpost-works" id="work">
          <div className="outpost-works-top">
            <h3 className="outpost-kicker">
              Our<br />Selected<br />Works
            </h3>
            <div className="outpost-categories">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`outpost-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="outpost-projects-list" ref={galleryRef}>
            {filtered.map((art, idx) => (
              <article
                key={art.id}
                className={`outpost-project ${idx % 2 === 1 ? 'is-reversed' : ''}`}
              >
                <div
                  className="outpost-project-inner"
                  onClick={() => openArt(art)}
                  role="button"
                  tabIndex={0}
                >
                  <figure className="outpost-project-media">
                    <img
                      src={art.image}
                      alt={art.title}
                      loading="lazy"
                      onError={() => markImageError(art.id)}
                    />
                    <div className="outpost-project-pill">{art.category}</div>
                  </figure>
                  <div className="outpost-project-meta">
                    <span className="outpost-project-num">{String(idx + 1).padStart(2, '0')}</span>
                    <div className="outpost-project-details">
                      <h2 className="outpost-project-title">{art.title}</h2>
                      <h3 className="outpost-project-tags">
                        <span>{art.category}</span>, <span>{art.collection}</span>, <span>{art.year}</span>, <span>{art.creator}</span>
                      </h3>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

                <section className="outpost-about" id="about">
          <div className="outpost-about-grid">
            <div className="outpost-about-left">
              <span className="outpost-kicker">02 / The Philosophy</span>
              <h2 className="outpost-about-title">
                For everything<br />
                <em>worth looking at twice.</em>
              </h2>
            </div>
            <div className="outpost-about-right">
              <p className="outpost-about-p1">
                We believe the most powerful visuals are the ones that do not shout. They linger. They ask you to slow down, notice the subtle gradations of shadow, the texture of weathered concrete, and the fleeting quiet between moments.
              </p>
              <p className="outpost-about-p2">
                Stillform is an independently curated digital archive exploring the intersection of cinema-grade photography, modernist architectural spaces, and natural stillness across the globe.
              </p>
              <div className="outpost-stats-grid">
                <div>
                  <strong>12</strong>
                  <span>SELECTED WORKS</span>
                </div>
                <div>
                  <strong>06</strong>
                  <span>CREATIVE VOICES</span>
                </div>
                <div>
                  <strong>03</strong>
                  <span>CURATED WORLDS</span>
                </div>
                <div>
                  <strong>∞</strong>
                  <span>WAYS TO SEE</span>
                </div>
              </div>
            </div>
          </div>
        </section>

                <section className="outpost-collections" id="collections">
          <div className="outpost-collections-head">
            <span className="outpost-kicker">03 / Curated Worlds</span>
            <h2 className="outpost-collections-title">
              Themes in <em>stillness.</em>
            </h2>
          </div>
          <div className="outpost-collections-grid">
            {collections.map((col) => (
              <div
                key={col.title}
                className="outpost-collection-card"
                onClick={() => {
                  setActiveCategory(col.category)
                  scrollToWork()
                }}
              >
                <div className="outpost-collection-img-wrap">
                  <img src={col.image} alt={col.title} loading="lazy" />
                  <span className="outpost-collection-badge">{col.number} WORKS</span>
                </div>
                <div className="outpost-collection-info">
                  <span className="outpost-collection-cat">{col.category}</span>
                  <h3>{col.title}</h3>
                  <p>{col.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

                <section className="outpost-cta" id="contact">
          <div className="outpost-cta-inner">
            <p className="outpost-cta-lead">Ready to discover a world beyond the ordinary?</p>
            <a href="mailto:curate@stillform.archive" className="outpost-btn outpost-btn-large">
              <span className="outpost-btn-text">Curatorial Inquiries</span>
              <span className="outpost-btn-icon">
                <svg viewBox="0 0 15 13" fill="none">
                  <path d="M7.02 0.535156L12.18 5.73516L0 5.73516L0 7.15516L12.24 7.15516L7.02 12.4152H9L14.92 6.47516L9 0.535156L7.02 0.535156Z" fill="currentColor"/>
                </svg>
              </span>
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand-col">
            <a className="brand footer-brand" href="#top">
              <span className="brand-mark">
                <svg width="20" height="20" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="50" cy="50" r="43.5" />
                  <line x1="60.05" y1="32.6" x2="85.02" y2="75.84" />
                  <line x1="39.95" y1="32.6" x2="89.89" y2="32.6" />
                  <line x1="29.9" y1="50" x2="54.87" y2="6.76" />
                  <line x1="39.95" y1="67.4" x2="14.98" y2="24.16" />
                  <line x1="60.05" y1="67.4" x2="10.11" y2="67.4" />
                  <line x1="70.1" y1="50" x2="45.13" y2="93.24" />
                </svg>
              </span>
              <span>STILLFORM</span>
            </a>
            <p className="footer-tagline">
              For everything worth<br />looking at twice.
            </p>
            <p className="footer-desc">
              An independent archive celebrating quiet light, architectural form, and deliberate visual composition.
            </p>
            <p className="footer-submit">
              Curatorial inquiries:{' '}
              <a href="mailto:curate@stillform.archive" className="footer-submit-link">
                curate@stillform.archive
              </a>
            </p>
            <div className="footer-socials">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://bsky.app" target="_blank" rel="noopener noreferrer" aria-label="Bluesky">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566 1.01 1.5 1.5 1.5 3.5c0 1.25.375 6.5 1 8.5.833 2.667 2.667 3.5 4.5 3.5-3 .5-4.5 2.5-4 4.5.625 2.5 3.5 3 6 1.5 2.5-1.5 3-3 3-3s.5 1.5 3 3c2.5 1.5 5.375 1 6-1.5.5-2-.999-4-4-4.5 1.833 0 3.667-.833 4.5-3.5.625-2 1-7.25 1-8.5 0-2-1.066-2.49-3.702-.695C16.046 4.747 13.087 8.686 12 10.8z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="footer-links-col">
              <h4>Collections</h4>
              <ul>
                <li><a href="#collections">After the Last Light</a></li>
                <li><a href="#collections">Concrete Dreams</a></li>
                <li><a href="#collections">Quiet Landscapes</a></li>
                <li><a href="#collections">Human Fragments</a></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4>Categories</h4>
              <ul>
                <li><a href="#gallery" onClick={() => setActiveCategory('Cinematic')}>Cinematic</a></li>
                <li><a href="#gallery" onClick={() => setActiveCategory('Architecture')}>Architecture</a></li>
                <li><a href="#gallery" onClick={() => setActiveCategory('Nature')}>Nature</a></li>
                <li><a href="#gallery" onClick={() => setActiveCategory('Portraits')}>Portraits</a></li>
                <li><a href="#gallery" onClick={() => setActiveCategory('Abstract')}>Abstract</a></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4>Curations</h4>
              <ul>
                <li><a href="#gallery">Selected Works</a></li>
                <li><a href="#about">Creative Voices</a></li>
                <li><a href="#about">Curated Worlds</a></li>
                <li><a href="#about">Ways to See</a></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#gallery">Archive Index</a></li>
                <li><a href="#about">About Stillform</a></li>
                <li><a href="mailto:curate@stillform.archive">Submit Site</a></li>
                <li><a href="#top" className="footer-back-top-link">Back to Top <ArrowUpRight size={13} /></a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} STILLFORM ARCHIVE</span>
          <span>INDEPENDENTLY CURATED · ALWAYS LOOKING</span>
          <div className="footer-bottom-nav">
            <a href="#gallery">GALLERY</a>
            <a href="#collections">COLLECTIONS</a>
            <a href="#about">ABOUT</a>
          </div>
        </div>

        <div className="footer-big-text" aria-hidden="true">
          <span>STILLFORM</span>
        </div>
      </footer>

      {activeArt && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeArt.title} artwork`}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setActiveArt(null)
          }}
        >
          <button className="lightbox-close" onClick={() => setActiveArt(null)} aria-label="Close artwork">
            <X size={21} />
          </button>
          <button className="lightbox-nav lightbox-prev" onClick={() => moveArt(-1)} aria-label="Previous artwork">
            <ArrowLeft size={20} />
          </button>
          <div className="lightbox-inner">
            <div className="lightbox-image">
              <img src={activeArt.image.replace('w=1400', 'w=2000')} alt={activeArt.title} />
            </div>
            <div className="lightbox-details">
              <div>
                <span className="art-category">
                  {activeArt.category} / {activeArt.year} · {activeArt.collection}
                </span>
                <h2>{activeArt.title}</h2>
                <p>{activeArt.description}</p>
              </div>
              <div className="lightbox-credit">
                <span>CAPTURED BY</span>
                <strong>{activeArt.creator}</strong>
                <span className="lightbox-count">
                  {String(filtered.findIndex((a) => a.id === activeArt.id) + 1).padStart(2, '0')} /{' '}
                  {String(filtered.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
          <button className="lightbox-nav lightbox-next" onClick={() => moveArt(1)} aria-label="Next artwork">
            <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  )
}

export default App
