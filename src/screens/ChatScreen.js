/**
 * Application de Chat React Native
 * Composant ChatScreen avec fonctionnalités avancées
 * 
 * Fonctionnalités principales :
 * - Interface de chat en temps réel
 * - Gestion des statuts en ligne/hors ligne
 * - Retour haptique
 * - Chargement des messages par lots
 * - Indicateur de frappe
 * - Thème sombre personnalisé
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Text,
  Platform,
  Vibration,
  PermissionsAndroid,
} from 'react-native';
import { GiftedChat, Bubble, Send, SystemMessage, Composer, InputToolbar } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/theme';

/**
 * Messages de test pour le développement
 * Chaque message contient un ID unique, texte, timestamp, et statut
 */
const INITIAL_MESSAGES = [
  {
    id: '1',
    text: 'Bonjour!',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 heure avant
    isSent: false,
    status: 'read',
  },
  {
    id: '2',
    text: 'Comment allez-vous?',
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes avant
    isSent: true,
    status: 'read',
  },
];

/**
 * Composant d'en-tête du chat
 * Affiche l'avatar, le nom, le statut en ligne et les options
 */
const ChatHeader = ({ name, onBackPress, onlineStatus = false, lastSeen = '' }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
      <Icon name="arrow-back" size={24} color={COLORS.white} />
    </TouchableOpacity>
    <View style={styles.headerContent}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.headerTitle}>{name}</Text>
        <Text style={styles.statusText}>
          {onlineStatus ? 'En ligne' : lastSeen ? `Vu(e) ${lastSeen}` : 'Hors ligne'}
        </Text>
      </View>
    </View>
    <TouchableOpacity style={styles.menuButton}>
      <Icon name="ellipsis-vertical" size={24} color={COLORS.white} />
    </TouchableOpacity>
  </View>
);

/**
 * Composant principal ChatScreen
 * Gère l'affichage et la logique du chat
 */
