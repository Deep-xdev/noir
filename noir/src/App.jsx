import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Google Fonts ─────────────────────────────────────────────── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@200;300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --black: #080808;
      --charcoal: #111111;
      --gray-dark: #1a1a1a;
      --gray-mid: #2a2a2a;
      --gray-border: #282828;
      --gray-text: #888;
      --white: #f5f5f0;
      --white-dim: #b0b0a8;
      --accent: #c8a96e;
      --accent-dim: #8a7048;
      --red: #d94f3d;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--black);
      color: var(--white);
      font-family: 'Outfit', sans-serif;
      font-weight: 300;
      cursor: none;
      overflow-x: hidden;
    }

    /* ── Custom Cursor ── */
    .cursor-dot {
      width: 6px; height: 6px;
      background: var(--white);
      border-radius: 50%;
      position: fixed;
      top: 0; left: 0;
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%, -50%);
      transition: background 0.2s;
    }
    .cursor-ring {
      width: 36px; height: 36px;
      border: 1px solid rgba(245,245,240,0.5);
      border-radius: 50%;
      position: fixed;
      top: 0; left: 0;
      pointer-events: none;
      z-index: 99998;
      transform: translate(-50%, -50%);
      transition: width 0.3s, height 0.3s, border-color 0.3s, background 0.3s;
    }
    .cursor-ring.hovered {
      width: 56px; height: 56px;
      border-color: var(--accent);
      background: rgba(200,169,110,0.08);
    }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: var(--black); }
    ::-webkit-scrollbar-thumb { background: var(--gray-mid); }

    /* ── Noise Texture Overlay ── */
    .noise::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 1;
      opacity: 0.35;
    }

    /* ── Scroll Reveal ── */
    .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.9s cubic-bezier(.16,1,.3,1), transform 0.9s cubic-bezier(.16,1,.3,1); }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal-left { opacity: 0; transform: translateX(-50px); transition: opacity 0.9s cubic-bezier(.16,1,.3,1), transform 0.9s cubic-bezier(.16,1,.3,1); }
    .reveal-left.visible { opacity: 1; transform: translateX(0); }
    .reveal-right { opacity: 0; transform: translateX(50px); transition: opacity 0.9s cubic-bezier(.16,1,.3,1), transform 0.9s cubic-bezier(.16,1,.3,1); }
    .reveal-right.visible { opacity: 1; transform: translateX(0); }

    /* ── Hero ── */
    @keyframes heroFadeIn {
      from { opacity: 0; transform: scale(1.04); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes heroTextIn {
      from { opacity: 0; transform: translateY(60px) skewY(2deg); }
      to { opacity: 1; transform: translateY(0) skewY(0); }
    }
    @keyframes subtitleIn {
      from { opacity: 0; letter-spacing: 0.6em; }
      to { opacity: 1; letter-spacing: 0.35em; }
    }
    .hero-bg {
      animation: heroFadeIn 1.6s cubic-bezier(.16,1,.3,1) forwards;
    }
    .hero-title span {
      display: block;
      animation: heroTextIn 1s cubic-bezier(.16,1,.3,1) forwards;
      opacity: 0;
    }
    .hero-title span:nth-child(1) { animation-delay: 0.3s; }
    .hero-title span:nth-child(2) { animation-delay: 0.5s; }
    .hero-subtitle {
      animation: subtitleIn 1.4s cubic-bezier(.16,1,.3,1) 0.9s forwards;
      opacity: 0;
    }
    .hero-cta {
      animation: heroTextIn 1s cubic-bezier(.16,1,.3,1) 1.1s forwards;
      opacity: 0;
    }

    /* ── Nav ── */
    .nav-link {
      position: relative;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--white-dim);
      text-decoration: none;
      transition: color 0.3s;
      cursor: none;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -2px; left: 0;
      width: 0; height: 1px;
      background: var(--accent);
      transition: width 0.4s cubic-bezier(.16,1,.3,1);
    }
    .nav-link:hover { color: var(--white); }
    .nav-link:hover::after { width: 100%; }

    /* ── Product Cards ── */
    .product-card { cursor: none; }
    .product-card .card-img { transition: transform 0.7s cubic-bezier(.16,1,.3,1); }
    .product-card:hover .card-img { transform: scale(1.07); }
    .product-card .card-overlay {
      opacity: 0;
      transition: opacity 0.4s;
      background: linear-gradient(to top, rgba(8,8,8,0.85) 0%, rgba(8,8,8,0.2) 60%, transparent 100%);
    }
    .product-card:hover .card-overlay { opacity: 1; }
    .product-card .quick-view {
      transform: translateY(12px);
      opacity: 0;
      transition: transform 0.4s cubic-bezier(.16,1,.3,1), opacity 0.4s;
    }
    .product-card:hover .quick-view {
      transform: translateY(0);
      opacity: 1;
    }

    /* ── Countdown Flip ── */
    @keyframes flipIn {
      from { transform: rotateX(-90deg); opacity: 0; }
      to { transform: rotateX(0); opacity: 1; }
    }
    .flip-animate { animation: flipIn 0.4s cubic-bezier(.16,1,.3,1); }

    /* ── Cart Panel ── */
    .cart-panel {
      transform: translateX(100%);
      transition: transform 0.5s cubic-bezier(.16,1,.3,1);
    }
    .cart-panel.open { transform: translateX(0); }

    /* ── Btn Primary ── */
    .btn-primary {
      position: relative;
      overflow: hidden;
      background: var(--white);
      color: var(--black);
      font-family: 'Outfit', sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      padding: 16px 40px;
      border: none;
      cursor: none;
      transition: color 0.4s;
    }
    .btn-primary::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--accent);
      transform: translateX(-101%);
      transition: transform 0.5s cubic-bezier(.16,1,.3,1);
    }
    .btn-primary:hover::before { transform: translateX(0); }
    .btn-primary span { position: relative; z-index: 1; }

    /* ── Btn Outline ── */
    .btn-outline {
      position: relative;
      overflow: hidden;
      background: transparent;
      color: var(--white);
      font-family: 'Outfit', sans-serif;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      padding: 14px 32px;
      border: 1px solid var(--gray-border);
      cursor: none;
      transition: color 0.4s, border-color 0.4s;
    }
    .btn-outline::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--white);
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.5s cubic-bezier(.16,1,.3,1);
    }
    .btn-outline:hover { color: var(--black); border-color: var(--white); }
    .btn-outline:hover::before { transform: scaleX(1); transform-origin: left; }
    .btn-outline span { position: relative; z-index: 1; }

    /* ── Size Selector ── */
    .size-btn {
      width: 48px; height: 48px;
      border: 1px solid var(--gray-border);
      background: transparent;
      color: var(--white-dim);
      font-family: 'Outfit', sans-serif;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.05em;
      cursor: none;
      transition: all 0.25s;
    }
    .size-btn:hover { border-color: var(--white); color: var(--white); }
    .size-btn.selected { background: var(--white); color: var(--black); border-color: var(--white); }

    /* ── Lookbook ── */
    .lookbook-item { overflow: hidden; }
    .lookbook-item img { transition: transform 8s cubic-bezier(.16,1,.3,1); transform: scale(1.05); }
    .lookbook-item:hover img { transform: scale(1); }

    /* ── Marquee ── */
    @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    .marquee-inner { animation: marquee 18s linear infinite; white-space: nowrap; }
    .marquee-inner:hover { animation-play-state: paused; }

    /* ── Modal ── */
    @keyframes modalIn {
      from { opacity: 0; transform: scale(0.96) translateY(20px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .modal-enter { animation: modalIn 0.5s cubic-bezier(.16,1,.3,1) forwards; }

    /* ── Grain ── */
    .grain {
      position: fixed; inset: 0; pointer-events: none; z-index: 99997;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)' opacity='0.05'/%3E%3C/svg%3E");
      opacity: 0.4;
    }

    @keyframes addToCart {
      0% { transform: scale(1); }
      30% { transform: scale(0.95); }
      60% { transform: scale(1.03); }
      100% { transform: scale(1); }
    }
    .cart-bounce { animation: addToCart 0.5s cubic-bezier(.16,1,.3,1); }

    .thumbnail-btn { transition: opacity 0.3s, border-color 0.3s; }
    .thumbnail-btn.active { border-color: var(--accent) !important; opacity: 1 !important; }
  `}</style>
);

/* ─── Product Data ──────────────────────────────────────────────── */
const PRODUCTS = [
  {
    id: 1,
    name: "VOID OVERSIZED TEE",
    price: "$185",
    tag: "NEW",
    color: "#1a1a1a",
    gradient: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
    sizes: ["S","M","L","XL"],
    description: "Heavy-weight 280gsm cotton. Oversized silhouette with dropped shoulders. Garment-dyed black. Made in Portugal.",
    images: [
      "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=800&q=80",
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&q=80",
      "https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=800&q=80",
    ]
  },
  {
    id: 2,
    name: "SHADOW CARGO PANT",
    price: "$320",
    tag: "LIMITED",
    color: "#1c1c1c",
    gradient: "linear-gradient(135deg, #1c1a17 0%, #111 100%)",
    sizes: ["S","M","L","XL"],
    description: "Technical ripstop fabric. Six-pocket cargo construction. Tapered fit. Tonal hardware. Limited run of 200 units.",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
    ]
  },
  {
    id: 3,
    name: "ECLIPSE BOMBER",
    price: "$590",
    tag: "EXCLUSIVE",
    color: "#181818",
    gradient: "linear-gradient(135deg, #181818 0%, #0a0a0a 100%)",
    sizes: ["S","M","L","XL"],
    description: "MA-1 inspired silhouette. Satin shell with quilted lining. Hidden zip pockets. Drop-shoulder construction.",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80",
    ]
  },
  {
    id: 4,
    name: "MONOLITH HOODIE",
    price: "$265",
    tag: "DROP 01",
    color: "#161616",
    gradient: "linear-gradient(135deg, #161616 0%, #0e0e0e 100%)",
    sizes: ["S","M","L","XL"],
    description: "500gsm French terry. Double-lined hood. Kangaroo pocket. Ribbed hem and cuffs. Boxy fit.",
    images: [
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      // "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80",
    ]
  },
  {
    id: 5,
    name: "NOIR UTILITY VEST",
    price: "$240",
    tag: "NEW",
    color: "#141414",
    gradient: "linear-gradient(135deg, #141414 0%, #0c0c0c 100%)",
    sizes: ["S","M","L","XL"],
    description: "Six-pocket tactical vest. Adjustable waist straps. Matte black hardware. Waxed cotton canvas.",
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80",
      "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    ]
  },
  {
    id: 6,
    name: "PHANTOM TRACK JACKET",
    price: "$295",
    tag: "LIMITED",
    color: "#131313",
    gradient: "linear-gradient(135deg, #131313 0%, #0b0b0b 100%)",
    sizes: ["S","M","L","XL"],
    description: "Recycled technical fabric. Zip-through silhouette. Contrast seam tape. Reflective NOIR logo.",
    images: [
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&q=80",
      // "https://images.unsplash.com/photo-1580153015574-13d4b8b5cbee?w=800&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
    ]
  },
];

const LOOKBOOK = [
  { src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=85", label: "LOOK 01 — SHADOW", desc: "Oversized Tee / Cargo Pant / Military Boot" },
  { src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&q=85", label: "LOOK 02 — VOID", desc: "Eclipse Bomber / Monolith Hoodie / Track Pant" },
  { src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=85", label: "LOOK 03 — PHANTOM", desc: "Utility Vest / Phantom Jacket / Noir Tee" },
  { src: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=1200&q=85", label: "LOOK 04 — ECLIPSE", desc: "Full Look — DROP 01 Collection" },
];

/* ─── useScrollReveal ───────────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ─── Cursor ────────────────────────────────────────────────────── */
function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    const onMove = e => { mx = e.clientX; my = e.clientY; };
    const animate = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (dot.current) { dot.current.style.left = mx + 'px'; dot.current.style.top = my + 'px'; }
      if (ring.current) { ring.current.style.left = rx + 'px'; ring.current.style.top = ry + 'px'; }
      requestAnimationFrame(animate);
    };
    const onEnter = () => ring.current?.classList.add('hovered');
    const onLeave = () => ring.current?.classList.remove('hovered');
    window.addEventListener('mousemove', onMove);
    document.querySelectorAll('button, a, [data-hover]').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });
    animate();
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dot} />
      <div className="cursor-ring" ref={ring} />
    </>
  );
}

/* ─── Navbar ────────────────────────────────────────────────────── */
function Navbar({ cartCount, onCartOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9000,
      padding: '0 40px',
      height: 72,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transition: 'background 0.5s, backdrop-filter 0.5s',
      background: scrolled ? 'rgba(8,8,8,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.04)' : 'none',
    }}>
      {/* Logo */}
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: '0.12em', color: 'var(--white)' }}>
        NOIR
      </div>

      {/* Desktop Nav */}
      <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
        {['Collection','Lookbook','Drops','About'].map(item => (
          <a key={item} href="#" className="nav-link">{item}</a>
        ))}
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <a href="#" className="nav-link">Search</a>
        <button
          onClick={onCartOpen}
          style={{ background: 'none', border: 'none', color: 'var(--white)', cursor: 'none', position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <span style={{ fontSize: 11, fontFamily: 'Outfit', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--white-dim)' }}>Cart</span>
          {cartCount > 0 && (
            <span style={{
              width: 18, height: 18, borderRadius: '50%', background: 'var(--accent)',
              color: '#000', fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{cartCount}</span>
          )}
        </button>
      </div>
    </nav>
  );
}

/* ─── Hero ──────────────────────────────────────────────────────── */
function Hero({ onShopNow }) {
  const bgRef = useRef(null);

  useEffect(() => {
    const handler = () => {
      if (bgRef.current) bgRef.current.style.transform = `scale(1.04) translateY(${window.scrollY * 0.25}px)`;
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <section style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {/* BG */}
      <div ref={bgRef} className="hero-bg" style={{
        position: 'absolute', inset: '-10%',
        backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=90)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'brightness(0.28)',
        zIndex: 0,
      }} />

      {/* Gradient Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,8,8,0.2) 0%, rgba(8,8,8,0.7) 100%)', zIndex: 1 }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px' }}>
        {/* Eyebrow */}
        <p className="hero-subtitle" style={{
          fontFamily: 'Outfit', fontSize: 11, fontWeight: 500, letterSpacing: '0.35em',
          textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 32,
        }}>
          — Spring / Summer 2025 —
        </p>

        {/* Title */}
        <h1 className="hero-title" style={{ fontFamily: "'Bebas Neue', sans-serif", lineHeight: 0.88, marginBottom: 48 }}>
          <span style={{ fontSize: 'clamp(80px, 18vw, 240px)', display: 'block', letterSpacing: '0.04em', color: 'var(--white)' }}>NOIR</span>
          <span style={{ fontSize: 'clamp(28px, 6vw, 80px)', letterSpacing: '0.3em', color: 'var(--accent)', display: 'block', marginTop: 8 }}>DROP 01</span>
        </h1>

        {/* CTA */}
        <div className="hero-cta" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={onShopNow}><span>Shop the Collection</span></button>
          <button className="btn-outline"><span>View Lookbook</span></button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div style={{
        position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
        zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontFamily: 'Outfit', fontSize: 10, letterSpacing: '0.25em', color: 'var(--white-dim)', textTransform: 'uppercase' }}>Scroll</span>
        <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--accent), transparent)', animation: 'heroTextIn 2s ease infinite' }} />
      </div>
    </section>
  );
}

/* ─── Marquee ───────────────────────────────────────────────────── */
function Marquee() {
  const items = ["DROP 01", "NOIR", "SS-25", "LIMITED", "STREETWEAR", "LUXURY", "VOID", "SHADOW"];
  const repeated = [...items, ...items, ...items, ...items];
  return (
    <div style={{ overflow: 'hidden', borderTop: '1px solid var(--gray-border)', borderBottom: '1px solid var(--gray-border)', padding: '18px 0', background: 'var(--charcoal)' }}>
      <div className="marquee-inner" style={{ display: 'inline-flex', gap: 64 }}>
        {repeated.map((item, i) => (
          <span key={i} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: '0.3em', color: i % 3 === 1 ? 'var(--accent)' : 'var(--gray-text)', whiteSpace: 'nowrap' }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Collection ────────────────────────────────────────────────── */
function Collection({ onQuickView, onAddToCart }) {
  useScrollReveal();
  return (
    <section id="collection" style={{ padding: '120px 40px', background: 'var(--black)' }}>
      {/* Header */}
      <div className="reveal" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 80, flexWrap: 'wrap', gap: 24 }}>
        <div>
          <p style={{ fontFamily: 'Outfit', fontSize: 11, letterSpacing: '0.3em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 16 }}>— Featured Collection</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 8vw, 96px)', letterSpacing: '0.04em', lineHeight: 0.9, color: 'var(--white)' }}>
            DROP<br />01
          </h2>
        </div>
        <button className="btn-outline" style={{ alignSelf: 'flex-end' }}><span>View All</span></button>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
        {PRODUCTS.map((p, i) => (
          <div key={p.id} className={`reveal product-card`} style={{ animationDelay: `${i * 0.08}s`, transitionDelay: `${i * 0.05}s` }}>
            {/* Image Container */}
            <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: p.gradient, cursor: 'none' }}
              onClick={() => onQuickView(p)}>
              <img
                src={p.images[0]}
                alt={p.name}
                className="card-img"
                style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'luminosity', opacity: 0.85 }}
              />
              {/* Overlay */}
              <div className="card-overlay" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px 20px' }}>
                <button className="quick-view btn-outline" style={{ width: '100%', textAlign: 'center' }}
                  onClick={(e) => { e.stopPropagation(); onQuickView(p); }}>
                  <span>Quick View</span>
                </button>
              </div>
              {/* Tag */}
              <div style={{ position: 'absolute', top: 16, left: 16, background: 'var(--accent)', color: '#000', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', padding: '4px 10px', textTransform: 'uppercase', fontFamily: 'Outfit' }}>
                {p.tag}
              </div>
            </div>
            {/* Info */}
            <div style={{ padding: '20px 0 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontFamily: 'Outfit', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--white)', marginBottom: 6 }}>{p.name}</p>
                <p style={{ fontFamily: 'Outfit', fontSize: 11, color: 'var(--gray-text)', letterSpacing: '0.05em' }}>Black / SS-25</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: '0.05em', color: 'var(--white)' }}>{p.price}</p>
                <button onClick={() => onAddToCart(p)} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 10, fontFamily: 'Outfit', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'none', marginTop: 4 }}>+ Add</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Countdown ─────────────────────────────────────────────────── */
function Countdown() {
  const target = useRef(new Date(Date.now() + 3 * 24 * 3600 * 1000 + 14 * 3600 * 1000 + 37 * 60 * 1000 + 22000));
  const [time, setTime] = useState({ d: 3, h: 14, m: 37, s: 22 });
  const prevTime = useRef(time);

  useEffect(() => {
    const id = setInterval(() => {
      const diff = Math.max(0, target.current - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTime(prev => { prevTime.current = prev; return { d, h, m, s }; });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const Unit = ({ val, label, changed }) => (
    <div style={{ textAlign: 'center', flex: 1 }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <span
          key={val}
          className={changed ? 'flip-animate' : ''}
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(56px, 10vw, 140px)',
            lineHeight: 1,
            display: 'block',
            color: 'var(--white)',
            letterSpacing: '0.02em',
          }}
        >
          {String(val).padStart(2, '0')}
        </span>
      </div>
      <p style={{ fontFamily: 'Outfit', fontSize: 10, fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gray-text)', marginTop: 12 }}>{label}</p>
    </div>
  );

  const sep = (
    <div style={{ display: 'flex', alignItems: 'flex-start', paddingTop: '4px' }}>
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 8vw, 120px)', color: 'var(--accent)', opacity: 0.6 }}>:</span>
    </div>
  );

  return (
    <section style={{ padding: '120px 40px', background: 'var(--charcoal)', position: 'relative', overflow: 'hidden' }}>
      {/* BG text */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: "'Bebas Neue'", fontSize: '30vw', color: 'rgba(255,255,255,0.015)', letterSpacing: '0.05em', userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
        DROP02
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <div className="reveal">
          <p style={{ fontFamily: 'Outfit', fontSize: 11, letterSpacing: '0.3em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 20 }}>— Next Drop</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 5vw, 64px)', letterSpacing: '0.2em', color: 'var(--white)', marginBottom: 8 }}>DROP 02 — ETHER</h2>
          <p style={{ fontFamily: 'Outfit', fontSize: 13, color: 'var(--gray-text)', letterSpacing: '0.05em', marginBottom: 64 }}>
            The next chapter arrives. Limited to 300 units worldwide.
          </p>
        </div>

        <div className="reveal" style={{ display: 'flex', gap: '0', justifyContent: 'center', alignItems: 'center', borderTop: '1px solid var(--gray-border)', borderBottom: '1px solid var(--gray-border)', padding: '48px 0' }}>
          <Unit val={time.d} label="Days" />
          {sep}
          <Unit val={time.h} label="Hours" />
          {sep}
          <Unit val={time.m} label="Minutes" />
          {sep}
          <Unit val={time.s} label="Seconds" changed={true} />
        </div>

        <div className="reveal" style={{ marginTop: 48 }}>
          <button className="btn-primary"><span>Notify Me</span></button>
        </div>
      </div>
    </section>
  );
}

/* ─── Lookbook ──────────────────────────────────────────────────── */
function Lookbook() {
  useScrollReveal();
  return (
    <section style={{ background: 'var(--black)', padding: '120px 0' }}>
      <div className="reveal" style={{ padding: '0 40px', marginBottom: 80 }}>
        <p style={{ fontFamily: 'Outfit', fontSize: 11, letterSpacing: '0.3em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 16 }}>— Lookbook</p>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 8vw, 96px)', letterSpacing: '0.04em', lineHeight: 0.9, color: 'var(--white)' }}>
          EDITORIAL<br />SS—25
        </h2>
      </div>

      {/* Featured Lookbook Items */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        {/* Large Left */}
        <div className="lookbook-item reveal-left" style={{ gridRow: 'span 2', position: 'relative', overflow: 'hidden', aspectRatio: '2/3' }}>
          <img src={LOOKBOOK[0].src} alt="Look 01" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75)' }} />
          <div style={{ position: 'absolute', bottom: 40, left: 40 }}>
            <p style={{ fontFamily: 'Outfit', fontSize: 10, letterSpacing: '0.3em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 8 }}>{LOOKBOOK[0].label}</p>
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: 'var(--white)', fontStyle: 'italic' }}>{LOOKBOOK[0].desc}</p>
          </div>
        </div>

        {/* Right Column */}
        {LOOKBOOK.slice(1).map((look, i) => (
          <div key={i} className="lookbook-item reveal-right" style={{ position: 'relative', overflow: 'hidden', transitionDelay: `${i * 0.1}s` }}>
            <img src={look.src} alt={look.label} style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '3/2', filter: 'brightness(0.7)' }} />
            <div style={{ position: 'absolute', bottom: 24, left: 24 }}>
              <p style={{ fontFamily: 'Outfit', fontSize: 10, letterSpacing: '0.25em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 4 }}>{look.label}</p>
              <p style={{ fontFamily: 'Outfit', fontSize: 12, color: 'var(--white-dim)' }}>{look.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="reveal" style={{ textAlign: 'center', padding: '80px 40px 0' }}>
        <button className="btn-outline"><span>View Full Lookbook</span></button>
      </div>
    </section>
  );
}

/* ─── Product Modal ─────────────────────────────────────────────── */
function ProductModal({ product, onClose, onAddToCart }) {
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState(null);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    if (!size) return;
    onAddToCart({ ...product, size });
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 1200);
  };

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(8px)' }}
    >
      <div
        className="modal-enter"
        onClick={e => e.stopPropagation()}
        style={{ background: 'var(--charcoal)', maxWidth: 960, width: '100%', maxHeight: '92vh', overflow: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid var(--gray-border)' }}
      >
        {/* Left: Images */}
        <div style={{ position: 'relative', background: product.gradient }}>
          <img
            src={product.images[activeImg]}
            alt={product.name}
            style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', mixBlendMode: 'luminosity', opacity: 0.85, transition: 'opacity 0.4s' }}
          />
          {/* Thumbnails */}
          <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', gap: 8 }}>
            {product.images.map((img, i) => (
              <button
                key={i}
                className={`thumbnail-btn ${i === activeImg ? 'active' : ''}`}
                onClick={() => setActiveImg(i)}
                style={{ width: 52, height: 52, overflow: 'hidden', border: '1px solid var(--gray-border)', background: 'none', cursor: 'none', opacity: i === activeImg ? 1 : 0.5 }}
              >
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'luminosity' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: 28, overflowY: 'auto' }}>
          {/* Close */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ background: 'var(--accent)', color: '#000', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', padding: '4px 10px', textTransform: 'uppercase', fontFamily: 'Outfit' }}>{product.tag}</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--gray-text)', cursor: 'none', fontSize: 22, lineHeight: 1 }}>×</button>
          </div>

          <div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, letterSpacing: '0.06em', color: 'var(--white)', lineHeight: 0.9, marginBottom: 12 }}>{product.name}</h2>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: 'var(--accent)', letterSpacing: '0.05em' }}>{product.price}</p>
          </div>

          <p style={{ fontFamily: 'Outfit', fontSize: 13, lineHeight: 1.7, color: 'var(--gray-text)', letterSpacing: '0.02em' }}>{product.description}</p>

          {/* Size */}
          <div>
            <p style={{ fontFamily: 'Outfit', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gray-text)', marginBottom: 12 }}>Select Size</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {product.sizes.map(s => (
                <button key={s} className={`size-btn ${size === s ? 'selected' : ''}`} onClick={() => setSize(s)}>{s}</button>
              ))}
            </div>
            {!size && <p style={{ fontFamily: 'Outfit', fontSize: 11, color: 'var(--gray-text)', marginTop: 8, opacity: 0.6 }}>Please select a size</p>}
          </div>

          {/* Add to Cart */}
          <button
            className={`btn-primary ${added ? 'cart-bounce' : ''}`}
            onClick={handleAdd}
            style={{ width: '100%', transition: 'opacity 0.3s', opacity: size ? 1 : 0.4, background: added ? 'var(--accent)' : 'var(--white)' }}
          >
            <span>{added ? '✓ Added to Cart' : 'Add to Cart'}</span>
          </button>

          {/* Meta */}
          <div style={{ borderTop: '1px solid var(--gray-border)', paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[["Material", "Heavy-weight cotton"], ["Origin", "Made in Portugal"], ["Care", "Cold wash, hang dry"]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Outfit', fontSize: 11, color: 'var(--gray-text)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{k}</span>
                <span style={{ fontFamily: 'Outfit', fontSize: 11, color: 'var(--white-dim)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Cart Panel ────────────────────────────────────────────────── */
function CartPanel({ open, onClose, items, onUpdateQty, onRemove }) {
  const total = items.reduce((sum, it) => sum + parseFloat(it.price.replace('$', '')) * it.qty, 0);

  return (
    <>
      {/* Backdrop */}
      {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 8998, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />}

      {/* Panel */}
      <div className={`cart-panel ${open ? 'open' : ''}`} style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 8999,
        width: '100%', maxWidth: 440,
        background: 'var(--charcoal)',
        borderLeft: '1px solid var(--gray-border)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '28px 32px', borderBottom: '1px solid var(--gray-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: '0.1em', color: 'var(--white)' }}>Your Cart</p>
            <p style={{ fontFamily: 'Outfit', fontSize: 11, color: 'var(--gray-text)', marginTop: 2 }}>{items.length} item{items.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid var(--gray-border)', color: 'var(--white-dim)', width: 40, height: 40, cursor: 'none', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 80 }}>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: '0.1em', color: 'var(--gray-text)', marginBottom: 12 }}>Empty</p>
              <p style={{ fontFamily: 'Outfit', fontSize: 13, color: 'var(--gray-text)' }}>Your cart awaits.</p>
            </div>
          ) : items.map(item => (
            <div key={item.cartId} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', paddingBottom: 24, borderBottom: '1px solid var(--gray-border)' }}>
              <div style={{ width: 80, height: 96, overflow: 'hidden', background: item.gradient, flexShrink: 0 }}>
                <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'luminosity', opacity: 0.8 }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'Outfit', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--white)', marginBottom: 4 }}>{item.name}</p>
                <p style={{ fontFamily: 'Outfit', fontSize: 11, color: 'var(--gray-text)', marginBottom: 12 }}>Size: {item.size}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', border: '1px solid var(--gray-border)' }}>
                    <button onClick={() => onUpdateQty(item.cartId, -1)} style={{ width: 32, height: 32, background: 'none', border: 'none', color: 'var(--white)', cursor: 'none', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <span style={{ width: 32, textAlign: 'center', lineHeight: '32px', fontFamily: 'Outfit', fontSize: 12, color: 'var(--white)' }}>{item.qty}</span>
                    <button onClick={() => onUpdateQty(item.cartId, 1)} style={{ width: 32, height: 32, background: 'none', border: 'none', color: 'var(--white)', cursor: 'none', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: 'var(--white)', letterSpacing: '0.05em' }}>
                    ${(parseFloat(item.price.replace('$', '')) * item.qty).toFixed(0)}
                  </p>
                </div>
              </div>
              <button onClick={() => onRemove(item.cartId)} style={{ background: 'none', border: 'none', color: 'var(--gray-text)', cursor: 'none', fontSize: 16, marginTop: 2 }}>×</button>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '24px 32px', borderTop: '1px solid var(--gray-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: 'Outfit', fontSize: 12, color: 'var(--gray-text)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Subtotal</span>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: 'var(--white)', letterSpacing: '0.05em' }}>${total.toFixed(0)}</span>
            </div>
            <p style={{ fontFamily: 'Outfit', fontSize: 11, color: 'var(--gray-text)', marginBottom: 20 }}>Shipping calculated at checkout</p>
            <button className="btn-primary" style={{ width: '100%', textAlign: 'center' }}><span>Checkout</span></button>
            <button className="btn-outline" style={{ width: '100%', textAlign: 'center', marginTop: 8 }}><span>Continue Shopping</span></button>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Footer ────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: 'var(--charcoal)', borderTop: '1px solid var(--gray-border)', padding: '80px 40px 40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 48, marginBottom: 64 }}>
        <div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: '0.1em', color: 'var(--white)', marginBottom: 16 }}>NOIR</div>
          <p style={{ fontFamily: 'Outfit', fontSize: 12, lineHeight: 1.7, color: 'var(--gray-text)' }}>Premium streetwear.<br />Made with intention.<br />Limited by design.</p>
        </div>
        {[
          ['Collection', ['Drop 01', 'Drop 02', 'Archive', 'Lookbook']],
          ['Info', ['About', 'Sustainability', 'Stockists', 'Press']],
          ['Help', ['Sizing', 'Shipping', 'Returns', 'Contact']],
        ].map(([title, links]) => (
          <div key={title}>
            <p style={{ fontFamily: 'Outfit', fontSize: 10, fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--white)', marginBottom: 20 }}>{title}</p>
            {links.map(l => (
              <a key={l} href="#" className="nav-link" style={{ display: 'block', marginBottom: 12, fontSize: 12 }}>{l}</a>
            ))}
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--gray-border)', paddingTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <p style={{ fontFamily: 'Outfit', fontSize: 11, color: 'var(--gray-text)', letterSpacing: '0.05em' }}>© 2025 NOIR. All rights reserved.</p>
        <p style={{ fontFamily: 'Outfit', fontSize: 11, color: 'var(--gray-text)', letterSpacing: '0.05em' }}>SS-25 / DROP 01</p>
      </div>
    </footer>
  );
}

/* ─── Main App ──────────────────────────────────────────────────── */
export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [modal, setModal] = useState(null);
  const [cartAnim, setCartAnim] = useState(false);

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  const handleAddToCart = useCallback((product) => {
    setCartItems(prev => {
      const key = `${product.id}-${product.size || 'M'}`;
      const existing = prev.find(i => i.cartId === key);
      if (existing) return prev.map(i => i.cartId === key ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, size: product.size || 'M', qty: 1, cartId: key }];
    });
    setCartAnim(true);
    setTimeout(() => setCartAnim(false), 600);
  }, []);

  const handleUpdateQty = (cartId, delta) => {
    setCartItems(prev => prev.map(i => i.cartId === cartId ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const handleRemove = (cartId) => {
    setCartItems(prev => prev.filter(i => i.cartId !== cartId));
  };

  return (
    <>
      <FontLoader />
      <div className="grain" />
      <Cursor />

      <Navbar
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
      />

      <main>
        <Hero onShopNow={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })} />
        <Marquee />
        <Collection onQuickView={setModal} onAddToCart={handleAddToCart} />
        <Countdown />
        <Lookbook />
      </main>

      <Footer />

      {/* Product Modal */}
      {modal && (
        <ProductModal
          product={modal}
          onClose={() => setModal(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart Panel */}
      <CartPanel
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
      />
    </>
  );
}
