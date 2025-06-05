import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import spells from '../data/spells.json';
import MainTabs from '../MainTabs';
import SpellModal from './SpellModal';
import CharacterSelectModal from './SelectCharacterModal';

export default function SpellsScreen({ navigation }) {
    const [agrupadoPorNivel, setAgrupadoPorNivel] = useState({});
    const [niveisVisiveis, setNiveisVisiveis] = useState({});
    const [filtro, setFiltro] = useState('');
    const [modalVisivel, setModalVisivel] = useState(false);
    const [modalSelecionarPersonagem, setModalSelecionarPersonagem] = useState(false);
    const [spellParaAdicionar, setSpellParaAdicionar] = useState(null);
    
    useEffect(() => {
        const organizarPorNivel = () => {
            const agrupado = {};
            
            spells.forEach(spell => {
                const nivel = spell.nivel || 0;
                if (!agrupado[nivel]) {
                    agrupado[nivel] = [];
                }
                agrupado[nivel].push(spell);
            });
            
            setAgrupadoPorNivel(agrupado);
        };
        
        organizarPorNivel();
    }, []);
    
    const toggleNivel = (nivel) => {
        setNiveisVisiveis(prev => ({
            ...prev,
            [nivel]: !prev[nivel],
        }));
    };
    
    const normalizarTexto = (texto) =>
        texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    
    const filtroNormalizado = normalizarTexto(filtro);
    
    const resultadoBusca =
    filtro.trim() === ''
    ? null
    : spells.filter(spell =>
        normalizarTexto(spell.nome).includes(filtroNormalizado)
    );
    
    const abrirModal = (spell) => {
        setSpellParaAdicionar(spell)
        setModalVisivel(true);
    };
    
    const fecharModal = () => {
        setModalVisivel(false);
        setSpellParaAdicionar(null);
    };
    
    const abrirSelecaoPersonagem = (spell) => {
        setSpellParaAdicionar(spell);
        setModalSelecionarPersonagem(true);
    };
    
    const fecharSelecaoPersonagem = () => {
        setModalSelecionarPersonagem(false);
        setSpellParaAdicionar(null);
    };
    
    return (
        <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
        <TextInput
        style={styles.input}
        placeholder="Buscar magia..."
        placeholderTextColor="#999"
        value={filtro}
        onChangeText={setFiltro}
        />
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
        {resultadoBusca ? (
            resultadoBusca.length === 0 ? (
                <Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
                Nenhuma magia encontrada.
                </Text>
            ) : (
                resultadoBusca.map((spell, index) => (
                    <TouchableOpacity key={index} onPress={(e) => {e.stopPropagation(); abrirModal(spell)}} style={styles.spellCard}>
                    <Text style={styles.spellNome}>{spell.nome}</Text>
                    <TouchableOpacity
                    onPress={(e) => {
                        e.stopPropagation();
                        abrirSelecaoPersonagem(spell);
                    }}
                    style={styles.addButton}
                    >
                    <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                    </TouchableOpacity>
                ))
            )
        ) : (
            Object.keys(agrupadoPorNivel)
            .sort((a, b) => Number(a) - Number(b))
            .map(nivel => (
                <View key={nivel} style={styles.nivelContainer}>
                <TouchableOpacity onPress={() => toggleNivel(nivel)}>
                <Text style={styles.nivelTitulo}>
                {niveisVisiveis[nivel] ? '▼' : '▶'} Nível {nivel}
                </Text>
                </TouchableOpacity>
                
                {niveisVisiveis[nivel] &&
                    agrupadoPorNivel[nivel].map((spell, index) => (
                        <TouchableOpacity key={index} onPress={() => abrirModal(spell)} style={styles.spellCard}>
                        <Text style={styles.spellNome}>{spell.nome}</Text>
                        <TouchableOpacity
                        onPress={(e) => {
                            e.stopPropagation(); // Evita que o toque abra o modal da magia
                            abrirSelecaoPersonagem(spell);
                            
                        }}
                        style={styles.addButton}
                        >
                        <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                        </TouchableOpacity>
                        
                    ))}
                    </View>
                ))
            )}
            </ScrollView>
            
            </View>
            
            <SpellModal visible={modalVisivel} spell={spellParaAdicionar} contexto='lista' onClose={fecharModal} />
            <CharacterSelectModal visible={modalSelecionarPersonagem} spell={spellParaAdicionar} onClose={fecharSelecaoPersonagem} />
            
            <View style={styles.footer}>
            <MainTabs />
            </View>
            </SafeAreaView>
        );
    }
    
    const styles = StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: '#000',
        },
        container: {
            flex: 1,
        },
        input: {
            backgroundColor: '#1a1a1a',
            color: 'white',
            padding: 10,
            fontSize: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#444',
        },
        scrollContent: {
            padding: 16,
            paddingBottom: 120,
        },
        nivelContainer: {
            marginBottom: 24,
        },
        nivelTitulo: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#00f0ff',
            marginBottom: 10,
        },
        spellCard: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: '#222',
            padding: 12,
            borderRadius: 8,
            marginBottom: 10,
        },
        spellNome: {
            fontSize: 16,
            fontWeight: 'bold',
            paddingTop: 5,
            height: '100%',
            color: 'white',
        },
        addButton: {
            padding: 6,
            backgroundColor: '#333',
            borderRadius: 6,
            alignSelf: 'flex-start',
        },
        addButtonText: {
            color: '#00f0ff',
            fontWeight: 'bold',
            fontSize: 14,
        },
        footer: {
            height: 95,
        },
    });
