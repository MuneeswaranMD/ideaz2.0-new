
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { LayoutDashboard, Clock, FileText, Calendar, LogOut, User, Users, Video, Briefcase, FileCode, FileOutput } from 'lucide-react-native';

// Screens
import DashboardScreen from './screens/DashboardScreen';
import TimesheetScreen from './screens/TimesheetScreen';
import LeaveScreen from './screens/LeaveScreen';
import DocumentScreen from './screens/DocumentScreen';
import ProfileScreen from './screens/ProfileScreen';
import EmployeeScreen from './screens/EmployeeScreen';
import MeetingScreen from './screens/MeetingScreen';
import ProposalScreen from './screens/ProposalScreen';
import BlogScreen from './screens/BlogScreen';
import QuotationScreen from './screens/QuotationScreen';

const Drawer = createDrawerNavigator();

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please enter credentials');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      Alert.alert('Login Failed', err.message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.loginContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{width: '100%', padding: 20}}>
        <View style={{alignItems: 'center', marginBottom: 50}}>
           <Text style={styles.logoTitle}>Averqon</Text>
           <Text style={styles.logoSubtitle}>CRM Mobile</Text>
        </View>
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginText}>Sign In</Text>}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import { useSafeAreaInsets } from 'react-native-safe-area-context';

function CustomDrawerContent(props) {
    const insets = useSafeAreaInsets();
    return (
        <View style={{flex: 1, paddingTop: insets.top || 20, backgroundColor: '#111'}}>
            <View style={{padding: 20, borderBottomWidth: 1, borderBottomColor: '#333', marginBottom: 10}}>
                <Text style={{color: '#fff', fontSize: 24, fontWeight: '900'}}>Averqon</Text>
                <Text style={{color: '#666'}}>Mobile Workspace</Text>
            </View>
            <props.descriptors.scene.descriptor.navigation.DrawerItemList {...props} />
            <TouchableOpacity onPress={() => signOut(auth)} style={{padding: 20, flexDirection:'row', gap: 10, alignItems:'center', borderTopWidth: 1, borderTopColor:'#333', marginTop: 'auto', paddingBottom: insets.bottom + 20}}>
                <LogOut color="#ef4444" size={20} />
                <Text style={{color: '#ef4444', fontWeight: 'bold'}}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#4F46E5" /></View>;

  if (!user) return <LoginScreen />;

  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#000', borderBottomColor: '#222', borderBottomWidth: 1 },
          headerTintColor: '#fff',
          drawerStyle: { backgroundColor: '#111', width: 280 },
          drawerActiveTintColor: '#4F46E5',
          drawerInactiveTintColor: '#888',
          drawerActiveBackgroundColor: 'rgba(79, 70, 229, 0.1)',
          sceneContainerStyle: { backgroundColor: '#000' }
        }}
      >
        <Drawer.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={{ drawerIcon: ({color}) => <LayoutDashboard color={color} size={20} /> }}
        />
        <Drawer.Screen 
            name="My Profile" 
            component={ProfileScreen} 
            options={{ drawerIcon: ({color}) => <User color={color} size={20} /> }}
        />
        <Drawer.Screen 
          name="Timesheets" 
          component={TimesheetScreen} 
          options={{ drawerIcon: ({color}) => <Clock color={color} size={20} /> }}
        />
        <Drawer.Screen 
          name="Leave Management" 
          component={LeaveScreen} 
          options={{ drawerIcon: ({color}) => <Calendar color={color} size={20} /> }}
        />
        <Drawer.Screen 
          name="Invoices & Finance" 
          component={DocumentScreen} 
          options={{ drawerIcon: ({color}) => <FileText color={color} size={20} /> }}
        />
        <Drawer.Screen 
            name="Employees" 
            component={EmployeeScreen} 
            options={{ drawerIcon: ({color}) => <Users color={color} size={20} /> }}
        />
        <Drawer.Screen 
            name="Meetings" 
            component={MeetingScreen} 
            options={{ drawerIcon: ({color}) => <Video color={color} size={20} /> }}
        />
        <Drawer.Screen 
            name="Proposals" 
            component={ProposalScreen} 
            options={{ drawerIcon: ({color}) => <Briefcase color={color} size={20} /> }}
        />
        <Drawer.Screen 
            name="Quotations" 
            component={QuotationScreen} 
            options={{ drawerIcon: ({color}) => <FileOutput color={color} size={20} /> }}
        />
        <Drawer.Screen 
            name="Blog Admin" 
            component={BlogScreen} 
            options={{ drawerIcon: ({color}) => <FileCode color={color} size={20} /> }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  loginContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  logoTitle: { fontSize: 40, fontWeight: '900', color: '#fff' },
  logoSubtitle: { color: '#666', letterSpacing: 2 },
  input: { backgroundColor: '#111', width: '100%', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#333', color: '#fff', marginBottom: 15 },
  loginBtn: { backgroundColor: '#4f46e5', width: '100%', padding: 16, borderRadius: 12, alignItems: 'center' },
  loginText: { color: '#fff', fontWeight: 'bold' }
});
