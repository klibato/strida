import {
  STEP_LENGTH_M_DEFAULT,
  STEP_LENGTH_M_MALE,
  STEP_LENGTH_M_FEMALE,
  STEP_LENGTH_MULTIPLIER_MALE,
  STEP_LENGTH_MULTIPLIER_FEMALE,
  WALKING_SPEED_KMH,
} from "./constants";
import type { Sex } from "../types";

/**
 * Convert steps to distance in meters.
 */
export function stepsToDistance(steps: number, stepLengthM: number = STEP_LENGTH_M_DEFAULT): number {
  return steps * stepLengthM;
}

/**
 * Convert distance in meters to estimated steps.
 */
export function distanceToSteps(distanceM: number, stepLengthM: number = STEP_LENGTH_M_DEFAULT): number {
  return Math.round(distanceM / stepLengthM);
}

/**
 * Estimate walking duration in seconds for a given distance in meters.
 */
export function estimateDuration(distanceM: number): number {
  const distanceKm = distanceM / 1000;
  const hours = distanceKm / WALKING_SPEED_KMH;
  return Math.round(hours * 3600);
}

/**
 * Calculate step length from height in cm and sex.
 */
export function stepLengthFromHeight(heightCm: number, sex: Sex): number {
  const heightM = heightCm / 100;
  if (sex === "male") return heightM * STEP_LENGTH_MULTIPLIER_MALE;
  if (sex === "female") return heightM * STEP_LENGTH_MULTIPLIER_FEMALE;
  // "other" — average of both multipliers
  return heightM * ((STEP_LENGTH_MULTIPLIER_MALE + STEP_LENGTH_MULTIPLIER_FEMALE) / 2);
}

/**
 * Get default step length based on sex (no height provided).
 */
export function defaultStepLength(sex: Sex): number {
  if (sex === "male") return STEP_LENGTH_M_MALE;
  if (sex === "female") return STEP_LENGTH_M_FEMALE;
  return STEP_LENGTH_M_DEFAULT;
}

/**
 * Format distance for display.
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Format duration in seconds to human-readable string.
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `~${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMin = minutes % 60;
  return `~${hours}h${remainingMin > 0 ? `${remainingMin.toString().padStart(2, "0")}` : ""}`;
}
