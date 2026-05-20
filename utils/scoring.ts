/**
 * Lógica de puntuación para el Prode Mundial 2026
 * 
 * 5 Puntos: Acierto Exacto
 * 3 Puntos: Acierto Diferencia de Goles o Empate no exacto
 * 1 Punto: Acierto Tendencia (Ganador)
 * 0 Puntos: Ningún acierto
 */
export function calculatePoints(
  predHome: number,
  predAway: number,
  realHome: number,
  realAway: number
): number {
  // 1. Acierto Exacto
  if (predHome === realHome && predAway === realAway) {
    return 5;
  }

  const predDiff = predHome - predAway;
  const realDiff = realHome - realAway;

  // 2. Acierto de Diferencia de Goles o Empate
  // Si ambos son empates (pero no exactos, ya que el exacto se checkeo arriba)
  // O si la diferencia de goles es la misma (ej: 3-1 y 2-0, ambos son +2)
  if (predDiff === realDiff) {
    return 3;
  }

  // 3. Acierto de Tendencia (Ganador)
  // Chequeamos si el signo de la diferencia es el mismo (ambos positivos o ambos negativos)
  // Nota: El caso de empate ya está cubierto en el punto anterior (diff === 0)
  if (Math.sign(predDiff) === Math.sign(realDiff) && realDiff !== 0) {
    return 1;
  }

  return 0;
}
