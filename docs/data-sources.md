# Data Sources

Flight Tracker Cards supports various data sources for flight tracking. This document outlines the available data sources and how to configure them.

## Flightradar24 Integration

The [Flightradar24 Integration](https://github.com/AlexandrErohin/home-assistant-flightradar24) is a custom component for Home Assistant that provides real-time flight tracking data. It allows you to:

- Track flights in a specific area
- Monitor particular aircraft
- Get information about the most tracked flights
- Receive notifications for flight events
- Create automations based on flight data

### Installation

1. Install the integration through [HACS](https://hacs.xyz/):
   - Go to HACS → Integrations
   - Click the three dots menu
   - Select "Custom repositories"
   - Add repository: `AlexandrErohin/home-assistant-flightradar24`
   - Category: Integration

2. Restart Home Assistant

3. Configure the integration:
   - Go to Settings → Devices & Services
   - Click "Add Integration"
   - Search for "Flightradar24"
   - Configure your area settings (latitude, longitude, radius)
   - Submit the configuration

### Available Data

The integration provides the following data that can be used with Flight Tracker Cards:

- Flight details (callsign, aircraft type, airline)
- Position data (latitude, longitude, altitude)
- Airport information (origin and destination)
- Flight status (on ground, speed, heading)
- Aircraft photos and details

### Configuration Example

```yaml
# Example configuration.yaml entry
flightradar24:
  latitude: 40.7128
  longitude: -74.0060
  radius: 50
  min_altitude: 0
  max_altitude: 10000
```

### Usage with Flight Tracker Cards

When configuring your Flight Tracker Cards, you can use the following entities from the Flightradar24 integration:

- `sensor.flightradar24_current_in_area` - Current flights in your area
- `sensor.flightradar24_entered_area` - Recently entered flights
- `sensor.flightradar24_exited_area` - Recently exited flights
- `sensor.flightradar24_additional_tracked` - Manually tracked flights
- `sensor.flightradar24_most_tracked` - Most tracked flights on Flightradar24

### Events

The integration fires various events that can be used for automations:

- `flightradar24_entry` - When a flight enters your area
- `flightradar24_exit` - When a flight exits your area
- `flightradar24_area_landed` - When a flight lands in your area
- `flightradar24_area_took_off` - When a flight takes off in your area

### Flight Data Structure

The Flightradar24 integration provides flight data in the following format:

```json
{
  "flight_number": "BA123",
  "callsign": "SPEEDBIRD123",
  "airline": "British Airways",
  "airline_short": "BA",
  "airline_icao": "BAW",
  "aircraft_model": "A320",
  "airport_origin_city": "London",
  "airport_origin_country_code": "GB",
  "airport_destination_city": "Paris",
  "airport_destination_country_code": "FR",
  "time_scheduled_departure": "2024-04-19T10:00:00Z",
  "time_scheduled_arrival": "2024-04-19T12:00:00Z",
  "altitude": 35000,
  "ground_speed": 450,
  "tracked_type": "live",
  "latitude": 50.1109,
  "longitude": 1.1848,
  "heading": 135
}
```

#### Required Fields

| Field | Type | Description |
| :---- | :--- | :---------- |
| `flight_number` | string | The flight number (e.g. "BA123") |
| `tracked_type` | string | Either "live" or "historical" |

#### Optional Fields

| Field | Type | Description |
| :---- | :--- | :---------- |
| `callsign` | string | The flight's callsign |
| `airline` | string | Full airline name |
| `airline_short` | string | Short airline name |
| `airline_icao` | string | ICAO airline code |
| `aircraft_model` | string | Aircraft model |
| `airport_origin_city` | string | Origin city |
| `airport_origin_country_code` | string | Origin country code (ISO 3166-1 alpha-2) |
| `airport_destination_city` | string | Destination city |
| `airport_destination_country_code` | string | Destination country code (ISO 3166-1 alpha-2) |
| `time_scheduled_departure` | string | Scheduled departure time (ISO 8601) |
| `time_scheduled_arrival` | string | Scheduled arrival time (ISO 8601) |
| `altitude` | number | Current altitude in feet |
| `ground_speed` | number | Current ground speed in knots |
| `latitude` | number | Current latitude |
| `longitude` | number | Current longitude |
| `heading` | number | Current heading in degrees |

### Notes

- No Flightradar24 subscription is required to use this integration
- The integration respects Flightradar24's terms of service
- For commercial use, please contact Flightradar24 directly 