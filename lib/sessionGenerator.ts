type GenerateSessionsParams = {
  startDate: string
  sessionsCount: number
  weeklyFrequency: number
  secondDayDate?: string
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
}: GenerateSessionsParams) {
  const firstDate = new Date(`${startDate}T12:00:00`)

  if (weeklyFrequency === 1) {
    return Array.from({ length: sessionsCount }, (_, index) => {
      return toDateString(addDays(firstDate, index * 7))
    })
  }

  if (weeklyFrequency === 2) {
    if (!secondDayDate) {
      throw new Error("secondDayDate is required for weeklyFrequency 2")
    }

    const secondDate = new Date(`${secondDayDate}T12:00:00`)

    if (toDateString(firstDate) === toDateString(secondDate)) {
      throw new Error("The two selected days must be different")
    }

    const dates: string[] = []

    for (let week = 0; dates.length < sessionsCount; week++) {
      dates.push(toDateString(addDays(firstDate, week * 7)))

      if (dates.length < sessionsCount) {
        dates.push(toDateString(addDays(secondDate, week * 7)))
      }
    }

    return dates
  }

  throw new Error("Unsupported weeklyFrequency")
}
