import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { useStridoStore } from "../stores/useStridoStore";
import {
  STEP_SLIDER_MIN,
  STEP_SLIDER_MAX,
  STEP_SLIDER_STEP,
} from "../core/constants";
import {
  stepsToDistance,
  estimateDuration,
  formatDistance,
  formatDuration,
} from "../core/steps-to-distance";

export function StepInput() {
  const targetSteps = useStridoStore((s) => s.targetSteps);
  const setTargetSteps = useStridoStore((s) => s.setTargetSteps);
  const stepLengthCm = useStridoStore((s) => s.settings.stepLengthCm);

  const stepLengthM = stepLengthCm / 100;
  const distanceM = stepsToDistance(targetSteps, stepLengthM);
  const durationS = estimateDuration(distanceM);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre de pas</Text>
      <Slider
        style={styles.slider}
        minimumValue={STEP_SLIDER_MIN}
        maximumValue={STEP_SLIDER_MAX}
        step={STEP_SLIDER_STEP}
        value={targetSteps}
        onValueChange={setTargetSteps}
        minimumTrackTintColor="#4F46E5"
        maximumTrackTintColor="#D1D5DB"
        thumbTintColor="#4F46E5"
      />
      <Text style={styles.stepsValue}>
        {targetSteps.toLocaleString("fr-FR")} pas
      </Text>
      <Text style={styles.estimate}>
        {formatDistance(distanceM)} · {formatDuration(durationS)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  stepsValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginTop: 4,
  },
  estimate: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
  },
});
