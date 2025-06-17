import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

type Shift = {
  id: string;
  userId: string;
  start: string;
  end: string;
};

export default function ShiftsList() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://192.168.0.178:5104/api/shift')
      .then(res => res.json())
      .then(setShifts)
      .catch(err => console.error('Błąd fetchowania:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Text>Ładowanie zmian...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista zmian:</Text>
      <FlatList
        data={shifts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.userId}: {item.start} - {item.end}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 60, padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  item: { marginBottom: 4 },
});