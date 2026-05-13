import Link from "next/link"
import { supabase } from "../../../lib/supabaseClient"
import { AdminServicesList } from "../../../components/AdminServicesList"

export default async function AdminServicesPage() {
  const { data: services, error } = await supabase
    .from("services")
    .select(
      "id, name, slug, price_mxn, capacity, is_active, marketing_title, marketing_label, marketing_description, display_order, is_featured"
    )
    .order("created_at", { ascending: true })

  if (error) {
    return (
      <main className="min-h-screen bg-[#F7F5F2] p-6 text-[#1F1F1F]">
        <section className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-light">Error cargando servicios</h1>
          <p className="mt-2 text-sm text-red-600">{error.message}</p>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-6 text-[#1F1F1F]">
      <section className="animate-soft-enter mx-auto max-w-5xl">
        <div className="flex flex-wrap gap-3">
          <Link href="/admin" className="text-sm text-[#1F1F1F]/70 underline">
            Volver a reservaciones
          </Link>

          <Link href="/" className="text-sm text-[#1F1F1F]/70 underline">
            Volver al inicio
          </Link>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm tracking-[0.2em] text-[#59B9C6]">
            ADMIN
          </p>

          <h1 className="mt-2 text-3xl font-light">
            Servicios
          </h1>

          <p className="mt-2 text-gray-600">
            Activa, oculta y edita cómo aparecen los servicios en la página de reservaciones.
          </p>
        </div>

        <AdminServicesList services={services ?? []} />
      </section>
    </main>
  )
}
