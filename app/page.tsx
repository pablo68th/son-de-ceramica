import Link from "next/link"

const experiences = [
  {
    title: "Tus primeras vueltas",
    subtitle: "Clases de torno · 4 sesiones",
    description: "Aprende torno desde cero mientras desarrollas tus primeras piezas paso a paso.",
    badge: "Más elegida",
    meta: ["4 sesiones", "Torno", "Cupo 4"],
  },
  {
    title: "Manos a tu obra",
    subtitle: "Construcción manual · 4 sesiones",
    description: "Crea piezas a mano y experimenta con formas, texturas y técnicas manuales.",
    badge: "Todos niveles",
    meta: ["4 sesiones", "Manual", "Cupo 8"],
  },
  {
    title: "Pequeños ceramistas",
    subtitle: "Cerámica para niñ@s",
    description: "Un espacio creativo para explorar el barro, la imaginación y el trabajo con las manos.",
    badge: "Para niñ@s",
    meta: ["1 sesión", "Manual", "Cupo 8"],
  },
  {
    title: "Piezas de sábado por la mañana",
    subtitle: "Sesiones sabatinas",
    description: "Una experiencia tranquila de fin de semana para crear, aprender y bajar el ritmo.",
    badge: "Fin de semana",
    meta: ["1 sesión", "Manual", "Cupo 8"],
  },
]

const features = [
  "Materiales incluidos",
  "Experiencias guiadas",
  "Cupos reducidos",
  "Ambiente creativo",
]

