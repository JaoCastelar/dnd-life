import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function MochilaTab({ personagem, onUpdate }) {
    const [modalVisivel, setModalVisivel] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [nome, setNome] = useState('');
    const [tipo, setTipo] = useState('Consumível');
    const [dano, setDano] = useState('');
    const [ca, setCa] = useState('');
    const [descricao, setDescricao] = useState('');
    const [itensExpandidos, setItensExpandidos] = useState({});
    
    const abrirModalAdicionar = () => {
        setEditIndex(null);
        setNome('');
        setTipo('Consumível');
        setDano('');
        setCa('');
        setDescricao('');
        setModalVisivel(true);
    };
    
    const abrirModalEditar = (item, index) => {
        setEditIndex(index);
        setNome(item.nome);
        setTipo(item.tipo);
        setDano(item.dano || '');
        setCa(item.ca || '');
        setDescricao(item.descricao || '');
        setModalVisivel(true);
    };
    
    const salvarItem = async () => {
        if (!nome) {
            Alert.alert('Erro', 'Preencha o nome do item.');
            return;
        }
        
        const novoItem = { nome, tipo, descricao, quantidade: 1 };
        if (tipo === 'Arma') novoItem.dano = dano;
        if (tipo === 'Armadura' && ca) novoItem.ca = ca;
        
        try {
            const json = await AsyncStorage.getItem('personagens');
            const lista = json ? JSON.parse(json) : [];
            
            const atualizados = lista.map(p => {
                if (p.id === personagem.id) {
                    let mochila = [...(p.mochila || [])];
                    if (editIndex !== null) {
                        mochila[editIndex] = { ...mochila[editIndex], ...novoItem };
                    } else {
                        mochila.push(novoItem);
                    }
                    return { ...p, mochila };
                }
                return p;
            });
            
            await AsyncStorage.setItem('personagens', JSON.stringify(atualizados));
            onUpdate();
            setModalVisivel(false);
            setEditIndex(null);
            setNome('');
            setTipo('Consumível');
            setDano('');
            setCa('');
            setDescricao('');
        } catch (err) {
            Alert.alert('Erro', 'Falha ao salvar item.');
        }
    };
    
    const alterarQuantidade = async (index, delta) => {
        const json = await AsyncStorage.getItem('personagens');
        const lista = json ? JSON.parse(json) : [];
        
        const atualizados = lista.map(p => {
            if (p.id === personagem.id) {
                let mochila = [...(p.mochila || [])];
                let atual = mochila[index];
                atual.quantidade = Math.max(0, (atual.quantidade || 1) + delta);
                mochila[index] = atual;
                return { ...p, mochila };
            }
            return p;
        });
        
        await AsyncStorage.setItem('personagens', JSON.stringify(atualizados));
        onUpdate();
    };
    
    const removerItem = (index) => {
        Alert.alert(
            'Excluir Item',
            'Tem certeza que deseja remover este item da mochila?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        const json = await AsyncStorage.getItem('personagens');
                        const lista = json ? JSON.parse(json) : [];
                        
                        const atualizados = lista.map(p => {
                            if (p.id === personagem.id) {
                                let mochila = [...(p.mochila || [])];
                                mochila.splice(index, 1);
                                return { ...p, mochila };
                            }
                            return p;
                        });
                        
                        await AsyncStorage.setItem('personagens', JSON.stringify(atualizados));
                        onUpdate();
                    },
                },
            ]
        );
    };
    
    
    const toggleExpand = (index) => {
        setItensExpandidos(prev => ({
            ...prev,
            [index]: !prev[index],
        }));
    };
    
    return (
        <View style={{ flex: 1 }}>
        <TouchableOpacity style={styles.addButton} onPress={abrirModalAdicionar}>
        <Text style={styles.addButtonText}>+ Adicionar Item</Text>
        </TouchableOpacity>
        
        <ScrollView style={{ marginTop: 10 }}>
        {(personagem.mochila && personagem.mochila.length > 0) ? (
            personagem.mochila.map((item, idx) => {
                const expandido = itensExpandidos[idx];
                return (
                    <View key={idx} style={styles.item}>
                    <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => abrirModalEditar(item, idx)}>
                    <Text style={styles.itemTitle}>{item.nome}</Text>
                    </TouchableOpacity>
                    <View style={styles.actions}>
                    <TouchableOpacity onPress={() => alterarQuantidade(idx, -1)}>
                    <Ionicons name="remove-circle-outline" size={22} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.quantidade}>{item.quantidade || 1}</Text>
                    <TouchableOpacity onPress={() => alterarQuantidade(idx, 1)}>
                    <Ionicons name="add-circle-outline" size={22} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => removerItem(idx)}>
                    <Ionicons name="trash" size={22} color="red" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => toggleExpand(idx)}>
                    <Ionicons
                    name={expandido ? 'chevron-up' : 'chevron-down'}
                    size={22}
                    color="white"
                    />
                    </TouchableOpacity>
                    </View>
                    </View>
                    
                    {expandido && (
                        <TouchableOpacity onPress={() => abrirModalEditar(item, idx)}>
                        <View style={styles.details}>
                        <Text style={styles.itemText}>Tipo: {item.tipo}</Text>
                        {item.dano && <Text style={styles.itemText}>Dano: {item.dano}</Text>}
                        {item.ca && <Text style={styles.itemText}>CA: {item.ca}</Text>}
                        {item.descricao ? <Text style={styles.itemDesc}>{item.descricao}</Text> : null}
                        </View>
                        </TouchableOpacity>
                    )}
                    </View>
                );
            })
        ) : (
            <Text style={styles.itemText}>Mochila vazia.</Text>
        )}
        </ScrollView>
        
        {/* Modal Adicionar/Editar */}
        <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>
        {editIndex !== null ? 'Editar Item' : 'Adicionar Item'}
        </Text>
        
        <Text style={styles.label}>Nome:</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome do item" placeholderTextColor="#888" />
        
        <Text style={styles.label}>Tipo:</Text>
        <Picker selectedValue={tipo} onValueChange={setTipo} style={styles.picker}>
        <Picker.Item label="Arma" value="Arma" />
        <Picker.Item label="Armadura" value="Armadura" />
        <Picker.Item label="Consumível" value="Consumível" />
        </Picker>
        
        {tipo === 'Arma' && (
            <>
            <Text style={styles.label}>Dano:</Text>
            <TextInput style={styles.input} value={dano} onChangeText={setDano} placeholder="Ex: 1d8 + Força" placeholderTextColor="#888" />
            </>
        )}
        
        {tipo === 'Armadura' && (
            <>
            <Text style={styles.label}>CA:</Text>
            <TextInput style={styles.input} value={ca} onChangeText={setCa} keyboardType="numeric" placeholder="Classe de Armadura" placeholderTextColor="#888" />
            </>
        )}
        
        <Text style={styles.label}>Descrição / Efeitos:</Text>
        <TextInput
        style={[styles.input, { height: 70 }]}
        value={descricao}
        onChangeText={setDescricao}
        multiline
        placeholder="Detalhes do item"
        placeholderTextColor="#888"
        />
        
        <View style={styles.modalBotoes}>
        <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#922' }]} onPress={() => setModalVisivel(false)}>
        <Text style={styles.modalBtnText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalBtn} onPress={salvarItem}>
        <Text style={styles.modalBtnText}>Salvar</Text>
        </TouchableOpacity>
        </View>
        </View>
        </View>
        </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    addButton: { backgroundColor: '#00f0ff', padding: 10, borderRadius: 8, alignItems: 'center' },
    addButtonText: { color: 'white', fontWeight: 'bold' },
    item: { backgroundColor: '#222', padding: 10, borderRadius: 8, marginBottom: 10 },
    itemTitle: { color: '#00f0ff', fontWeight: 'bold', fontSize: 16 },
    itemText: { color: 'white', marginBottom: 2 },
    itemDesc: { color: '#ccc', fontStyle: 'italic' },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '45%' },
    quantidade: { color: 'white', marginHorizontal: 6, fontSize: 16 },
    details: { marginTop: 8, borderTopWidth: 1, borderTopColor: '#444', paddingTop: 6 },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
    modalContent: { backgroundColor: '#111', padding: 20, borderRadius: 10, width: '85%' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 10, textAlign: 'center' },
    label: { color: 'white', marginTop: 10 },
    input: { backgroundColor: '#222', color: 'white', padding: 8, borderRadius: 8, marginTop: 5 },
    picker: { color: 'white' },
    modalBotoes: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
    modalBtn: { backgroundColor: '#2a2', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 },
    modalBtnText: { color: 'white', fontWeight: 'bold' },
});
