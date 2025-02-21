import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  FlatList,
  Animated,
  Easing,
  Pressable
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Liste des codes pays avec indicateurs
const countryCodes = [
  { code: '+33', country: 'France' },
  { code: '+1', country: 'USA' },
  { code: '+44', country: 'UK' },
  { code: '+49', country: 'Germany' },
  { code: '+225', country: 'Côte d’Ivoire' },
  { code: '+237', country: 'Cameroun' },
  { code: '+221', country: 'Sénégal' },
];

const LoginScreen = () => {
  // États et références
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCode, setSelectedCode] = useState('+225');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const modalTranslateY = useRef(new Animated.Value(300)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  // Animation au montage du composant
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, []);

  // Gestionnaire de connexion avec animation
  const handleLogin = () => {
    // Animation de compression du bouton
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate('ChatList');
    });
  };

  // Ouverture de la modal avec animation
  const openModal = () => {
    setModalVisible(true);
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(modalTranslateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Fermeture de la modal avec animation
  const closeModal = () => {
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalTranslateY, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setModalVisible(false));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* En-tête avec animations */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Animated.Image
            source={require('./../../assets/images/1.png')}
            style={[
              styles.logo,
              {
                transform: [{
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1]
                  })
                }]
              }
            ]}
          />
          <Text style={styles.title}>ChatApp</Text>
          <Text style={styles.subtitle}>
            Connectez-vous avec votre numéro de téléphone
          </Text>
        </Animated.View>

        {/* Formulaire */}
        <View style={styles.form}>
          <Pressable
            onPress={openModal}
            style={({ pressed }) => [
              styles.inputContainer,
              pressed && styles.inputPressed
            ]}
          >
            <Text style={styles.prefix}>{selectedCode} ▼</Text>
            <TextInput
              style={styles.input}
              placeholder="Votre numéro de téléphone"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              maxLength={10}
            />
          </Pressable>

          {/* Bouton animé */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[
                styles.button,
                phoneNumber.length < 10 && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={phoneNumber.length < 10}
            >
              <Text style={styles.buttonText}>Continuer</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Lien d'inscription */}
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signupText}>Pas encore de compte ? Inscrivez-vous</Text>
        </TouchableOpacity>

        {/* Modal améliorée */}
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={closeModal}
        >
          <Pressable style={styles.modalBackdrop} onPress={closeModal}>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  opacity: modalOpacity,
                  transform: [{ translateY: modalTranslateY }]
                }
              ]}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Sélectionnez un pays</Text>
                <FlatList
                  data={countryCodes}
                  keyExtractor={(item) => item.code}
                  renderItem={({ item }) => (
                    <Pressable
                      style={({ pressed }) => [
                        styles.modalItem,
                        pressed && styles.modalItemPressed
                      ]}
                      onPress={() => {
                        setSelectedCode(item.code);
                        closeModal();
                      }}
                    >
                      <Text style={styles.modalText}>
                        {item.country} <Text style={styles.modalCode}>{item.code}</Text>
                      </Text>
                    </Pressable>
                  )}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
              </View>
            </Animated.View>
          </Pressable>
        </Modal>

        {/* Message de confidentialité */}
        <Text style={styles.privacy}>
          En continuant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Styles améliorés avec animations
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 25,
  },
  header: {
    alignItems: 'center',
    marginVertical: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
    color: '#2D3436',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    marginTop: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  inputPressed: {
    transform: [{ scale: 0.98 }],
  },
  prefix: {
    fontSize: 16,
    color: '#0984E3',
    fontWeight: '700',
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#2D3436',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'Roboto',
  },
  button: {
    backgroundColor: '#0984E3',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#0984E3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#DFE6E9',
    shadowColor: 'transparent',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  signupText: {
    fontSize: 14,
    color: '#0984E3',
    textAlign: 'center',
    marginTop: 15,
    fontWeight: '500',
  },
  privacy: {
    fontSize: 12,
    color: '#636E72',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 18,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    maxHeight: '60%',
  },
  modalContent: {
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  modalItemPressed: {
    backgroundColor: '#F8F9FA',
  },
  modalText: {
    fontSize: 16,
    color: '#2D3436',
  },
  modalCode: {
    fontWeight: '600',
    color: '#0984E3',
  },
  separator: {
    height: 1,
    backgroundColor: '#ECF0F1',
    marginHorizontal: 10,
  },
});

export default LoginScreen;