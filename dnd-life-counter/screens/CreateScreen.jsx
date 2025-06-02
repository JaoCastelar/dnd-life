import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';
import MainTabs from '../MainTabs';

export default function CreateScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={{ color: 'white' }}>Criar Personagem</Text>
      </View>

      <View style={styles.footer}>
        <MainTabs />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // cor de fundo opcional
  },
  content: {
    flex: 1,
    padding: 20,
  },
  footer: {
    height: 95,
    borderColor: '#222',
  },
});
