import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTintColor: "#1F2937",
          headerTitleStyle: { fontWeight: "700" },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: "Strido" }}
        />
        <Stack.Screen
          name="settings"
          options={{ title: "Reglages" }}
        />
      </Stack>
    </>
  );
}
