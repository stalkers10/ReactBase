import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  getSavedProfile,
  type FirebaseProfile,
} from "../services/firebaseAuth";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<FirebaseProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setProfile(await getSavedProfile());
    } catch {
      setError(
        "We couldn’t load your profile. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const request = setTimeout(() => void loadProfile(), 0);
    return () => clearTimeout(request);
  }, [loadProfile]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your profile</Text>
      <Text style={styles.subtitle}>
        The account details saved with Firebase.
      </Text>
      {loading ? (
        <ActivityIndicator style={styles.loader} color="#2563EB" />
      ) : profile ? (
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(profile.displayName || profile.email || "U")
                .charAt(0)
                .toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>
            {profile.displayName || "Name not set"}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.label}>EMAIL</Text>
          <Text style={styles.value}>{profile.email || "No email saved"}</Text>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.emptyTitle}>
            {error ? "Profile unavailable" : "No saved profile yet"}
          </Text>
          <Text style={styles.emptyBody}>
            {error || "Create an account to see your name and email here."}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={loadProfile}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {error ? "Try again" : "Refresh"}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#F5F7FA" },
  heading: { color: "#0F172A", fontSize: 28, fontWeight: "700", marginTop: 12 },
  subtitle: {
    color: "#64748B",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
    marginBottom: 24,
  },
  loader: { marginTop: 48 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 22,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  avatarText: { color: "#1D4ED8", fontWeight: "700", fontSize: 24 },
  name: { color: "#0F172A", fontSize: 21, fontWeight: "700" },
  divider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 20 },
  label: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 7,
  },
  value: { color: "#1E293B", fontSize: 16 },
  emptyTitle: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyBody: { color: "#64748B", fontSize: 15, lineHeight: 22 },
  button: {
    marginTop: 18,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    paddingVertical: 13,
    alignItems: "center",
  },
  buttonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
});
