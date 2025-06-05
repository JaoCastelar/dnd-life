import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function MainTabs() {
  const navigation = useNavigation();

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{
          flexDirection: 'row',
          backgroundColor: '#111',
          justifyContent: 'space-around',
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: '#333'
        }}>
          <TouchableOpacity style={{width: '20%', alignItems: 'center'}} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="people" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={{width: '20%', alignItems: 'center'}} onPress={() => navigation.navigate('Create')}>
            <Ionicons name="add-circle" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={{width: '20%', alignItems: 'center'}} onPress={() => navigation.navigate('Spells')}>
            <Ionicons name="book" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}
