
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { Calendar, Plus, Clock, CheckCircle, XCircle } from 'lucide-react-native';

export default function LeaveScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({ startDate: '', endDate: '', reason: '', type: 'vacation' });

  useEffect(() => {
    if (!auth.currentUser) return;

    // Check Admin Role
    getDoc(doc(db, 'users', auth.currentUser.uid)).then(s => {
        if(s.exists() && s.data().role === 'admin') setIsAdmin(true);
    });

    let q;
    // Admins see all, users see theirs. However, keeping it simple: Admin logic inside listener? 
    // Actually, separating queries is better.
    // For simplicity in this demo, we'll wait for isAdmin to load, but that might flicker.
    // Let's just default to user query and switch if admin 
    // OR we fetch all and filter in memory? No, security rules usually block that.
    
    // Let's setup a listener that updates when isAdmin changes.
    // NOTE: This re-subscribes.
  }, []);

  useEffect(() => {
     if (!auth.currentUser) return;
     let unsub;
     
     const setup = async () => {
         const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
         const admin = userDoc.exists() && userDoc.data().role === 'admin';
         setIsAdmin(admin);

         if (admin) {
             // Admin sees ALL pending requests (or all requests)
             // Simplified: Order by date
             const q = query(collection(db, 'leave_requests'), orderBy('createdAt', 'desc'));
             unsub = onSnapshot(q, async (snap) => {
                 // Enhance with user names
                 const data = await Promise.all(snap.docs.map(async d => {
                     const r = d.data();
                     // ideally cache this or use a separate users map
                     let uName = 'Unknown';
                     try {
                         const u = await getDoc(doc(db, 'users', r.userId));
                         if(u.exists()) uName = u.data().displayName || u.data().email;
                     } catch(e){}
                     return {id: d.id, ...r, userName: uName};
                 }));
                 setRequests(data);
                 setLoading(false);
             });
         } else {
             const q = query(
                collection(db, 'leave_requests'),
                where('userId', '==', auth.currentUser.uid),
                orderBy('createdAt', 'desc')
             );
             unsub = onSnapshot(q, (snap) => {
                setRequests(snap.docs.map(d => ({id:d.id, ...d.data()})));
                setLoading(false);
             });
         }
     };
     setup();
     return () => { if(unsub) unsub(); };
  }, []);

  const handleSubmit = async () => {
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    try {
      await addDoc(collection(db, 'leave_requests'), {
        userId: auth.currentUser.uid,
        ...formData,
        status: 'pending',
        createdAt: new Date() // Firestore timestamp ideally
      });
      setShowForm(false);
      setFormData({ startDate: '', endDate: '', reason: '', type: 'vacation' });
      Alert.alert('Success', 'Request submitted');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleAction = async (id, status) => {
      try {
          await updateDoc(doc(db, 'leave_requests', id), { status });
      } catch (e) { Alert.alert('Error', e.message); }
  };

  if (loading) return <ActivityIndicator style={{marginTop: 50}} color="#4F46E5" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leave Management</Text>
        {!isAdmin && (
            <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(!showForm)}>
            <Plus color="#fff" size={20} />
            <Text style={styles.addButtonText}>New</Text>
            </TouchableOpacity>
        )}
      </View>

      {showForm && (
        <View style={styles.formCard}>
           <Text style={styles.label}>Start Date (YYYY-MM-DD)</Text>
           <TextInput 
             style={styles.input} 
             placeholder="2026-01-01" 
             placeholderTextColor="#666"
             value={formData.startDate}
             onChangeText={t => setFormData({...formData, startDate: t})}
           />
           <Text style={styles.label}>End Date (YYYY-MM-DD)</Text>
           <TextInput 
             style={styles.input} 
             placeholder="2026-01-05" 
             placeholderTextColor="#666"
             value={formData.endDate}
             onChangeText={t => setFormData({...formData, endDate: t})}
           />
           <Text style={styles.label}>Reason</Text>
           <TextInput 
             style={styles.input} 
             placeholder="Reason..." 
             placeholderTextColor="#666"
             value={formData.reason}
             onChangeText={t => setFormData({...formData, reason: t})}
           />
           <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
             <Text style={styles.submitButtonText}>Submit Request</Text>
           </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.list}>
        {requests.map(req => (
          <View key={req.id} style={styles.item}>
            <View style={styles.itemIcon}>
               <Calendar color="#a855f7" size={20} />
            </View>
            <View style={{flex:1}}>
              <Text style={styles.itemType}>
                  {isAdmin ? (req.userName || 'Employee') : req.type.toUpperCase()}
              </Text>
              <Text style={styles.itemDate}>{req.startDate} to {req.endDate}</Text>
              <Text style={styles.itemReason}>{req.reason}</Text>
            </View>
            
            <View style={{alignItems: 'flex-end', gap: 5}}>
                <View style={[styles.statusBadge, 
                req.status === 'approved' ? {backgroundColor: 'rgba(34, 197, 94, 0.1)'} : 
                req.status === 'rejected' ? {backgroundColor: 'rgba(239, 68, 68, 0.1)'} : 
                {backgroundColor: 'rgba(234, 179, 8, 0.1)'}
                ]}>
                <Text style={[styles.statusText,
                    req.status === 'approved' ? {color: '#22c55e'} : 
                    req.status === 'rejected' ? {color: '#ef4444'} : 
                    {color: '#eab308'}
                ]}>{req.status}</Text>
                </View>

                {isAdmin && req.status === 'pending' && (
                    <View style={{flexDirection: 'row', gap: 10}}>
                        <TouchableOpacity onPress={() => handleAction(req.id, 'approved')}>
                            <CheckCircle color="#22c55e" size={24} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleAction(req.id, 'rejected')}>
                            <XCircle color="#ef4444" size={24} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
          </View>
        ))}
        {requests.length === 0 && <Text style={styles.emptyText}>No requests.</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  addButton: { flexDirection: 'row', backgroundColor: '#4f46e5', padding: 10, borderRadius: 8, alignItems: 'center', gap: 5 },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  formCard: { backgroundColor: '#111', padding: 16, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#333' },
  label: { color: '#888', marginBottom: 5, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  input: { backgroundColor: '#222', borderRadius: 8, padding: 12, color: '#fff', marginBottom: 15 },
  submitButton: { backgroundColor: '#22c55e', padding: 15, borderRadius: 8, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontWeight: 'bold' },
  list: { gap: 10 },
  item: { backgroundColor: '#111', padding: 16, borderRadius: 12, flexDirection: 'row', gap: 12, alignItems: 'center' },
  itemIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(168, 85, 247, 0.1)', alignItems: 'center', justifyContent: 'center' },
  itemType: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  itemDate: { color: '#888', fontSize: 12 },
  itemReason: { color: '#666', fontSize: 12, fontStyle: 'italic' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  emptyText: { color: '#666', textAlign: 'center', marginTop: 20 }
});
