export interface DashboardStats {
    bus: BusStats;
    chauffeur: ChauffeurStats;
    totalTrajets: number;
    totalConsommations: number;
}

export interface BusStats {
    total: number;
    disponible: number;
    enService: number;
    enPanne: number;
}

export interface ChauffeurStats {
    total: number;
    libre: number;
    enService: number;
    NonDisponible: number;
}
export interface ConsommationBus {
    busMatricule: string;
    totalConsommation: number;
}
export interface TrajetBus {
    busMatricule: string;
    totalTrajets: number;
}
export interface TrajetStats {
    semaine: number;
    mois: number;
    annee: number;
    totalTrajets: number;
    trajets_type_Date_depart_destination: number;
}