export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F7F5F2] p-6 text-[#1F1F1F]">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm tracking-[0.2em] text-[#59B9C6]">
            ADMIN
          </p>

          <h1 className="mt-2 text-3xl font-light">
            Cargando panel
          </h1>

          <div className="mt-6 grid gap-3">
            <div className="h-20 animate-pulse rounded-2xl bg-[#F7F5F2]" />
            <div className="h-20 animate-pulse rounded-2xl bg-[#F7F5F2]" />
            <div className="h-20 animate-pulse rounded-2xl bg-[#F7F5F2]" />
          </div>
        </div>
      </section>
    </main>
  )
}
