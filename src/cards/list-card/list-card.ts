import { LitElement, html, TemplateResult, css, CSSResultGroup } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant } from "../../ha";
import { FlightListCardConfig, DisplayField } from "./list-card-config";
import { formatTime } from "../../utils/format-time";
import { FLIGHT_LIST_CARD_NAME } from "./const";
import { registerCustomCard } from "../../utils/custom-cards";
import { PropertyValues } from "lit";
import setupCustomlocalize from "../../localize";

interface Flight {
    flight_number: string;
    airline_short?: string;
    airline?: string;
    airline_icao?: string;
    aircraft_model?: string;
    airport_origin_city?: string;
    airport_origin_country_code?: string;
    airport_destination_city?: string;
    airport_destination_country_code?: string;
    time_scheduled_departure?: string;
    time_scheduled_arrival?: string;
    altitude?: number;
    ground_speed?: number;
    tracked_type: string;
    callsign?: string;
    latitude?: number;
    longitude?: number;
    heading?: number;
}

@customElement(FLIGHT_LIST_CARD_NAME)
export class FlightListCard extends LitElement {
    @property({ attribute: false }) public hass!: HomeAssistant;

    @state() private _config?: FlightListCardConfig;
    @state() private _flights: Flight[] = [];
    @state() private _expanded: boolean = false;
    private _localize!: (key: string) => string;

    public static getConfigElement() {
        return document.createElement("flight-list-card-editor");
    }

    public static getStubConfig(/*hass: HomeAssistant*/): FlightListCardConfig {
        return {
            type: `custom:${FLIGHT_LIST_CARD_NAME}`,
            entity: "sensor.flightradar24_current_in_area",
            name: "Current Flights In Area",
            max_flights: 5
        };
    }

    public setConfig(config: FlightListCardConfig): void {
        if (!config.entity) {
            return;
        }
        this._config = config;
        this._localize = setupCustomlocalize(this.hass);
    }

    protected willUpdate(changedProperties: PropertyValues): void {
        if (changedProperties.has('hass') && this._config) {
            this._updateFlights();
        }
    }

    private _updateFlights(): void {
        if (!this._config || !this.hass) {
            this._flights = [];
            return;
        }

        const entity = this.hass.states[this._config.entity];
        if (!entity) {
            this._flights = [];
            return;
        }

        const flightsData = entity.attributes?.flights;

        try {
            let parsedFlights: Flight[] = [];
            
            if (typeof flightsData === 'string') {
                parsedFlights = JSON.parse(flightsData);
            } else if (Array.isArray(flightsData)) {
                parsedFlights = flightsData;
            } else if (flightsData === null || flightsData === undefined) {
                parsedFlights = [];
            }

            if (!Array.isArray(parsedFlights)) {
                this._flights = [];
                return;
            }

            this._flights = parsedFlights.filter(flight => {
                if (!flight || typeof flight !== 'object') {
                    return false;
                }
                if (!flight.flight_number || typeof flight.flight_number !== 'string') {
                    return false;
                }
                return true;
            });

        } catch (e) {
            this._flights = [];
        }
    }

    protected render(): TemplateResult {
        if (!this._config || !this.hass) {
            return html``;
        }

        const flights = Array.isArray(this._flights) ? this._flights : [];
        const maxFlights = this._config.max_flights || 5;
        const showMore = flights.length > maxFlights && !this._expanded;
        const displayedFlights = showMore ? flights.slice(0, maxFlights) : flights;
        
        return html`
            <ha-card @click=${this._handleClick}>
                <div class="card-header">
                    <div class="name">${this._config.name || this._localize("card.flight.title")}</div>
                    <div class="count">${this._localize("card.flight.flights_count").replace("{count}", flights.length.toString())}</div>
                </div>
                <div class="card-content">
                    ${displayedFlights.map((flight: Flight) => this._renderFlight(flight))}
                    ${showMore ? html`
                        <div class="show-more">
                            <mwc-button 
                                @click=${this._toggleExpanded}
                                class="show-more-button"
                            >
                                ${this._localize("card.flight.show_more")}
                            </mwc-button>
                        </div>
                    ` : ''}
                </div>
            </ha-card>
        `;
    }

    private _handleClick(): void {
        if (!this._config || !this.hass) return;
        
        const event = new Event('hass-more-info', {
            bubbles: true,
            composed: true,
        });
        (event as any).detail = { entityId: this._config.entity };
        this.dispatchEvent(event);
    }

    private _toggleExpanded(e: Event): void {
        e.stopPropagation();
        this._expanded = !this._expanded;
    }

