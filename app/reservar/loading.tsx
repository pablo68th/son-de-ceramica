export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F7F5F2] px-4 py-6 text-[#333333]">
      <section className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center">
        <div className="w-full rounded-[2rem] bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#DCCEC4] via-[#F2D9DC] to-[#59B9C6]/40">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#59B9C6]/20 border-t-[#59B9C6]" />
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.25em] text-[#59B9C6]">
            Son de Cerámica
          </p>

          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
            Preparando experiencia
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#333333]/60">
            Estamos cargando la información.
          </p>
        </div>
      </section>
    </main>
  )
}

