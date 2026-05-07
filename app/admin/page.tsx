import { supabase } from "../../lib/supabaseClient"
import { PaymentToggle } from "../../components/PaymentToggle"

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
      <main className="p-6">
        <h1>Error cargando reservas</h1>
        <p>{error.message}</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-6 text-[#1F1F1F]">
      <section className="mx-auto max-w-5xl">
        <a href="/" className="text-sm underline">
          Volver al inicio
        </a>

        <div className="mt-6">
          <p className="text-sm tracking-[0.2em] text-[#59B9C6]">
            ADMIN
          </p>

          <h1 className="mt-2 text-3xl font-light">
            Reservas
          </h1>

          <p className="mt-2 text-gray-600">
            Vista inicial de reservas registradas en el sistema.
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          {sessions?.map((session: any) => (
            <article
              key={session.id}
              className="rounded-2xl bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-lg font-medium">
                    {session.reservations.customer_name}{" "}
                    {session.reservations.customer_last_name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    {session.services.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    {session.session_date} ·{" "}
                    {session.schedule_blocks.start_time} –{" "}
                    {session.schedule_blocks.end_time}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Personas: {session.people_count}
                  </p>
                </div>

                <div>
                  <PaymentToggle
                    reservationId={session.reservations.id}
                    initialStatus={session.reservations.payment_status}
                  />
                </div>
              </div>

              <div className="mt-4 border-t pt-4 text-sm text-gray-600">
                <p>Tel: {session.reservations.phone}</p>
                <p>Correo: {session.reservations.email}</p>
              </div>
            </article>
          ))}

          {sessions?.length === 0 && (
            <div className="rounded-2xl bg-white p-5">
              No hay reservas registradas todavía.
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

