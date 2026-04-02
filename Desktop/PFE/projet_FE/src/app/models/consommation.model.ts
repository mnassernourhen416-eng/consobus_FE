// consommation.model.ts

export enum TypeConsommation {
  semaine = 'semaine',
  mois = 'mois',
  jour = "jour"
}
// adapte selon ton enum Prisma "type"

import { Bus } from './bus.model';

export interface Consommation {
  newConsommation: any;
  isNew: boolean;
  id: number;
  date: Date;
  valeur: number;
  type: TypeConsommation;

  busId: number;
  bus?: Bus;
}