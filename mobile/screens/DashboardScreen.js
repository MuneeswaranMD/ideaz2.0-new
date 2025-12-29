
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, onSnapshot, query, limit, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Users, Briefcase, FileText, MessageSquare, DollarSign } from 'lucide-react-native';

export default function DashboardScreen() {
  const [stats, setStats] = useState({
    enquiries: 0,
    hiring: 0,
    proposals: 0,
    testimonials: 0,
    revenue: 0
  });

  useEffect(() => {
    // Basic stats listeners - mirroring web dashboard
    const subs = [
      onSnapshot(collection(db, 'enquiries'), s => setStats(p => ({ ...p, enquiries: s.size }))),
      onSnapshot(collection(db, 'applications'), s => setStats(p => ({ ...p, hiring: s.size }))),
      onSnapshot(collection(db, 'proposals'), s => setStats(p => ({ ...p, proposals: s.size }))),
      onSnapshot(collection(db, 'testimonials'), s => setStats(p => ({ ...p, testimonials: s.size }))),
      onSnapshot(collection(db, 'invoices'), s => {
        const total = s.docs.reduce((acc, doc) => {
            const d = doc.data();
            if (d.status === 'Paid') {
                 const v = parseInt((d.amount || "0").replace(/[^0-9]/g, ''), 10) || 0;
                 return acc + v;
            }
            return acc;
        }, 0);
        setStats(p => ({...p, revenue: total}));
      })
    ];
    return () => subs.forEach(u => u());
  }, []);

  const StatCard = ({ label, value, icon: Icon, color, bg }) => (
    <View style={[styles.card, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <View style={[styles.iconBox, { backgroundColor: bg }]}>
        <Icon size={24} color={color} />
      </View>
      <View>
        <Text style={styles.cardLabel}>{label}</Text>
        <Text style={styles.cardValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Command Center</Text>
      <Text style={styles.headerSubtitle}>Overview of operations.</Text>

      <View style={styles.grid}>
        <StatCard label="Enquiries" value={stats.enquiries} icon={Users} color="#3b82f6" bg="rgba(59, 130, 246, 0.1)" />
        <StatCard label="Recruitment" value={stats.hiring} icon={Briefcase} color="#a855f7" bg="rgba(168, 85, 247, 0.1)" />
        <StatCard label="Proposals" value={stats.proposals} icon={FileText} color="#6366f1" bg="rgba(99, 102, 241, 0.1)" />
        <StatCard label="Testimonials" value={stats.testimonials} icon={MessageSquare} color="#f59e0b" bg="rgba(245, 158, 11, 0.1)" />
        <StatCard label="Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={DollarSign} color="#10b981" bg="rgba(16, 185, 129, 0.1)" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  grid: {
    gap: 15,
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 10,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  }
});
