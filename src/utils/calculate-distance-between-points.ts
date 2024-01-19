export type Point = {
  latitude: number
  longitude: number
}

type Unit = 'km' | 'm'

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

export function calculateDistance(
  pointA: Point,
  pointB: Point,
  unit: Unit = 'km',
): number {
  const earthRadius = unit === 'km' ? 6371 : 6371000

  const dLat = toRadians(pointB.latitude - pointA.latitude)
  const dLon = toRadians(pointB.longitude - pointA.longitude)

  const lat1 = toRadians(pointA.latitude)
  const lat2 = toRadians(pointB.latitude)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadius * c
}
