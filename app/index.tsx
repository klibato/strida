import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useStridoStore } from "../src/stores/useStridoStore";
import {
  requestLocationPermission,
  getCurrentPosition,
} from "../src/services/location";
import { CircuitMap } from "../src/components/CircuitMap";
import { StepInput } from "../src/components/StepInput";
import { CircuitInfo } from "../src/components/CircuitInfo";
import { GenerateButton } from "../src/components/GenerateButton";

export default function HomeScreen() {
  const router = useRouter();
  const setUserLocation = useStridoStore((s) => s.setUserLocation);
  const setLocationError = useStridoStore((s) => s.setLocationError);
  const circuitError = useStridoStore((s) => s.circuitError);

  useEffect(() => {
    (async () => {
      try {
        const status = await requestLocationPermission();
        if (status !== "granted") {
          setLocationError(
            "Permission de localisation refusee. Activez-la dans les reglages de votre appareil."
          );
          return;
        }
        const position = await getCurrentPosition();
        setUserLocation(position);
      } catch {
        setLocationError(
          "Impossible de recuperer votre position. Verifiez que le GPS est active."
        );
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        <CircuitMap />

        <StepInput />

        <GenerateButton />

        <CircuitInfo />

        {circuitError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{circuitError}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.settingsLink}
          onPress={() => router.push("/settings")}
        >
          <Text style={styles.settingsLinkText}>Reglages</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  errorBanner: {
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    padding: 12,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    textAlign: "center",
  },
  settingsLink: {
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 8,
  },
  settingsLinkText: {
    color: "#4F46E5",
    fontSize: 14,
    fontWeight: "600",
  },
});
