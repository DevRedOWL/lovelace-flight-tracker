export enum DisplayField {
    DEPARTURE_ARRIVAL_TIME = 'departure_arrival_time',
    ALTITUDE = 'altitude',
    SPEED = 'speed',
    HEADING_ICON = 'heading_icon',
    AIRCRAFT_MODEL = 'aircraft_model',
    AIRPORT_ICAO = 'airport_icao'
}

export enum Layout {
    HORIZONTAL = 'horizontal',
    VERTICAL = 'vertical'
}

export interface FlightListCardConfig {
    type: string;
    entity: string;
    name?: string;
    max_flights?: number;
    display_fields?: DisplayField[];
    show_header?: boolean;
    layout?: Layout;
} 