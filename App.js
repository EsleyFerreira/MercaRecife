import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Modal,
  TextInput,
  Button,
  Linking,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Dados fictícios dos comerciantes
const initialComerciantesMadalena = [
  { id: '1', nome: 'João Silva', produto: 'Frutas e Verduras', box: '12' },
  { id: '2', nome: 'Maria Santos', produto: 'Carnes', box: '18' },
];

const initialComerciantesEncruzilhada = [
  { id: '1', nome: 'Jorge Almeida', produto: 'Pães e Bolos', box: '10' },
  { id: '2', nome: 'Carla Souza', produto: 'Peixes e Frutos do Mar', box: '21' },
];

const initialComerciantesCasaAmarela = [
  { id: '1', nome: 'Juliana Almeida', produto: 'Produtos Orgânicos', box: '1' },
  { id: '2', nome: 'Eduardo Silva', produto: 'Queijos e Embutidos', box: '11' },
];

// Coordenadas dos mercados
const marketCoordinates = {
  mercado_madalena: { latitude: -8.052204, longitude: -34.908682 },
  mercado_encruzilhada: { latitude: -8.036935, longitude: -34.892169 },
  mercado_casa_amarela: { latitude: -8.026637, longitude: -34.917866 },
};

// Tela de Splash
const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.splashContainer}>
      <Image source={require('./assets/logo.jpg')} style={styles.splashImage} />
    </SafeAreaView>
  );
};

// Tela principal (Home)
const HomeScreen = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleVisitorClick = () => {
    navigation.navigate('Visitor');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://turismo.culturamix.com/blog/wp-content/gallery/fotos-de-recife/fotos-de-recife-8.jpg' }}
        style={styles.background}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Mercados Recife</Text>

          <TouchableOpacity onPress={handleVisitorClick} style={styles.button}>
            <Text style={styles.buttonText}>Visitante</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.button}>
            <Text style={styles.buttonText}>Admin</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Modal para comerciante */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Login do Comerciante</Text>
            <TextInput
              placeholder="Admin"
              style={styles.input}
            />
            <TextInput
              placeholder="Senha"
              style={styles.input}
              secureTextEntry
            />
            <Button title="Login" onPress={() => setIsModalVisible(false)} />
            <TouchableOpacity
              onPress={() => Linking.openURL('https://wa.me/5511999999999')} // Substitua pelo número desejado
              style={styles.contactButton}
            >
              <Text style={styles.contactButtonText}>Cadastro do Comerciante</Text>
            </TouchableOpacity>
            <Button title="Cancelar" onPress={() => setIsModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Tela de visitante
const VisitorScreen = ({ navigation }) => {
  const [selectedMarket, setSelectedMarket] = useState('mercado_madalena');

  const markets = [
    { label: "Mercado da Madalena", value: "mercado_madalena", image: require('./assets/madalena.jpg') },
    { label: "Mercado da Encruzilhada", value: "mercado_encruzilhada", image: require('./assets/mercado_da_encruzilhada.jpg') },
    { label: "Mercado de Casa Amarela", value: "mercado_casa_amarela", image: require('./assets/Merca_casa_amarela.jpg') },
  ];

  const handleMarketSelect = (value) => {
    setSelectedMarket(value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Picker
        selectedValue={selectedMarket}
        onValueChange={handleMarketSelect}
        style={styles.picker}
      >
        {markets.map((market) => (
          <Picker.Item key={market.value} label={market.label} value={market.value} />
        ))}
      </Picker>

      <Image source={markets.find(m => m.value === selectedMarket).image} style={styles.marketImage} />

      <MapView
        style={styles.map}
        region={{
          latitude: marketCoordinates[selectedMarket].latitude,
          longitude: marketCoordinates[selectedMarket].longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onRegionChangeComplete={(region) => console.log(region)}
      >
        <Marker
          coordinate={marketCoordinates[selectedMarket]}
          title={markets.find(m => m.value === selectedMarket).label}
        />
      </MapView>

      <FlatList
        data={selectedMarket === 'mercado_madalena' ? initialComerciantesMadalena :
              selectedMarket === 'mercado_encruzilhada' ? initialComerciantesEncruzilhada :
              initialComerciantesCasaAmarela}
        renderItem={({ item }) => (
          <View style={styles.comercianteItem}>
            <Text style={styles.comercianteText}>{`${item.nome} - ${item.produto} (Box: ${item.box})`}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.comercianteList}
      />
    </SafeAreaView>
  );
};

// Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Visitor" component={VisitorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  marketImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  comerciantesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  comercianteItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  comercianteText: {
    fontSize: 16,
  },
  comercianteList: {
    padding: 10,
  },
  contactButton: {
    marginTop: 20,
    backgroundColor: '#25D366',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  contactButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
