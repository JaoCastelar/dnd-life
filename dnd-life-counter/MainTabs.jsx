import React from 'react';
import { SafeAreaView, View, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function useNavigationMode() {
  const insets = useSafeAreaInsets();

  if (Platform.OS !== 'android') {
    return 'gestures'; // iOS sempre usa gestos
  }

  // Android: se não tiver espaço extra embaixo -> botões
  return insets.bottom === 0 ? 'buttons' : 'gestures';
}

export default function MainTabs() {
  const navigation = useNavigation();
  const mode = useNavigationMode();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#111',
          justifyContent: 'space-around',
          alignItems: 'center',
          top: '45%',
          height: 40 + (mode === 'gestures' ? 10 : 0), // dá mais espaço se for gestos
          borderTopWidth: 1,
          borderTopColor: '#333',
        }}
      >
        <TouchableOpacity
          style={{ width: '20%', alignItems: 'center' }}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="people" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ width: '20%', alignItems: 'center' }}
          onPress={() => navigation.navigate('Create')}
        >
          <Ionicons name="add-circle" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ width: '20%', alignItems: 'center' }}
          onPress={() => navigation.navigate('Spells')}
        >
          <Ionicons name="book" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
