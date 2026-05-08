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
      <main className="min-h-screen bg-[#F7F5F2] p-6 text-[#1F1F1F]">
        <section className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-light">Error cargando reservas</h1>
          <p className="mt-2 text-sm text-red-600">{error.message}</p>
        </section>
      </main>
    )
  }

  const groupedSessions = (sessions ?? []).reduce((groups: any, session: any) => {
    const date = session.session_date || "Sin fecha"

    if (!groups[date]) {
      groups[date] = []
    }

    groups[date].push(session)

    return groups
  }, {})

  const groupedEntries = Object.entries(groupedSessions)

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
            Revisa las reservas registradas, datos de contacto y estado de pago.
          </p>
        </div>

        <div className="mt-8 space-y-8">
          {groupedEntries.map(([date, dateSessions]: any) => (
            <section key={date}>
              <h2 className="mb-3 text-lg font-light text-[#1F1F1F]">
                {date === "Sin fecha"
                  ? "Sin fecha"
                  : new Date(date + "T00:00:00").toLocaleDateString("es-MX", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
              </h2>

              <div className="grid gap-4">
                {dateSessions.map((session: any) => (
                  <article
                    key={session.id}
                    className="rounded-3xl bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-lg font-medium">
                          {session.reservations.customer_name}{" "}
                          {session.reservations.customer_last_name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-600">
                          {session.services.name}
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          {session.schedule_blocks.start_time.slice(0, 5)} –{" "}
                          {session.schedule_blocks.end_time.slice(0, 5)}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-[#F7F5F2] px-3 py-1 text-xs text-gray-700">
                            Personas: {session.people_count}
                          </span>

                          <span className="rounded-full bg-[#F7F5F2] px-3 py-1 text-xs text-gray-700">
                            Estado: {session.status}
                          </span>
                        </div>
                      </div>

                      <div>
                        <PaymentToggle
                          reservationId={session.reservations.id}
                          initialStatus={session.reservations.payment_status}
                        />
                      </div>
                    </div>

                    <div className="mt-4 border-t border-gray-100 pt-4 text-sm text-gray-600">
                      <p>Tel: {session.reservations.phone}</p>
                      <p>Correo: {session.reservations.email}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}

          {sessions?.length === 0 && (
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              No hay reservas registradas todavía.
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
