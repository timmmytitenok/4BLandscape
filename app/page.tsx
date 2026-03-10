"use client";

import { useEffect, useRef, useState } from "react";

const SERVICE_CATEGORIES = [
  {
    title: "Lawn Care",
    services: [
      { name: "Lawn Mowing", Icon: LawnIcon, description: "Keep your lawn clean and neatly maintained." },
      { name: "Edging", Icon: EdgingIcon, description: "Clean, crisp edges along walkways and beds." },
      { name: "Seasonal Cleanups", Icon: SeasonalIcon, description: "Spring and fall yard preparation." },
      { name: "Leaf Removal", Icon: LeafIcon, description: "Thorough leaf removal and disposal." },
    ],
  },
  {
    title: "Landscaping",
    services: [
      { name: "Mulch Installation", Icon: MulchIcon, description: "Fresh mulch for beds and borders." },
      { name: "Sod Installation", Icon: SodIcon, description: "New lawn installation and repair." },
      { name: "Shrub Planting", Icon: ShrubIcon, description: "Professional shrub and plant installation." },
      { name: "General Landscaping", Icon: LandscapeIcon, description: "Full landscape design and installation." },
    ],
  },
  {
    title: "Yard Maintenance",
    services: [
      { name: "Yard Cleanups", Icon: CleanupIcon, description: "Complete yard cleanup and debris removal." },
      { name: "Bush Trimming", Icon: BushIcon, description: "Expert bush shaping and maintenance." },
      { name: "Hedge Trimming", Icon: HedgeIcon, description: "Neat, even hedge trimming." },
      { name: "Flower Bed Cleanup", Icon: FlowerIcon, description: "Weeding and bed maintenance." },
    ],
  },
  {
    title: "Property Improvements",
    services: [
      { name: "Fence Installation", Icon: FenceIcon, description: "Quality fence installation and repair." },
      { name: "Gravel Delivery", Icon: GravelIcon, description: "Gravel and stone delivery for driveways and paths." },
      { name: "Soil Delivery", Icon: SoilIcon, description: "Topsoil and fill dirt delivery." },
      { name: "Mulch Delivery", Icon: MulchIcon, description: "Bulk mulch delivery for beds and landscaping projects." },
    ],
  },
];

const PHONE = "tel:6140000000";
const PHONE_DISPLAY = "(614) 000-0000";

const beforeAfterProjects = [
  {
    before: "/gallery/IMG_5172-1aa29f5a-c6fa-4502-b946-a8cfe3bafd4b.png",
    after: "/gallery/IMG_5157-3e170bf1-355a-46d3-b075-d73db83ec244.png",
    label: "Yard Cleanup",
  },
  {
    before: "/gallery/IMG_5282-cd51159c-0137-4952-bc3a-122c32891b44.png",
    after: "/gallery/IMG_5238-5abbf5c2-213c-40bd-8451-217df547978e.png",
    label: "Mulch Refresh",
  },
  {
    before: "/gallery/IMG_1357-cd7a7abd-fbac-4e64-83a6-543008cb5e1b.png",
    after: "/gallery/IMG_2199-0bed0a76-5ec3-434e-b18d-c3e8c1a5dcd2.png",
    label: "Lawn Improvement",
  },
];

const TRUST_POINTS = [
  {
    title: "Locally Owned",
    description:
      "Proudly serving Columbus and surrounding communities with dependable local service.",
  },
  {
    title: "Reliable Scheduling",
    description:
      "We show up on time, communicate clearly, and keep your project moving.",
  },
  {
    title: "Quality Work",
    description:
      "From routine maintenance to full yard improvements, we focus on clean, professional results.",
  },
  {
    title: "Fast Quotes",
    description: "Call or message us for a quick estimate and easy scheduling.",
  },
  {
    title: "Professional Equipment",
    description:
      "We use the right tools and equipment to work efficiently and get the job done right.",
  },
  {
    title: "Friendly Service",
    description:
      "Easy communication, honest work, and a team that cares about the final result.",
  },
];

const SERVICE_AREAS = [
  "Columbus",
  "Hilliard",
  "Dublin",
  "Grove City",
  "Upper Arlington",
  "Galloway",
  "West Jefferson",
  "Plain City",
];

const HOW_IT_WORKS_STEPS = [
  {
    title: "Call or Request a Quote",
    description: "Tell us about your yard, cleanup, or landscaping project.",
  },
  {
    title: "Get a Fast Estimate",
    description: "We'll provide a quick quote and schedule a time that works for you.",
  },
  {
    title: "We Get to Work",
    description: "Our team gets the job done with clean, professional results.",
  },
];

