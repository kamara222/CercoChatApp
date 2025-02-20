// ChatScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {StyleSheet,Text,View,FlatList,TextInput,TouchableOpacity,KeyboardAvoidingView,Platform,ActivityIndicator,Dimensions,Image,Alert,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';

// Mock des données initiales pour les messages
const INITIAL_MESSAGES = [
  {
    id: '1',
    text: 'Bonjour!',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 heure avant
    isSent: false,
    status: 'read', // 'sent', 'delivered', 'read'
  },
  {
    id: '2',
    text: 'Comment allez-vous?',
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes avant
    isSent: true,
    status: 'read',
  },
];

const ChatScreen = ({ route, navigation }) => {
  // Récupération des paramètres de navigation
  const { chatId, name, updateLastMessage } = route.params;
  
  // États du composant
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  
  // Références
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const loadingMoreRef = useRef(false);

  // Effet pour simuler le chargement initial des messages
  useEffect(() => {
    loadInitialMessages();
  }, [chatId]);

  // Fonction pour charger les messages initiaux
  const loadInitialMessages = async () => {
    setIsLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessages(INITIAL_MESSAGES);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les messages');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour charger plus de messages (pagination)
  const loadMoreMessages = async () => {
    if (!hasMoreMessages || loadingMoreRef.current) return;
    
    loadingMoreRef.current = true;
    try {
      // Simuler un appel API pour charger plus de messages
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const oldestMessageDate = new Date(messages[messages.length - 1].timestamp);
      const newMessages = [
        {
          id: `old-${Date.now()}`,
          text: 'Message plus ancien',
          timestamp: new Date(oldestMessageDate.getTime() - 86400000).toISOString(),
          isSent: Math.random() > 0.5,
          status: 'read',
        },
      ];
      
      setMessages(prev => [...prev, ...newMessages]);
      
      // Simuler la fin des messages
      if (messages.length > 30) {
        setHasMoreMessages(false);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger plus de messages');
    } finally {
      loadingMoreRef.current = false;
    }
  };

  // Gestion de la frappe
  const handleTyping = (text) => {
    setInputMessage(text);
    
    // Gestion de l'indicateur de frappe
    if (!isTyping) {
      setIsTyping(true);
      // Simuler l'envoi du statut "en train d'écrire" au serveur
    }

    // Réinitialiser le timeout précédent
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Définir un nouveau timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      // Simuler l'envoi du statut "a cessé d'écrire" au serveur
    }, 1500);
  };

  // Envoi d'un message
  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      timestamp: new Date().toISOString(),
      isSent: true,
      status: 'sent',
    };

    // Ajouter le message localement
    setMessages(prev => [newMessage, ...prev]);
    setInputMessage('');
    
    // Mettre à jour le dernier message dans la liste des chats
    updateLastMessage?.(chatId, newMessage.text);

    // Faire défiler jusqu'au nouveau message
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });

    try {
      // Simuler l'envoi au serveur
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour le statut du message
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id
            ? { ...msg, status: 'delivered' }
            : msg
        )
      );

      // Simuler une réponse automatique
      const autoResponse = {
        id: (Date.now() + 1).toString(),
        text: `Réponse automatique à : ${newMessage.text}`,
        timestamp: new Date().toISOString(),
        isSent: false,
        status: 'read',
      };

      setTimeout(() => {
        setMessages(prev => [autoResponse, ...prev]);
      }, 2000);

    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'envoyer le message');
    }
  };

  // Rendu d'un message
  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.isSent ? styles.sentMessage : styles.receivedMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.isSent ? styles.sentMessageText : styles.receivedMessageText
      ]}>
        {item.text}
      </Text>
      
      <View style={styles.messageFooter}>
        <Text style={styles.messageTimestamp}>
          {new Date(item.timestamp).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        
        {item.isSent && (
          <View style={styles.messageStatus}>
            {item.status === 'sent' && <Text>✓</Text>}
            {item.status === 'delivered' && <Text>✓✓</Text>}
            {item.status === 'read' && <Text style={styles.messageStatusRead}>✓✓</Text>}
          </View>
        )}
      </View>
    </View>
  );

  // Rendu du composant
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        {/* Liste des messages */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            inverted
            contentContainerStyle={styles.messagesList}
            onEndReached={loadMoreMessages}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              hasMoreMessages && messages.length > 0 ? (
                <ActivityIndicator style={styles.loadingMore} />
              ) : null
            }
          />
        )}

        {/* Indicateur de frappe */}
        {isTyping && (
          <View style={styles.typingIndicator}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.typingText}>En train d'écrire...</Text>
          </View>
        )}

        {/* Zone de saisie */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputMessage}
            onChangeText={handleTyping}
            placeholder="Écrivez un message..."
            placeholderTextColor="#424242"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputMessage.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputMessage.trim()}
          >
            <Text style={[
              styles.sendButtonText,
              !inputMessage.trim() && styles.sendButtonTextDisabled
            ]}>
              Envoyer
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.noir,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '90%',
    marginVertical: 4,
    padding: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#262628',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
    
  },
  sentMessageText: {
    color: '#FFFFFF',
  },
  receivedMessageText: {
    color:COLORS.white,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  messageTimestamp: {
    fontSize: 12,
    color: COLORS.white,
    marginRight: 4,
  },
  messageStatus: {
    flexDirection: 'row',
  },
  messageStatusRead: {
    color: '#007AFF',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginLeft: 16,
  },
  typingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.noir,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.noir,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  sendButtonTextDisabled: {
    color: '#999999',
  },
  loadingMore: {
    padding: 16,
  },
});

export default ChatScreen;
