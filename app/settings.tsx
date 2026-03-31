import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useStridoStore } from "../src/stores/useStridoStore";
import type { Sex, RoutePreference } from "../src/types";

export default function SettingsScreen() {
  const settings = useStridoStore((s) => s.settings);
  const setSex = useStridoStore((s) => s.setSex);
  const setHeight = useStridoStore((s) => s.setHeight);
  const setStepLengthCm = useStridoStore((s) => s.setStepLengthCm);
  const setRoutePreference = useStridoStore((s) => s.setRoutePreference);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Sex */}
        <Text style={styles.sectionTitle}>Sexe</Text>
        <View style={styles.segmented}>
          {(["male", "female", "other"] as Sex[]).map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.segmentedButton,
                settings.sex === option && styles.segmentedButtonActive,
              ]}
              onPress={() => setSex(option)}
            >
              <Text
                style={[
                  styles.segmentedText,
                  settings.sex === option && styles.segmentedTextActive,
                ]}
              >
                {option === "male" ? "Homme" : option === "female" ? "Femme" : "Autre"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Height */}
        <Text style={styles.sectionTitle}>Taille (cm)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Ex: 175"
          placeholderTextColor="#9CA3AF"
          value={settings.heightCm?.toString() ?? ""}
          onChangeText={(text) => {
            const val = parseInt(text, 10);
            setHeight(isNaN(val) ? null : val);
          }}
        />
        <Text style={styles.hint}>
          Laissez vide pour utiliser la longueur de foulee par defaut.
        </Text>

        {/* Step length override */}
        <Text style={styles.sectionTitle}>Longueur de foulee (cm)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Ex: 74"
          placeholderTextColor="#9CA3AF"
          value={settings.stepLengthCm.toString()}
          onChangeText={(text) => {
            const val = parseInt(text, 10);
            if (!isNaN(val) && val > 0 && val < 200) {
              setStepLengthCm(val);
            }
          }}
        />
        <Text style={styles.hint}>
          Calculee automatiquement depuis votre taille, ou saisissez manuellement.
        </Text>

        {/* Route preference */}
        <Text style={styles.sectionTitle}>Preference de route</Text>
        <View style={styles.segmented}>
          {(["recommended", "shortest"] as RoutePreference[]).map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.segmentedButton,
                settings.routePreference === option && styles.segmentedButtonActive,
              ]}
              onPress={() => setRoutePreference(option)}
            >
              <Text
                style={[
                  styles.segmentedText,
                  settings.routePreference === option && styles.segmentedTextActive,
                ]}
              >
                {option === "recommended" ? "Recommande" : "Plus court"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginTop: 20,
    marginBottom: 8,
  },
  segmented: {
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  segmentedButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  segmentedButtonActive: {
    backgroundColor: "#4F46E5",
  },
  segmentedText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  segmentedTextActive: {
    color: "#FFFFFF",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#1F2937",
  },
  hint: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
});
