// import React, { useEffect, useState } from "react";
// import { View, Text, Button, FlatList, StyleSheet } from "react-native";
// import { useAuth } from "../AuthContext";

// export default function ManagerScreen() {
//   const { token } = useAuth();
//   const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
//   // Analogicznie możesz dodać swapRequests i shifts

//   useEffect(() => {
//     async function fetchLeaveRequests() {
//       if (!token) return;
//       const res = await fetch("http://.../api/leaverequest", {
//         headers: { "Authorization": `Bearer ${token}` }
//       });
//       setLeaveRequests(await res.json());
//     }
//     fetchLeaveRequests();
//   }, [token]);

//   async function approveLeave(id: string) {
//     if (!token) return;
//     await fetch(`http://.../api/leaverequest/${id}/approve`, {
//       method: "POST",
//       headers: { "Authorization": `Bearer ${token}` }
//     });
//     // Odśwież listę!
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Zgłoszenia urlopowe</Text>
//       <FlatList
//         data={leaveRequests}
//         keyExtractor={item => item.id}
//         renderItem={({ item }) => (
//           <View>
//             <Text>{item.userId}: {item.start} - {item.end} [{item.status}]</Text>
//             {item.status === "Pending" && (
//               <>
//                 <Button title="Akceptuj" onPress={() => approveLeave(item.id)} />
//                 <Button title="Odrzuć" onPress={() => {/* ... */}} />
//               </>
//             )}
//           </View>
//         )}
//       />
//       {/* Tu kolejne sekcje – swap requests, zarządzanie grafikiem itd. */}
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 24 },
//   title: { fontSize: 20, fontWeight: "bold", marginBottom: 24, textAlign: "center" }
// });