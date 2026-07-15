import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectCharacterModal from './SelectCharacterModal';

export default function HabilidadeModal({ visible, habilidade, onClose, contexto, personagem, onUpdate }) {
  const [showSelectPersonagem, setShowSelectPersonagem] = useState(false);
  const [habParaAdicionar, setHabParaAdicionar] = useState(null);

  const abrirSelecaoPersonagem = (hab) => {
    setHabParaAdicionar(hab);
    setShowSelectPersonagem(true);
  };

  const fecharSelecaoPersonagem = () => {
    setShowSelectPersonagem(false);
    setHabParaAdicionar(null);
  };

  const removerHabilidade = async () => {
    try {
      const data = await AsyncStorage.getItem('personagens');
      const lista = data ? JSON.parse(data) : [];

      const personagemIndex = lista.findIndex(p => p.id === personagem.id);
      if (personagemIndex === -1) return;

      const personagemAtual = lista[personagemIndex];
      personagemAtual.habilidades = personagemAtual.habilidades.filter(h => h.nome !== habilidade.nome);

      lista[personagemIndex] = personagemAtual;

      await AsyncStorage.setItem('personagens', JSON.stringify(lista));

      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.error('Erro ao remover habilidade:', error);
    }
  };

  if (!habilidade) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitulo}>{habilidade.nome}</Text>
          <Text style={styles.modalTexto}>Classe: {habilidade.classe}</Text>
          <Text style={styles.modalTexto}>Nível: {habilidade.nivel}</Text>
          <ScrollView>
            <Text style={[styles.modalTexto, { marginTop: 10 }]}>{habilidade.descricao}</Text>
          </ScrollView>

          <View style={styles.botoesContainer}>
            {contexto === 'lista' && (
              <TouchableOpacity onPress={() => abrirSelecaoPersonagem(habilidade)} style={styles.botaoAdd}>
                <Text style={styles.botaoAddTexto}>Adicionar</Text>
              </TouchableOpacity>
            )}
            {contexto === 'detalhes' && (
              <TouchableOpacity onPress={removerHabilidade} style={styles.botaoRemove}>
                <Text style={styles.botaoRemoveTexto}>Remover</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose} style={styles.botaoFechar}>
              <Text style={styles.botaoFecharTexto}>Fechar</Text>
            </TouchableOpacity>
          </View>

          <SelectCharacterModal visible={showSelectPersonagem} spell={habParaAdicionar} onClose={fecharSelecaoPersonagem} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#111', padding: 20, borderRadius: 10, width: '100%', maxHeight: '90%' },
  modalTitulo: { fontSize: 22, fontWeight: 'bold', color: '#00f0ff', marginBottom: 10 },
  modalTexto: { color: 'white', marginBottom: 6, textAlign: 'justify' },
  botoesContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  botaoAdd: { padding: 10, backgroundColor: '#488532', borderRadius: 8, flex: 1, marginHorizontal: 5, alignItems: 'center' },
  botaoAddTexto: { color: 'white', fontWeight: 'bold' },
  botaoRemove: { padding: 10, backgroundColor: '#fa2833', borderRadius: 8, flex: 1, marginHorizontal: 5, alignItems: 'center' },
  botaoRemoveTexto: { color: 'white', fontWeight: 'bold' },
  botaoFechar: { padding: 10, borderWidth: 2, borderRadius: 8, borderColor: '#00f0ff', flex: 1, marginHorizontal: 5, alignItems: 'center' },
  botaoFecharTexto: { color: '#00f0ff', fontWeight: 'bold' },
});
