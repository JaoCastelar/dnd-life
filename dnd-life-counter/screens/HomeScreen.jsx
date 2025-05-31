import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Button } from 'react-native';
import MainTabs from '../MainTabs';

export default function HomeScreen({ navigation }) {
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View style={{ padding: 20 }}>
            <Text style={{ color: 'white' }}>Tela Inicial</Text>
            <Button title="Ir para Detalhes" onPress={() => navigation.navigate('Details')} />
          </View>
        </View>
      </SafeAreaView>
      <MainTabs />
    </>
  );
}
