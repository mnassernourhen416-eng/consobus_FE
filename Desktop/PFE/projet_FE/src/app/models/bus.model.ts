export type EtatBus = 'Disponible' | 'EnPanne';
// adapte les valeurs selon ton enum Prisma

import { Chauffeur } from './chauffeur.model';
import { Consommation } from './consommation.model';
import { Trajet } from './trajet.model';

export interface Bus {
  id: number;
  model: string;
  fabricant: string;
  etat: EtatBus;
  chauffeur?: Chauffeur;     // optionnel comme dans Prisma
  trajet: Trajet[];          // relation 1-N
  consommation: Consommation[];
}

