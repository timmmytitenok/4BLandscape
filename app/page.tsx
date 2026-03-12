"use client";

import { useEffect, useRef, useState } from "react";
import CircularGallery from "./components/CircularGallery";
import LightRays from "./components/LightRays";
const CircularGalleryAny = CircularGallery as any;

const SERVICE_CATEGORIES = [
  {
    title: "Services",
    services: [
      { name: "Mulching", Icon: MulchIcon, description: "Fresh mulch installation for clean beds." },
      { name: "Sod Installation", Icon: SodIcon, description: "New sod installation and lawn replacement." },
      { name: "Grass Seeding", Icon: LawnIcon, description: "Overseeding and new seed application for thicker lawns." },
      { name: "Brick Edging", Icon: EdgingIcon, description: "Crisp brick edging for beds and walkways." },
      { name: "Lawn Mowing", Icon: LawnIcon, description: "Routine mowing for clean, even lawns." },
      { name: "Tree Services", Icon: SeasonalIcon, description: "General trimming and tree service support." },
      { name: "Land Clearing", Icon: CleanupIcon, description: "Brush and debris clearing for open usable space." },
      { name: "Fence Installation", Icon: FenceIcon, description: "Fence installation and property boundary upgrades." },
      { name: "Patio Builds", Icon: LandscapeIcon, description: "Patio installations for outdoor living spaces." },
      { name: " Gravel/Mulch Deliveries", Icon: GravelIcon, description: "Bulk material delivery to your property." },
    ],
  },
];

const SERVICE_GALLERY_ITEMS = SERVICE_CATEGORIES.flatMap((category) =>
  category.services.map((service) => {
    return {
      image:
        service.name.trim() === "Mulching"
          ? "/gallery/mulching.png"
          : service.name.trim() === "Brick Edging"
            ? "/gallery/brick-edging.png"
            : service.name.trim() === "Sod Installation"
              ? "/gallery/sod-installation.png"
              : service.name.trim() === "Lawn Mowing"
                ? "/gallery/lawn-mowing.png"
                : service.name.trim() === "Gravel/Mulch Deliveries"
                  ? "/gallery/gravel-mulch-deliveries.png"
              : "/gallery/service-placeholder.svg",
      text: service.name,
    };
  })
);

const PHONE = "tel:6148932918";
const PHONE_DISPLAY = "(614) 893-2918";

const WHY_CHOOSE_BENEFITS = [
  "Locally owned Columbus landscaping team",
  "Reliable scheduling and clear communication",
  "Clean, professional landscaping work",
  "Fast quotes and simple scheduling",
  "Professional tools and equipment",
  "Friendly and dependable service",
];

const SERVICE_AREAS = [
  "Columbus",
  "Dublin",
  "Hilliard",
  "Galloway",
  "Grove City",
  "Worthington",
  "Upper Arlington",
  "German Village",
];

const NAV_ITEMS = [
  { label: "Services", id: "services" },
  { label: "Our Work", id: "work" },
  { label: "Why Choose Us", id: "why-choose-us" },
  { label: "Service Area", id: "service-area" },
];

