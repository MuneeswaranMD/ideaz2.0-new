
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { FileOutput, Plus, X, Trash2 } from 'lucide-react-native';

export default function QuotationScreen() {
    const [quotes, setQuotes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ clientName: '', title: '', amount: '' });

    useEffect(() => {
        const q = query(collection(db, 'quotations'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setQuotes(snap.docs.map(d => ({id:d.id, ...d.data()})));
        });
        return unsub;
    }, []);

    const handleCreate = async () => {
        if (!formData.clientName || !formData.amount) return Alert.alert('Error', 'Missing details');
        try {
            await addDoc(collection(db, 'quotations'), {
                clientName: formData.clientName,
                title: formData.title || 'General Quotation',
                totalAmount: formData.amount, // Just string as simplistic
                status: 'draft',
                createdAt: Timestamp.now(),
                validUntil: Timestamp.fromDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)) // 14 days
            });
            setShowForm(false);
            setFormData({ clientName: '', title: '', amount: '' });
            Alert.alert('Success', 'Quotation Created');
        } catch (e) { Alert.alert('Error', e.message); }
    };

    const handleDelete = async (id) => {
          Alert.alert('Confirm', 'Delete this quotation?', [
              { text: 'Cancel', style: 'cancel'},
              { text: 'Delete', style: 'destructive', onPress: async () => {
                  try { await deleteDoc(doc(db, 'quotations', id)); } catch(e) { console.error(e); }
              }}
          ]);
    };

    const renderItem = ({item}) => (
        <View style={styles.card}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 15, flex: 1}}>
                <View style={styles.iconBox}>
                    <FileOutput color="#fff" size={20} />
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.client}>{item.clientName || 'Unknown Client'}</Text>
                    <Text style={styles.itemTitle}>{item.title || 'Untitled Quotation'}</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-end'}}>
                <Text style={styles.amount}>{item.totalAmount ? `₹${item.totalAmount}` : '-'}</Text>
                <Text style={[styles.status, {color: item.status === 'approved' ? '#22c55e' : '#eab308'}]}>
                    {item.status || 'draft'}
                </Text>
            </View>
            <TouchableOpacity hitSlop={10} onPress={() => handleDelete(item.id)} style={{marginLeft: 10}}>
                 <Trash2 size={20} color="#ef4444" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
             <View style={styles.header}>
                <Text style={styles.headerTitle}>Quotations</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(!showForm)}>
                    {showForm ? <X color="#fff" size={24} /> : <Plus color="#fff" size={24} />}
                </TouchableOpacity>
              </View>

            {showForm && (
              <View style={styles.form}>
                  <TextInput style={styles.input} placeholder="Client Name" placeholderTextColor="#666" value={formData.clientName} onChangeText={t => setFormData({...formData, clientName: t})} />
                  <TextInput style={styles.input} placeholder="Title / Project" placeholderTextColor="#666" value={formData.title} onChangeText={t => setFormData({...formData, title: t})} />
                  <TextInput style={styles.input} placeholder="Estimated Amount" keyboardType="numeric" placeholderTextColor="#666" value={formData.amount} onChangeText={t => setFormData({...formData, amount: t})} />
                  <TouchableOpacity style={styles.submitBtn} onPress={handleCreate}>
                      <Text style={styles.submitText}>Save Quotation</Text>
                  </TouchableOpacity>
              </View>
            )}

            <FlatList 
                data={quotes}
                renderItem={renderItem}
                keyExtractor={i => i.id}
                contentContainerStyle={{gap: 10}}
                ListEmptyComponent={<Text style={styles.empty}>No quotations found.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
    addBtn: { backgroundColor: '#4f46e5', padding: 10, borderRadius: 10 },
    form: { backgroundColor: '#111', padding: 15, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#333' },
    input: { backgroundColor: '#222', borderRadius: 8, padding: 12, color: '#fff', marginBottom: 10 },
    submitBtn: { backgroundColor: '#22c55e', padding: 12, borderRadius: 8, alignItems: 'center' },
    submitText: { color: '#fff', fontWeight: 'bold' },
    card: { backgroundColor: '#111', padding: 15, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
    iconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(99, 102, 241, 0.1)', alignItems: 'center', justifyContent: 'center' },
    client: { color: '#fff', fontWeight: 'bold' },
    itemTitle: { color: '#888', fontSize: 12 },
    amount: { color: '#fff', fontWeight: 'bold' },
    status: { fontSize: 10, textTransform: 'uppercase', fontWeight: 'bold' },
    empty: { color: '#666', textAlign: 'center', marginTop: 50 }
});
