import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import MainTabs from '../MainTabs';

export default function CreateScreen() {
  return (
    <>
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: 'space-between'}}>
                <View style={{ padding: 20 }}>
                    <Text style={{ color: 'white' }}>Criar Personagem</Text>
                </View>
            </View>
        </SafeAreaView>
        <MainTabs />
    </>
  );
}
