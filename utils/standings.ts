import { Match, Team } from "@prisma/client"

export interface TeamStanding {
  team: Team
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

export function calculateGroupStandings(teams: Team[], matches: (Match & { homeTeam: Team, awayTeam: Team })[]): TeamStanding[] {
  const standings: Record<string, TeamStanding> = {}

  // Inicializar todos los equipos con ceros
  teams.forEach(team => {
    standings[team.id] = {
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0
    }
  })

  // Procesar partidos finalizados
  matches.forEach(match => {
    if (match.status !== 'FINISHED' || match.homeGoals === null || match.awayGoals === null) return

    const home = standings[match.homeTeamId]
    const away = standings[match.awayTeamId]

    if (!home || !away) return

    home.played++
    away.played++
    home.goalsFor += match.homeGoals
    home.goalsAgainst += match.awayGoals
    away.goalsFor += match.awayGoals
    away.goalsAgainst += match.homeGoals

    if (match.homeGoals > match.awayGoals) {
      home.won++
      home.points += 3
      away.lost++
    } else if (match.homeGoals < match.awayGoals) {
      away.won++
      away.points += 3
      home.lost++
    } else {
      home.drawn++
      away.drawn++
      home.points += 1
      away.points += 1
    }

    home.goalDifference = home.goalsFor - home.goalsAgainst
    away.goalDifference = away.goalsFor - away.goalsAgainst
  })

  // Convertir a array y ordenar
  return Object.values(standings).sort((a, b) => {
    // 1. Puntos
    if (b.points !== a.points) return b.points - a.points
    // 2. Diferencia de goles
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
    // 3. Goles a favor
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor
    // 4. Nombre (alfabético)
    return a.team.name.localeCompare(b.team.name)
  })
}