const ChatScreen = ({ route, navigation }) => {
  // Extraction des paramètres de navigation avec valeurs par défaut
  const { 
    chatId = '1', 
    name = 'User', 
    updateLastMessage = () => {} 
  } = route?.params || {};
  
  // États du composant
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSeen, setLastSeen] = useState('');
  const [hasVibratePermission, setHasVibratePermission] = useState(false);
  
  // Références pour gérer les timeouts
  const typingTimeoutRef = useRef(null);

  /**
   * Demande la permission de vibration sur Android
   * @returns {Promise<void>}
   */
  const requestVibratePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.VIBRATE,
          {
            title: "Permission de vibration",
            message: "L'application a besoin de la permission de vibration pour le retour haptique.",
            buttonNeutral: "Demander plus tard",
            buttonNegative: "Annuler",
            buttonPositive: "OK"
          }
        );
        setHasVibratePermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } catch (err) {
        console.warn('Erreur de permission vibration:', err);
        setHasVibratePermission(false);
      }
    } else {
      setHasVibratePermission(true);
    }
  };

  /**
   * Convertit les messages initiaux au format GiftedChat
   */
  const convertInitialMessages = useCallback(() => {
    return INITIAL_MESSAGES
      .map(msg => ({
        _id: msg.id,
        text: msg.text,
        createdAt: new Date(msg.timestamp),
        user: {
          _id: msg.isSent ? 1 : 2,
          name: msg.isSent ? 'Vous' : name,
        },
        sent: msg.isSent,
        received: msg.status === 'delivered' || msg.status === 'read',
        pending: msg.status === 'sent',
      }))
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [name]);

  /**
   * Charge les messages initiaux
   */
  const loadInitialMessages = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const convertedMessages = convertInitialMessages();
      setMessages(convertedMessages);
    } catch (error) {
      console.error('Erreur de chargement des messages:', error);
      Alert.alert('Erreur', 'Impossible de charger les messages');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Effet pour initialiser le chat
   */
  useEffect(() => {
    requestVibratePermission();
    loadInitialMessages();
    
    // Simulation des changements de statut en ligne
    const onlineInterval = setInterval(() => {
      setIsOnline(prev => !prev);
      if (!isOnline) {
        setLastSeen('il y a quelques minutes');
      }
    }, 30000);

    return () => {
      clearInterval(onlineInterval);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [chatId]);

  /**
   * Gère la vibration avec vérification des permissions
   */
  const handleVibration = () => {
    if (hasVibratePermission) {
      Vibration.vibrate(50);
    }
  };

  /**
   * Gère l'envoi de nouveaux messages
   */
  const onSend = useCallback(async (newMessages = []) => {
    if (!newMessages.length) return;

    handleVibration();
    
    const updatedMessages = GiftedChat.append(messages, newMessages);
    setMessages(updatedMessages);

    try {
      updateLastMessage?.(chatId, newMessages[0].text);
      
      // Simulation de délai réseau
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsTyping(true);
      
      // Simulation de réponse automatique
      setTimeout(() => {
        const autoResponse = {
          _id: Date.now().toString(),
          text: `Réponse automatique à : ${newMessages[0].text}`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: name,
          },
        };

        setMessages(prev => GiftedChat.append(prev, [autoResponse]));
        setIsTyping(false);
      }, 3000);

    } catch (error) {
      console.error('Erreur d\'envoi du message:', error);
      Alert.alert('Erreur', 'Impossible d\'envoyer le message');
    }
  }, [chatId, name, updateLastMessage, messages, hasVibratePermission]);

  /**
   * Gère le chargement des messages plus anciens
   */
  const onLoadEarlier = async () => {
    if (isLoadingEarlier || !hasMoreMessages) return;
    
    setIsLoadingEarlier(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Génération de messages historiques
      const oldMessages = Array.from({ length: 5 }, (_, index) => ({
        _id: `old-${Date.now()}-${index}`,
        text: `Message historique ${index + 1}`,
        createdAt: new Date(Date.now() - (86400000 * (index + 1))),
        user: {
          _id: Math.random() > 0.5 ? 1 : 2,
          name: Math.random() > 0.5 ? 'Vous' : name,
        },
      }));

      setMessages(previousMessages => GiftedChat.append(previousMessages, oldMessages));
      
      if (messages.length > 50) {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error('Erreur de chargement des anciens messages:', error);
      Alert.alert('Erreur', 'Impossible de charger plus de messages');
    } finally {
      setIsLoadingEarlier(false);
    }
  };

  /**
   * Gère l'indicateur de frappe
   */
  const handleInputTextChanged = text => {
    if (text.length > 0) {
      setIsTyping(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    } else {
      setIsTyping(false);
    }
  };

  // Composants de rendu personnalisés
  const renderBubble = useCallback(props => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: COLORS.primary,
        },
        left: {
          backgroundColor: '#262628',
        },
      }}
      textStyle={{
        right: {
          color: COLORS.white,
        },
        left: {
          color: COLORS.white,
        },
      }}
    />
  ), []);

  const renderSend = useCallback(props => (
    <Send {...props}>
      <View style={styles.sendButton}>
        <Icon name="send" size={24} color={COLORS.primary} />
      </View>
    </Send>
  ), []);

  const renderInputToolbar = useCallback(props => (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: COLORS.noir,
        borderTopWidth: 1,
        borderTopColor: '#262628',
      }}
      primaryStyle={{ alignItems: 'center' }}
    />
  ), []);

  const renderComposer = useCallback(props => (
    <Composer
      {...props}
      textInputStyle={{
        color: COLORS.white,
        backgroundColor: '#262628',
        borderRadius: 20,
        paddingHorizontal: 12,
        marginLeft: 0,
        marginTop: 5,
        marginBottom: 5,
      }}
    />
  ), []);

  const renderLoading = useCallback(() => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  ), []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ChatHeader 
        name={name} 
        onBackPress={() => navigation.goBack()} 
        onlineStatus={isOnline}
        lastSeen={lastSeen}
      />
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: 1 }}
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        renderComposer={renderComposer}
        renderLoading={renderLoading}
        loadEarlier={hasMoreMessages}
        isLoadingEarlier={isLoadingEarlier}
        onLoadEarlier={onLoadEarlier}
        infiniteScroll={true}
        placeholder="Écrivez un message..."
        onInputTextChanged={handleInputTextChanged}
        isTyping={isTyping}
        renderChatEmpty={() => (
          <View style={styles.emptyChat}>
            <Text style={styles.emptyChatText}>Aucun message</Text>
          </View>
        )}
        placeholderTextColor="#666"
        locale="fr"
        timeFormat="HH:mm"
        dateFormat="LL"
        isLoading={isLoading}
        renderSystemMessage={props => (
          <SystemMessage
            {...props}
            textStyle={{ color: '#666', fontSize: 12 }}
          />
        )}
        listViewProps={{
          style: styles.listView,
          contentContainerStyle: styles.listContent,
        }}
        inverted={true}
        alignTop={false}
      />
    </SafeAreaView>
  );
};

/**
 * Styles du composant
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.noir,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#262628',
    justifyContent: 'space-between',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  userInfo: {
    marginLeft: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
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
    loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    marginRight: 10,
    marginBottom: 5,
  },
  listView: {
    backgroundColor: COLORS.noir,
  },
  listContent: {
    paddingVertical: 10,
  },
  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyChatText: {
    color: '#666',
    fontSize: 16,
  },
});

export default ChatScreen;