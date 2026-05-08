import Link from "next/link"

const experiences = [
  {
    name: "Torno en pareja",
    slug: "torno-en-pareja",
  },
  {
    name: "Cerámica para niñ@s",
    slug: "ceramica-para-ninos",
  },
  {
    name: "Clases de torno",
    slug: "clases-de-torno-4-sesiones",
  },
  {
    name: "Construcción manual",
    slug: "construccion-manual-4-sesiones",
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F5F2] text-[#333333]">
      <section className="mx-auto min-h-screen max-w-md bg-[#F7F5F2] shadow-sm md:my-8 md:overflow-hidden md:rounded-[2rem]">
        <div className="relative min-h-[520px] overflow-hidden rounded-b-[2rem] bg-[#DCCEC4]">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.20),rgba(0,0,0,0.55))]" />

          <div className="absolute left-6 top-8 z-10">
            <p className="text-xs uppercase tracking-[0.28em] text-white/80">
              Son de Cerámica
            </p>
          </div>

          <div className="absolute right-6 top-8 z-10 text-3xl text-white">
            ☰
          </div>

          <div className="absolute bottom-24 left-6 right-6 z-10">
            <h1 className="text-5xl font-light leading-[0.98] tracking-[-0.05em] text-white">
              Son de cerámica
            </h1>

            <p className="mt-5 max-w-xs text-sm font-medium uppercase leading-6 tracking-[0.08em] text-white">
              Clases y experiencias de cerámica en CDMX
            </p>
          </div>

          <div className="absolute bottom-8 left-6 right-6 z-10">
            <Link
              href="/reservar"
              className="block rounded-2xl bg-[#59B9C6] px-6 py-4 text-center text-base font-semibold text-white shadow-lg shadow-black/10 transition hover:bg-[#4ca9b5]"
            >
              Reservar clase
            </Link>
          </div>

          <div className="absolute left-10 top-24 h-40 w-40 rounded-full bg-[#F2D9DC]/45 blur-2xl" />
          <div className="absolute bottom-20 right-[-40px] h-44 w-44 rounded-full bg-[#59B9C6]/30 blur-2xl" />
        </div>

        <section className="-mt-6 rounded-t-[2rem] bg-[#F7F5F2] px-5 pb-8 pt-8">
          <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-[#59B9C6]" />

          <h2 className="text-center text-2xl font-light">
            Nuestras experiencias
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-4">
            {experiences.map((experience) => (
              <article
                key={experience.slug}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="h-28 bg-[#DCCEC4]">
                  <div className="h-full w-full bg-[radial-gradient(circle_at_30%_30%,rgba(89,185,198,0.35),transparent_35%),radial-gradient(circle_at_70%_70%,rgba(242,217,220,0.75),transparent_40%)]" />
                </div>

                <div className="p-3">
                  <h3 className="text-sm font-medium leading-5">
                    {experience.name}
                  </h3>

                  <Link
                    href={`/reservar/${experience.slug}`}
                    className="mt-3 block rounded-xl border border-[#59B9C6] px-3 py-2 text-center text-xs font-medium text-[#459EAA]"
                  >
                    Reservar
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <section className="mt-8 rounded-[1.5rem] bg-white p-5 shadow-sm">
            <h2 className="text-center text-lg font-light">
              ¿Cómo funciona?
            </h2>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs text-[#333333]/70">
              <div>
                <p className="text-2xl">□</p>
                <p className="mt-2">Elige tu clase</p>
              </div>

              <div>
                <p className="text-2xl">○</p>
                <p className="mt-2">Selecciona horario</p>
              </div>

              <div>
                <p className="text-2xl">♡</p>
                <p className="mt-2">Reserva tu lugar</p>
              </div>
            </div>
          </section>

          <div className="sticky bottom-4 mt-8">
            <Link
              href="/reservar"
              className="block rounded-2xl bg-[#59B9C6] px-6 py-4 text-center text-base font-semibold text-white shadow-lg shadow-black/10"
            >
              Reservar ahora
            </Link>
          </div>
        </section>
      </section>
    </main>
  )
}
