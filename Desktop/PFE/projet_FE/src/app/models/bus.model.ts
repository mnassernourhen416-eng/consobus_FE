export enum EtatBus {
  'Disponible' = 'Disponible',
  'EnService' = 'EnService',
  'EnPanne' = 'EnPanne'
}
export enum BusClass {
  'big' = 'big',
  'mini' = 'mini',
  'standar' = 'standar'
}

// adapte les valeurs selon ton enum Prisma

import { Chauffeur } from './chauffeur.model';
import { Consommation } from './consommation.model';
import { Trajet } from './trajet.model';

export interface Bus {
  EtatBus: any;
  id: number;
  model: string;
  fabricant: string;
  matricule: string;
  etat?: EtatBus;
  busClass?: BusClass;
  chauffeur?: Chauffeur;     // optionnel comme dans Prisma
  trajet: Trajet[];          // relation 1-N
  consommation: Consommation[];
}

