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

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCode, setSelectedCode] = useState('+225');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleSignup = () => {
    console.log('Nom:', name);
    console.log('Numéro de téléphone:', `${selectedCode} ${phoneNumber}`);
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Image
            source={require('./../../assets/images/1.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>Inscription</Text>
          <Text style={styles.subtitle}>Créez votre compte</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Votre nom"
            value={name}
            onChangeText={setName}
          />
          <View style={styles.inputContainer}>
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
              (name.trim() === '' || phoneNumber.length < 10) && styles.buttonDisabled,
            ]}
            onPress={handleSignup}
            disabled={name.trim() === '' || phoneNumber.length < 10}
          >
            <Text style={styles.buttonText}>S'inscrire</Text>
          </TouchableOpacity>
        </View>

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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
  input: {
    height: 50,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
  },
});

export default RegisterScreen;
