type GenerateSessionDatesParams = {
  startDate: string
  sessionsCount: number
  weeklyFrequency: number
  secondDayDate?: string
}

type GenerateSessionPlanParams = {
  startDate: string
  firstBlockId: string
  sessionsCount: number
  weeklyFrequency: number
  secondDayDate?: string
  secondBlockId?: string
}

export type SessionPlanItem = {
  date: string
  blockId: string
}

function addDays(date: Date, days: number) {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + days)
  return copy
}

function toDateString(date: Date) {
  return date.toISOString().split("T")[0]
}

export function generateSessionDates({
  startDate,
  sessionsCount,
  weeklyFrequency,
  secondDayDate,
}: GenerateSessionDatesParams) {
  const plan = generateSessionPlan({
    startDate,
    firstBlockId: "TEMP_BLOCK",
    sessionsCount,
    weeklyFrequency,
    secondDayDate,
    secondBlockId: secondDayDate ? "TEMP_BLOCK" : undefined,
  })

  return plan.map((session) => session.date)
}

export function generateSessionPlan({
  startDate,
  firstBlockId,
  sessionsCount,
  weeklyFrequency,
  secondDayDate,
  secondBlockId,
}: GenerateSessionPlanParams): SessionPlanItem[] {
  const firstDate = new Date(`${startDate}T12:00:00`)

  if (weeklyFrequency === 1) {
    return Array.from({ length: sessionsCount }, (_, index) => ({
      date: toDateString(addDays(firstDate, index * 7)),
      blockId: firstBlockId,
    }))
  }

  if (weeklyFrequency === 2) {
    if (!secondDayDate || !secondBlockId) {
      throw new Error(
        "secondDayDate and secondBlockId are required for weeklyFrequency 2"
      )
    }

    const secondDate = new Date(`${secondDayDate}T12:00:00`)

    if (toDateString(firstDate) === toDateString(secondDate)) {
      throw new Error("The two selected dates must be different")
    }

    if (firstDate.getDay() === secondDate.getDay()) {
      throw new Error("The two selected weekdays must be different")
    }

    const sessions: SessionPlanItem[] = []

    for (let week = 0; sessions.length < sessionsCount; week++) {
      sessions.push({
        date: toDateString(addDays(firstDate, week * 7)),
        blockId: firstBlockId,
      })

      if (sessions.length < sessionsCount) {
        sessions.push({
          date: toDateString(addDays(secondDate, week * 7)),
          blockId: secondBlockId,
        })
      }
    }

    return sessions
  }

  throw new Error("Unsupported weeklyFrequency")
}
