// ChatScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons'; // Import des icônes Ionicons
import { COLORS } from '../constants/theme';

// Messages initiaux pour le développement
const INITIAL_MESSAGES = [
  {
    id: '1',
    text: 'Bonjour!',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isSent: false,
    status: 'read',
  },
  {
    id: '2',
    text: 'Comment allez-vous?',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    isSent: true,
    status: 'read',
  },
];

/**
 * Composant pour l'avatar affichant la première lettre du nom
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.name - Le nom dont on affiche la première lettre
 */
const LetterAvatar = ({ name }) => (
  <View style={styles.avatarContainer}>
    <Text style={styles.avatarText}>
      {name.charAt(0).toUpperCase()}
    </Text>
  </View>
);

/**
 * Composant d'en-tête du chat
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.name - Nom de l'interlocuteur
 * @param {Function} props.onBackPress - Fonction appelée lors du clic sur le bouton retour
 */
const ChatHeader = ({ name, onBackPress }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
      <Icon name="arrow-back" size={24} color={COLORS.white} />
    </TouchableOpacity>
    <LetterAvatar name={name} />
    <Text style={styles.headerTitle}>{name}</Text>
  </View>
);

/**
 * Composant principal de l'écran de chat
 */
const ChatScreen = ({ route, navigation }) => {
  // Extraction des paramètres de navigation
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

  /**
   * Charge les messages initiaux au montage du composant
   */
  useEffect(() => {
    loadInitialMessages();
  }, [chatId]);

  /**
   * Gère le retour à l'écran précédent
   */
  const handleBack = () => {
    navigation.goBack();
  };

  /**
   * Charge les messages initiaux depuis l'API
   */
  const loadInitialMessages = async () => {
    setIsLoading(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessages(INITIAL_MESSAGES);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les messages');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Charge plus de messages anciens (pagination)
   */
  const loadMoreMessages = async () => {
    if (!hasMoreMessages || loadingMoreRef.current) return;
    
    loadingMoreRef.current = true;
    try {
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
      
      if (messages.length > 30) {
        setHasMoreMessages(false);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger plus de messages');
    } finally {
      loadingMoreRef.current = false;
    }
  };

  /**
   * Gère la saisie de message et l'indicateur de frappe
   */
  const handleTyping = (text) => {
    setInputMessage(text);
    
    if (!isTyping) {
      setIsTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  };

  /**
   * Envoie un nouveau message
   */
  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      timestamp: new Date().toISOString(),
      isSent: true,
      status: 'sent',
    };

    setMessages(prev => [newMessage, ...prev]);
    setInputMessage('');
    updateLastMessage?.(chatId, newMessage.text);

    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id
            ? { ...msg, status: 'delivered' }
            : msg
        )
      );

      // Simulation d'une réponse automatique
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

  /**
   * Rendu d'un message individuel
   */
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
            {item.status === 'sent' && <Icon name="checkmark" size={16} color={COLORS.white} />}
            {item.status === 'delivered' && <Icon name="checkmark-done" size={16} color={COLORS.white} />}
            {item.status === 'read' && <Icon name="checkmark-done" size={16} color={COLORS.primary} />}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ChatHeader name={name} onBackPress={handleBack} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        {/* Zone des messages */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
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
            <ActivityIndicator size="small" color={COLORS.primary} />
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
            style={[
              styles.sendButton,
              !inputMessage.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSend}
            disabled={!inputMessage.trim()}
          >
            <Icon
              name="send"
              size={24}
              color={inputMessage.trim() ? COLORS.primary : '#999999'}
            />
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
  // Styles du header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#262628',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 12,
  },
  // Styles de l'avatar
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  // Styles des messages
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
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
    color: COLORS.white,
  },
  receivedMessageText: {
    color: COLORS.white,
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
    opacity: 0.7,
  },
  messageStatus: {
    flexDirection: 'row',
  },
  // Styles de la zone de saisie
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.noir,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#262628',
  },
  input: {
    flex: 1,
    backgroundColor: '#262628',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    color: COLORS.white,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    opacity: 0.5,
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
  loadingMore: {
    padding: 16,
  },
});

export default ChatScreen;