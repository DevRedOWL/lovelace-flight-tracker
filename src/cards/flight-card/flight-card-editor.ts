import { LitElement, html, TemplateResult, css, CSSResultGroup } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant } from "../../ha";
import { FlightCardConfig } from "./flight-card-config";

@customElement("flight-card-editor")
export class FlightCardEditor extends LitElement {
    @property({ attribute: false }) public hass!: HomeAssistant;

    @state() private _config?: FlightCardConfig;

    public setConfig(config: FlightCardConfig): void {
        this._config = config;
    }

    protected render(): TemplateResult {
        if (!this.hass) {
            return html``;
        }

        return html`
            <div class="card-config">
                <div class="config-row">
                    <ha-entity-picker
                        .hass=${this.hass}
                        .value=${this._config?.entity}
                        .label=${"Entity"}
                        .configValue=${"entity"}
                        @value-changed=${this._valueChanged}
                        allow-custom-entity
                    ></ha-entity-picker>
                </div>
                <div class="config-row">
                    <paper-input
                        .label=${"Name"}
                        .value=${this._config?.name}
                        .configValue=${"name"}
                        @value-changed=${this._valueChanged}
                    ></paper-input>
                </div>
            </div>
        `;
    }

    private _valueChanged(ev: CustomEvent): void {
        if (!this._config || !this.hass) {
            return;
        }
        const target = ev.target as any;
        if (this[`_${target.configValue}`] === target.value) {
            return;
        }
        if (target.configValue) {
            if (target.value === "") {
                delete this._config[target.configValue];
            } else {
                this._config = {
                    ...this._config,
                    [target.configValue]: target.value,
                };
            }
        }
        this.dispatchEvent(
            new CustomEvent("config-changed", {
                detail: { config: this._config },
            })
        );
    }

    static get styles(): CSSResultGroup {
        return css`
            .card-config {
                padding: 16px;
            }
            .config-row {
                margin-bottom: 16px;
            }
        `;
    }
} 