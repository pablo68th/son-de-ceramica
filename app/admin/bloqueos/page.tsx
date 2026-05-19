import Link from "next/link"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "../../../lib/supabaseServer"
import { AdminLogoutButton } from "../../../components/AdminLogoutButton"
import { AdminBlockedDates } from "../../../components/AdminBlockedDates"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminBlockedDatesPage() {
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

const { data: blocks, error } = await supabase
  .from("schedule_blocks")
  .select("id, start_time, end_time")
  .order("start_time", { ascending: true })

const { data: blockedDatesData } = await supabase
  .from("blocked_schedule_dates")
  .select(`
    id,
    date,
    block_id,
    reason,
    created_at,
    schedule_blocks (
      start_time,
      end_time
    )
  `)
  .order("date", { ascending: true })

// supabase returns related rows as arrays; map to the shape expected by AdminBlockedDates
const blockedDates = blockedDatesData?.map((d: any) => ({
  ...d,
  schedule_blocks: Array.isArray(d.schedule_blocks) ? d.schedule_blocks[0] ?? null : d.schedule_blocks,
}))

  if (error) {
    return (
      <main className="min-h-screen bg-[#F7F5F2] p-6 text-[#1F1F1F]">
        <section className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-light">
            Error cargando horarios
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
          <div className="flex flex-wrap gap-3">
            <Link href="/admin" className="text-sm text-[#1F1F1F]/70 underline">
              Volver a reservaciones
            </Link>

            <Link href="/" className="text-sm text-[#1F1F1F]/70 underline">
              Volver al inicio
            </Link>
          </div>

          <AdminLogoutButton />
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm tracking-[0.2em] text-[#59B9C6]">
            ADMIN
          </p>

          <h1 className="mt-2 text-3xl font-light">
            Bloqueos
          </h1>

          <p className="mt-2 text-gray-600">
            Bloquea días completos u horarios específicos para evitar nuevas reservaciones.
          </p>
        </div>

        <AdminBlockedDates
        blocks={blocks ?? []}
        initialBlockedDates={blockedDates ?? []}
        />
      </section>
    </main>
  )
}
