
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react-native';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!auth.currentUser) return;
    const unsub = onSnapshot(doc(db, 'users', auth.currentUser.uid), (d) => {
        if (d.exists()) {
             setProfile(d.data());
             setFormData(d.data());
        }
        setLoading(false);
    });
    return unsub;
  }, []);

  const handleSave = async () => {
    try {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), formData);
        setProfile(formData);
        setEditing(false);
        Alert.alert('Success', 'Profile updated');
    } catch (err) { Alert.alert('Error', err.message); }
  };

  if (loading) return <ActivityIndicator style={{marginTop: 50}} color="#4F46E5" />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{profile?.displayName?.charAt(0) || 'U'}</Text>
        </View>
        <Text style={styles.name}>{profile?.displayName || 'User'}</Text>
        <Text style={styles.role}>{profile?.role || 'Employee'}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
            <Text style={styles.label}>Full Name</Text>
            {editing ? (
                <TextInput style={styles.input} value={formData.displayName} onChangeText={t => setFormData({...formData, displayName: t})} />
            ) : (
                <Text style={styles.value}>{profile?.displayName}</Text>
            )}
        </View>
        <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{profile?.email}</Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.label}>Phone</Text>
            {editing ? (
                <TextInput style={styles.input} value={formData.phone} onChangeText={t => setFormData({...formData, phone: t})} />
            ) : (
                <Text style={styles.value}>{profile?.phone || '-'}</Text>
            )}
        </View>
         <View style={styles.row}>
            <Text style={styles.label}>Address</Text>
            {editing ? (
                <TextInput style={styles.input} value={formData.address} onChangeText={t => setFormData({...formData, address: t})} />
            ) : (
                <Text style={styles.value}>{profile?.address || '-'}</Text>
            )}
        </View>
      </View>

      <TouchableOpacity style={styles.btn} onPress={() => editing ? handleSave() : setEditing(true)}>
          <Text style={styles.btnText}>{editing ? 'Save Changes' : 'Edit Profile'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  header: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#4F46E5', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarText: { fontSize: 40, fontWeight: 'bold', color: '#fff' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  role: { color: '#888', textTransform: 'uppercase', fontSize: 12, marginTop: 5 },
  card: { backgroundColor: '#111', borderRadius: 16, padding: 20, marginBottom: 20 },
  row: { marginBottom: 20 },
  label: { color: '#666', fontSize: 12, textTransform: 'uppercase', marginBottom: 5 },
  value: { color: '#fff', fontSize: 16 },
  input: { backgroundColor: '#222', color: '#fff', padding: 10, borderRadius: 8 },
  btn: { backgroundColor: '#4F46E5', padding: 16, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
