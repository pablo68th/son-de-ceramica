"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Block = {
  id: string
  day_of_week: number
  label: string
  start_time: string
  end_time: string
}

type Props = {
  blocks: Block[]
}

const daysMap: Record<number, string> = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
}

export default function BlockSelector({ blocks }: Props) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)

  const router = useRouter()
  const selectedBlock = blocks.find((block) => block.id === selectedBlockId)

  return (
    <section className="mt-6 rounded-xl border p-4">
      <h2 className="text-lg font-semibold mb-4">Elige tu horario</h2>

      <div className="grid gap-3">
        {blocks.map((block) => {
          const isSelected = selectedBlockId === block.id

          return (
            <button
              key={block.id}
              type="button"
              onClick={() => setSelectedBlockId(block.id)}
              className={`rounded-lg border p-3 text-left transition ${
                isSelected
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white"
              }`}
            >
              <p className="font-medium">{daysMap[block.day_of_week]}</p>
              <p className={isSelected ? "text-white/80" : "text-gray-600"}>
                {block.start_time} – {block.end_time}
              </p>
            </button>
          )
        })}
      </div>

      {selectedBlock && (
        <div className="mt-4 rounded-lg bg-gray-100 p-3">
          <p className="text-sm">
            Horario seleccionado: {daysMap[selectedBlock.day_of_week]}{" "}
            {selectedBlock.start_time} – {selectedBlock.end_time}
          </p>

            <button
            onClick={() => {
                if (!selectedBlockId) return

                router.push(`?blockId=${selectedBlockId}`)
            }}
            className="mt-3 rounded bg-black px-4 py-2 text-white"
            >
            Continuar
            </button>
        </div>
      )}
    </section>
  )
}