export default function Home() {
  const [navVisible, setNavVisible] = useState(true);
  const [workVisible, setWorkVisible] = useState(false);
  const workSectionRef = useRef<HTMLElement | null>(null);

  const smoothScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    el?.scrollIntoView({ behavior: "smooth" });
  };

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav - only visible when at top section */}
      <nav
        className={`nav-slide fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/10 backdrop-blur-xl hover:border-white/20 ${
          navVisible ? "nav-visible" : "nav-hidden"
        }`}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-3 items-center px-4 py-4 sm:px-6">
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
          <div className="flex items-center justify-center">
            <a
              href="/#services"
              onClick={(e) => smoothScrollTo(e, "services")}
              className="nav-link text-sm font-medium text-white/90 transition-all duration-300 hover:text-[#39ff14] hover:scale-110"
            >
              Services
            </a>
          </div>

          {/* Call Now - right */}
          <div className="flex justify-end">
            <a
              href={PHONE}
              className="nav-cta rounded-xl bg-[#39ff14] px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-[#39ff14]/20 transition-all duration-300 hover:scale-105 hover:bg-[#5fff3d] hover:shadow-[#39ff14]/40 active:scale-[0.98]"
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

        <div className="relative z-10 mx-auto flex w-full max-w-4xl -mt-16 flex-col items-center text-center">
          {/* Subtle green glow behind title */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] max-w-2xl h-64 opacity-30 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 70% 50% at center, rgba(57, 255, 20, 0.12) 0%, transparent 70%)",
            }}
          />

          {/* Title - dominant focal point */}
          <h1 className="relative mb-6 animate-fade-in-up text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
            4B<span className="text-[#39ff14]">Landscape</span>
          </h1>

          {/* Subtitle */}
          <p className="relative mx-auto mb-24 max-w-xl animate-fade-in-up-delay-1 text-base text-zinc-400 sm:text-lg md:text-xl">
            Keeping Columbus yards clean, healthy, and looking their best.
          </p>

          {/* CTA Buttons */}
          <div className="relative mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={PHONE}
              className="hero-cta-primary hero-cta-animate flex w-full max-w-xs items-center justify-center gap-2.5 rounded-xl bg-[#39ff14] px-8 py-4 text-lg font-bold text-black shadow-lg shadow-[#39ff14]/25 hover:bg-[#5fff3d] sm:w-auto sm:px-10 sm:py-4.5 sm:text-xl"
              style={{ animationDelay: "0.25s", opacity: 0 }}
            >
              <PhoneIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              Call Now
            </a>
            <a
              href="/#contact"
              onClick={(e) => smoothScrollTo(e, "contact")}
              className="hero-cta-secondary hero-cta-animate flex w-full max-w-xs items-center justify-center rounded-xl border-2 border-white px-8 py-4 text-lg font-semibold text-white sm:w-auto sm:px-10 sm:py-4.5 sm:text-xl"
              style={{ animationDelay: "0.35s", opacity: 0 }}
            >
              Get Free Quote
            </a>
          </div>

          {/* Service area - smaller, subtle */}
          <p className="relative animate-fade-in-up-delay-3 text-xs text-zinc-600 sm:text-sm">
            Proudly serving Columbus and nearby communities
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="scroll-mt-20 border-t border-white/5 bg-[#0f0f0f] px-4 py-20 sm:px-6"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-4xl font-bold sm:text-5xl">
            Our Landscaping Services
          </h2>
          <p className="mx-auto mb-14 max-w-2xl text-center text-zinc-400">
            Complete landscaping services for homes across Columbus.
          </p>

          <div className="space-y-14">
            {SERVICE_CATEGORIES.map((category) => (
              <div key={category.title}>
                <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-[#39ff14]">
                  {category.title}
                </h3>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {category.services.map((service) => (
                    <div
                      key={service.name}
                      className="service-card rounded-xl border border-white/5 bg-[#1a1a1a] p-6 transition-all duration-300"
                    >
                      <service.Icon className="mb-4 h-8 w-8 text-[#39ff14]" />
                      <h4 className="mb-2 font-semibold text-white">{service.name}</h4>
                      <p className="text-sm text-zinc-500">{service.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* Our Work Section */}
      <section
        ref={workSectionRef}
        className="border-t border-white/5 bg-[#0b0b0b] px-4 py-24 sm:px-6"
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

            <div className="space-y-10">
              {beforeAfterProjects.map((project, index) => (
                <div
                  key={project.label}
                  className={`work-reveal ${workVisible ? "is-visible" : ""}`}
                  style={{ transitionDelay: `${0.08 * (index + 1)}s` }}
                >
                  <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#39ff14]">
                    {project.label}
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="relative">
                      <img
                        src={project.before}
                        alt={`${project.label} before`}
                        loading="lazy"
                        className="h-64 w-full rounded-2xl object-cover sm:h-80 lg:h-[27rem]"
                      />
                      <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-200">
                        Before
                      </span>
                    </div>
                    <div className="relative">
                      <img
                        src={project.after}
                        alt={`${project.label} after`}
                        loading="lazy"
                        className="h-64 w-full rounded-2xl object-cover sm:h-80 lg:h-[27rem]"
                      />
                      <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-200">
                        After
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <a
              href="/our-work"
              className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#141414] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#39ff14]/50 hover:text-[#39ff14] hover:shadow-[0_8px_24px_rgba(57,255,20,0.16)]"
            >
              View More Work
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="border-t border-white/5 bg-[#0e0e0e] px-4 py-24 sm:px-6">
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
            className={`work-reveal mx-auto mb-10 max-w-2xl text-center text-zinc-400 ${
              workVisible ? "is-visible" : ""
            }`}
            style={{ transitionDelay: "0.06s" }}
          >
            Reliable service, quality work, and straightforward communication from a local team you
            can trust.
          </p>

          <div
            className={`work-reveal mb-12 flex flex-wrap items-center justify-center gap-3 ${
              workVisible ? "is-visible" : ""
            }`}
            style={{ transitionDelay: "0.1s" }}
          >
            <span className="rounded-full border border-white/10 bg-[#151515] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-300">
              Local Columbus Business
            </span>
            <span className="rounded-full border border-white/10 bg-[#151515] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-300">
              Fast Response
            </span>
            <span className="rounded-full border border-white/10 bg-[#151515] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-300">
              Free Estimates
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TRUST_POINTS.map((point, index) => (
              <article
                key={point.title}
                className={`trust-card work-reveal rounded-2xl border border-white/10 bg-[#181818] p-6 shadow-lg shadow-black/25 ${
                  workVisible ? "is-visible" : ""
                }`}
                style={{ transitionDelay: `${0.08 * (index + 1)}s` }}
              >
                <TrustBadgeIcon className="mb-4 h-7 w-7 text-[#39ff14]" />
                <h3 className="mb-2 text-lg font-semibold text-white">{point.title}</h3>
                <p className="text-sm leading-6 text-zinc-400">{point.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="border-t border-white/5 bg-[#0b0b0b] px-4 py-24 sm:px-6">
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
                style={{ transitionDelay: `${0.05 * (index + 1)}s` }}
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

      {/* How It Works */}
      <section className="border-t border-white/5 bg-[#0e0e0e] px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.2em] text-[#39ff14]">
            How It Works
          </p>
          <h2
            className={`work-reveal mb-4 text-center text-4xl font-bold sm:text-5xl ${
              workVisible ? "is-visible" : ""
            }`}
          >
            Simple Process, Clean Results
          </h2>
          <p
            className={`work-reveal mx-auto mb-12 max-w-2xl text-center text-zinc-400 ${
              workVisible ? "is-visible" : ""
            }`}
            style={{ transitionDelay: "0.08s" }}
          >
            Getting started is easy - just reach out, get a quick estimate, and let us handle the rest.
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <article
                key={step.title}
                className={`process-card work-reveal rounded-2xl border border-white/10 bg-[#181818] p-6 shadow-lg shadow-black/25 ${
                  workVisible ? "is-visible" : ""
                }`}
                style={{ transitionDelay: `${0.08 * (index + 1)}s` }}
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#39ff14]/40 bg-[#39ff14]/10 text-sm font-bold text-[#39ff14]">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{step.title}</h3>
                <p className="text-sm leading-6 text-zinc-400">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-white/5 bg-[#0b0b0b] px-4 py-24 sm:px-6">
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
              className={`work-reveal mx-auto mb-10 max-w-2xl text-zinc-300 ${
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
                className="final-cta-primary inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#39ff14] px-8 py-4 text-base font-bold text-black sm:w-auto sm:min-w-[190px]"
              >
                <PhoneIcon className="h-5 w-5" />
                Call Now
              </a>
              <a
                href="/#contact"
                onClick={(e) => smoothScrollTo(e, "contact")}
                className="final-cta-secondary inline-flex w-full items-center justify-center rounded-xl border border-white/25 bg-transparent px-8 py-4 text-base font-semibold text-white sm:w-auto sm:min-w-[190px]"
              >
                Get Free Quote
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
              Proudly serving Columbus, Hilliard, Dublin, Grove City and surrounding areas.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-white/10 bg-[#0b0b0b] px-4 pt-16 pb-8 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 pb-10 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-white">
                4B<span className="text-[#39ff14]">Landscape</span>
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-400">
                Reliable lawn care and landscaping services for homes across Columbus.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
                Service Area
              </p>
              <p className="mt-3 text-sm text-zinc-400">
                Proudly serving Columbus and surrounding areas.
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Columbus • Hilliard • Dublin • Grove City
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
                Contact
              </p>
              <a
                href={PHONE}
                className="mt-3 inline-flex items-center gap-2 text-xl font-semibold text-[#39ff14] transition-colors hover:text-[#5fff3d]"
              >
                <PhoneIcon className="h-5 w-5" />
                {PHONE_DISPLAY}
              </a>
              <p className="mt-2 text-sm text-zinc-500">
                Call for fast quotes and availability.
              </p>
            </div>
          </div>

          <div className="mt-2 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-center sm:flex-row">
            <p className="text-xs text-zinc-500">
              © 2026 4BLandscaping. All rights reserved.
            </p>
            <p className="text-xs text-zinc-500">
              Website by <span className="text-zinc-300">Stratova</span>
            </p>
          </div>
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

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 12h14m0 0-5-5m5 5-5 5" />
    </svg>
  );
}

function TrustBadgeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
        d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3zm-3.2 9.2L11 14.4l4.2-4.2"
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
