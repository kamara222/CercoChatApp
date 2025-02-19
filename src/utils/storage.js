import AsyncStorage from '@react-native-async-storage/async-storage';


export const saveMessages = async (chatId, messages) => {
  try {
    await AsyncStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des messages:', error);
  }
};

export const loadMessages = async (chatId) => {
  try {
    const messages = await AsyncStorage.getItem(`chat_${chatId}`);
    return messages ? JSON.parse(messages) : [];
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error);
    return [];
  }
};
