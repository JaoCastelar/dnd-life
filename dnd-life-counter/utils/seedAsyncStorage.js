// utils/seedAsyncStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import rawData from '../data/char.json';

export const seedPersonagens = async () => {
  try {
    await AsyncStorage.setItem('personagens', JSON.stringify(rawData));
    console.log('Personagens inseridos no AsyncStorage com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir personagens no AsyncStorage:', error);
  }
};

export const clearPersonagens = async () => {
  try {
    await AsyncStorage.removeItem('personagens');
    console.log('Personagens removidos do AsyncStorage.');
  } catch (error) {
    console.error('Erro ao limpar personagens do AsyncStorage:', error);
  }
};
