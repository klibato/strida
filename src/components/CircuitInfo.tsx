import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useStridoStore } from "../stores/useStridoStore";
import { formatDistance, formatDuration } from "../core/steps-to-distance";

export function CircuitInfo() {
  const circuit = useStridoStore((s) => s.circuit);

  if (!circuit) return null;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <InfoItem label="Distance" value={formatDistance(circuit.distance)} />
        <InfoItem
          label="Pas estimes"
          value={circuit.estimatedSteps.toLocaleString("fr-FR")}
        />
        <InfoItem
          label="Duree"
          value={formatDuration(circuit.estimatedDuration)}
        />
      </View>
    </View>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.item}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  item: {
    alignItems: "center",
  },
  value: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
});
