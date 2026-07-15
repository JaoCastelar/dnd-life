import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from "expo-checkbox";
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import MainTabs from '../MainTabs';
import SpellModal from './SpellModal';
import MochilaTab from './MochilaTab';
import HabilidadeModal from './HabilidadeModal';
import habilidadesJson from '../data/habilidades.json';

export default function DetailsScreen({ route }) {
  const personagem = route.params.personagem;
  
  const [personagemAtual, setPersonagemAtual] = useState(personagem);
  const [vidaAtual, setVidaAtual] = useState(personagem.vida_atual);
  const [abaSelecionada, setAbaSelecionada] = useState('Info');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [magiaSelecionada, setMagiaSelecionada] = useState(null);
  const [modalDownloadVisivel, setModalDownloadVisivel] = useState(false);
  
  const [modalNivelVisivel, setModalNivelVisivel] = useState(false);
  const [classeEscolhida, setClasseEscolhida] = useState(personagem.classes?.[0] || '');
  const [novaVidaMax, setNovaVidaMax] = useState('');
  
  const [modalDiminuirClasseVisivel, setModalDiminuirClasseVisivel] = useState(false);
  const [classeDiminuir, setClasseDiminuir] = useState('');

  const [modalEditarNome, setModalEditarNome] = useState(false);
  const [nomeEditado, setNomeEditado] = useState(personagemAtual.nome);

  const [modalAdicionarHab, setModalAdicionarHab] = useState(false);
  const [habilidadesJSON, setHabilidadesJSON] = useState([]);
  const [abaModalHab, setAbaModalHab] = useState('Classe');

  const [modalHabilidadeVisivel, setModalHabilidadeVisivel] = useState(false);
const [habilidadeSelecionada, setHabilidadeSelecionada] = useState(null);

const [expandClasses, setExpandClasses] = useState({});
  const [expandHabilidades, setExpandHabilidades] = useState({});


  const classesDisponiveis = [
    'Artífice', 'Bárbaro', 'Bardo', 'Bruxo', 'Clérigo',
    'Druida', 'Feiticeiro', 'Guerreiro', 'Ladino', 'Mago',
    'Monge', 'Paladino', 'Patrulheiro'
  ];

  const atributos = ['Força', 'Destreza', 'Constituição', 'Inteligência', 'Sabedoria', 'Carisma'];
  const salvaguardas = ['Força', 'Destreza', 'Constituição', 'Inteligência', 'Sabedoria', 'Carisma'];
  const pericias = [
    'Atletismo', 'Acrobacia',  'Furtividade', 'Prestidigitação',
    'Arcanismo',  'História', 'Investigação', 'Natureza', 'Religião',
    'Intuição',  'Medicina',  'Percepção',  'Sobrevivência',
    'Lidar com Animais',  'Atuação',  'Enganação',  'Intimidação',
    'Persuasão'
  ];
  
  useEffect(() => {
  // Carrega o personagem
  setVidaAtual(personagemAtual.vida_atual);

  // Inicializa habilidades no AsyncStorage caso não existam
  const inicializarHabilidades = async () => {
    try {
      const jaTem = await AsyncStorage.getItem('habilidades');
      if (!jaTem) {
        // Salva do JSON para AsyncStorage
        await AsyncStorage.setItem('habilidades', JSON.stringify(habilidadesJson));
        console.log('Habilidades carregadas no AsyncStorage.');
      }
    } catch (err) {
      console.error('Erro ao inicializar habilidades:', err);
    }
  };

  inicializarHabilidades();

  // Carrega habilidades do AsyncStorage para estado
  const carregarHabilidades = async () => {
    try {
      const json = await AsyncStorage.getItem('habilidades');
      const lista = json ? JSON.parse(json) : [];
      setHabilidadesJSON(lista);
    } catch (err) {
      console.error('Erro ao carregar habilidades do AsyncStorage:', err);
    }
  };

  carregarHabilidades();
}, []);

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

  const baixarPersonagem = async () => {
    try {
      const jsonString = JSON.stringify(personagemAtual, null, 2);
      const fileName = `${personagemAtual.nome.replace(/\s/g, '_')}.json`;
      const fileUri = FileSystem.documentDirectory + fileName;
      
      await FileSystem.writeAsStringAsync(fileUri, jsonString, { encoding: FileSystem.EncodingType.UTF8 });
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Compartilhar personagem',
        UTI: 'public.json',
      });
    } catch (err) {
      Alert.alert('Erro', 'Falha ao exportar o personagem.');
      console.error(err);
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

  const salvarNome = async () => {
    const novoNome = nomeEditado.trim();
    if (novoNome.length === 0) {
      Alert.alert("Erro", "O nome não pode ficar vazio.");
      return;
    }
    try {
      const json = await AsyncStorage.getItem("personagens");
      const lista = json ? JSON.parse(json) : [];
      const atualizados = lista.map(p =>
        p.id === personagemAtual.id ? { ...p, nome: novoNome } : p
      );
      await AsyncStorage.setItem("personagens", JSON.stringify(atualizados));
      setPersonagemAtual(prev => ({ ...prev, nome: novoNome }));
      setModalEditarNome(false);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível salvar o nome.");
      console.error(err);
    }
  };

  const adicionarHabilidade = async (hab) => {
  try {
    const json = await AsyncStorage.getItem('personagens');
    const lista = json ? JSON.parse(json) : [];

    const atualizados = lista.map(p =>
      p.id === personagemAtual.id
        ? { 
            ...p, 
            habilidades: [...(p.habilidades || []), hab] 
          }
        : p
    );

    await AsyncStorage.setItem('personagens', JSON.stringify(atualizados));
    setPersonagemAtual(prev => ({
      ...prev,
      habilidades: [...(prev.habilidades || []), hab]
    }));

    setModalAdicionarHab(false);
  } catch (err) {
    console.error("Erro ao adicionar habilidade:", err);
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
          const novaVidaAtual = p.vida_atual + vidaAdicional;
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
      await descerNivelClasse(personagemAtual.classes[0]);
    } else {
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

  const atualizarAtributo = async (index, valorDigitado) => {
    if (valorDigitado === "") {
      const novosAtributos = [...personagemAtual.atributos];
      novosAtributos[index] = ""; 
      setPersonagemAtual(prev => ({ ...prev, atributos: novosAtributos }));
      return;
    }
    const novoValor = Number(valorDigitado);
    if (isNaN(novoValor)) return;
    const novosAtributos = [...personagemAtual.atributos];
    novosAtributos[index] = novoValor;
    try {
      const json = await AsyncStorage.getItem('personagens');
      const lista = json ? JSON.parse(json) : [];
      const atualizados = lista.map(p =>
        p.id === personagemAtual.id ? { ...p, atributos: novosAtributos } : p
      );
      await AsyncStorage.setItem('personagens', JSON.stringify(atualizados));
      setPersonagemAtual(prev => ({ ...prev, atributos: novosAtributos }));
    } catch (err) {
      console.error("Erro ao atualizar atributo:", err);
    }
  };

  const renderConteudoAba = () => {
    switch (abaSelecionada) {
      case 'Info':
        return (
          <View style={styles.info}>
            <View style={styles.atributos}>
              <Text style={[styles.text, {textAlign: 'center', borderBottomWidth: 1, borderColor: 'white', marginBottom: 10}]}>Atributos</Text>
              {personagemAtual.atributos?.map((atr, idx) => {
                const modificador = Math.floor(((atr === "" ? 10 : atr) - 10) / 2);
                return (
                  <View key={idx} style={{ marginBottom: 10 }}>
                    <Text style={[styles.text, styles.nomeAtr]}>{atributos[idx]}</Text>
                    <View style={styles.atributoCard}>
                      <TextInput
                        style={styles.inputAtr}
                        keyboardType="numeric"
                        value={String(atr)}
                        onChangeText={(text) => atualizarAtributo(idx, text)}
                      />
                      <Text style={[styles.text, styles.textMod]}>
                        {isNaN(modificador) ? 0 : modificador}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
            <View style={styles.pericias}>
              <View style={styles.salvaCard}>
                <Text style={[styles.text, { textAlign: "center", borderBottomWidth: 1, borderColor: "white" }]}>Salvaguardas</Text>
                {salvaguardas?.map((salv, idx) => {
                  const marcado = personagemAtual?.salvaguardas?.[idx] ?? false;
                  const toggle = async (v = !marcado) => {
                    const novas = [...(personagemAtual.salvaguardas || [])];
                    novas[idx] = v;
                    try {
                      const json = await AsyncStorage.getItem("personagens");
                      const lista = json ? JSON.parse(json) : [];
                      const atualizados = lista.map((p) =>
                        p.id === personagemAtual.id ? { ...p, salvaguardas: novas } : p
                      );
                      await AsyncStorage.setItem("personagens", JSON.stringify(atualizados));
                      setPersonagemAtual((old) => ({ ...old, salvaguardas: novas }));
                    } catch (err) {
                      console.error("Erro ao salvar salvaguarda:", err);
                    }
                  };
                  return (
                    <TouchableOpacity key={idx} onPress={() => toggle()} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Checkbox value={marcado} onValueChange={(v) => toggle(v)} color={marcado ? "#00f0ff" : undefined} />
                      <Text style={styles.text}>{salv}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={styles.pericCard}>
                <Text style={[styles.text, { textAlign: "center", borderBottomWidth: 1, borderColor: "white" }]}>Perícias</Text>
                {pericias?.map((per, idx) => {
                  const marcado = personagemAtual?.pericias?.[idx] ?? false;
                  const toggle = async (v = !marcado) => {
                    const novas = [...(personagemAtual.pericias || [])];
                    novas[idx] = v;
                    try {
                      const json = await AsyncStorage.getItem("personagens");
                      const lista = json ? JSON.parse(json) : [];
                      const atualizados = lista.map((p) =>
                        p.id === personagemAtual.id ? { ...p, pericias: novas } : p
                      );
                      await AsyncStorage.setItem("personagens", JSON.stringify(atualizados));
                      setPersonagemAtual((old) => ({ ...old, pericias: novas }));
                    } catch (err) {
                      console.error("Erro ao salvar perícia:", err);
                    }
                  };
                  return (
                    <TouchableOpacity key={idx} onPress={() => toggle()} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Checkbox value={marcado} onValueChange={(v) => toggle(v)} color={marcado ? "#00f0ff" : undefined} />
                      <Text style={styles.text}>{per}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        );
      case 'Habilidades':
        return (
          <View>
            {/* Botão para adicionar habilidade */}
            <TouchableOpacity
              style={[styles.addButton]}
              onPress={() => setModalAdicionarHab(true)}
            >
              <Text style={styles.nivelTexto}>+ Adicionar Habilidade</Text>
            </TouchableOpacity>

            {/* Lista de habilidades existentes */}
            {personagemAtual.habilidades?.map((hab, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.habilidade}
                onPress={() => { setHabilidadeSelecionada(hab); setModalHabilidadeVisivel(true); }}
              >
                <Text style={styles.habilidadeTitulo}>{hab.nome}</Text>
                <Text style={styles.habilidadeTag}>{hab.classe} - Nível {hab.nivel}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );   
      case 'Magias':
        return personagemAtual.magias?.map((mag, idx) => (
          <TouchableOpacity key={idx} style={styles.habilidade} onPress={() => { setMagiaSelecionada(mag); setModalVisivel(true); }}>
            <Text style={styles.habilidadeTitulo}>{mag.nome}</Text>
            <Text style={styles.magiaTag}>{mag.classes?.join(', ')} {'\nNível: '} {mag.nivel}</Text>
          </TouchableOpacity>
        ));
      case 'Mochila':
        return <MochilaTab personagem={personagemAtual} onUpdate={carregarPersonagem} />;
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
          {/* Download e editar nome */}
          <View style={{ width:'100%', alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={() => setModalDownloadVisivel(true)}>
              <Ionicons name="download-outline" size={28} color="white" />
            </TouchableOpacity>
          </View>
          <View style={{ marginLeft: 16, marginBottom: 10, marginTop: 5, flexDirection: "row", alignItems: "flex-start", gap: 8, alignSelf: "center" }}>
            <TouchableOpacity onPress={() => { setNomeEditado(personagemAtual.nome); setModalEditarNome(true); }}>
              <Text style={styles.title}>{personagemAtual.nome}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setNomeEditado(personagemAtual.nome); setModalEditarNome(true); }}>
              <Entypo name="pencil" size={15} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.text}>Nível de Personagem: {personagemAtual.nivel}</Text>
          <Text style={styles.text}>Classe(s): {personagemAtual.classes?.map((classe, idx) => `${classe} - ${personagemAtual.nivel_por_classe?.[idx] || 0}`).join(', ')}</Text>
          <Text style={styles.text}>Subclasse(s): {personagemAtual.subclasses?.join(', ')}</Text>
          <View style={styles.vidaContainer}>
            <Text style={styles.vidaTexto}>Vida: {vidaAtual}/{personagemAtual.vida_maxima}</Text>
            <View style={styles.botoesLinha}>
              {[1,5,10,50].map(v => <TouchableOpacity key={`+${v}`} style={styles.botao} onPress={() => alterarVida(v)}><Text style={styles.botaoTexto}>+{v}</Text></TouchableOpacity>)}
            </View>
            <View style={styles.botoesLinha}>
              {[-1,-5,-10,-50].map(v => <TouchableOpacity key={`${v}`} style={styles.botao} onPress={() => alterarVida(v)}><Text style={styles.botaoTexto}>{v}</Text></TouchableOpacity>)}
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
            {['Info', 'Habilidades', 'Magias', 'Mochila'].map((aba) => (
              <TouchableOpacity key={aba} style={[styles.abaBotao, abaSelecionada === aba && styles.abaSelecionada]} onPress={() => setAbaSelecionada(aba)}>
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

      <HabilidadeModal
  visible={modalHabilidadeVisivel}
  habilidade={habilidadeSelecionada}
  onClose={() => setModalHabilidadeVisivel(false)}
  contexto="detalhes"
  personagem={personagemAtual}
  onUpdate={carregarPersonagem}
/>

<Modal visible={modalAdicionarHab} transparent animationType="slide">
  <View style={{
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20
  }}>
    <View style={{
      backgroundColor: '#222',
      borderRadius: 10,
      padding: 15,
      maxHeight: '80%'
    }}>

      {/* Botões para alternar abas */}
      <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
        <TouchableOpacity
          style={[styles.nivelBtn, { alignItems: 'center', width: '50%', borderRadius: 0, backgroundColor: 'transparent', borderBottomWidth: abaModalHab === 'Classe' ? 2 : 0, borderBottomColor: abaModalHab === 'Classe' ? '#00f0ff' : '#444' }]}
          onPress={() => setAbaModalHab('Classe')}
        >
          <Text style={styles.nivelTexto}>Classe</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nivelBtn, { alignItems: 'center', width: '50%', borderRadius: 0, backgroundColor: 'transparent', borderBottomWidth: abaModalHab === 'Subclasse' ? 2 : 0, borderBottomColor: abaModalHab === 'Subclasse' ? '#00f0ff' : '#444' }]}
          onPress={() => setAbaModalHab('Subclasse')}
        >
          <Text style={styles.nivelTexto}>Subclasse</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de habilidades */}
      <ScrollView>
        {Object.values(habilidadesJSON).map((classeObj) => {
          const habilidadesFiltradas = abaModalHab === 'Classe'
            ? classeObj.classFeatures
            : classeObj.subclasses.flatMap(sc => sc.features);

          if (!habilidadesFiltradas.length) return null;

          return (
            <View key={classeObj.index} style={{ marginBottom: 10 }}>
              {/* Cabeçalho da classe/subclasse */}
              <TouchableOpacity
                onPress={() => setExpandClasses(prev => ({ ...prev, [classeObj.index]: !prev[classeObj.index] }))}
                style={{ padding: 8, backgroundColor: '#111', borderRadius: 5 }}
              >
                <Text style={{ fontWeight: 'bold', color: '#00f0ff' }}>
                  {classeObj.name} {abaModalHab === 'Subclasse' ? '(Subclasses)' : ''}
                </Text>
              </TouchableOpacity>

              {/* Habilidades da classe, visíveis se a classe estiver expandida */}
              {expandClasses[classeObj.index] && (
                <View style={{ marginTop: 5, paddingLeft: 10 }}>
                  {habilidadesFiltradas.map((hab, idx) => (
                    <View key={idx} style={{ marginBottom: 8, borderWidth: 1, borderColor: '#555', borderRadius: 5, padding: 5 }}>
                        <TouchableOpacity
                            style={{ marginLeft: 5, padding: 5 }}
                            onPress={() => setExpandHabilidades(prev => ({ ...prev, [`${classeObj.index}-${idx}`]: !prev[`${classeObj.index}-${idx}`] }))}
                          >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'column', width: '70%' }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{hab.name}</Text>
                            <Text style={[styles.habilidadeTag, { width: '100%', marginTop: 10 }]}>Nível: {hab.level}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                          {/* Botão Add */}
                          <TouchableOpacity
                            style={{ padding: 6, backgroundColor: '#333', borderRadius: 6, alignSelf: 'flex-start'}}
                            onPress={() => {
                              // Adiciona a habilidade
                              adicionarHabilidade({
                                nome: hab.name,
                                descricao: hab.desc,
                                nivel: hab.level,
                                classe: abaModalHab === 'Classe' ? classeObj.name : hab.classe || classeObj.name,
                                subclasse: abaModalHab === 'Classe' ? null : hab.subclasse || null
                              });

                              // Fecha tanto a lista de habilidades quanto a descrição
                              setExpandHabilidades(prev => ({})); // fecha todas as descrições
                              setExpandClasses(prev => ({ ...prev, [classeObj.index]: false })); // fecha a classe atual
                            }}
                          >
                            <Text style={{ color: '#00f0ff', fontWeight: 'bold' }}>Add</Text>
                          </TouchableOpacity>


                        </View>
                      </View>
                            </TouchableOpacity>

                      {/* Descrição visível se expandida */}
                      {expandHabilidades[`${classeObj.index}-${idx}`] && (
                        <View>
                          <Text style={{ color: '#ccc', marginTop: 8 }}>{hab.desc}</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Botão de fechar */}
      <TouchableOpacity
        style={[styles.nivelBtn, { marginTop: 10, backgroundColor: '#922', alignSelf: 'center' }]}
        onPress={() => setModalAdicionarHab(false)}
      >
        <Text style={styles.nivelTexto}>Fechar</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

      {/* Modal Download */}
      <Modal visible={modalDownloadVisivel} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Baixar Personagem</Text>
            <Text style={styles.text}>Deseja realmente baixar este personagem em um arquivo JSON?</Text>
            <View style={styles.modalBotoes}>
              <TouchableOpacity style={[styles.nivelBtn, { backgroundColor: '#922' }]} onPress={() => setModalDownloadVisivel(false)}>
                <Text style={styles.nivelTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.nivelBtn]} onPress={() => { baixarPersonagem(); setModalDownloadVisivel(false); }}>
                <Text style={styles.nivelTexto}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Editar Nome */}
      <Modal visible={modalEditarNome} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Nome</Text>
            <TextInput
              value={nomeEditado}
              onChangeText={setNomeEditado}
              style={{ width: "100%", backgroundColor: "#222", padding: 10, borderRadius: 8, color: "white", marginBottom: 20 }}
              placeholder="Novo nome"
              placeholderTextColor="#888"
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
              <TouchableOpacity style={[styles.nivelBtn, { backgroundColor: "#922", flex: 1, marginRight: 8, alignItems: 'center' }]} onPress={() => setModalEditarNome(false)}>
                <Text style={styles.nivelTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.nivelBtn, { flex: 1, marginLeft: 8, alignItems: 'center' }]} onPress={salvarNome}>
                <Text style={styles.nivelTexto}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Subir Nível */}
      <Modal visible={modalNivelVisivel} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Subir Nível</Text>
            <Text style={styles.text}>Escolha a classe:</Text>
            <Picker selectedValue={classeEscolhida} onValueChange={setClasseEscolhida} style={{ color: 'white' }}>
              {classesDisponiveis.map((c, idx) => <Picker.Item label={c} value={c} key={idx} />)}
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
              <TouchableOpacity style={styles.nivelBtn} onPress={salvarNivel}><Text style={styles.nivelTexto}>Salvar</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.nivelBtn, { backgroundColor: '#922' }]} onPress={() => setModalNivelVisivel(false)}><Text style={styles.nivelTexto}>Cancelar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Diminuir Nível */}
      <Modal visible={modalDiminuirClasseVisivel} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha a classe para diminuir nível</Text>
            <Picker selectedValue={classeDiminuir} onValueChange={setClasseDiminuir} style={{ color: 'white' }}>
              {personagemAtual.classes?.map((c, idx) => <Picker.Item label={c} value={c} key={idx} />)}
            </Picker>
            <Text style={styles.warning}>* Ao diminuir o nível sua vida máxima será diminuída no valor ganho ao receber aquele nível</Text>
            <View style={styles.modalBotoes}>
              <TouchableOpacity style={styles.nivelBtn} onPress={() => descerNivelClasse(classeDiminuir)}><Text style={styles.nivelTexto}>Confirmar</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.nivelBtn, { backgroundColor: '#922' }]} onPress={() => setModalDiminuirClasseVisivel(false)}><Text style={styles.nivelTexto}>Cancelar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addButton: { backgroundColor: '#00f0ff', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  scroll: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 10, textAlign: 'center' },
  text: { color: 'white', marginBottom: 5 },
  vidaContainer: { marginVertical: 20, alignItems: 'center' },
  vidaTexto: { fontSize: 18, color: 'white', marginBottom: 10 },
  botoesLinha: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 10 },
  botao: { backgroundColor: '#444', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12, marginHorizontal: 5 },
  botaoTexto: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  info: { display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-around' },
  atributos: { width: '45%' },
  nomeAtr: { textAlign: 'center' },
  atributoCard: { display: 'flex', flexDirection: 'row', gap: 5, width: '100%', justifyContent: 'center' },
  pericias: { width: '45%', display: 'flex', flexDirection: 'column' },
  salvaCard: { height: 'auto', marginBottom: 10 },
  pericCard: { height: 'auto' },
  textMod: { padding: 10, backgroundColor: "#222", borderColor: "#555", width: '40%', textAlign: 'center', fontSize: 30, borderRadius: 10 },
  inputAtr: { backgroundColor: "#222", color: "white", padding: 8, borderRadius: 8, borderWidth: 1, borderColor: "#555", height: '50%', width: '25%' },
  habilidade: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#444', paddingBottom: 10 },
  habilidadeTitulo: { color: '#00f0ff', fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
  habilidadeTag: { backgroundColor: '#3d3d3d', color: 'white', fontSize: 10, maxWidth: '25%', margin: 2, borderRadius: 10, textAlign: 'center' },
  magiaTag: { backgroundColor: '#3d3d3d', color: 'white', fontSize: 10, maxWidth: '50%', margin: 2, borderRadius: 10, paddingLeft: '5%' },
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
  warning: { color: 'red', fontWeight: 'bold', fontSize: 14, marginBottom: 5, textAlign: 'justify' }
});
