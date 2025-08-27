import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
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
  
  // Modal subir nível
  const [modalNivelVisivel, setModalNivelVisivel] = useState(false);
  const [classeEscolhida, setClasseEscolhida] = useState(personagem.classes?.[0] || '');
  const [novaVidaMax, setNovaVidaMax] = useState('');
  
  const [modalDiminuirClasseVisivel, setModalDiminuirClasseVisivel] = useState(false);
  const [classeDiminuir, setClasseDiminuir] = useState('');
  
  const classesDisponiveis = [
    'Artífice', 'Bárbaro', 'Bardo', 'Bruxo', 'Clérigo',
    'Druida', 'Feiticeiro', 'Guerreiro', 'Ladino', 'Mago',
    'Monge', 'Paladino', 'Patrulheiro'
  ];
  
  useEffect(() => {
    setVidaAtual(personagemAtual.vida_atual);
  }, [personagemAtual]);
  
  const carregarPersonagem = async () => {
    try {
      const data = await AsyncStorage.getItem('personagens');
      const lista = data ? JSON.parse(data) : [];
      const p = lista.find(p => p.id === personagem.id);
      if (p) setPersonagemAtual(p);
    } catch (error) {
      console.error('Erro ao carregar personagem:', error);
    }
  };
  
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
  
  const abrirModalNivel = () => {
    setClasseEscolhida(personagem.classes?.[0] || '');
    setNovaVidaMax('');
    setModalNivelVisivel(true);
  };
  
  const salvarNivel = async () => {
    if (!classeEscolhida || !novaVidaMax) {
      Alert.alert('Erro', 'Preencha a classe e a vida a ser adicionada.');
      return;
    }
    
    const vidaAdicional = parseInt(novaVidaMax);
    if (isNaN(vidaAdicional) || vidaAdicional <= 0) {
      Alert.alert('Erro', 'Valor de vida inválido.');
      return;
    }
    
    try {
      const json = await AsyncStorage.getItem('personagens');
      const lista = json ? JSON.parse(json) : [];
      
      const atualizados = lista.map(p => {
        if (p.id === personagemAtual.id) {
          let classes = [...(p.classes || [])];
          let nivel_por_classe = [...(p.nivel_por_classe || [])];
          
          const idx = classes.indexOf(classeEscolhida);
          if (idx >= 0) {
            nivel_por_classe[idx] = (nivel_por_classe[idx] || 0) + 1;
          } else {
            classes.push(classeEscolhida);
            nivel_por_classe.push(1);
          }
          
          const vida_por_nivel = [...(p.vida_por_nivel || []), vidaAdicional];
          const novaVidaMax = vida_por_nivel.reduce((acc, v) => acc + v, 0);
          const novaVidaAtual = p.vida_atual + vidaAdicional; // adiciona à vida atual
          
          return {
            ...p,
            nivel: (p.nivel || 0) + 1,
            classes,
            nivel_por_classe,
            vida_por_nivel,
            vida_maxima: novaVidaMax,
            vida_atual: novaVidaAtual,
          };
        }
        return p;
      });
      
      await AsyncStorage.setItem('personagens', JSON.stringify(atualizados));
      await carregarPersonagem();
      setModalNivelVisivel(false);
    } catch (err) {
      Alert.alert('Erro', 'Falha ao atualizar nível.');
    }
  };
  
  
  const descerNivel = async () => {
    if (personagemAtual.nivel <= 1) return;
    
    if ((personagemAtual.classes?.length || 0) <= 1) {
      // Apenas uma classe: decrementa normalmente
      await descerNivelClasse(personagemAtual.classes[0]);
    } else {
      // Mais de uma classe: abrir modal para escolher qual classe diminuir
      setClasseDiminuir(personagemAtual.classes[0]);
      setModalDiminuirClasseVisivel(true);
    }
  };
  
  
  const descerNivelClasse = async (classe) => {
    try {
      const json = await AsyncStorage.getItem('personagens');
      const lista = json ? JSON.parse(json) : [];
      
      const atualizados = lista.map(p => {
        if (p.id === personagemAtual.id) {
          let classes = [...(p.classes || [])];
          let nivel_por_classe = [...(p.nivel_por_classe || [])];
          let vida_por_nivel = [...(p.vida_por_nivel || [])];
          
          const idxClasse = classes.indexOf(classe);
          if (idxClasse >= 0) {
            let nivelClasse = nivel_por_classe[idxClasse];
            
            if (nivelClasse > 1) {
              nivel_por_classe[idxClasse] -= 1;
            } else {
              classes.splice(idxClasse, 1);
              nivel_por_classe.splice(idxClasse, 1);
            }
            
            // Remove a última vida adicionada
            vida_por_nivel.pop();
          }
          
          const novaVidaMax = vida_por_nivel.reduce((acc, v) => acc + v, 0);
          const novaVidaAtual = Math.min(p.vida_atual, novaVidaMax);
          
          return {
            ...p,
            nivel: (p.nivel || 1) - 1,
            classes,
            nivel_por_classe,
            vida_por_nivel,
            vida_maxima: novaVidaMax,
            vida_atual: novaVidaAtual,
          };
        }
        return p;
      });
      
      await AsyncStorage.setItem('personagens', JSON.stringify(atualizados));
      await carregarPersonagem();
      setModalDiminuirClasseVisivel(false);
    } catch (err) {
      Alert.alert('Erro', 'Falha ao descer nível.');
    }
  };
  
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
  
  if (!personagemAtual) {
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
    <Text style={styles.title}>{personagemAtual.nome}</Text>
    <Text style={styles.text}>Nível de Personagem: {personagemAtual.nivel}</Text>
    <Text style={styles.text}>Classe(s): {personagemAtual.classes?.map((classe, idx) => `${classe} - ${personagemAtual.nivel_por_classe?.[idx] || 0}`).join(', ')}</Text>
    <Text style={styles.text}>Subclasse(s): {personagemAtual.subclasses?.join(', ')}</Text>
    
    <View style={styles.vidaContainer}>
    <Text style={styles.vidaTexto}>Vida: {vidaAtual}/{personagemAtual.vida_maxima}</Text>
    <View style={styles.botoesLinha}>
    {[1,5,10,50].map(v => (
      <TouchableOpacity key={`+${v}`} style={styles.botao} onPress={() => alterarVida(v)}>
      <Text style={styles.botaoTexto}>+{v}</Text>
      </TouchableOpacity>
    ))}
    </View>
    <View style={styles.botoesLinha}>
    {[-1,-5,-10,-50].map(v => (
      <TouchableOpacity key={`${v}`} style={styles.botao} onPress={() => alterarVida(v)}>
      <Text style={styles.botaoTexto}>{v}</Text>
      </TouchableOpacity>
    ))}
    </View>
    </View>
    
    <View style={styles.nivelBotoes}>
    <TouchableOpacity style={[styles.nivelBtn, { backgroundColor: '#922' }]} onPress={descerNivel}>
    <Text style={styles.nivelTexto}>- Nível</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.nivelBtn} onPress={abrirModalNivel}>
    <Text style={styles.nivelTexto}>+ Nível</Text>
    </TouchableOpacity>
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
    onUpdate={carregarPersonagem}
    />
    
    {/* Modal Subir Nível */}
    <Modal
    visible={modalNivelVisivel}
    transparent
    animationType="slide"
    >
    <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
    <Text style={styles.modalTitle}>Subir Nível</Text>
    
    <Text style={styles.text}>Escolha a classe:</Text>
    <Picker
    selectedValue={classeEscolhida}
    onValueChange={setClasseEscolhida}
    style={{ color: 'white' }}
    >
    {classesDisponiveis.map((c, idx) => (
      <Picker.Item label={c} value={c} key={idx} />
    ))}
    </Picker>
    
    <Text style={styles.text}>Vida ganha:</Text>
    <TextInput
    style={styles.input}
    placeholder='Vida ganha no novo nível'
    placeholderTextColor="#888"
    keyboardType="numeric"
    value={novaVidaMax}
    onChangeText={setNovaVidaMax}
    />
    
    <View style={styles.modalBotoes}>
    <TouchableOpacity style={styles.nivelBtn} onPress={salvarNivel}>
    <Text style={styles.nivelTexto}>Salvar</Text>
    </TouchableOpacity>
    <TouchableOpacity style={[styles.nivelBtn, { backgroundColor: '#922' }]} onPress={() => setModalNivelVisivel(false)}>
    <Text style={styles.nivelTexto}>Cancelar</Text>
    </TouchableOpacity>
    </View>
    </View>
    </View>
    </Modal>
    {/* Modal Diminuir Nível */}
    <Modal
    visible={modalDiminuirClasseVisivel}
    transparent
    animationType="slide"
    >
    <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
    <Text style={styles.modalTitle}>Escolha a classe para diminuir nível</Text>
    
    <Picker
    selectedValue={classeDiminuir}
    onValueChange={setClasseDiminuir}
    style={{ color: 'white' }}
    >
    {personagemAtual.classes?.map((c, idx) => (
      <Picker.Item label={c} value={c} key={idx} />
    ))}
    </Picker>

    <Text style={styles.warning}>* Ao diminuir o nível sua vida máxima será diminuida no valor ganho ao receber aquele nível</Text>
    
    <View style={styles.modalBotoes}>
    <TouchableOpacity style={styles.nivelBtn} onPress={() => descerNivelClasse(classeDiminuir)}>
    <Text style={styles.nivelTexto}>Confirmar</Text>
    </TouchableOpacity>
    <TouchableOpacity style={[styles.nivelBtn, { backgroundColor: '#922' }]} onPress={() => setModalDiminuirClasseVisivel(false)}>
    <Text style={styles.nivelTexto}>Cancelar</Text>
    </TouchableOpacity>
    </View>
    </View>
    </View>
    </Modal>
    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 10, textAlign: 'center' },
  text: { color: 'white', marginBottom: 5 },
  vidaContainer: { marginVertical: 20, alignItems: 'center' },
  vidaTexto: { fontSize: 18, color: 'white', marginBottom: 10 },
  botoesLinha: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 10, }, botao: { backgroundColor: '#444', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12, marginHorizontal: 5, }, botaoTexto: { color: 'white', fontWeight: 'bold', fontSize: 16, },
  habilidade: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#444', paddingBottom: 10 },
  habilidadeTitulo: { color: '#00f0ff', fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
  habilidadeTag: { backgroundColor: '#3d3d3d', color: 'white', fontSize: 10, maxWidth: '25%', margin: 2, borderRadius: 10, textAlign: 'center' },
  abasContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  abaBotao: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#222', borderRadius: 10 },
  abaSelecionada: { backgroundColor: '#00f0ff' },
  abaTexto: { color: 'white', fontWeight: 'bold' },
  nivelBotoes: { flexDirection: 'row', justifyContent: 'center', gap: 15, marginVertical: 10 },
  nivelBtn: { backgroundColor: '#2a2', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 },
  nivelTexto: { color: 'white', fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalContent: { backgroundColor: '#111', padding: 20, borderRadius: 10, width: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 15, textAlign: 'center' },
  modalBotoes: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  input: { backgroundColor: '#222', color: 'white', padding: 8, borderRadius: 8, marginTop: 5 },
  warning: {color: 'red', fontWeight: 'bold', fontSize: 14, marginBottom: 5, textAlign: 'justify'}
});