export default function Home() {
  const [navVisible, setNavVisible] = useState(true);
  const [workVisible, setWorkVisible] = useState(false);
  const [serviceEdgeHover, setServiceEdgeHover] = useState<"left" | "right" | null>(null);
  const [serviceButtonHover, setServiceButtonHover] = useState<"left" | "right" | null>(null);
  const [serviceButtonOpacity, setServiceButtonOpacity] = useState({ left: 0, right: 0 });
  const workSectionRef = useRef<HTMLElement | null>(null);
  const heroLoadRef = useRef<HTMLDivElement | null>(null);
  const serviceGalleryRef = useRef<{ nudgeLeft: () => void; nudgeRight: () => void } | null>(null);

  const smoothScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const heroNode = heroLoadRef.current;
    if (!heroNode) return;
    heroNode.classList.remove("hero-ready");
    const timer = window.setTimeout(() => {
      heroNode.classList.add("hero-ready");
    }, 120);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const hero = document.getElementById("hero-section");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only show nav when hero section is visible in viewport
        setNavVisible(entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -400px 0px",
      }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const handleServiceHoverEdge = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const revealRadius = Math.min(260, rect.width * 0.22);
    const buttonHalfSize = 36;
    const buttonInset = 12;
    const buttonCenterY = rect.height * 0.56;
    const leftCenterX = buttonInset + buttonHalfSize;
    const rightCenterX = rect.width - buttonInset - buttonHalfSize;

    const leftDist = Math.hypot(x - leftCenterX, y - buttonCenterY);
    const rightDist = Math.hypot(x - rightCenterX, y - buttonCenterY);
    const toOpacity = (distance: number) => {
      const t = Math.max(0, 1 - distance / revealRadius);
      return +(t * 0.8).toFixed(3);
    };
    const leftOpacity = toOpacity(leftDist);
    const rightOpacity = toOpacity(rightDist);
    setServiceButtonOpacity({ left: leftOpacity, right: rightOpacity });

    if (leftOpacity > rightOpacity && leftOpacity > 0) {
      setServiceEdgeHover("left");
    } else if (rightOpacity > leftOpacity && rightOpacity > 0) {
      setServiceEdgeHover("right");
    } else {
      setServiceEdgeHover(null);
    }
  };

  useEffect(() => {
    if (!workSectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWorkVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(workSectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealSelector =
      "h1, h2, h3, p, a, li, .group, .final-cta-shell, .area-pill, video, .service-gallery-reveal";
    const sections = Array.from(document.querySelectorAll<HTMLElement>("section"));
    const revealElements: HTMLElement[] = [];

    sections.forEach((section) => {
      const sectionItems = Array.from(section.querySelectorAll<HTMLElement>(revealSelector)).filter((el) => {
        if (el.classList.contains("service-edge-button")) return false;
        if (el.closest(".service-edge-button")) return false;
        if (el.closest("#hero-section")) return false;
        return true;
      });

      sectionItems.forEach((el, index) => {
        el.style.setProperty("--reveal-delay", `${Math.min(index * 45, 360)}ms`);
        revealElements.push(el);
      });
    });

    if (!revealElements.length) return;

    revealElements.forEach((el) => el.classList.add("scroll-reveal"));

    if (reduceMotion) {
      revealElements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.06,
        rootMargin: "0px 0px -4% 0px",
      }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav - only visible when at top section */}
      <nav
        className={`nav-slide fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/10 backdrop-blur-xl hover:border-white/20 ${
          navVisible ? "nav-visible" : "nav-hidden"
        }`}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:px-6">
          {/* Logo - left */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="w-fit text-lg font-bold tracking-tight text-white transition-transform duration-300 hover:scale-105"
          >
            4B<span className="text-[#39ff14]">Landscape</span>
          </a>

          {/* Center nav */}
          <div className="flex items-center justify-center overflow-x-auto overflow-y-visible py-1">
            <div className="flex min-w-max items-center gap-6 lg:gap-8">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`/#${item.id}`}
                  onClick={(e) => smoothScrollTo(e, item.id)}
                  className="nav-link inline-block whitespace-nowrap pb-1 text-[11px] font-medium text-white/90 transition-all duration-300 hover:scale-110 hover:text-[#39ff14] sm:text-xs lg:text-sm"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* CTA buttons - right */}
          <div className="flex items-center justify-end gap-2">
            <a
              href="/#contact"
              onClick={(e) => smoothScrollTo(e, "contact")}
              className="nav-cta-soft rounded-xl border border-white/20 px-4 py-2.5 text-xs font-semibold whitespace-nowrap text-white transition-all duration-300 hover:scale-105 hover:border-white/35 hover:bg-white/5 active:scale-[0.98] sm:px-5 sm:text-sm"
            >
              Request Quote
            </a>
            <a
              href={PHONE}
              className="nav-cta rounded-xl bg-[#39ff14] px-4 py-2.5 text-xs font-semibold whitespace-nowrap text-black shadow-lg shadow-[#39ff14]/20 transition-all duration-300 hover:scale-105 hover:bg-[#5fff3d] hover:shadow-[#39ff14]/40 active:scale-[0.98] sm:px-5 sm:text-sm"
            >
              Call Now
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Screen */}
      <section
        id="hero-section"
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-20 sm:px-6"
      >
        {/* Background image - slightly blurred */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/hero-landscape.png)",
            filter: "blur(2px)",
            transform: "scale(1.02)",
          }}
        />
        {/* Darker overlay for text contrast */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.88) 50%, rgba(10,10,10,0.96) 100%)",
          }}
        />
        <div className="absolute inset-0 z-[2]">
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={0.7}
            lightSpread={0.7}
            rayLength={1.8}
            followMouse={true}
            mouseInfluence={0.05}
            noiseAmount={0}
            distortion={0}
            className="custom-rays"
            pulsating={false}
            fadeDistance={1.3}
            saturation={1}
          />
        </div>

        <div
          ref={heroLoadRef}
          className="hero-load-root relative z-10 mx-auto flex w-full max-w-4xl -mt-16 flex-col items-center text-center"
        >
          {/* Subtle green glow behind title */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] max-w-2xl h-64 opacity-30 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 70% 50% at center, rgba(57, 255, 20, 0.12) 0%, transparent 70%)",
            }}
          />

          {/* Title - dominant focal point */}
          <h1 className="hero-load-item hero-load-1 relative mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
            4B<span className="text-[#39ff14]">Landscape</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-load-item hero-load-2 relative mx-auto mb-24 max-w-xl text-base text-zinc-400 sm:text-lg md:text-xl">
            Keeping Columbus yards clean, healthy, and looking their best.
          </p>

          {/* CTA Buttons */}
          <div className="hero-load-item hero-load-3 relative mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={PHONE}
              className="cta-main-primary inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#39ff14] px-9 py-4 text-lg font-bold text-black shadow-sm shadow-[#39ff14]/10 sm:w-auto sm:min-w-[210px]"
            >
              <PhoneIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              Call Now
            </a>
            <a
              href="/#contact"
              onClick={(e) => smoothScrollTo(e, "contact")}
              className="cta-main-secondary inline-flex w-full items-center justify-center rounded-xl border-2 border-white px-9 py-4 text-lg font-semibold text-white sm:w-auto sm:min-w-[210px]"
            >
              Request Free Quote
            </a>
          </div>

          {/* Service area - smaller, subtle */}
          <p className="hero-load-item hero-load-4 relative text-xs text-zinc-600 sm:text-sm">
            Proudly serving Columbus and nearby communities
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="scroll-mt-20 border-t border-white/5 bg-[#0f0f0f] px-4 pt-28 pb-20 sm:px-6"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-center text-4xl font-bold sm:text-5xl">
            Explore Our Landscaping Services
          </h2>
          <p className="text-center text-sm text-zinc-400 sm:text-base">
            Swipe to explore services -&gt;
          </p>
        </div>

        <div
          className="service-gallery-reveal relative left-1/2 mt-5 h-[700px] w-screen -translate-x-1/2 overflow-visible"
          onMouseMove={handleServiceHoverEdge}
          onMouseLeave={() => {
            setServiceEdgeHover(null);
            setServiceButtonHover(null);
            setServiceButtonOpacity({ left: 0, right: 0 });
          }}
        >
          <CircularGalleryAny
            ref={serviceGalleryRef}
            items={SERVICE_GALLERY_ITEMS}
            bend={1}
            textColor="#ffffff"
            borderRadius={0.05}
            scrollSpeed={2}
            scrollEase={0.05}
          />
          <button
            type="button"
            aria-label="Scroll services left"
            onClick={() => serviceGalleryRef.current?.nudgeLeft()}
            onMouseEnter={() => setServiceButtonHover("left")}
            onMouseLeave={() => setServiceButtonHover(null)}
            className={`service-edge-button left-8 ${serviceEdgeHover === "left" ? "is-active" : ""}`}
            style={{
              opacity: serviceButtonHover === "left" ? 1 : serviceButtonOpacity.left,
              pointerEvents:
                serviceButtonHover === "left" || serviceButtonOpacity.left > 0.05 ? "auto" : "none",
            }}
          >
            <span className="service-edge-button-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M15 5 8 12l7 7" />
              </svg>
            </span>
          </button>
          <button
            type="button"
            aria-label="Scroll services right"
            onClick={() => serviceGalleryRef.current?.nudgeRight()}
            onMouseEnter={() => setServiceButtonHover("right")}
            onMouseLeave={() => setServiceButtonHover(null)}
            className={`service-edge-button right-8 ${serviceEdgeHover === "right" ? "is-active" : ""}`}
            style={{
              opacity: serviceButtonHover === "right" ? 1 : serviceButtonOpacity.right,
              pointerEvents:
                serviceButtonHover === "right" || serviceButtonOpacity.right > 0.05 ? "auto" : "none",
            }}
          >
            <span className="service-edge-button-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="m9 5 7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>

        <div className="mx-auto mt-14 flex max-w-6xl flex-col items-center px-4 pb-4">
          <div className="flex w-full max-w-2xl flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={PHONE}
              className="cta-main-primary inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#39ff14] px-9 py-4 text-lg font-bold text-black shadow-sm shadow-[#39ff14]/10 sm:w-auto sm:min-w-[210px]"
            >
              <PhoneIcon className="h-5 w-5" />
              CALL NOW
            </a>
            <a
              href="/#contact"
              onClick={(e) => smoothScrollTo(e, "contact")}
              className="cta-main-secondary inline-flex w-full items-center justify-center rounded-xl border-2 border-white px-9 py-4 text-lg font-semibold text-white sm:w-auto sm:min-w-[210px]"
            >
              REQUEST QUOTE
            </a>
          </div>
          <p className="mt-5 text-center text-sm text-zinc-400">
            Not sure what you need? Give us a call and we’ll help.
          </p>
        </div>
      </section>


      {/* Our Work Section */}
      <section
        id="work"
        ref={workSectionRef}
        className="border-t border-white/5 bg-[#0b0b0b] px-4 pt-24 pb-10 sm:px-6"
      >
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.2em] text-[#39ff14]">
            Our Work
          </p>
          <h2 className="mb-4 text-center text-4xl font-bold sm:text-5xl">
            See the Difference
          </h2>
          <p className="mx-auto mb-14 max-w-2xl text-center text-zinc-400">
            Real landscaping projects, yard cleanups, and transformations from our recent work.
          </p>

          <div className="mb-14">
            <h3 className="mb-2 text-2xl font-semibold text-white">
              Before & After Transformations
            </h3>
            <p className="mb-8 text-zinc-400">
              See how our work can completely transform a property.
            </p>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-xl shadow-black/35 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-[#39ff14]/60 hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
                <img
                  src="/work/before-1.png"
                  alt="Before landscaping work"
                  className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.01] group-hover:opacity-0 group-hover:brightness-90"
                />
                <img
                  src="/work/after-1.png"
                  alt="After landscaping work"
                  className="absolute inset-0 z-10 h-full w-full scale-[1.01] object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-100 group-hover:brightness-90"
                />
                <div className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-200">
                  Hover to reveal after
                </div>
              </div>
              <div className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-xl shadow-black/35 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-[#39ff14]/60 hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
                <img
                  src="/work/before-2.png"
                  alt="Before landscaping work"
                  className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.01] group-hover:opacity-0 group-hover:brightness-90"
                />
                <img
                  src="/work/after-2.png"
                  alt="After landscaping work"
                  className="absolute inset-0 z-10 h-full w-full scale-[1.01] object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-100 group-hover:brightness-90"
                />
                <div className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-200">
                  Hover to reveal after
                </div>
              </div>
              <div className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-xl shadow-black/35 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-[#39ff14]/60 hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
                <img
                  src="/work/after-3.png"
                  alt="After landscaping work"
                  className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.01] group-hover:opacity-0 group-hover:brightness-90"
                />
                <img
                  src="/work/before-3.png"
                  alt="Before landscaping work"
                  className="absolute inset-0 z-10 h-full w-full scale-[1.01] object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-100 group-hover:brightness-90"
                />
                <div className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-200">
                  Hover to reveal after
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-3">
              <div className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-xl shadow-black/35 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-[#39ff14]/60 hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
                <img
                  src="/work/before-4.png"
                  alt="Before landscaping work"
                  className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.01] group-hover:opacity-0 group-hover:brightness-90"
                />
                <img
                  src="/work/after-4.png"
                  alt="After landscaping work"
                  className="absolute inset-0 z-10 h-full w-full object-cover opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:brightness-90"
                />
                <div className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-200">
                  Hover to reveal after
                </div>
              </div>
              <div className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-xl shadow-black/35 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-[#39ff14]/60 hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
                <img
                  src="/work/before-5.png"
                  alt="Before landscaping work"
                  className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.01] group-hover:opacity-0 group-hover:brightness-90"
                />
                <img
                  src="/work/after-5.png"
                  alt="After landscaping work"
                  className="absolute inset-0 z-10 h-full w-full object-cover opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:brightness-90"
                />
                <div className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-200">
                  Hover to reveal after
                </div>
              </div>
              <div className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-xl shadow-black/35 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-[#39ff14]/60 hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
                <img
                  src="/work/before-6.png"
                  alt="Before landscaping work"
                  className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.01] group-hover:opacity-0 group-hover:brightness-90"
                />
                <img
                  src="/work/after-6.png"
                  alt="After landscaping work"
                  className="absolute inset-0 z-10 h-full w-full object-cover opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:brightness-90"
                />
                <div className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-200">
                  Hover to reveal after
                </div>
              </div>
            </div>

            <div className="mt-14 flex flex-col items-center text-center">
              <p className="mb-4 text-sm text-zinc-400">Like what you see?</p>
              <a
                href="/#contact"
                onClick={(e) => smoothScrollTo(e, "contact")}
                className="inline-flex items-center justify-center rounded-lg border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:border-[#39ff14]/60 hover:text-[#39ff14]"
              >
                Get a Free Quote
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section
        id="why-choose-us"
        className="border-t border-white/5 bg-[#0e0e0e] px-4 pt-24 pb-32 sm:px-6"
      >
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.2em] text-[#39ff14]">
            Why Choose Us
          </p>
          <h2
            className={`work-reveal mb-4 text-center text-4xl font-bold sm:text-5xl ${
              workVisible ? "is-visible" : ""
            }`}
          >
            Why Homeowners Choose 4BLandscaping
          </h2>
          <p
            className={`work-reveal mx-auto mb-16 max-w-2xl text-center text-zinc-400 ${
              workVisible ? "is-visible" : ""
            }`}
            style={{ transitionDelay: "0.06s" }}
          >
            Reliable landscaping, clean results, and a local team you can count on.
          </p>

          <div className="grid items-stretch gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <div
              className={`work-reveal h-full rounded-2xl border border-white/10 bg-[#171717] p-6 shadow-xl shadow-black/25 sm:p-8 ${
                workVisible ? "is-visible" : ""
              }`}
              style={{ transitionDelay: "0.1s" }}
            >
              <h3 className="mb-4 text-2xl font-bold leading-tight whitespace-nowrap text-white sm:text-3xl">
                Homeowners trust 4BLandscape
              </h3>
              <p className="mb-7 max-w-xl text-base leading-7 text-zinc-400">
                We provide reliable landscaping, clear communication, and clean professional results
                for homeowners across Columbus.
              </p>
              <ul className="mt-2 flex h-[calc(100%-14rem)] flex-col justify-between">
                {WHY_CHOOSE_BENEFITS.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-4 rounded-xl px-2 py-1 text-lg leading-8 text-zinc-300 transition-all duration-300 hover:translate-x-2 hover:text-zinc-100"
                  >
                    <CheckMarkIcon className="mt-1 h-6 w-6 shrink-0 text-[#39ff14]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/10 bg-[#141414] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-300">
                  Local Columbus Business
                </span>
                <span className="rounded-full border border-white/10 bg-[#141414] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-300">
                  Fast Response
                </span>
                <span className="rounded-full border border-white/10 bg-[#141414] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-300">
                  Free Estimates
                </span>
              </div>

            </div>

            <div
              className={`work-reveal mx-auto flex h-full w-full justify-center rounded-[20px] border border-white/10 bg-[#141414] p-2 shadow-2xl shadow-black/40 ${
                workVisible ? "is-visible" : ""
              }`}
              style={{ transitionDelay: "0.16s" }}
            >
              <div className="h-full overflow-hidden rounded-2xl">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster="/work/after-2.png"
                  className="aspect-[4/5] h-full w-auto max-w-full object-cover"
                >
                  <source src="/landscaping-work.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section id="service-area" className="border-t border-white/5 bg-[#0b0b0b] px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.2em] text-[#39ff14]">
            Service Area
          </p>
          <h2
            className={`work-reveal mb-4 text-center text-4xl font-bold sm:text-5xl ${
              workVisible ? "is-visible" : ""
            }`}
          >
            Serving Columbus & Surrounding Areas
          </h2>
          <p
            className={`work-reveal mx-auto mb-10 max-w-2xl text-center text-zinc-400 ${
              workVisible ? "is-visible" : ""
            }`}
            style={{ transitionDelay: "0.08s" }}
          >
            Proudly providing landscaping services throughout Columbus and nearby communities.
          </p>

          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICE_AREAS.map((city, index) => (
              <div
                key={city}
                className={`area-pill work-reveal flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#151515] px-4 py-3 text-sm font-medium text-zinc-200 ${
                  workVisible ? "is-visible" : ""
                }`}
              >
                <LocationPinIcon className="h-4 w-4 text-[#39ff14]" />
                <span>{city}</span>
              </div>
            ))}
          </div>

          <div
            className={`work-reveal mt-10 text-center text-sm text-zinc-400 ${
              workVisible ? "is-visible" : ""
            }`}
            style={{ transitionDelay: "0.2s" }}
          >
            <span>Not sure if we service your area? Give us a call. </span>
            <a href={PHONE} className="font-semibold text-[#39ff14] transition-colors hover:text-[#5fff3d]">
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="get-started" className="border-t border-white/5 bg-[#0b0b0b] px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="final-cta-shell rounded-3xl border border-white/10 px-6 py-14 text-center sm:px-10">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#39ff14]">
              Get Started
            </p>
            <h2
              className={`work-reveal mb-4 text-4xl font-bold sm:text-5xl ${
                workVisible ? "is-visible" : ""
              }`}
            >
              Ready to Transform Your Yard?
            </h2>
            <p
              className={`work-reveal mx-auto mb-14 max-w-none whitespace-nowrap text-sm text-zinc-300 sm:text-base ${
                workVisible ? "is-visible" : ""
              }`}
              style={{ transitionDelay: "0.08s" }}
            >
              Call today for a fast quote, easy scheduling, and reliable landscaping service across Columbus.
            </p>

            <div
              className={`work-reveal mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row ${
                workVisible ? "is-visible" : ""
              }`}
              style={{ transitionDelay: "0.12s" }}
            >
              <a
                href={PHONE}
                className="cta-main-primary inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#39ff14] px-8 py-4 text-base font-bold text-black shadow-sm shadow-[#39ff14]/10 sm:w-auto sm:min-w-[190px]"
              >
                <PhoneIcon className="h-5 w-5" />
                Call Now
              </a>
              <a
                href="/#contact"
                onClick={(e) => smoothScrollTo(e, "contact")}
                className="cta-main-secondary inline-flex w-full items-center justify-center rounded-xl border-2 border-white px-8 py-4 text-base font-semibold text-white sm:w-auto sm:min-w-[190px]"
              >
                Request Free Quote
              </a>
            </div>

            <p
              className={`work-reveal text-sm text-zinc-300 ${workVisible ? "is-visible" : ""}`}
              style={{ transitionDelay: "0.16s" }}
            >
              <span className="text-[#39ff14]">✔</span> Free Estimates{" "}
              <span className="mx-2 text-zinc-600">|</span>
              <span className="text-[#39ff14]">✔</span> Fast Scheduling{" "}
              <span className="mx-2 text-zinc-600">|</span>
              <span className="text-[#39ff14]">✔</span> Locally Owned
            </p>

            <p
              className={`work-reveal mt-3 text-xs text-zinc-500 ${workVisible ? "is-visible" : ""}`}
              style={{ transitionDelay: "0.2s" }}
            >
              Proudly serving Columbus, Ohio and surrounding areas.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-white/5 bg-[#0b0b0b] px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
            4B<span className="text-[#39ff14]">Landscape</span>
          </p>
          <p className="mt-3 text-xs text-zinc-500">
            Serving Columbus, Ohio & surrounding areas
          </p>
          <p className="mt-3 text-[11px] text-zinc-600">
            © 2026 4BLandscape
          </p>
          <a
            href="https://stratovabuilds.com/"
            target="_blank"
            rel="noreferrer"
            className="mt-2 text-[11px] text-zinc-600 transition-all duration-300 hover:text-zinc-400"
          >
            Website designed by <span className="text-zinc-400 hover:text-[#39ff14]">Stratova</span>
          </a>
        </div>
      </footer>

    </div>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
}

function LawnIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 20h16M4 16h4M8 16v4M12 16v4M16 16v4M20 16h-4M6 12h12M6 8h12M6 4h12" />
    </svg>
  );
}
function MulchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 20l4-8 4 8 4-8 4 8M4 12l4-8 4 8 4-8 4 8" />
    </svg>
  );
}
function CleanupIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}
function BushIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 20h14M12 20V8m0 0a4 4 0 100-8 4 4 0 000 8z" />
    </svg>
  );
}
function HedgeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a4 4 0 10-5.656-5.656 4 4 0 005.656 5.656z" />
    </svg>
  );
}
function FlowerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4v.01M12 2C8.134 2 5 5.134 5 9c0 2.5 1.5 4.5 3.5 5.5M12 2c3.866 0 7 3.134 7 7 0 2.5-1.5 4.5-3.5 5.5M12 2v4m0 4h.01" />
    </svg>
  );
}
function EdgingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );
}
function SeasonalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}
function LeafIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}
function SodIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}
function ShrubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}
function LandscapeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}
function FenceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h4v12H4V6zm6 0h4v12h-4V6zm6 0h4v12h-4V6zM2 4v16M22 4v16" />
    </svg>
  );
}
function GravelIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8l4-4 4 4 4-4M4 16l4-4 4 4 4-4M8 4v16M16 4v16" />
    </svg>
  );
}
function SoilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 20h16v-4H4v4zM4 8h16V4H4v4zM4 14h4v-2H4v2zm6 0h4v-2h-4v2zm6 0h4v-2h-4v2z" />
    </svg>
  );
}

function CheckMarkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.2}
        d="m5 13 4 4L19 7"
      />
    </svg>
  );
}

function LocationPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.7}
        d="M12 21s6-5.5 6-11a6 6 0 10-12 0c0 5.5 6 11 6 11zm0-8.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
      />
    </svg>
  );
}
