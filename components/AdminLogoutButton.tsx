"use client"

import { useRouter } from "next/navigation"
import { supabase } from "../lib/supabaseClient"

export function AdminLogoutButton() {
  const router = useRouter()

  async function logout() {
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#1F1F1F] shadow-sm transition active:scale-[0.98]"
    >
      Cerrar sesión
    </button>
  )
}