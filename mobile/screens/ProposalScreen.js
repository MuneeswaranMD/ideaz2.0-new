
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { FileText, Plus, X, Trash2 } from 'lucide-react-native';

export default function ProposalScreen() {
    const [proposals, setProposals] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ clientName: '', projectTitle: '', budget: '' });

    useEffect(() => {
        const q = query(collection(db, 'proposals'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setProposals(snap.docs.map(d => ({id:d.id, ...d.data()})));
        });
        return unsub;
    }, []);

    const handleCreate = async () => {
        if (!formData.clientName || !formData.projectTitle) return Alert.alert('Error', 'Missing fields');
        try {
            await addDoc(collection(db, 'proposals'), {
                ...formData,
                status: 'Draft',
                createdAt: Timestamp.now()
            });
            setShowForm(false);
            setFormData({ clientName: '', projectTitle: '', budget: '' });
            Alert.alert('Success', 'Proposal drafted');
        } catch (err) { Alert.alert('Error', err.message); }
    };

    const handleDelete = async (id) => {
        Alert.alert('Confirm', 'Delete this proposal?', [
             { text: 'Cancel', style: 'cancel' },
             { text: 'Delete', style: 'destructive', onPress: async () => {
                 try { await deleteDoc(doc(db, 'proposals', id)); } catch(e) { console.error(e); }
             }}
        ]);
    };

    const renderItem = ({item}) => (
        <View style={styles.card}>
             <View style={{flexDirection: 'row', alignItems: 'center', gap: 15, flex: 1}}>
                <View style={styles.iconBox}>
                    <FileText color="#a855f7" size={20} />
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.title}>{item.clientName || 'Unnamed Client'}</Text>
                    <Text style={styles.subtitle}>{item.projectTitle}</Text>
                </View>
             </View>
             <View style={{alignItems: 'flex-end', gap: 5}}>
                <View style={[styles.badge, {backgroundColor: item.status === 'Accepted' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(168, 85, 247, 0.1)'}]}>
                    <Text style={[styles.status, {color: item.status === 'Accepted' ? '#22c55e' : '#a855f7'}]}>{item.status}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Trash2 size={18} color="#ef4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
             <View style={styles.header}>
                <Text style={styles.headerTitle}>All Proposals</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(!showForm)}>
                     {showForm ? <X color="#fff" size={24} /> : <Plus color="#fff" size={24} />}
                </TouchableOpacity>
            </View>

            {showForm && (
                <View style={styles.form}>
                    <TextInput style={styles.input} placeholder="Client Name" placeholderTextColor="#666" value={formData.clientName} onChangeText={t => setFormData({...formData, clientName: t})} />
                    <TextInput style={styles.input} placeholder="Project Title" placeholderTextColor="#666" value={formData.projectTitle} onChangeText={t => setFormData({...formData, projectTitle: t})} />
                    <TextInput style={styles.input} placeholder="Budget (approx)" placeholderTextColor="#666" value={formData.budget} onChangeText={t => setFormData({...formData, budget: t})} />
                    <TouchableOpacity style={styles.submitBtn} onPress={handleCreate}>
                        <Text style={styles.submitText}>Create Proposal Draft</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList 
                data={proposals}
                renderItem={renderItem}
                keyExtractor={i => i.id}
                contentContainerStyle={{gap: 10}}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
    addBtn: { backgroundColor: '#4f46e5', padding: 10, borderRadius: 10 },
    card: { backgroundColor: '#111', padding: 15, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 15 },
    iconBox: { backgroundColor: 'rgba(168, 85, 247, 0.1)', padding: 10, borderRadius: 10 },
    title: { color: '#fff', fontWeight: 'bold' },
    subtitle: { color: '#666', fontSize: 12 },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    status: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
    form: { backgroundColor: '#111', padding: 15, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#333' },
    input: { backgroundColor: '#222', borderRadius: 8, padding: 12, color: '#fff', marginBottom: 10 },
    submitBtn: { backgroundColor: '#22c55e', padding: 12, borderRadius: 8, alignItems: 'center' },
    submitText: { color: '#fff', fontWeight: 'bold' }
});
