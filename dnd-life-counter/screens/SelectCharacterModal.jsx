import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SelectCharacterModal({ visible, onClose, spell }) {
    const [characters, setCharacters] = useState([]);
    
    useEffect(() => {
        if (visible) {
            carregarPersonagens();
        }
    }, [visible]);
    
    const carregarPersonagens = async () => {
        try {        
            const data = await AsyncStorage.getItem('personagens');
            const lista = data ? JSON.parse(data) : [];
            setCharacters(lista);
        } catch (error) {
            console.error('Erro ao carregar personagens:', error);
        }
    };
    
    const adicionarMagiaAoPersonagem = async (personagem) => {
        try {
            const data = await AsyncStorage.getItem('personagens');
            const lista = data ? JSON.parse(data) : [];
            
            const personagemIndex = lista.findIndex(p => p.id === personagem.id);
            if (personagemIndex === -1) {
                console.warn('Personagem não encontrado no armazenamento');
                return;
            }
            
            const personagemAtual = lista[personagemIndex];
            const magias = personagemAtual.magias || [];
            
            const jaTem = magias.some(m => m.nome === spell.nome);
            if (!jaTem) {       
                
                magias.push(spell);
                personagemAtual.magias = magias;
                
                lista[personagemIndex] = personagemAtual;
                
                await AsyncStorage.setItem('personagens', JSON.stringify(lista));
            }
            
            onClose();
        } catch (error) {
            console.error('Erro ao adicionar magia:', error);
        }
    };
    
    return (
        <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
        >
        <View style={styles.overlay}>
        <View style={styles.container}>
        <Text style={styles.titulo}>Escolha um personagem</Text>
        <FlatList
        data={characters}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        renderItem={({ item }) => (
            <TouchableOpacity
            style={styles.item}
            onPress={() => adicionarMagiaAoPersonagem(item)}
            >
            <Text style={styles.itemTexto}>{item.nome}</Text>
            </TouchableOpacity>
        )}
        ListEmptyComponent={
            <Text style={styles.vazio}>Nenhum personagem encontrado.</Text>
        }
        />
        <TouchableOpacity onPress={onClose} style={styles.botaoFechar}>
        <Text style={styles.textoFechar}>Cancelar</Text>
        </TouchableOpacity>
        </View>
        </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: '100%',
        maxHeight: '80%',
        backgroundColor: '#111',
        borderRadius: 10,
        padding: 20,
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00f0ff',
        marginBottom: 10,
    },
    item: {
        padding: 12,
        backgroundColor: '#222',
        borderRadius: 6,
        marginBottom: 8,
    },
    itemTexto: {
        color: 'white',
        fontSize: 16,
    },
    vazio: {
        color: '#ccc',
        textAlign: 'center',
        marginTop: 20,
    },
    botaoFechar: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#333',
        borderRadius: 8,
        alignSelf: 'center',
    },
    textoFechar: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