    private _renderFlight(flight: Flight): TemplateResult {
        const isLive = flight.tracked_type !== "historical";
        const heading = flight.heading || 0;
        const displayFields = this._config?.display_fields || [];
        
        // Helper function to check if a field should be displayed
        const shouldDisplay = (field: DisplayField) => 
            displayFields.length === 0 || displayFields.includes(field);
        
        return html`
            <div class="flight ${isLive ? "live" : "historical"}">
                <div class="flight-header">
                    ${flight.airline_icao ? html`
                        <img 
                            src="https://content.airhex.com/content/logos/airlines_${flight.airline_icao}_90_90_f.png?proportions=keep" 
                            alt="${flight.airline_short || ''}"
                            class="airline-icon"
                            @error=${(e: Event) => {
                                const img = e.target as HTMLImageElement;
                                img.style.display = 'none';
                            }}
                        />
                    ` : ''}
                    <span class="flight-number">${flight.flight_number}</span>
                    <span class="airline">${flight.airline || ''}</span>
                    ${shouldDisplay(DisplayField.AIRCRAFT_MODEL) ? html`
                        <span class="aircraft">${flight.aircraft_model || ''}</span>
                    ` : ''}
                    ${isLive && flight.heading !== undefined && shouldDisplay(DisplayField.HEADING_ICON) ? html`
                        <ha-icon 
                            icon="mdi:airplane" 
                            class="heading-icon"
                            style="transform: rotate(${heading}deg)"
                        ></ha-icon>
                    ` : ''}
                </div>
                
                ${flight.airport_origin_city && flight.airport_destination_city
                    ? html`
                        <div class="flight-details">
                            <div class="route">
                                ${this._renderLocation(flight.airport_origin_city, flight.airport_origin_country_code)}
                                <ha-icon icon="mdi:arrow-right"></ha-icon>
                                ${this._renderLocation(flight.airport_destination_city, flight.airport_destination_country_code)}
                            </div>
                            ${shouldDisplay(DisplayField.DEPARTURE_ARRIVAL_TIME) ? html`
                                <div class="schedule">
                                    ${flight.time_scheduled_departure
                                        ? html`<div>${this._localize("card.flight.departure")}: ${formatTime(flight.time_scheduled_departure)}</div>`
                                        : ""}
                                    ${flight.time_scheduled_arrival
                                        ? html`<div>${this._localize("card.flight.arrival")}: ${formatTime(flight.time_scheduled_arrival)}</div>`
                                        : ""}
                                </div>
                            ` : ''}
                            ${(shouldDisplay(DisplayField.ALTITUDE) || shouldDisplay(DisplayField.SPEED)) && 
                              (flight.altitude !== undefined || flight.ground_speed !== undefined) ? html`
                                <div class="stats">
                                    ${shouldDisplay(DisplayField.ALTITUDE) && flight.altitude !== undefined ? html`
                                        <div>${this._localize("card.flight.altitude")}: ${flight.altitude} ${this._localize("card.flight.feet")} (${Math.round(flight.altitude * 0.3048)} ${this._localize("card.flight.meters")})</div>
                                    ` : ''}
                                    ${shouldDisplay(DisplayField.SPEED) && flight.ground_speed !== undefined ? html`
                                        <div>${this._localize("card.flight.speed")}: ${flight.ground_speed} ${this._localize("card.flight.knots")} (${Math.round(flight.ground_speed * 1.852)} ${this._localize("card.flight.kmh")})</div>
                                    ` : ''}
                                </div>
                            ` : ''}
                        </div>
                    `
                    : ""}
            </div>
        `;
    }

    private _renderLocation(city?: string, countryCode?: string): TemplateResult {
        if (!city) return html``;
        
        return html`
            <div class="location">
                <span class="city">${city}</span>
                ${countryCode
                    ? html`<img 
                        src="https://flagsapi.com/${countryCode}/shiny/16.png" 
                        alt="${countryCode}"
                        class="flag"
                    />`
                    : ""}
            </div>
        `;
    }

    static get styles(): CSSResultGroup {
        return css`
            ha-card {
                padding: 16px;
                background-color: transparent;
                border: none;
                padding: 0;
            }
            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 2px;
            }
            .card-content {
                padding: 0 0 16px 0;
            }
            .name {
                font-size: 24px;
                font-weight: 500;
            }
            .count {
                font-size: 14px;
                color: var(--secondary-text-color);
            }
            .flight {
                border: 1px solid var(--divider-color);
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 12px;
            }
            .flight.live {
                background-color: var(--card-background-color);
            }
            .flight.historical {
                background-color: var(--secondary-background-color);
            }
            .flight-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 8px;
                flex-wrap: wrap;
            }
            .airline-icon {
                width: 32px;
                height: 32px;
                object-fit: contain;
                border-radius: 4px;
            }
            .company {
                font-weight: 500;
                color: var(--primary-text-color);
            }
            .flight-number {
                font-weight: 600;
                color: var(--primary-text-color);
            }
            .airline {
                color: var(--secondary-text-color);
                flex: 1;
            }
            .aircraft {
                color: var(--secondary-text-color);
                font-style: italic;
            }
            .flight-details {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .route {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .location {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .flag {
                width: 16px;
                height: 16px;
            }
            .schedule, .stats {
                display: flex;
                gap: 16px;
                font-size: 0.9em;
                color: var(--secondary-text-color);
            }
            .warning {
                color: var(--error-color);
                padding: 16px;
            }
            .heading-icon {
                width: 24px;
                height: 24px;
                transition: transform 0.3s ease;
                color: var(--primary-text-color);
            }
            .show-more {
                display: flex;
                justify-content: center;
                margin-top: 16px;
            }
            .show-more-button {
                --mdc-theme-primary: var(--primary-color);
            }
        `;
    }
}

registerCustomCard({
    type: FLIGHT_LIST_CARD_NAME,
    name: "Flight Tracker | List Card",
    description: "Card for displaying flight list"
}); 