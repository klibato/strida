export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface Circuit {
  polyline: LatLng[];
  distance: number; // meters
  estimatedSteps: number;
  estimatedDuration: number; // seconds
  waypoints: LatLng[];
}

export type Sex = "male" | "female" | "other";
export type RoutePreference = "recommended" | "shortest";

export interface UserSettings {
  sex: Sex;
  heightCm: number | null;
  stepLengthCm: number; // centimeters
  routePreference: RoutePreference;
}

export interface ORSRouteResponse {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    geometry: {
      type: "LineString";
      coordinates: [number, number][]; // [lng, lat]
    };
    properties: {
      summary: {
        distance: number; // meters
        duration: number; // seconds
      };
    };
  }>;
}
