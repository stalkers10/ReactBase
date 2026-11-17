import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2563EB",
        headerStyle: { backgroundColor: "#FFFFFF" },
        headerTitleStyle: { color: "#0F172A", fontWeight: "700" },
        tabBarStyle: { borderTopColor: "#E2E8F0", backgroundColor: "#FFFFFF" },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen
        name="screens/signup"
        options={{
          title: "Create Account",
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
}
