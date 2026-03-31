import type { LatLng, Circuit } from "../types";
import { fetchRoute } from "../services/routing";
import {
  NUM_WAYPOINTS,
  INITIAL_CORRECTION_FACTOR,
  MAX_ITERATIONS,
  ACCEPTABLE_DISTANCE_RATIO,
  METERS_PER_DEGREE_LAT,
} from "./constants";
import { stepsToDistance } from "./steps-to-distance";

/**
 * Generate waypoints arranged in a noisy circle around the origin.
 */
export function generateWaypoints(
  origin: LatLng,
  targetDistance: number,
  correctionFactor: number,
  numPoints: number = NUM_WAYPOINTS
): LatLng[] {
  const radius = targetDistance / (2 * Math.PI * correctionFactor);
  const radiusInDegrees = radius / METERS_PER_DEGREE_LAT;

  const waypoints: LatLng[] = [];
  const angleStep = (2 * Math.PI) / numPoints;

  // Random initial direction for variety
  const startAngle = Math.random() * 2 * Math.PI;

  for (let i = 0; i < numPoints; i++) {
    const angle = startAngle + i * angleStep;
    // Add angular noise (±15°)
    const noisyAngle = angle + (Math.random() - 0.5) * (Math.PI / 6);
    // Add radial noise (±20%)
    const noisyRadius = radiusInDegrees * (0.8 + Math.random() * 0.4);

    const lat = origin.latitude + noisyRadius * Math.cos(noisyAngle);
    // Correct longitude for latitude (degrees get narrower toward poles)
    const lngCorrection = Math.cos(origin.latitude * (Math.PI / 180));
    const lng = origin.longitude + (noisyRadius * Math.sin(noisyAngle)) / lngCorrection;

    waypoints.push({ latitude: lat, longitude: lng });
  }

  return waypoints;
}

/**
 * Main circuit generation algorithm.
 * Generates waypoints, fetches route from ORS, and iteratively adjusts
 * the correction factor to match the target distance within tolerance.
 */
export async function generateCircuit(
  origin: LatLng,
  targetSteps: number,
  stepLengthM: number,
  apiKey: string
): Promise<Circuit> {
  const targetDistance = stepsToDistance(targetSteps, stepLengthM);
  let correctionFactor = INITIAL_CORRECTION_FACTOR;
  let bestResult: Circuit | null = null;
  let bestRatio = Infinity;

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const waypoints = generateWaypoints(origin, targetDistance, correctionFactor);

    // Build coordinate list: origin → waypoints → origin
    const coordinates: LatLng[] = [origin, ...waypoints, origin];
    const route = await fetchRoute(coordinates, apiKey);

    const actualDistance = route.distance;
    const ratio = actualDistance / targetDistance;

    const circuit: Circuit = {
      polyline: route.polyline,
      distance: actualDistance,
      estimatedSteps: Math.round(actualDistance / stepLengthM),
      estimatedDuration: route.duration,
      waypoints,
    };

    // Track the best result
    if (Math.abs(ratio - 1) < Math.abs(bestRatio - 1)) {
      bestResult = circuit;
      bestRatio = ratio;
    }

    // Accept if within tolerance
    if (Math.abs(ratio - 1) < ACCEPTABLE_DISTANCE_RATIO) {
      return circuit;
    }

    // Adjust correction factor for next iteration
    correctionFactor *= ratio;
  }

  // Return the best result we got
  return bestResult!;
}
