import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "../../lib/supabaseServer"
import { AdminReservationsList } from "../../components/AdminReservationsList"
import { AdminLogoutButton } from "../../components/AdminLogoutButton"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .single()

  if (!adminUser) {
    redirect("/admin/login")
  }

  const { data: sessions, error } = await supabase
    .from("reservation_sessions")
    .select(`
      id,
      session_date,
      people_count,
      status,
      reservations (
        id,
        customer_name,
        customer_last_name,
        phone,
        email,
        payment_status
      ),
      services (
        name
      ),
      schedule_blocks (
        start_time,
        end_time
      )
    `)
    .order("session_date", { ascending: true })

  if (error) {
    return (
      <main className="min-h-screen bg-[#F7F5F2] p-6 text-[#1F1F1F]">
        <section className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-light">
            Error cargando reservaciones
          </h1>

          <p className="mt-2 text-sm text-red-600">
            {error.message}
          </p>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-6 text-[#1F1F1F]">
      <section className="animate-soft-enter mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-3">
          <a href="/" className="text-sm text-[#1F1F1F]/70 underline">
            Volver al inicio
          </a>

          <AdminLogoutButton />
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm tracking-[0.2em] text-[#59B9C6]">
            ADMIN
          </p>

          <h1 className="mt-2 text-3xl font-light">
            Reservaciones
          </h1>

          <p className="mt-2 text-gray-600">
            Revisa las reservaciones registradas, datos de contacto, estado de pago y estado de la reservación.
          </p>

          <a
            href="/admin/servicios"
            className="mt-5 inline-block rounded-2xl bg-[#59B9C6] px-5 py-3 text-sm font-semibold !text-white transition active:scale-[0.98] hover:bg-[#4ca9b5]"
          >
            Editar servicios
          </a>
        </div>

        <AdminReservationsList sessions={sessions ?? []} />
      </section>
    </main>
  )
}