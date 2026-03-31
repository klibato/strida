// Step length constants (meters)
export const STEP_LENGTH_M_MALE = 0.78;
export const STEP_LENGTH_M_FEMALE = 0.70;
export const STEP_LENGTH_M_DEFAULT = 0.74;

// Height-based step length multipliers
export const STEP_LENGTH_MULTIPLIER_MALE = 0.415;
export const STEP_LENGTH_MULTIPLIER_FEMALE = 0.413;

// Walking constants
export const STEPS_PER_KM_APPROX = 1350;
export const WALKING_SPEED_KMH = 5.0;

// Circuit generation limits
export const MIN_STEPS = 500;
export const MAX_STEPS = 30_000;
export const STEP_SLIDER_MIN = 1_000;
export const STEP_SLIDER_MAX = 20_000;
export const STEP_SLIDER_STEP = 500;
export const DEFAULT_STEPS = 5_000;

// Circuit generation parameters
export const NUM_WAYPOINTS = 5;
export const INITIAL_CORRECTION_FACTOR = 1.3;
export const MAX_ITERATIONS = 3;
export const ACCEPTABLE_DISTANCE_RATIO = 0.15; // 15% tolerance

// Geo constants
export const METERS_PER_DEGREE_LAT = 111_320;
