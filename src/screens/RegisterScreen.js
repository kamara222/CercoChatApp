// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
//   Image,
//   Modal,
//   FlatList
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// const countryCodes = [
//   { code: '+33', country: 'France' },
//   { code: '+1', country: 'USA' },
//   { code: '+44', country: 'UK' },
//   { code: '+49', country: 'Germany' },
//   { code: '+225', country: 'Côte d’Ivoire' },
//   { code: '+237', country: 'Cameroun' },
//   { code: '+221', country: 'Sénégal' },
// ];

// const RegisterScreen = () => {
//   const [name, setName] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [selectedCode, setSelectedCode] = useState('+225');
//   const [modalVisible, setModalVisible] = useState(false);
//   const navigation = useNavigation();

//   const handleSignup = () => {
//     console.log('Nom:', name);
//     console.log('Numéro de téléphone:', `${selectedCode} ${phoneNumber}`);
//     navigation.navigate('Login');
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.content}
//       >
//         <View style={styles.header}>
//           <Image
//             source={require('./../../assets/images/1.png')}
//             style={styles.logo}
//           />
//           <Text style={styles.title}>Inscription</Text>
//           <Text style={styles.subtitle}>Créez votre compte</Text>
//         </View>

//         <View style={styles.form}>
//           <TextInput
//             style={styles.input}
//             placeholder="Votre nom"
//             value={name}
//             onChangeText={setName}
//           />
//           <View style={styles.inputContainer}>
//             <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.prefixButton}>
//               <Text style={styles.prefix}>{selectedCode} ▼</Text>
//             </TouchableOpacity>
//             <TextInput
//               style={styles.input}
//               placeholder="Votre numéro de téléphone"
//               keyboardType="phone-pad"
//               value={phoneNumber}
//               onChangeText={setPhoneNumber}
//               maxLength={10}
//             />
//           </View>
//           <TouchableOpacity
//             style={[
//               styles.button,
//               (name.trim() === '' || phoneNumber.length < 10) && styles.buttonDisabled,
//             ]}
//             onPress={handleSignup}
//             disabled={name.trim() === '' || phoneNumber.length < 10}
//           >
//             <Text style={styles.buttonText}>S'inscrire</Text>
//           </TouchableOpacity>
//         </View>

//         <Modal
//           visible={modalVisible}
//           animationType="slide"
//           transparent={true}
//           onRequestClose={() => setModalVisible(false)}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <FlatList
//                 data={countryCodes}
//                 keyExtractor={(item) => item.code}
//                 renderItem={({ item }) => (
//                   <TouchableOpacity
//                     style={styles.modalItem}
//                     onPress={() => {
//                       setSelectedCode(item.code);
//                       setModalVisible(false);
//                     }}
//                   >
//                     <Text style={styles.modalText}>{item.country} ({item.code})</Text>
//                   </TouchableOpacity>
//                 )}
//               />
//             </View>
//           </View>
//         </Modal>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   content: {
//     flex: 1,
//     padding: 20,
//   },
//   header: {
//     alignItems: 'center',
//     marginVertical: 40,
//   },
//   logo: {
//     width: 100,
//     height: 100,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#333',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//   },
//   form: {
//     marginTop: 30,
//   },
//   input: {
//     height: 50,
//     fontSize: 16,
//     color: '#333',
//     borderWidth: 1,
//     borderColor: '#DDD',
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     marginBottom: 20,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#DDD',
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     marginBottom: 20,
//   },
//   prefixButton: {
//     paddingVertical: 10,
//     paddingRight: 10,
//   },
//   prefix: {
//     fontSize: 16,
//     color: '#007AFF',
//     fontWeight: 'bold',
//   },
//   button: {
//     backgroundColor: '#007AFF',
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   buttonDisabled: {
//     backgroundColor: '#CCCCCC',
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     width: '80%',
//     borderRadius: 10,
//     padding: 20,
//   },
//   modalItem: {
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   modalText: {
//     fontSize: 16,
//     color: '#333',
//   },
// });

// export default RegisterScreen;






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

// Réutilisation de la liste des codes pays
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
  // États
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCode, setSelectedCode] = useState('+225');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const modalTranslateY = useRef(new Animated.Value(300)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const inputsTranslateX = useRef(new Animated.Value(50)).current;

  // Animation au montage
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(inputsTranslateX, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Validation du formulaire
  const isFormValid = () => {
    return fullName.length >= 3 && phoneNumber.length >= 10;
  };

  // Gestionnaire d'inscription
  const handleRegister = () => {
    if (!isFormValid()) return;

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
      // Ici, vous pouvez ajouter la logique d'inscription
      navigation.navigate('Login');
    });
  };

  // Gestion de la modal
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
        {/* En-tête */}
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
          <Text style={styles.title}>Inscription</Text>
          <Text style={styles.subtitle}>
            Créez votre compte pour commencer à chatter
          </Text>
        </Animated.View>

        {/* Formulaire */}
        <Animated.View 
          style={[
            styles.form,
            {
              transform: [{ translateX: inputsTranslateX }],
              opacity: fadeAnim
            }
          ]}
        >
          {/* Champ Nom et Prénom */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nom et Prénom"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          {/* Champ Numéro de téléphone */}
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

          {/* Bouton d'inscription */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[
                styles.button,
                !isFormValid() && styles.buttonDisabled,
              ]}
              onPress={handleRegister}
              disabled={!isFormValid()}
            >
              <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        {/* Lien de connexion */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('Login')}
          style={styles.loginLink}
        >
          <Text style={styles.loginText}>Déjà un compte ? Connectez-vous</Text>
        </TouchableOpacity>

        {/* Modal de sélection du pays */}
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
          En vous inscrivant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
  loginText: {
    fontSize: 14,
    color: '#0984E3',
    textAlign: 'center',
    marginTop: 15,
    fontWeight: '500',
  },
  loginLink: {
    marginTop: 15,
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

export default RegisterScreen;