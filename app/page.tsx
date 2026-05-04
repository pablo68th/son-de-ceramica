import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F5F2] text-[#1F1F1F]">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-3 text-sm tracking-[0.25em] text-[#59B9C6]">
          SON DE CERÁMICA STUDIO
        </p>

        <h1 className="max-w-3xl text-4xl font-light leading-tight md:text-6xl">
          Clases y experiencias de cerámica en CDMX
        </h1>

        <p className="mt-6 max-w-xl text-base text-gray-600 md:text-lg">
          Reserva tu lugar para torno, construcción manual, clases para niñ@s y experiencias especiales.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/reservar"
            className="rounded-full bg-black px-6 py-3 text-white"
          >
            Reservar clase
          </Link>

          <a
            href="https://www.instagram.com/son_de_ceramica"
            target="_blank"
            className="rounded-full border border-black px-6 py-3"
          >
            Ver Instagram
          </a>
        </div>

        <div className="mt-12 rounded-2xl bg-white/70 p-5 text-sm text-gray-600">
          <p>Fresas 87, Col. Del Valle, Ciudad de México</p>
          <p className="mt-1">Lunes a viernes y sábados con horarios definidos por clase</p>
        </div>
      </section>
    </main>
  )
}
