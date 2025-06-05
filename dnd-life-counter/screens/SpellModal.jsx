import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectCharacterModal from './SelectCharacterModal';

export default function SpellModal({ visible, spell, onClose, contexto, personagem, onUpdate }) {
    const [showSelectPersonagem, setShowSelectPersonagem] = useState(false);
    const [spellParaAdicionar, setSpellParaAdicionar] = useState(null);
    
    
    const abrirSelecaoPersonagem = (spell) => {
        setSpellParaAdicionar(spell);
        setShowSelectPersonagem(true);
    };
    
    const fecharSelecaoPersonagem = () => {
        setShowSelectPersonagem(false);
        setSpellParaAdicionar(null);
    };
    
    const removerMagia = async () => {
        try {
            const data = await AsyncStorage.getItem('personagens');
            const lista = data ? JSON.parse(data) : [];
            
            const personagemIndex = lista.findIndex(p => p.id === personagem.id);
            if (personagemIndex === -1) return;
            
            const personagemAtual = lista[personagemIndex];
            personagemAtual.magias = personagemAtual.magias.filter(m => m.nome !== spell.nome);
            
            lista[personagemIndex] = personagemAtual;
            
            await AsyncStorage.setItem('personagens', JSON.stringify(lista));
            
            if (onUpdate) {
                onUpdate();
            }
            
            onClose();
        } catch (error) {
            console.error('Erro ao remover magia:', error);
        }
    };
    
    
    if (!spell) return null;
    
    return (
        <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
        >
        <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
        <Text style={styles.modalTitulo}>{spell.nome}</Text>
        <Text style={styles.modalTexto}>Nível: {spell.nivel}</Text>
        <Text style={styles.modalTexto}>Escola: {spell.escola}</Text>
        <Text style={styles.modalTexto}>
        Componentes:{' '}
        {[
            spell.verbal && 'Verbal',
            spell.somatico && 'Somático',
            spell.material && 'Material',
        ]
        .filter(Boolean)
        .join(', ')}
        </Text>
        <Text style={styles.modalTexto}>
        Ritual: {spell.ritual ? 'Sim' : 'Não'} | Concentração:{' '}
        {spell.concentracao ? 'Sim' : 'Não'}
        </Text>
        <Text style={styles.modalTexto}>Tempo de Conjuração: {spell.tempo_conju}</Text>
        <Text style={styles.modalTexto}>Alcance: {spell.alcance}</Text>
        <Text style={styles.modalTexto}>Duração: {spell.duracao}</Text>
        <Text style={styles.modalTexto}>Classes: {spell.classes?.join(', ')}</Text>

        <ScrollView>
        <Text style={[styles.modalTexto, { marginTop: 10 }]}>{spell.descricao}</Text>
        </ScrollView>

        <View style={styles.botoesContainer}>
        {contexto === 'lista' ? (
            <TouchableOpacity onPress={(e) => {e.stopPropagation(); abrirSelecaoPersonagem(spell)}} style={styles.botaoAdd}>
            <Text style={styles.botaoAddTexto}>Adicionar</Text>
            </TouchableOpacity>
        ) : contexto === 'detalhes' ? (
            <TouchableOpacity onPress={removerMagia} style={styles.botaoRemove}>
            <Text style={styles.botaoRemoveTexto}>Remover</Text>
            </TouchableOpacity>
        ) : null}
        
        <TouchableOpacity onPress={onClose} style={styles.botaoFechar}>
        <Text style={styles.botaoFecharTexto}>Fechar</Text>
        </TouchableOpacity>
        </View>
        <SelectCharacterModal visible={showSelectPersonagem} spell={spellParaAdicionar} onClose={fecharSelecaoPersonagem} />
        </View>
        </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#111',
        padding: 20,
        borderRadius: 10,
        width: '100%',
        maxHeight: '90%',
    },
    modalTitulo: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#00f0ff',
        marginBottom: 10,
    },
    modalTexto: {
        color: 'white',
        marginBottom: 6,
        textAlign: 'justify',
    },
    botoesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    botaoAdd: {
        padding: 10,
        backgroundColor: '#488532',
        borderRadius: 8, 
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    botaoAddTexto: {
        color: 'white',
        fontWeight: 'bold',
    },
    botaoRemove: {
        padding: 10,
        backgroundColor: '#fa2833',
        borderRadius: 8, 
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    botaoRemoveTexto: {
        color: 'white',
        fontWeight: 'bold',
    },
    botaoFechar: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 8,
        borderColor: '#00f0ff', 
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    botaoFecharTexto: {
        color: '#00f0ff',
        fontWeight: 'bold',
    },
    botaoAcao: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#0066cc',
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    botaoTexto: {
        color: 'white',
        fontWeight: 'bold',
    },
    selectContainer: {
        marginTop: 20,
        backgroundColor: '#222',
        padding: 10,
        borderRadius: 8,
    },
    personagemBotao: {
        backgroundColor: '#333',
        padding: 8,
        borderRadius: 6,
        marginTop: 6,
    },
});
