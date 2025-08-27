import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainTabs from '../MainTabs';

export default function CreateScreen() {
  const [nome, setNome] = useState('');
  const [classe, setClasse] = useState('');
  const [vidaMax, setVidaMax] = useState('');
  
  const classesDisponiveis = ['Artífice', 'Bárbaro', 'Bardo', 'Bruxo', 'Clérigo', 'Druida', 'Feiticeiro', 'Guerreiro', 'Ladino', 'Mago', 'Monge', 'Paladino', 'Patrulheiro'];
  
  const salvarPersonagem = async () => {
    if (!nome || !classe || !vidaMax) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    
    try {
      const data = await AsyncStorage.getItem('personagens');
      const lista = data ? JSON.parse(data) : [];
      
      // Descobre o maior id já registrado
      const maiorId = lista.length > 0 ? Math.max(...lista.map(p => p.id)) : 0;
      
      const novoPersonagem = {
        id: maiorId + 1, // incrementa 1
        nome,
        nivel: 1,
        classes: [classe],
        subclasses: [],
        nivel_por_classe: [1],
        vida_atual: parseInt(vidaMax, 10),
        vida_maxima: parseInt(vidaMax, 10),
        vida_por_nivel: [parseInt(vidaMax, 10)],
        habilidades: [],
        magias: []
      };
      
      lista.push(novoPersonagem);
      await AsyncStorage.setItem('personagens', JSON.stringify(lista));
      
      Alert.alert('Sucesso', 'Personagem criado com sucesso!');
      setNome('');
      setClasse('');
      setVidaMax('');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar o personagem.');
    }
  };
  
  
  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.content}>
    <Text style={styles.label}>Nome do Personagem</Text>
    <TextInput
    style={styles.input}
    value={nome}
    onChangeText={setNome}
    placeholder="Digite o nome"
    placeholderTextColor="#666"
    />
    
    <Text style={styles.label}>Classe</Text>
    <View style={styles.pickerWrapper}>
    <Picker
    selectedValue={classe}
    style={styles.picker}
    onValueChange={(itemValue) => setClasse(itemValue)}
    >
    <Picker.Item label="Selecione a classe" value="" />
    {classesDisponiveis.map((c, idx) => (
      <Picker.Item key={idx} label={c} value={c} />
    ))}
    </Picker>
    </View>
    
    <Text style={styles.label}>Vida Máxima</Text>
    <TextInput
    style={styles.input}
    value={vidaMax}
    onChangeText={setVidaMax}
    placeholder="Digite a vida máxima"
    placeholderTextColor="#666"
    keyboardType="numeric"
    />
    
    <TouchableOpacity style={styles.botao} onPress={salvarPersonagem}>
    <Text style={styles.botaoTexto}>Criar Personagem</Text>
    </TouchableOpacity>
    <View>
      <Text style={styles.warning}>* Seu personagem será criado no nível 1 e será possível evoluir depois</Text>
      <Text style={styles.warning}>** A vida inserida precisa ser a vida no nível 1</Text>
    </View>
    </View>
    
    <View style={styles.footer}>
    <MainTabs />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { flex: 1, padding: 20 },
  footer: { height: 95, borderColor: '#222' },
  label: { color: 'white', marginTop: 10, marginBottom: 5 },
  input: { backgroundColor: '#222', color: 'white', padding: 10, borderRadius: 8, marginBottom: 15 },
  pickerWrapper: { backgroundColor: '#222', borderRadius: 8, marginBottom: 15 },
  picker: { color: 'white' },
  botao: { backgroundColor: '#00f0ff', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10},
  botaoTexto: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  warning: {color: 'red', fontWeight: 'bold', fontSize: 14, marginBottom: 5, textAlign: 'justify'}
});
