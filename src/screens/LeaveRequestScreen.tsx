import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { useAuth } from "../AuthContext";

function formatDate(d: Date | null) {
  if (!d) return "";
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

function parseCalendarDate(s: string): Date {
  // Format YYYY-MM-DD
  const [year, month, day] = s.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export default function LeaveRequestScreen() {
  const { token, user } = useAuth();
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [calendarMode, setCalendarMode] = useState<"start" | "end" | null>(null);

  async function submitRequest() {
    setLoading(true);
    try {
      if (!token) throw new Error("Brak autoryzacji! Zaloguj się ponownie.");
      if (!user?.id) throw new Error("Brak danych użytkownika (id).");
      if (!start || !end) throw new Error("Wybierz obie daty!");
      if (end < start) throw new Error("Data zakończenia musi być po dacie rozpoczęcia!");

      const res = await fetch("http://172.20.10.10:5104/api/leaverequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          UserId: user.id,
          Start: start.toISOString(),
          End: end.toISOString(),
          Reason: reason
        })
      });
      if (!res.ok) throw new Error(await res.text());
      Alert.alert("Sukces", "Urlop zgłoszony!");
      setStart(null); setEnd(null); setReason("");
      fetchRequests();
    } catch (e: any) {
      Alert.alert("Błąd", e.message || "Nie udało się zgłosić urlopu.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchRequests() {
    setLoading(true);
    try {
      if (!token) throw new Error("Brak autoryzacji! Zaloguj się ponownie.");
      const res = await fetch("http://172.20.10.10:5104/api/leaverequest", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setRequests(data);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { fetchRequests(); }, [token]);

  // --- Widok wyboru daty ---
  function renderCalendar(mode: "start" | "end") {
    return (
      <Calendar
        onDayPress={day => {
          if (mode === "start") setStart(parseCalendarDate(day.dateString));
          else setEnd(parseCalendarDate(day.dateString));
          setCalendarMode(null);
        }}
        markedDates={{
          [(mode === "start" && start ? start : end)?.toISOString().slice(0, 10) ?? ""]: {
            selected: true, selectedColor: "#2196F3"
          }
        }}
        style={{ marginBottom: 12 }}
        theme={{
          todayTextColor: "#2196F3",
          selectedDayBackgroundColor: "#2196F3"
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zgłoś urlop</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
        <TouchableOpacity onPress={() => setCalendarMode("start")} style={styles.dateBtn}>
          <Text>
            {start ? "Od: " + formatDate(start) : "Data rozpoczęcia"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCalendarMode("end")} style={styles.dateBtn}>
          <Text>
            {end ? "Do: " + formatDate(end) : "Data zakończenia"}
          </Text>
        </TouchableOpacity>
      </View>
      {calendarMode && renderCalendar(calendarMode)}

      <TextInput
        placeholder="Powód urlopu (opcjonalnie)"
        value={reason}
        onChangeText={setReason}
        style={styles.input}
      />
      <Button title={loading ? "Wysyłanie..." : "Zgłoś urlop"} onPress={submitRequest} disabled={loading} />

      <Text style={{ marginTop: 30, fontWeight: "bold" }}>Twoje zgłoszenia urlopowe:</Text>
      <FlatList
        data={requests}
        keyExtractor={(item, idx) => item.Id?.toString() || item.id?.toString() || idx.toString()}
        renderItem={({ item }) => (
          <View style={styles.requestBox}>
            <Text style={{ fontWeight: "bold" }}>
              {formatDate(new Date(item.Start || item.start))} – {formatDate(new Date(item.End || item.end))}
            </Text>
            <Text>Status: <Text style={{ color: item.Status === "Approved" ? "green" : item.Status === "Rejected" ? "red" : "#FFA000" }}>
              {item.Status || item.status || "?"}
            </Text></Text>
            <Text>Powód: {item.Reason || item.reason}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 24 }}>Brak zgłoszeń urlopowych</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 18, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#aaa", borderRadius: 8, marginBottom: 14, padding: 10 },
  dateBtn: { borderWidth: 1, borderColor: "#aaa", borderRadius: 8, padding: 12, flex: 1, alignItems: "center", marginHorizontal: 4, backgroundColor: "#F4F8FB" },
  requestBox: { marginVertical: 7, padding: 10, borderWidth: 1, borderColor: "#eee", borderRadius: 8, backgroundColor: "#F9FAFC" }
});