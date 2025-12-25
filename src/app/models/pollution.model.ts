export const POLLUTION_TYPES = [
  'Plastique',
  'Chimique',
  'Dépôt sauvage',
  'Eau',
  'Air',
  'Autre',
] as const
export const POLLUTION_LEVELS = ['Faible', 'Moyen', 'Élevé'] as const

export interface PollutionDeclaration {
  id: number
  titre: string
  type: PollutionType
  description: string
  dateObservation: string
  lieu: string
  niveau: PollutionLevel
  latitude: number
  longitude: number
  photoUrl?: string
}

export type PollutionLevel = (typeof POLLUTION_LEVELS)[number]

export type PollutionType = (typeof POLLUTION_TYPES)[number]
export interface PollutionStats {
  totalDeclarations: number
  declarationsByType: Record<PollutionType, number>
  declarationsBySeverity: Record<PollutionLevel, number>
}

export interface PollutionFilter {
  type?: PollutionType
  niveau?: PollutionLevel
  dateFrom?: string
  dateTo?: string
}