const steps = [
  {
    icon: "✦",
    title: "Elige tu experiencia",
    text: "Explora las clases disponibles y elige la que mejor se acomode a tu plan.",
  },
  {
    icon: "◷",
    title: "Selecciona día y horario",
    text: "Consulta disponibilidad real antes de enviar tu solicitud.",
  },
  {
    icon: "✓",
    title: "Aparta tu lugar",
    text: "Envía tus datos y confirma tu lugar con el anticipo correspondiente.",
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7F5F2] text-[#333333]">
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <section className="animate-soft-enter overflow-hidden rounded-[2.5rem] bg-white shadow-sm ring-1 ring-black/5">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[560px] bg-gradient-to-br from-[#DCCEC4] via-[#F2D9DC] to-[#59B9C6]/40 p-7 sm:p-10 lg:p-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.48),transparent_32%),radial-gradient(circle_at_80%_75%,rgba(89,185,198,0.30),transparent_38%)]" />

              <div className="relative flex min-h-[500px] flex-col justify-between">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#333333]/65">
                    Son de Cerámica
                  </p>

                  <span className="rounded-full bg-white/70 px-3 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-[#333333]/65 backdrop-blur">
                    CDMX
                  </span>
                </div>

                <div>
                  <p className="inline-flex rounded-full bg-white/75 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#333333]/80 backdrop-blur">
                    Clases y experiencias
                  </p>

                  <h1 className="mt-4 max-w-2xl text-5xl font-semibold leading-[0.9] tracking-[-0.07em] sm:text-6xl lg:text-7xl">
                    Cerámica para crear con calma.
                  </h1>

                  <p className="mt-5 max-w-xl text-sm leading-6 text-[#333333]/70 sm:text-base sm:leading-7">
                    Reserva experiencias de cerámica para niñ@s, torno, construcción manual y sesiones de fin de semana.
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    {features.map((feature) => (
                      <div
                        key={feature}
                        className="rounded-2xl bg-white/60 px-3 py-3 text-xs leading-4 text-[#333333]/70 backdrop-blur"
                      >
                        ✦ {feature}
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/reservar"
                      className="rounded-2xl bg-[#59B9C6] px-6 py-4 text-center text-sm font-semibold !text-white transition hover:bg-[#4ca9b5] active:scale-[0.98]"
                    >
                      Reservar experiencia
                    </Link>

                    <a
                      href="#como-funciona"
                      className="rounded-2xl bg-white px-6 py-4 text-center text-sm font-semibold text-[#333333] shadow-sm transition hover:bg-[#F7F5F2] active:scale-[0.98]"
                    >
                      ¿Cómo funciona?
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden min-h-full bg-white p-8 lg:block">
              <div className="flex h-full flex-col justify-end rounded-[2rem] bg-[#F7F5F2] p-6">
                <p className="text-xs uppercase tracking-[0.25em] text-[#59B9C6]">
                  Estudio creativo
                </p>
                <p className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.05em]">
                  Un espacio para aprender, crear y bajar el ritmo.
                </p>
                <p className="mt-4 text-sm leading-6 text-[#333333]/65">
                  Clases guiadas, materiales incluidos y experiencias pensadas para disfrutar el proceso.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-7 lg:mt-10">
          <p className="text-xs uppercase tracking-[0.22em] text-[#59B9C6]">
            Experiencias destacadas
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] lg:text-4xl">
            Elige cómo quieres crear
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#333333]/65">
            Opciones pensadas para distintas edades, ritmos y formas de acercarse al barro.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {experiences.map((experience) => (
              <article
                key={experience.title}
                className="group overflow-hidden rounded-[2rem] bg-[#F7F5F2] p-4 shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="rounded-2xl bg-gradient-to-br from-[#DCCEC4] via-[#F2D9DC] to-[#59B9C6]/25 p-5">
                  <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[#333333]/50">
                    {experience.subtitle}
                  </p>

                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.05em]">
                    {experience.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#333333]/65">
                    {experience.description}
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {experience.meta.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-white/65 px-2 py-1.5 text-center text-[0.66rem] text-[#333333]/65"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href="/reservar"
                  className="mt-3 block rounded-2xl bg-[#333333] px-5 py-4 text-center text-sm font-semibold !text-white transition hover:bg-[#222222] active:scale-[0.98]"
                >
                  Ver horarios
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section
          id="como-funciona"
          className="mt-6 overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-black/5 sm:mt-10"
        >
          <div className="bg-gradient-to-br from-[#DCCEC4]/70 via-[#F2D9DC]/70 to-[#59B9C6]/20 p-5 sm:p-7">
            <p className="text-xs uppercase tracking-[0.22em] text-[#59B9C6]">
              Cómo funciona
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] lg:text-4xl">
              Reserva sin complicarte
            </h2>
          </div>

          <div className="grid gap-4 p-5 sm:p-7 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.title} className="rounded-[2rem] bg-[#F7F5F2] p-5 md:min-h-[210px]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#59B9C6]/45 bg-white text-xl font-semibold text-[#59B9C6] shadow-sm">
                  {step.icon}
                </div>

                <p className="mt-4 font-semibold">{step.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#333333]/65">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] bg-[#333333] p-5 text-white shadow-sm sm:p-7 lg:mt-10">
          <p className="text-xs uppercase tracking-[0.22em] text-[#59B9C6]">
            ¿Listx para crear?
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">
            Encuentra tu próxima experiencia.
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
            Revisa horarios, cupos y opciones disponibles para apartar tu lugar.
          </p>

          <Link
            href="/reservar"
            className="mt-5 inline-block rounded-2xl bg-[#59B9C6] px-7 py-4 text-sm font-semibold !text-white transition hover:bg-[#4ca9b5] active:scale-[0.98]"
          >
            Ver experiencias
          </Link>
        </section>

        <div className="sticky bottom-4 mt-6 md:hidden">
          <Link
            href="/reservar"
            className="block w-full rounded-2xl bg-[#59B9C6] px-6 py-4 text-center text-base font-semibold !text-white shadow-lg shadow-black/10 transition hover:bg-[#4ca9b5] active:scale-[0.98]"
          >
            Reservar ahora
          </Link>
        </div>
      </section>
    </main>
  )
}

