export enum EtatChauffeur {
  Libre = 'Libre',
  EnService = 'EnService',
  NonDisponible = 'NonDisponible'
}
// adapte selon ton enum Prisma

import { Bus } from './bus.model';

export interface Chauffeur {
  id: number;
  matricule: string;
  nom?: string;
  prenom?: string;
  age: number;
  etat: EtatChauffeur;

  busId?: number;   // clé étrangère optionnelle
  bus?: Bus;        // relation 1-1 optionnelle
}