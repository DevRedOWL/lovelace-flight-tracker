declare global {
    interface Window {
        customCards?: Array<{
            type: string;
            name: string;
            description: string;
            preview: boolean;
        }>;
    }
}

export interface CustomCardConfig {
    type: string;
    name?: string;
    description?: string;
}

export const registerCustomCard = (config: CustomCardConfig): void => {
    if (!customElements.get(config.type)) {
        console.warn(`Custom card ${config.type} not found`);
        return;
    }

    window.customCards = window.customCards || [];
    window.customCards.push({
        type: config.type,
        name: config.name || config.type,
        description: config.description || "",
        preview: false,
    });
}; 