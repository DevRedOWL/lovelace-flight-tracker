import { LitElement, html, TemplateResult, css, CSSResultGroup } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant } from "../../ha";
import { FlightListCardConfig, DisplayField } from "./list-card-config";
import setupCustomlocalize from "../../localize";
import { FLIGHT_LIST_CARD_NAME } from "./const";

@customElement(`${FLIGHT_LIST_CARD_NAME}-editor`)
export class FlightCardEditor extends LitElement {
    @property({ attribute: false }) public hass!: HomeAssistant;

    @state() private _config?: FlightListCardConfig;
    @state() private _localize!: (key: string) => string;

    constructor() {
        super();
        this._localize = setupCustomlocalize();
    }

    public setConfig(config: FlightListCardConfig): void {
        this._config = {
            ...config,
            type: `custom:${FLIGHT_LIST_CARD_NAME}`
        };
    }

    protected willUpdate(changedProperties: Map<string, any>): void {
        if (changedProperties.has('hass')) {
            this._localize = setupCustomlocalize(this.hass);
        }
    }

    protected render(): TemplateResult {
        if (!this.hass) {
            return html``;
        }

        const entity = this._config?.entity || '';
        const name = this._config?.name || '';
        const maxFlights = this._config?.max_flights?.toString() || "5";
        const showHeader = this._config?.show_header !== false;
        const displayFields = this._config?.display_fields || Object.values(DisplayField);

        return html`
            <div class="card-config">
                <ha-form
                    .hass=${this.hass}
                    .data=${{
                        entity: entity,
                        name: name,
                        max_flights: maxFlights,
                        show_header: showHeader,
                        display_fields: displayFields
                    }}
                    .schema=${[
                        {
                            name: "entity",
                            label: this._localize("card.flight.fields.entity"),
                            selector: {
                                entity: {
                                    filter: {
                                        domain: "sensor"
                                    }
                                }
                            },
                            required: true
                        },
                        {
                            name: "name",
                            label: this._localize("card.flight.fields.name"),
                            selector: {
                                text: {}
                            },
                            required: true
                        },
                        {
                            name: "max_flights",
                            label: this._localize("card.flight.fields.max_flights"),
                            selector: {
                                number: {
                                    min: 1,
                                    mode: "box"
                                }
                            },
                            required: true
                        },
                        {
                            name: "show_header",
                            label: this._localize("card.flight.fields.show_header"),
                            selector: {
                                boolean: {}
                            }
                        },
                        {
                            name: "display_fields",
                            label: this._localize("card.flight.fields.display_fields"),
                            selector: {
                                select: {
                                    multiple: true,
                                    options: [
                                        {
                                            value: DisplayField.DEPARTURE_ARRIVAL_TIME,
                                            label: this._localize("card.flight.departure_arrival_time")
                                        },
                                        {
                                            value: DisplayField.ALTITUDE,
                                            label: this._localize("card.flight.altitude")
                                        },
                                        {
                                            value: DisplayField.SPEED,
                                            label: this._localize("card.flight.speed")
                                        },
                                        {
                                            value: DisplayField.HEADING_ICON,
                                            label: this._localize("card.flight.heading_icon")
                                        },
                                        {
                                            value: DisplayField.AIRCRAFT_MODEL,
                                            label: this._localize("card.flight.aircraft_model")
                                        },
                                        {
                                            value: DisplayField.AIRPORT_ICAO,
                                            label: this._localize("card.flight.airport_icao")
                                        }
                                    ]
                                }
                            }
                        }
                    ]}
                    @value-changed=${this._valueChanged}
                ></ha-form>
            </div>
        `;
    }

    private _valueChanged(ev: CustomEvent): void {
        if (!this._config || !this.hass) {
            return;
        }

        const data = ev.detail.value;
        if (!data) {
            return;
        }

        this._config = {
            ...this._config,
            ...data
        };

        this.dispatchEvent(
            new CustomEvent("config-changed", {
                detail: { config: this._config },
                bubbles: true,
                composed: true
            })
        );
    }

    static get styles(): CSSResultGroup {
        return css`
            .card-config {
                padding: 16px;
            }
        `;
    }
} 