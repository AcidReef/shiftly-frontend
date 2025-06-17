import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../AppNavigator";

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Witaj w Shiftly!</Text>

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
      {/* Na razie opcjonalnie: wyloguj */}
      <View style={{ marginTop: 40 }}>
        <Button
          title="Wyloguj"
          onPress={() => navigation.replace("Login")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 24, textAlign: "center" },
});