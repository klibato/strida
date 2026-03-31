import { create } from "zustand";
import type { LatLng, Circuit, UserSettings, Sex, RoutePreference } from "../types";
import {
  STEP_LENGTH_M_DEFAULT,
  DEFAULT_STEPS,
} from "../core/constants";
import { stepLengthFromHeight, defaultStepLength } from "../core/steps-to-distance";

interface StridoState {
  // Location
  userLocation: LatLng | null;
  locationError: string | null;

  // Steps input
  targetSteps: number;

  // Circuit
  circuit: Circuit | null;
  isGenerating: boolean;
  circuitError: string | null;

  // Settings
  settings: UserSettings;

  // Actions
  setUserLocation: (location: LatLng) => void;
  setLocationError: (error: string | null) => void;
  setTargetSteps: (steps: number) => void;
  setCircuit: (circuit: Circuit | null) => void;
  setIsGenerating: (generating: boolean) => void;
  setCircuitError: (error: string | null) => void;
  setSex: (sex: Sex) => void;
  setHeight: (heightCm: number | null) => void;
  setStepLengthCm: (cm: number) => void;
  setRoutePreference: (pref: RoutePreference) => void;
  getStepLengthM: () => number;
}

export const useStridoStore = create<StridoState>((set, get) => ({
  // Location
  userLocation: null,
  locationError: null,

  // Steps
  targetSteps: DEFAULT_STEPS,

  // Circuit
  circuit: null,
  isGenerating: false,
  circuitError: null,

  // Settings
  settings: {
    sex: "other",
    heightCm: null,
    stepLengthCm: Math.round(STEP_LENGTH_M_DEFAULT * 100),
    routePreference: "recommended",
  },

  // Actions
  setUserLocation: (location) => set({ userLocation: location, locationError: null }),
  setLocationError: (error) => set({ locationError: error }),
  setTargetSteps: (steps) => set({ targetSteps: steps }),
  setCircuit: (circuit) => set({ circuit }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setCircuitError: (error) => set({ circuitError: error }),

  setSex: (sex) => {
    const { settings } = get();
    const stepLengthM = settings.heightCm
      ? stepLengthFromHeight(settings.heightCm, sex)
      : defaultStepLength(sex);
    set({
      settings: {
        ...settings,
        sex,
        stepLengthCm: Math.round(stepLengthM * 100),
      },
    });
  },

  setHeight: (heightCm) => {
    const { settings } = get();
    if (heightCm) {
      const stepLengthM = stepLengthFromHeight(heightCm, settings.sex);
      set({
        settings: {
          ...settings,
          heightCm,
          stepLengthCm: Math.round(stepLengthM * 100),
        },
      });
    } else {
      set({ settings: { ...settings, heightCm: null } });
    }
  },

  setStepLengthCm: (cm) => {
    const { settings } = get();
    set({ settings: { ...settings, stepLengthCm: cm } });
  },

  setRoutePreference: (pref) => {
    const { settings } = get();
    set({ settings: { ...settings, routePreference: pref } });
  },

  getStepLengthM: () => get().settings.stepLengthCm / 100,
}));
