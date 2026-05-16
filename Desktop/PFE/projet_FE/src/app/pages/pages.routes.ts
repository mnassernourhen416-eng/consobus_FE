import { Routes } from '@angular/router';

import { TableauBord } from './dashboard/tableau-bord/tableau-bord';
import { GestionBus } from './gestion-bus/gestion-bus';
import { GestionChauffeur } from './gestion-chauffeur/gestion-chauffeur';
import { GestionConsommation } from './gestion-consommation/gestion-consommation';
import { GestionTrajet } from './gestion-trajet/gestion-trajet';


export default [

    { path: 'gestion_bus', component: GestionBus },
    { path: 'gestion_consommation', component: GestionConsommation },
    { path: 'gestion_trajet', component: GestionTrajet },
    { path: 'gestion_chauffeur', component: GestionChauffeur },
    { path: 'tableau-bord', component: TableauBord },

    { path: '**', redirectTo: '/notfound' }
] as Routes;
