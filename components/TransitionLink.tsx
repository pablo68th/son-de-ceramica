"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

type Props = {
  href: string
  children: React.ReactNode
  className?: string
}

export function TransitionLink({ href, children, className }: Props) {
  const router = useRouter()
  const [isLeaving, setIsLeaving] = useState(false)

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()

    if (isLeaving) return

    setIsLeaving(true)

    setTimeout(() => {
      router.push(href)
    }, 280)
  }

  return (
    <>
      {isLeaving && (
        <div className="fixed inset-0 z-[9999] animate-soft-fade bg-[#F7F5F2]" />
      )}

      <a href={href} onClick={handleClick} className={className}>
        {children}
      </a>
    </>
  )
}