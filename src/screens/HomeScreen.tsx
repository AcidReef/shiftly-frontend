import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../AppNavigator";
import { useAuth } from "../AuthContext";

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();
  const { logout, user } = useAuth();

  const isManager = user?.role === "Manager";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Witaj w Shiftly!</Text>
      <Text style={styles.subtitle}>Zalogowany jako: {user?.userName} ({user?.role})</Text>

      <Button
        title="Moje zmiany"
        onPress={() => navigation.navigate("Shifts")}
      />
      <Button
        title="Zgłoś urlop"
        onPress={() => navigation.navigate("LeaveRequest")}
      />
      <Button
        title="Swap Request"
        onPress={() => navigation.navigate("SwapRequest")}
      />

      {/* Panel managera */}
      {isManager && (
        <View style={styles.managerPanel}>
          <Text style={styles.managerTitle}>Panel managera</Text>
          <Button
            title="Zarządzaj grafikiem"
            onPress={() => navigation.navigate("ManagerShift")}
          />
          <Button
            title="Akceptuj urlopy"
            onPress={() => navigation.navigate("ManagerLeaveRequest")}
          />
          <Button
            title="Zgłoszenia zamian"
            onPress={() => navigation.navigate("ManagerSwapRequest")}
          />
        </View>
      )}

      <View style={{ marginTop: 40 }}>
        <Button
          title="Wyloguj"
          onPress={() => {
            logout();
            navigation.replace("Login");
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  subtitle: { fontSize: 15, marginBottom: 18, textAlign: "center" },
  managerPanel: { marginTop: 30 },
  managerTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 12, textAlign: "center" }
});