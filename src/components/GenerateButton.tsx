import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import Constants from "expo-constants";
import { useStridoStore } from "../stores/useStridoStore";
import { generateCircuit } from "../core/circuit-generator";
import { MIN_STEPS, MAX_STEPS } from "../core/constants";

export function GenerateButton() {
  const userLocation = useStridoStore((s) => s.userLocation);
  const targetSteps = useStridoStore((s) => s.targetSteps);
  const isGenerating = useStridoStore((s) => s.isGenerating);
  const setCircuit = useStridoStore((s) => s.setCircuit);
  const setIsGenerating = useStridoStore((s) => s.setIsGenerating);
  const setCircuitError = useStridoStore((s) => s.setCircuitError);
  const settings = useStridoStore((s) => s.settings);
  const circuit = useStridoStore((s) => s.circuit);

  const handleGenerate = async () => {
    if (!userLocation) {
      Alert.alert(
        "Position introuvable",
        "Impossible de determiner votre position. Verifiez vos parametres de localisation."
      );
      return;
    }

    if (targetSteps < MIN_STEPS) {
      Alert.alert("Trop peu de pas", `Minimum ${MIN_STEPS} pas pour generer un circuit.`);
      return;
    }

    if (targetSteps > MAX_STEPS) {
      Alert.alert(
        "Trop de pas",
        `Maximum ${MAX_STEPS.toLocaleString("fr-FR")} pas, ca fait quand meme ${Math.round((targetSteps * settings.stepLengthCm) / 100000)} km !`
      );
      return;
    }

    const apiKey = Constants.expoConfig?.extra?.orsApiKey
      ?? process.env.EXPO_PUBLIC_ORS_API_KEY
      ?? "";

    if (!apiKey) {
      Alert.alert(
        "Cle API manquante",
        "Configurez EXPO_PUBLIC_ORS_API_KEY dans votre fichier .env"
      );
      return;
    }

    setIsGenerating(true);
    setCircuitError(null);

    try {
      const stepLengthM = settings.stepLengthCm / 100;
      const result = await generateCircuit(
        userLocation,
        targetSteps,
        stepLengthM,
        apiKey
      );
      setCircuit(result);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erreur inconnue";

      if (message.includes("No route found")) {
        setCircuitError(
          "Aucun circuit trouve dans cette zone. Essayez de vous deplacer."
        );
      } else {
        setCircuitError(`Erreur : ${message}`);
      }

      Alert.alert("Erreur", message);
    } finally {
      setIsGenerating(false);
    }
  };

  const disabled = isGenerating || !userLocation;

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={handleGenerate}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {isGenerating ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Text style={styles.buttonText}>
          {circuit ? "Regenerer le circuit" : "Generer un circuit"}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4F46E5",
    marginHorizontal: 20,
    marginVertical: 8,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
