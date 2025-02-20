import React, { useState } from 'react';
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
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCode, setSelectedCode] = useState('+225');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleLogin = () => {
    console.log('Numéro de téléphone:', `${selectedCode} ${phoneNumber}`);
    // navigation.navigate('MainTabs'); // Navigue vers HomeScreen
    navigation.navigate('ChatList'); // Navigue vers HomeScreen
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Logo et Titre */}
        <View style={styles.header}>
          <Image
            source={require('./../../assets/images/1.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>ChatApp</Text>
          <Text style={styles.subtitle}>
            Connectez-vous avec votre numéro de téléphone
          </Text>
        </View>

        {/* Formulaire */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            {/* Bouton pour ouvrir la modal */}
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.prefixButton}>
              <Text style={styles.prefix}>{selectedCode} ▼</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Votre numéro de téléphone"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              maxLength={10}
            />
          </View>

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
        </View>

        {/* Lien vers la page d'inscription */}
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signupText}>Pas encore de compte ? Inscrivez-vous</Text>
        </TouchableOpacity>

        {/* Modal de sélection du code pays */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={countryCodes}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedCode(item.code);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalText}>{item.country} ({item.code})</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Message de confidentialité */}
        <Text style={styles.privacy}>
          En continuant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    marginTop: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  prefixButton: {
    paddingVertical: 10,
    paddingRight: 10,
  },
  prefix: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupText: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 15,
  },
  privacy: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LoginScreen;
