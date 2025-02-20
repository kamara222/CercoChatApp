// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const ChatListScreen = () => {
//   return (
//     <View>
//       <Text>ChatListScreen</Text>
//     </View>
//   )
// }

// export default ChatListScreen

// const styles = StyleSheet.create({})



import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  TextInput,
  Dimensions,
  Platform,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/theme';

// Données initiales pour le développement
const INITIAL_CHATS_DATA = [
  {
    id: '1',
    name: 'Marie Dupont',
    lastMessage: 'On se voit demain ?',
    timestamp: new Date().toISOString(),
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    unread: 2,
  },
  {
    id: '2',
    name: 'Solo',
    lastMessage: 'On se voit demain ?',
    timestamp: new Date().toISOString(),
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    unread: 2,
  },
];

/**
 * Composant Avatar avec fallback sur les initiales
 */
const Avatar = ({ uri, name, size = 50 }) => {
  const [hasError, setHasError] = useState(false);

  // Obtenir les initiales du nom
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (hasError || !uri) {
    return (
      <View style={[styles.avatarFallback, { width: size, height: size, borderRadius: size / 2 }]}>
        <Text style={styles.avatarFallbackText}>{getInitials(name)}</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
      onError={() => setHasError(true)}
    />
  );
};

/**
 * Modal de modification personnalisé avec animation
 */
const EditModal = ({ visible, onClose, onOption }) => {
  const translateY = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: Dimensions.get('window').height,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View 
      style={[
        styles.modalContainer,
        {
          opacity: opacity,
          pointerEvents: visible ? 'auto' : 'none',
        }
      ]}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <View style={styles.modalIndicator} />
            <Text style={styles.modalTitle}>Options de conversation</Text>
          </View>

          {['Marquer comme lu', 'Archiver', 'Supprimer'].map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.modalOption}
              onPress={() => onOption(option)}
            >
              <Icon
                name={
                  index === 0 ? 'checkmark-circle-outline' :
                  index === 1 ? 'archive-outline' : 'trash-outline'
                }
                size={24}
                color={index === 2 ? COLORS.danger : COLORS.primary}
              />
              <Text style={[
                styles.modalOptionText,
                index === 2 && styles.modalOptionTextDanger
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ChatListScreen = ({ navigation }) => {
  const [chats, setChats] = useState(INITIAL_CHATS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [filteredChats, setFilteredChats] = useState(INITIAL_CHATS_DATA);

  // Animations
  const listAnimation = useRef(new Animated.Value(0)).current;
  const searchBarAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation d'entrée de la liste
    Animated.spring(listAnimation, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  // Filtrage des conversations
  useEffect(() => {
    const filtered = INITIAL_CHATS_DATA.filter(chat =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredChats(filtered);

    // Animation de la barre de recherche
    Animated.spring(searchBarAnimation, {
      toValue: searchQuery.length > 0 ? 1 : 0,
      tension: 40,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [searchQuery]);

  // Formatage de l'horodatage
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (days === 1) {
      return 'Hier';
    } else if (days < 7) {
      return date.toLocaleDateString('fr-FR', { weekday: 'long' });
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
      });
    }
  };

  // Rendu d'un élément de la liste
  const renderChatItem = ({ item, index }) => {
    const animationDelay = index * 100;

    return (
      <Animated.View
        style={[
          styles.chatItem,
          {
            transform: [
              {
                translateY: listAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
            opacity: listAnimation,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('Chat', { chatId: item.id, name: item.name })}
          style={styles.chatContent}
        >
          <Avatar uri={item.avatar} name={item.name} />
          
          <View style={styles.chatInfo}>
            <View style={styles.chatHeader}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
            </View>

            <View style={styles.messageRow}>
              <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
              {item.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unread}</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.editButton}
        >
          <Icon name="ellipsis-horizontal" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.searchContainer,
          {
            transform: [{
              translateY: searchBarAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10],
              }),
            }],
          },
        ]}
      >
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Animated.View>

      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <EditModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onOption={(option) => {
          console.log('Option sélectionnée:', option);
          setModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.noir,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  editButton: {
    padding: 8,
  },
  searchContainer: {
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262628',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    paddingVertical: 12,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  chatItem: {
    marginBottom: 12,
    backgroundColor: '#262628',
    borderRadius: 16,
    overflow: 'hidden',
  },
  chatContent: {
    flexDirection: 'row',
    padding: 12,
  },
  avatar: {
    backgroundColor: '#404040',
  },
  avatarFallback: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarFallbackText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#999',
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  unreadText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#262628',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#666',
    borderRadius: 2,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalOptionText: {
    marginLeft: 16,
    fontSize: 16,
    color: COLORS.white,
  },
  modalOptionTextDanger: {
    color: COLORS.danger,
  },
});

export default ChatListScreen;