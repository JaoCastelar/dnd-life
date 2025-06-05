import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, FlatList, RefreshControl, Button, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainTabs from '../MainTabs';
import { seedPersonagens, clearPersonagens } from '../utils/seedAsyncStorage';

import rawData from '../data/char.json';

export default function HomeScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  
  const loadData = async () => {
    try {
      const json = await AsyncStorage.getItem('personagens');
      if (json !== null) {
        setData(JSON.parse(json));
      } else {
        await AsyncStorage.setItem('personagens', JSON.stringify(rawData));
        setData(rawData);
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData().then(() => setRefreshing(false));
  }, []);
  
  const renderItem = ({ item: personagem }) => (
    <TouchableOpacity
    onPress={() => navigation.navigate('Details', { personagem })}
    style={{
      backgroundColor: '#333',
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
    }}
    >
    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>{personagem.nome}</Text>
    <Text style={{ color: 'white' }}>Nível de Personagem: {personagem.nivel}</Text>
    <Text style={{ color: 'white' }}>Classe: {personagem.classes?.map((classe, idx) => `${classe} - ${personagem.nivel_por_classe?.[idx] || 0}`).join(', ')}</Text>
    <Text style={{ color: 'white' }}>Vida: {personagem.vida_atual}/{personagem.vida_maxima}</Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
    <View style={{ flex: 1 }}>
    <FlatList
    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
    data={data}
    keyExtractor={(item) => item.id.toString()}
    renderItem={renderItem}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
    }
    />
    {/* <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
    <Button title="🔁 Inserir personagens (seed)" onPress={seedPersonagens} />
    <Button title="🗑️ Limpar personagens" onPress={clearPersonagens} color="red" />
    </View> */}
    </View>
    
    <View style={{ height: 95}}>
    <MainTabs />
    </View>
    </SafeAreaView>
  );
}
