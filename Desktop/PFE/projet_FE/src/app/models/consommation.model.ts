// consommation.model.ts

export type TypeConsommation = 'jour' | 'semaine' | 'mois'; 
// adapte selon ton enum Prisma "type"

import { Bus } from './bus.model';

export interface Consommation {
  id: number;
  date: Date;
  valeur: number;
  type: TypeConsommation;

  busId: number;
  bus?: Bus;
}