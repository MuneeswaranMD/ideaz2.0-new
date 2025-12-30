
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Linking, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { Video, Plus, Trash2, X } from 'lucide-react-native';

export default function MeetingScreen() {
    const [meetings, setMeetings] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false); // Should really fetch this role
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', link: '', date: '', time: '' });

    useEffect(() => {
        const q = query(collection(db, 'meetings'), orderBy('startTime', 'asc'));
        const unsub = onSnapshot(q, (snap) => {
            setMeetings(snap.docs.map(d => ({id:d.id, ...d.data()})));
        });
        return unsub;
    }, []);

    const handleCreate = async () => {
        if (!formData.title || !formData.date || !formData.time) return Alert.alert('Error', 'Missing fields');
        try {
            // Simplified date parsing
            const start = new Date(`${formData.date}T${formData.time}:00`);
            const end = new Date(start.getTime() + 60*60*1000); // 1 hour default

            await addDoc(collection(db, 'meetings'), {
                title: formData.title,
                link: formData.link,
                startTime: Timestamp.fromDate(start),
                endTime: Timestamp.fromDate(end),
                createdBy: auth.currentUser.uid
            });
            setShowForm(false);
            setFormData({ title: '', link: '', date: '', time: '' });
            Alert.alert('Success', 'Meeting scheduled');
        } catch (err) { Alert.alert('Error', err.message); }
    };

    const handleDelete = async (id) => {
        Alert.alert('Confirm', 'Delete this meeting?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: async () => {
                try { await deleteDoc(doc(db, 'meetings', id)); } catch(e) { console.error(e); }
            }}
        ]);
    };

    const renderItem = ({item}) => (
        <View style={styles.card}>
            <View style={styles.dateBox}>
                <Text style={styles.day}>{new Date(item.startTime?.seconds * 1000).getDate()}</Text>
                <Text style={styles.month}>{new Date(item.startTime?.seconds * 1000).toLocaleString('default', {month:'short'})}</Text>
            </View>
            <View style={{flex: 1}}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.time}>
                    {new Date(item.startTime?.seconds * 1000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                </Text>
            </View>
            <View style={{flexDirection: 'row', gap: 10}}>
                {item.link && (
                    <TouchableOpacity onPress={() => Linking.openURL(item.link)}>
                        <Video size={20} color="#4f46e5" />
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Trash2 size={20} color="#ef4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Meetings</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(!showForm)}>
                    {showForm ? <X color="#fff" size={24} /> : <Plus color="#fff" size={24} />}
                </TouchableOpacity>
            </View>

            {showForm && (
                <View style={styles.form}>
                    <TextInput style={styles.input} placeholder="Meeting Title" placeholderTextColor="#666" value={formData.title} onChangeText={t => setFormData({...formData, title: t})} />
                    <TextInput style={styles.input} placeholder="Link (Zoom/Meet)" placeholderTextColor="#666" value={formData.link} onChangeText={t => setFormData({...formData, link: t})} />
                    <View style={{flexDirection:'row', gap: 10}}>
                        <TextInput style={[styles.input, {flex: 1}]} placeholder="2026-01-01" placeholderTextColor="#666" value={formData.date} onChangeText={t => setFormData({...formData, date: t})} />
                        <TextInput style={[styles.input, {flex: 1}]} placeholder="14:00" placeholderTextColor="#666" value={formData.time} onChangeText={t => setFormData({...formData, time: t})} />
                    </View>
                    <TouchableOpacity style={styles.submitBtn} onPress={handleCreate}>
                        <Text style={styles.submitText}>Schedule Meeting</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList 
                data={meetings}
                renderItem={renderItem}
                keyExtractor={i => i.id}
                contentContainerStyle={{gap: 10}}
                ListEmptyComponent={<Text style={{color:'#666', textAlign:'center', marginTop: 50}}>No meetings scheduled.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
    card: { backgroundColor: '#111', padding: 15, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 15 },
    dateBox: { backgroundColor: 'rgba(79, 70, 229, 0.1)', padding: 10, borderRadius: 12, alignItems: 'center', minWidth: 50 },
    day: { color: '#4f46e5', fontWeight: 'bold', fontSize: 18 },
    month: { color: '#4f46e5', fontSize: 10, textTransform: 'uppercase' },
    title: { color: '#fff', fontWeight: 'bold' },
    time: { color: '#666', fontSize: 12 },
    addBtn: { backgroundColor: '#4f46e5', padding: 10, borderRadius: 10 },
    form: { backgroundColor: '#111', padding: 15, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#333' },
    input: { backgroundColor: '#222', borderRadius: 8, padding: 12, color: '#fff', marginBottom: 10 },
    submitBtn: { backgroundColor: '#22c55e', padding: 12, borderRadius: 8, alignItems: 'center' },
    submitText: { color: '#fff', fontWeight: 'bold' }
});
