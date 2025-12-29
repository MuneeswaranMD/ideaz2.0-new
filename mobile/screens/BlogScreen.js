
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { FileCode, Plus, Trash2, X } from 'lucide-react-native';

export default function BlogScreen() {
    const [posts, setPosts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', excerpt: '', content: '' });

    useEffect(() => {
        const q = query(collection(db, 'blog_posts'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setPosts(snap.docs.map(d => ({id:d.id, ...d.data()})));
        });
        return unsub;
    }, []);

    const handleCreate = async () => {
        if (!formData.title || !formData.content) return Alert.alert('Error', 'Missing title or content');
        try {
            await addDoc(collection(db, 'blog_posts'), {
                ...formData,
                author: 'Admin',
                createdAt: Timestamp.now(),
                readTime: '5 min read'
            });
            setShowForm(false);
            setFormData({ title: '', excerpt: '', content: '' });
            Alert.alert('Success', 'Post published');
        } catch (err) { Alert.alert('Error', err.message); }
    };

    const handleDelete = async (id) => {
        Alert.alert('Confirm', 'Delete this post?', [
             { text: 'Cancel', style: 'cancel' },
             { text: 'Delete', style: 'destructive', onPress: async () => {
                 try { await deleteDoc(doc(db, 'blog_posts', id)); } catch(e) { console.error(e); }
             }}
        ]);
    };

    const renderItem = ({item}) => (
        <View style={styles.card}>
            <View style={{flex: 1}}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.excerpt} numberOfLines={2}>{item.excerpt || 'No excerpt'}</Text>
                <View style={{flexDirection: 'row', gap: 10, marginTop: 5}}>
                    <Text style={styles.meta}>{item.author || 'Admin'}</Text>
                    <Text style={styles.meta}>•</Text>
                    <Text style={styles.meta}>{new Date(item.createdAt?.seconds * 1000).toLocaleDateString()}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Trash2 size={20} color="#ef4444" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Blog Admin</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(!showForm)}>
                     {showForm ? <X color="#fff" size={24} /> : <Plus color="#fff" size={24} />}
                </TouchableOpacity>
            </View>

            {showForm && (
                <View style={styles.form}>
                    <TextInput style={styles.input} placeholder="Post Title" placeholderTextColor="#666" value={formData.title} onChangeText={t => setFormData({...formData, title: t})} />
                    <TextInput style={styles.input} placeholder="Short Excerpt" placeholderTextColor="#666" value={formData.excerpt} onChangeText={t => setFormData({...formData, excerpt: t})} />
                    <TextInput style={[styles.input, {minHeight: 100, textAlignVertical: 'top'}]} placeholder="Content..." placeholderTextColor="#666" multiline value={formData.content} onChangeText={t => setFormData({...formData, content: t})} />
                    <TouchableOpacity style={styles.submitBtn} onPress={handleCreate}>
                        <Text style={styles.submitText}>Publish Post</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList 
                data={posts}
                renderItem={renderItem}
                keyExtractor={i => i.id}
                contentContainerStyle={{gap: 15}}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
    addBtn: { backgroundColor: '#4f46e5', padding: 10, borderRadius: 10 },
    card: { backgroundColor: '#111', padding: 20, borderRadius: 16, borderColor: '#333', borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 15 },
    cardTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
    excerpt: { color: '#888', fontSize: 14, marginBottom: 10 },
    meta: { color: '#666', fontSize: 12 },
    form: { backgroundColor: '#111', padding: 15, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#333' },
    input: { backgroundColor: '#222', borderRadius: 8, padding: 12, color: '#fff', marginBottom: 10 },
    submitBtn: { backgroundColor: '#22c55e', padding: 12, borderRadius: 8, alignItems: 'center' },
    submitText: { color: '#fff', fontWeight: 'bold' }
});
