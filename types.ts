export interface Identification {
    plantName: string;
    scientificName: string;
    alternativeNames: string[];
    confidence: number;
    description: string;
    ayurvedicProperties: string[];
}

export interface AlternativeMatch {
    name: string;
    confidence: number;
}

export interface BotanicalClassification {
    family: string;
    genus: string;
    partsUsed: string;
    habitat: string;
}

export interface AyurvedicProfile {
    rasa: string;
    virya: string;
    vipaka: string;
    prabhava: string;
}

export interface DoshaEffects {
    vata: string;
    pitta: string;
    kapha: string;
}

export interface TraditionalUses {
    primary: string;
    secondary: string;
    dosage: string;
}

export interface DetailedAnalysis {
    botanicalClassification: BotanicalClassification;
    ayurvedicProfile: AyurvedicProfile;
    doshaEffects: DoshaEffects;
    traditionalUses: TraditionalUses;
}

export interface PlantData {
    isPlant: boolean;
    identification: Identification;
    alternativeMatches: AlternativeMatch[];
    detailedAnalysis: DetailedAnalysis;
}
