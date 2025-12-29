
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Phone, Mail, Trash2 } from 'lucide-react-native';

export default function EmployeeScreen() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'users'), orderBy('displayName'));
        const unsub = onSnapshot(q, (snap) => {
            setUsers(snap.docs.map(d => ({id:d.id, ...d.data()})));
        });
        return unsub;
    }, []);

    const handleDelete = async (id) => {
        Alert.alert('Warning', 'Delete this employee record? This does not remove their authentication account, only their database profile.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: async () => {
                try { await deleteDoc(doc(db, 'users', id)); } catch(e) { console.error(e); }
            }}
        ]);
    };

    const renderItem = ({item}) => (
        <View style={styles.card}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.displayName?.charAt(0) || 'U'}</Text>
            </View>
            <View style={{flex: 1}}>
                <Text style={styles.name}>{item.displayName || item.email}</Text>
                <Text style={styles.role}>{item.role}</Text>
            </View>
            <View style={{gap: 15, flexDirection: 'row', alignItems: 'center'}}>
                {item.phone && <TouchableOpacity><Phone size={18} color="#4f46e5" /></TouchableOpacity>}
                <TouchableOpacity><Mail size={18} color="#4f46e5" /></TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Trash2 size={18} color="#ef4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>All Employees</Text>
            <FlatList 
                data={users}
                renderItem={renderItem}
                keyExtractor={i => i.id}
                contentContainerStyle={{gap: 10}}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
    card: { backgroundColor: '#111', padding: 15, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 15 },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: '#fff', fontWeight: 'bold' },
    name: { color: '#fff', fontWeight: 'bold' },
    role: { color: '#666', fontSize: 12, textTransform: 'uppercase' }
});
