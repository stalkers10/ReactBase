import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { saveRefreshToken, signupUser, updateUserDisplayName } from "../../services/firebaseAuth";

export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // 1. Validate empty fields
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert("Validation Error", "Please complete all fields.");
      alert("Please complete all fields.");
      return;
    }
    // 2. Check password length
    if (password.length < 6) {
      Alert.alert(
        "Validation Error",
        "Password must contain at least 6 characters.",
      );
      alert("Password must contain at least 6 characters.");
      return;
    }
    //email verification
    if (!email.includes("@")) {
      Alert.alert("Validation Error", "Invalid email address.");
      alert("Invalid email address.");
      return;
    }
    // 3. Compare passwords
    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match.");
      alert("Passwords do not match.");
      return;
    }
    try {
      // 4. Activate loading
      setLoading(true);
      // 5. Call Firebase signup service
      const result = await signupUser({
        fullName: fullName.trim(),
        email: email.trim(),
        password: password,
      });
      await updateUserDisplayName(result.idToken, fullName.trim());
      await saveRefreshToken(result.refreshToken);
      Alert.alert("Registration Successful", "Your account has been created. Open the Profile tab to view your saved details.");
      confirm("account created")
      
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      Alert.alert("Registration Failed", message);
    } finally {
      // 8. Stop loading whether success or failure
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Register to get started</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#F5F7FA",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#1E293B",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#64748B",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 15,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
