
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { collection, query, orderBy, limit, onSnapshot, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { FileText, DollarSign, Plus, X, Trash2 } from 'lucide-react-native';

export default function DocumentScreen() {
  const [docs, setDocs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ clientName: '', amount: '', date: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    const q = query(collection(db, 'invoices'), orderBy('timestamp', 'desc'), limit(50));
    const unsub = onSnapshot(q, (snap) => {
        setDocs(snap.docs.map(d => ({id:d.id, ...d.data()})));
    });
    return unsub;
  }, []);

  const handleCreate = async () => {
      if (!formData.clientName || !formData.amount) return Alert.alert('Error', 'Missing details');
      try {
          // Generate a random invoice number for demo
          const invNum = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
          await addDoc(collection(db, 'invoices'), {
              clientName: formData.clientName,
              amount: `₹${formData.amount}`,
              invoiceNumber: invNum,
              status: 'Pending',
              timestamp: Timestamp.now(),
              items: [{desc: 'Service Charge', price: formData.amount}]
          });
          setShowForm(false);
          setFormData({ clientName: '', amount: '', date: new Date().toISOString().split('T')[0] });
          Alert.alert('Success', 'Invoice Generated');
      } catch (e) { Alert.alert('Error', e.message); }
  };

  const handleDelete = async (id) => {
      Alert.alert('Confirm', 'Delete this invoice?', [
          { text: 'Cancel', style: 'cancel'},
          { text: 'Delete', style: 'destructive', onPress: async () => {
              try { await deleteDoc(doc(db, 'invoices', id)); } catch(e) { console.error(e); }
          }}
      ]);
  };

  const renderItem = ({item}) => (
    <View style={styles.item}>
        <View style={styles.row}>
            <View style={[styles.iconBox, {backgroundColor: item.status === 'Paid' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)'}]}>
                <DollarSign size={20} color={item.status === 'Paid' ? '#22c55e' : '#eab308'} />
            </View>
            <View style={{flex: 1}}>
                <Text style={styles.title}>{item.clientName || 'Unknown Client'}</Text>
                <Text style={styles.subtitle}>{item.invoiceNumber || 'INV-0000'}</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
                <Text style={styles.amount}>{item.amount}</Text>
                <Text style={[styles.status, {color: item.status === 'Paid' ? '#22c55e' : '#eab308'}]}>{item.status}</Text>
            </View>
            <TouchableOpacity hitSlop={10} onPress={() => handleDelete(item.id)} style={{marginLeft: 10}}>
                <Trash2 size={20} color="#ef4444" />
            </TouchableOpacity>
        </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finance & Docs</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(!showForm)}>
            {showForm ? <X color="#fff" size={24} /> : <Plus color="#fff" size={24} />}
        </TouchableOpacity>
      </View>

      {showForm && (
          <View style={styles.form}>
              <TextInput style={styles.input} placeholder="Client Name" placeholderTextColor="#666" value={formData.clientName} onChangeText={t => setFormData({...formData, clientName: t})} />
              <TextInput style={styles.input} placeholder="Amount (INR)" keyboardType="numeric" placeholderTextColor="#666" value={formData.amount} onChangeText={t => setFormData({...formData, amount: t})} />
              <TouchableOpacity style={styles.submitBtn} onPress={handleCreate}>
                  <Text style={styles.submitText}>Generate Invoice</Text>
              </TouchableOpacity>
          </View>
      )}

      <FlatList 
        data={docs}
        renderItem={renderItem}
        keyExtractor={i => i.id}
        contentContainerStyle={{gap: 10}}
        ListEmptyComponent={<Text style={{color:'#666', textAlign:'center', marginTop: 50}}>No documents found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#fff' },
  addBtn: { backgroundColor: '#4f46e5', padding: 10, borderRadius: 10 },
  form: { backgroundColor: '#111', padding: 15, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#333' },
  input: { backgroundColor: '#222', borderRadius: 8, padding: 12, color: '#fff', marginBottom: 10 },
  submitBtn: { backgroundColor: '#22c55e', padding: 12, borderRadius: 8, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: 'bold' },
  item: { backgroundColor: '#111', padding: 15, borderRadius: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBox: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', fontWeight: 'bold' },
  subtitle: { color: '#666', fontSize: 12 },
  amount: { color: '#fff', fontWeight: 'bold' },
  status: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' }
});
