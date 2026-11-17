import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>WELCOME</Text>
        <Text style={styles.title}>A little space to get started.</Text>
        <Text style={styles.body}>
          Create an account to save your details, then find them anytime in your profile.
        </Text>
        <Pressable
          accessibilityRole="link"
          hitSlop={10}
          onPress={() => router.push("/screens/signup")}
          style={styles.link}
        >
          <Text style={styles.linkText}>Create your account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#F5F7FA" },
  card: { padding: 24, borderRadius: 24, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E2E8F0" },
  eyebrow: { color: "#2563EB", fontSize: 12, fontWeight: "700", letterSpacing: 1.5, marginBottom: 12 },
  title: { color: "#0F172A", fontSize: 28, lineHeight: 34, fontWeight: "700", marginBottom: 10 },
  body: { color: "#64748B", fontSize: 16, lineHeight: 24, marginBottom: 20 },
  link: { alignSelf: "flex-start", paddingVertical: 8 },
  linkText: { color: "#2563EB", fontSize: 16, fontWeight: "700" },
});
