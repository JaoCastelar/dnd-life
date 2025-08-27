import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, FlatList, RefreshControl, Modal, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainTabs from '../MainTabs';
import { Ionicons } from '@expo/vector-icons'; // Ícones de lixeira
import rawData from '../data/char.json';

export default function HomeScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [personagemParaExcluir, setPersonagemParaExcluir] = useState(null);
  
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
  
  const confirmarExclusao = async () => {
    try {
      const json = await AsyncStorage.getItem('personagens');
      let lista = json ? JSON.parse(json) : [];
      lista = lista.filter(p => p.id !== personagemParaExcluir.id);
      await AsyncStorage.setItem('personagens', JSON.stringify(lista));
      setModalVisible(false);
      setPersonagemParaExcluir(null);
      loadData(); // recarrega lista
    } catch (err) {
      console.error('Erro ao excluir personagem:', err);
    }
  };
  
  const renderItem = ({ item: personagem }) => (
    <View
    style={{
      backgroundColor: '#333',
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
    }}
    >
    <TouchableOpacity
    onPress={() => navigation.navigate('Details', { personagem })}
    style={{ flex: 1 }}
    >
    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>{personagem.nome}</Text>
    <Text style={{ color: 'white' }}>Nível de Personagem: {personagem.nivel}</Text>
    <Text style={{ color: 'white' }}>
    Classe: {personagem.classes?.map((classe, idx) => `${classe} - ${personagem.nivel_por_classe?.[idx] || 0}`).join(', ')}
    </Text>
    <Text style={{ color: 'white' }}>Vida: {personagem.vida_atual}/{personagem.vida_maxima}</Text>
    </TouchableOpacity>
    
    <TouchableOpacity
    style={{ position: 'absolute', right: 10, top: 10 }}
    onPress={() => {
      setPersonagemParaExcluir(personagem);
      setModalVisible(true);
    }}
    >
    <Ionicons name="trash" size={24} color="red" />
    </TouchableOpacity>
    </View>
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
    </View>
    
    {/* Modal de confirmação */}
    <Modal
    visible={modalVisible}
    transparent
    animationType="fade"
    onRequestClose={() => setModalVisible(false)}
    >
    <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
    <Text style={{ color: 'white', fontSize: 16, marginBottom: 20 }}>
    Tem certeza que deseja excluir "{personagemParaExcluir?.nome}"?
    </Text>
    <View style={styles.modalButtons}>
    <TouchableOpacity
    style={[styles.botao, { backgroundColor: '#555' }]}
    onPress={() => setModalVisible(false)}
    >
    <Text style={styles.botaoTexto}>Cancelar</Text>
    </TouchableOpacity>
    <TouchableOpacity
    style={[styles.botao, { backgroundColor: 'red' }]}
    onPress={confirmarExclusao}
    >
    <Text style={styles.botaoTexto}>Excluir</Text>
    </TouchableOpacity>
    </View>
    </View>
    </View>
    </Modal>
    
    <View style={{ height: 95 }}>
    <MainTabs />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    maxWidth: 300,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botao: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  botaoTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
});
