
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { collection, addDoc, query, where, limit, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { Clock, Square, Play, History } from 'lucide-react-native';

export default function TimesheetScreen() {
  const [currentSession, setCurrentSession] = useState(null);
  const [description, setDescription] = useState('');
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Listen for active session
    const qCurrent = query(
      collection(db, 'timesheets'),
      where('userId', '==', auth.currentUser.uid),
      where('status', '==', 'active'),
      limit(1)
    );
    const unsubCurrent = onSnapshot(qCurrent, (snap) => {
        if (!snap.empty) setCurrentSession({ id: snap.docs[0].id, ...snap.docs[0].data() });
        else setCurrentSession(null);
    });

    // Listen for history
    const qRecent = query(
        collection(db, 'timesheets'),
        where('userId', '==', auth.currentUser.uid),
        limit(10)
    );
    const unsubRecent = onSnapshot(qRecent, (snap) => {
        setRecentSessions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
    });

    return () => { unsubCurrent(); unsubRecent(); };
  }, []);

  const handleClockIn = async () => {
    try {
      await addDoc(collection(db, 'timesheets'), {
        userId: auth.currentUser.uid,
        startTime: new Date(),
        endTime: null,
        date: new Date().toLocaleDateString(),
        status: 'active'
      });
    } catch (err) { Alert.alert('Error', err.message); }
  };

  const handleClockOut = async () => {
    if (!description.trim()) { Alert.alert('Required', 'Please enter a description'); return; }
    try {
      await updateDoc(doc(db, 'timesheets', currentSession.id), {
        endTime: new Date(),
        description,
        status: 'pending_approval'
      });
      setDescription('');
    } catch (err) { Alert.alert('Error', err.message); }
  };

  if (loading) return <ActivityIndicator style={{marginTop:50}} color="#4F46E5" />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Time Clock</Text>
      
      <View style={styles.card}>
         {currentSession ? (
             <View>
                 <View style={styles.statusBadge}>
                     <Text style={styles.statusText}>• Clocked In</Text>
                 </View>
                 <Text style={styles.timer}>Since: {new Date(currentSession.startTime?.seconds * 1000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</Text>
                 <TextInput 
                    style={styles.input} 
                    placeholder="Work description..." 
                    placeholderTextColor="#666"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                 />
                 <TouchableOpacity style={styles.stopButton} onPress={handleClockOut}>
                     <Square color="#fff" fill="currentColor" size={24} />
                     <Text style={styles.btnText}>Stop & Submit</Text>
                 </TouchableOpacity>
             </View>
         ) : (
             <View style={{alignItems: 'center', padding: 20}}>
                 <Text style={{color: '#888', marginBottom: 20}}>Ready to work?</Text>
                 <TouchableOpacity style={styles.startButton} onPress={handleClockIn}>
                     <Play color="#fff" fill="currentColor" size={24} />
                     <Text style={styles.btnText}>Clock In</Text>
                 </TouchableOpacity>
             </View>
         )}
      </View>

      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={{gap: 10}}>
          {recentSessions.map(s => (
              <View key={s.id} style={styles.historyItem}>
                  <History size={16} color="#666" />
                  <View style={{flex:1}}>
                      <Text style={{color:'#fff', fontWeight:'bold'}}>{s.date}</Text>
                      <Text style={{color:'#666', fontSize:12}}>{s.description || 'No description'}</Text>
                  </View>
                  <Text style={{color: s.status === 'approved' ? '#22c55e' : '#eab308', fontSize: 10, fontWeight:'bold', textTransform:'uppercase'}}>{s.status}</Text>
              </View>
          ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  headerTitle: { fontSize: 32, fontWeight: '900', color: '#fff', marginBottom: 20 },
  card: { backgroundColor: '#111', borderRadius: 24, padding: 20, marginBottom: 30, borderWidth: 1, borderColor: '#333' },
  statusBadge: { backgroundColor: 'rgba(34, 197, 94, 0.1)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, marginBottom: 10 },
  statusText: { color: '#22c55e', fontWeight: 'bold', fontSize: 12 },
  timer: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#222', color:'#fff', padding: 15, borderRadius: 12, minHeight: 80, textAlignVertical: 'top', marginBottom: 20 },
  startButton: { backgroundColor: '#22c55e', width: '100%', padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', gap: 10, alignItems: 'center' },
  stopButton: { backgroundColor: '#ef4444', width: '100%', padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', gap: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  sectionTitle: { color: '#888', fontWeight: 'bold', marginBottom: 15, textTransform: 'uppercase', fontSize: 12 },
  historyItem: { flexDirection: 'row', gap: 15, padding: 15, backgroundColor: '#111', borderRadius: 12, alignItems: 'center' }
});
