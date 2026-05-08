import { supabase } from "../../lib/supabaseClient"
import { AdminReservationsList } from "../../components/AdminReservationsList"

export default async function AdminPage() {
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
          <h1 className="text-2xl font-light">Error cargando reservas</h1>
          <p className="mt-2 text-sm text-red-600">{error.message}</p>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-6 text-[#1F1F1F]">
      <section className="mx-auto max-w-5xl">
        <a href="/" className="text-sm text-[#1F1F1F]/70 underline">
          Volver al inicio
        </a>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm tracking-[0.2em] text-[#59B9C6]">
            ADMIN
          </p>

          <h1 className="mt-2 text-3xl font-light">
            Reservas
          </h1>

          <p className="mt-2 text-gray-600">
            Revisa las reservas registradas, datos de contacto, estado de pago y estado de la reserva.
          </p>
        </div>

        <AdminReservationsList sessions={sessions ?? []} />
      </section>
    </main>
  )
}

