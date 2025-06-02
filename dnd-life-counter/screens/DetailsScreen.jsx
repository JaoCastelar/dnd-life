import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainTabs from '../MainTabs';

export default function DetailsScreen({ route }) {
  const { personagem } = route.params;
  const [vidaAtual, setVidaAtual] = useState(personagem.vida_atual);
  
  const alterarVida = async (valor) => {
    const novaVida = Math.max(0, Math.min(personagem.vida_maxima, vidaAtual + valor));
    setVidaAtual(novaVida);

    try {
      const json = await AsyncStorage.getItem('personagens');
      const lista = json ? JSON.parse(json) : [];

      const atualizados = lista.map(p =>
        p.id === personagem.id ? { ...p, vida_atual: novaVida } : p
      );

      await AsyncStorage.setItem('personagens', JSON.stringify(atualizados));
    } catch (err) {
      Alert.alert('Erro', 'Falha ao salvar a vida.');
    }
  };

  if (!personagem) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Nenhum personagem recebido.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 100 }]}>
          <Text style={styles.title}>{personagem.nome}</Text>
          <Text style={styles.text}>Nível: {personagem.nivel}</Text>
          <Text style={styles.text}>Classe(s): {personagem.classes?.join(', ')}</Text>
          <Text style={styles.text}>Subclasse(s): {personagem.subclasses?.join(', ')}</Text>
          
          <View style={styles.vidaContainer}>
            <Text style={styles.vidaTexto}>Vida: {vidaAtual}/{personagem.vida_maxima}</Text>
            <View style={styles.botoesLinha}>
              {[1, 5, 10, 50].map(v => (
                <TouchableOpacity key={`+${v}`} style={styles.botao} onPress={() => alterarVida(v)}>
                  <Text style={styles.botaoTexto}>+{v}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.botoesLinha}>
              {[-1, -5, -10, -50].map(v => (
                <TouchableOpacity key={`${v}`} style={styles.botao} onPress={() => alterarVida(v)}>
                  <Text style={styles.botaoTexto}>{v}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text style={[styles.text, styles.subtitle]}>Habilidades:</Text>
          {personagem.habilidades?.map((hab, idx) => (
            <View key={idx} style={styles.habilidade}>
              <Text style={styles.habilidadeTitulo}>{hab.nome}</Text>
              <Text style={styles.habilidadeTag}>{hab.classe} - {hab.nivel}</Text>
              <Text style={styles.text}>{hab.descricao}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Menu fixo no final da tela */}
      <View style={{ height: 95 }}>
        <MainTabs />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    marginBottom: 5,
  },
  vidaContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  vidaTexto: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  botoesLinha: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 10,
  },
  botao: {
    backgroundColor: '#444',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  botaoTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  habilidade: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingBottom: 10,
  },
  habilidadeTitulo: {
    color: '#00f0ff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  habilidadeTag: {
    backgroundColor: '#3d3d3d',
    color: 'white',
    fontSize: 10,
    maxWidth: '25%',
    margin: 2,
    borderRadius: 10,
    textAlign: 'center'
  },
});
