import type { LatLng, ORSRouteResponse } from "../types";

const ORS_BASE_URL = "https://api.openrouteservice.org/v2/directions/foot-walking/geojson";

interface RouteResult {
  polyline: LatLng[];
  distance: number; // meters
  duration: number; // seconds
}

/**
 * Fetch a walking route from OpenRouteService.
 * Coordinates are passed as [lng, lat] pairs per ORS spec.
 */
export async function fetchRoute(
  points: LatLng[],
  apiKey: string,
  preference: "recommended" | "shortest" = "recommended"
): Promise<RouteResult> {
  const coordinates = points.map((p) => [p.longitude, p.latitude]);

  const response = await fetch(ORS_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
    body: JSON.stringify({
      coordinates,
      instructions: false,
      preference,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouteService error (${response.status}): ${errorText}`);
  }

  const data: ORSRouteResponse = await response.json();

  if (!data.features || data.features.length === 0) {
    throw new Error("No route found — the area may not be routable for walking.");
  }

  const feature = data.features[0];
  const { distance, duration } = feature.properties.summary;

  // Convert [lng, lat] coordinates to LatLng objects
  const polyline: LatLng[] = feature.geometry.coordinates.map(([lng, lat]) => ({
    latitude: lat,
    longitude: lng,
  }));

  return { polyline, distance, duration };
}
