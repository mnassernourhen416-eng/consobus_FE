// trajet.model.ts

import { Bus } from './bus.model';
export enum Ville {
  'Gafsa' = 'Gafsa',
  'Metlaoui' = 'Metlaoui',
  'Mdhilla' = 'Mdhilla',
  'Redeyef' = 'Redeyef',
  'Moularès' = 'Moularès'
}
export interface Trajet {
  id: number;
  depart: string;
  destination: string;
  date: Date;
  kilometrage: number;

  busId: number;   // obligatoire
  bus?: Bus;       // relation vers Bus
}