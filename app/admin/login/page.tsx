import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "../../../lib/supabaseServer"

async function login(formData: FormData) {
  "use server"

  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect("/admin/login?error=1")
  }

  redirect("/admin")
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string
  }>
}) {
  const params = await searchParams

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-6 text-[#1F1F1F]">
      <section className="mx-auto mt-20 max-w-md rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm tracking-[0.2em] text-[#59B9C6]">
          ADMIN
        </p>

        <h1 className="mt-2 text-3xl font-light">
          Iniciar sesión
        </h1>

        <form action={login} className="mt-6 grid gap-4">
          <input
            name="email"
            type="email"
            placeholder="Correo"
            required
            className="rounded-2xl border border-gray-200 px-4 py-4"
          />

          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            required
            className="rounded-2xl border border-gray-200 px-4 py-4"
          />

          {params?.error && (
            <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
              No se pudo iniciar sesión. Revisa correo y contraseña.
            </p>
          )}

          <button
            type="submit"
            className="rounded-2xl bg-[#59B9C6] px-5 py-4 text-sm font-semibold !text-white"
          >
            Entrar
          </button>
        </form>
      </section>
    </main>
  )
}
