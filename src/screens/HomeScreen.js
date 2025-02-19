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
  Modal,
  Dimensions,
} from 'react-native';

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
    name: 'Pierre Martin',
    lastMessage: 'Super, merci !',
    timestamp: new Date().toISOString(),
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    unread: 0,
  },
  {
    id: '3',
    name: 'Sophie Lambert',
    lastMessage: 'À bientôt !',
    timestamp: new Date().toISOString(),
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    unread: 3,
  },
];

const HomeScreen = ({ navigation }) => {
  // États
  const [chats, setChats] = useState(INITIAL_CHATS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [filteredChats, setFilteredChats] = useState(INITIAL_CHATS_DATA);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const searchBarAnim = useRef(new Animated.Value(0)).current;

  // Animation d'entrée lors du montage du composant
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Effet pour filtrer les chats en fonction de la recherche
  useEffect(() => {
    const filtered = INITIAL_CHATS_DATA.filter(chat =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredChats(filtered);

    // Animation de la barre de recherche
    Animated.spring(searchBarAnim, {
      toValue: searchQuery.length > 0 ? 1 : 0,
      tension: 40,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [searchQuery]);

  // Fonction pour formater l'horodatage
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Composant Modal avec options
  const OptionsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Options</Text>
          <TouchableOpacity style={styles.modalOption}>
            <Text>Marquer tout comme lu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalOption}>
            <Text>Archiver les conversations</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalOption}>
            <Text>Supprimer les conversations</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.modalCloseText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Rendu d'un élément de la liste avec animation
  const renderChatItem = ({ item, index }) => (
    <Animated.View
      style={[
        styles.chatItem,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 50 * index],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate('Chat', { chatId: item.id, name: item.name })}
      >
        <View style={styles.chatContent}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: item.avatar }}
              style={styles.avatar}
              onError={(e) => console.log('Erreur de chargement de l\'avatar:', e.nativeEvent.error)}
            />
          </View>

          <View style={styles.chatInfo}>
            <View style={styles.chatHeader}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
            </View>

            <View style={styles.messageRow}>
              <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
              {item.unread > 0 && (
                <Animated.View
                  style={[
                    styles.unreadBadge,
                    {
                      transform: [{ scale: fadeAnim }]
                    }
                  ]}
                >
                  <Text style={styles.unreadText}>{item.unread}</Text>
                </Animated.View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête avec bouton Modifier */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.editButton}>Modifier</Text>
        </TouchableOpacity>
      </View>

      {/* Barre de recherche animée */}
      <Animated.View style={[
        styles.searchContainer,
        {
          transform: [{
            translateY: searchBarAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -10],
            })
          }]
        }
      ]}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une conversation..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Animated.View>

      {/* Liste des chats */}
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshing={false}
        onRefresh={() => {
          console.log('Rafraîchissement...');
        }}
      />

      {/* Modal des options */}
      <OptionsModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  editButton: {
    color: '#007AFF',
    fontSize: 16,
  },
  searchContainer: {
    padding: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
  },
  listContainer: {
    paddingVertical: 8,
  },
  chatItem: {
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chatContent: {
    flexDirection: 'row',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },




  chatInfo: {
    flex: 1,
    justifyContent: 'center',
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
    color: '#000000',
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#666666',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },



  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;