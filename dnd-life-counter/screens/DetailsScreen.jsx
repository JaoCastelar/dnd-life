import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainTabs from '../MainTabs';
import SpellModal from './SpellModal'; 

export default function DetailsScreen({ route }) {
  const personagem = route.params.personagem;
  
  const [personagemAtual, setPersonagemAtual] = useState(personagem);
  const [vidaAtual, setVidaAtual] = useState(personagem.vida_atual);
  const [abaSelecionada, setAbaSelecionada] = useState('Habilidades');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [magiaSelecionada, setMagiaSelecionada] = useState(null);
  
  useEffect(() => {
    setVidaAtual(personagemAtual.vida_atual);
  }, [personagemAtual]);
  
  const alterarVida = async (valor) => {
    const novaVida = Math.max(0, Math.min(personagemAtual.vida_maxima, vidaAtual + valor));
    setVidaAtual(novaVida);
    
    try {
      const json = await AsyncStorage.getItem('personagens');
      const lista = json ? JSON.parse(json) : [];
      
      const atualizados = lista.map(p =>
        p.id === personagemAtual.id ? { ...p, vida_atual: novaVida } : p
      );
      
      await AsyncStorage.setItem('personagens', JSON.stringify(atualizados));
      
      setPersonagemAtual(prev => ({ ...prev, vida_atual: novaVida }));
    } catch (err) {
      Alert.alert('Erro', 'Falha ao salvar a vida.');
    }
  };
  
  if (!personagemAtual) {
    return (
      <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Nenhum personagem recebido.</Text>
      </SafeAreaView>
    );
  }
  
  const renderConteudoAba = () => {
    switch (abaSelecionada) {
      case 'Habilidades':
      return personagemAtual.habilidades?.map((hab, idx) => (
        <View key={idx} style={styles.habilidade}>
        <Text style={styles.habilidadeTitulo}>{hab.nome}</Text>
        <Text style={styles.habilidadeTag}>{hab.classe} - {hab.nivel}</Text>
        <Text style={styles.text}>{hab.descricao}</Text>
        </View>
      ));
      case 'Magias':
      return personagemAtual.magias?.map((mag, idx) => (
        <TouchableOpacity
        key={idx}
        style={styles.habilidade}
        onPress={() => {
          setMagiaSelecionada(mag);
          setModalVisivel(true);
        }}
        >
        <Text style={styles.habilidadeTitulo}>{mag.nome}</Text>
        <Text style={styles.habilidadeTag}>{mag.classes?.join(', ')} - {mag.nivel}</Text>
        </TouchableOpacity>
      ));
      case 'Mochila':
      return <Text style={styles.text}>Mochila vazia.</Text>;
      default:
      return null;
    }
  };
  
  const carregarPersonagem = async () => {
    try {
      const data = await AsyncStorage.getItem('personagens');
      const lista = data ? JSON.parse(data) : [];
      const p = lista.find(p => p.id === personagem.id);
      if (p) { 
        setPersonagemAtual(p);
      }
    } catch (error) {
      console.error('Erro ao carregar personagem:', error);
    }
  };
  
  const atualizarPersonagem = async () => {
    await carregarPersonagem();
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
    <View style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 100 }]}>
    <Text style={styles.title}>{personagemAtual.nome}</Text>
    <Text style={styles.text}>Nível de Personagem: {personagemAtual.nivel}</Text>
    <Text style={styles.text}>Classe(s): {personagemAtual.classes?.map((classe, idx) => `${classe} - ${personagemAtual.nivel_por_classe?.[idx] || 0}`).join(', ')}</Text>
    <Text style={styles.text}>Subclasse(s): {personagemAtual.subclasses?.join(', ')}</Text>
    
    <View style={styles.vidaContainer}>
    <Text style={styles.vidaTexto}>Vida: {vidaAtual}/{personagemAtual.vida_maxima}</Text>
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
    
    <View style={styles.abasContainer}>
    {['Habilidades', 'Magias', 'Mochila'].map((aba) => (
      <TouchableOpacity
      key={aba}
      style={[
        styles.abaBotao,
        abaSelecionada === aba && styles.abaSelecionada
      ]}
      onPress={() => setAbaSelecionada(aba)}
      >
      <Text style={styles.abaTexto}>{aba}</Text>
      </TouchableOpacity>
    ))}
    </View>
    
    {renderConteudoAba()}
    </ScrollView>
    </View>
    
    <View style={{ height: 95 }}>
    <MainTabs />
    </View>
    
    <SpellModal
    visible={modalVisivel}
    spell={magiaSelecionada}
    onClose={() => setModalVisivel(false)}
    contexto="detalhes"
    personagem={personagemAtual}
    onUpdate={atualizarPersonagem}
    />
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
    textAlign: 'center',
  },
  abasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  abaBotao: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#222',
    borderRadius: 10,
  },
  abaSelecionada: {
    backgroundColor: '#00f0ff',
  },
  abaTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
});
