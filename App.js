import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Dimensions,
  Modal,
  TextInput,
  Button
} from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MapView, { Marker } from 'react-native-maps';

// Dados fictícios dos comerciantes
const initialComerciantesMadalena = [
  { id: '1', nome: 'João Silva', produto: 'Frutas e Verduras', box: '12', latitude: -8.052204, longitude: -34.908682 },
  { id: '2', nome: 'Maria Santos', produto: 'Carnes', box: '18', latitude: -8.052204, longitude: -34.908682 },
];

const initialComerciantesEncruzilhada = [
  { id: '1', nome: 'Jorge Almeida', produto: 'Pães e Bolos', box: '10', latitude: -8.036935, longitude: -34.892169 },
  { id: '2', nome: 'Carla Souza', produto: 'Peixes e Frutos do Mar', box: '21', latitude: -8.036935, longitude: -34.892169 },
];

const initialComerciantesCasaAmarela = [
  { id: '1', nome: 'Juliana Almeida', produto: 'Produtos Orgânicos', box: '1', latitude: -8.026637, longitude: -34.917866 },
  { id: '2', nome: 'Eduardo Silva', produto: 'Queijos e Embutidos', box: '11', latitude: -8.026637, longitude: -34.917866 },
];

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
      <Image source={require('./assets/logo1.jpg')} style={styles.splashImage} />
    </SafeAreaView>
  );
};

// Tela principal (Home)
const HomeScreen = ({ navigation }) => {
  const [selectedMarket, setSelectedMarket] = useState('');
  const [isAdminVisible, setIsAdminVisible] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [pendentes, setPendentes] = useState([]); // Estado para comerciantes pendentes
  const [comerciantesMadalena, setComerciantesMadalena] = useState(initialComerciantesMadalena);
  const [comerciantesEncruzilhada, setComerciantesEncruzilhada] = useState(initialComerciantesEncruzilhada);
  const [comerciantesCasaAmarela, setComerciantesCasaAmarela] = useState(initialComerciantesCasaAmarela);

  const handleAdminLogin = () => {
    if (adminUsername === 'admin' && adminPassword === 'admin') {
      setIsAdminVisible(false);
      navigation.navigate('Admin', { pendentes, setPendentes, setComerciantesMadalena, setComerciantesEncruzilhada, setComerciantesCasaAmarela });
    } else {
      Alert.alert('Erro', 'Usuário ou senha incorretos!');
    }
  };

  const handlePickerChange = (itemValue) => {
    setSelectedMarket(itemValue);
    if (itemValue === 'mercado_madalena') {
      navigation.navigate('Comerciantes', { market: 'Madalena', comerciantes: comerciantesMadalena, setPendentes });
    } else if (itemValue === 'mercado_encruzilhada') {
      navigation.navigate('Comerciantes', { market: 'Encruzilhada', comerciantes: comerciantesEncruzilhada, setPendentes });
    } else if (itemValue === 'mercado_casa_amarela') {
      navigation.navigate('Comerciantes', { market: 'Casa Amarela', comerciantes: comerciantesCasaAmarela, setPendentes });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://turismo.culturamix.com/blog/wp-content/gallery/fotos-de-recife/fotos-de-recife-8.jpg' }}
        style={styles.background}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Mercados Recife</Text>
          <RNPicker
            selectedValue={selectedMarket}
            onValueChange={handlePickerChange}
            style={styles.picker}
          >
            <RNPicker.Item label="Selecione um mercado" value="" />
            <RNPicker.Item label="Mercado da Madalena" value="mercado_madalena" />
            <RNPicker.Item label="Mercado da Encruzilhada" value="mercado_encruzilhada" />
            <RNPicker.Item label="Mercado de Casa Amarela" value="mercado_casa_amarela" />
          </RNPicker>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={() => handlePickerChange('mercado_madalena')}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Mercadomadalena.jpg/1200px-Mercadomadalena.jpg' }}
                  style={styles.image}
                />
                <Text style={styles.imageLabel}>Madalena</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePickerChange('mercado_encruzilhada')}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: 'https://www2.recife.pe.gov.br/sites/default/files/styles/imagem_slide_home/public/mercado_da_encruzilhada.jpg?itok=rxnfUUAe' }}
                  style={styles.image}
                />
                <Text style={styles.imageLabel}>Encruzilhada</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePickerChange('mercado_casa_amarela')}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: 'https://mercadosempe.com/wp-content/uploads/2022/05/001-mercadosempe-casa-amarela.jpg' }}
                  style={styles.image}
                />
                <Text style={styles.imageLabel}>Casa Amarela</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Botão para login de admin */}
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => setIsAdminVisible(true)}
          >
            <Text style={styles.adminButtonText}>Admin</Text>
          </TouchableOpacity>

          {/* Modal para login de admin */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={isAdminVisible}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <TextInput
                  placeholder="Usuário"
                  value={adminUsername}
                  onChangeText={setAdminUsername}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Senha"
                  value={adminPassword}
                  onChangeText={setAdminPassword}
                  style={styles.input}
                  secureTextEntry
                />
                <Button title="Login" onPress={handleAdminLogin} />
                <Button
                  title="Cancelar"
                  onPress={() => setIsAdminVisible(false)}
                  color="red"
                />
              </View>
            </View>
          </Modal>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

// Tela de comerciantes
const ComercianteScreen = ({ route }) => {
  const { comerciantes, market, setPendentes, setComerciantes } = route.params; // Receber setComerciantes
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newNome, setNewNome] = useState('');
  const [newProduto, setNewProduto] = useState('');
  const [newBox, setNewBox] = useState('');

  const handleAddComerciante = () => {
    const newComerciante = {
      id: Date.now().toString(),
      nome: newNome,
      produto: newProduto,
      box: newBox,
    };

    // Adiciona o comerciante à lista de pendentes
    setPendentes((prevPendentes) => [...prevPendentes, newComerciante]);
    Alert.alert('Solicitação enviada', 'Seu cadastro foi enviado para aprovação.');

    // Limpa os campos
    setNewNome('');
    setNewProduto('');
    setNewBox('');
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.comerciantesTitle}>Comerciantes - {market}</Text>
      <MapView style={styles.map}>
        {comerciantes.map((comerciante) => (
          <Marker
            key={comerciante.id}
            coordinate={{ latitude: comerciante.latitude, longitude: comerciante.longitude }}
            title={comerciante.nome}
            description={`${comerciante.produto} (Box: ${comerciante.box})`}
          />
        ))}
      </MapView>

      <FlatList
        data={comerciantes}
        renderItem={({ item }) => (
          <View style={styles.comercianteItem}>
            <Text style={styles.comercianteText}>{`${item.nome} - ${item.produto} (Box: ${item.box})`}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.comercianteList}
      />

      <Button title="Adicionar Comerciante" onPress={() => setIsModalVisible(true)} />

      {/* Modal para adicionar comerciante */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TextInput
              placeholder="Nome"
              value={newNome}
              onChangeText={setNewNome}
              style={styles.input}
            />
            <TextInput
              placeholder="Produto"
              value={newProduto}
              onChangeText={setNewProduto}
              style={styles.input}
            />
            <TextInput
              placeholder="Box"
              value={newBox}
              onChangeText={setNewBox}
              style={styles.input}
            />
            <Button title="Enviar" onPress={handleAddComerciante} />
            <Button
              title="Cancelar"
              onPress={() => setIsModalVisible(false)}
              color="red"
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Tela de admin
const AdminScreen = ({ route }) => {
  const { pendentes, setPendentes, setComerciantesMadalena, setComerciantesEncruzilhada, setComerciantesCasaAmarela } = route.params;

  const handleAcceptComerciante = (id) => {
    const comerciante = pendentes.find((item) => item.id === id);
    if (comerciante) {
      // Adiciona o comerciante ao respectivo mercado
      if (comerciante.box.startsWith('Madalena')) {
        setComerciantesMadalena((prev) => [...prev, comerciante]);
      } else if (comerciante.box.startsWith('Encruzilhada')) {
        setComerciantesEncruzilhada((prev) => [...prev, comerciante]);
      } else if (comerciante.box.startsWith('Casa Amarela')) {
        setComerciantesCasaAmarela((prev) => [...prev, comerciante]);
      }

      // Remove o comerciante da lista de pendentes
      setPendentes((prev) => prev.filter((item) => item.id !== id));
      Alert.alert('Comerciante Aceito', 'O comerciante foi aceito com sucesso!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.adminTitle}>Admin - Pendentes</Text>
      <FlatList
        data={pendentes}
        renderItem={({ item }) => (
          <View style={styles.pendingItem}>
            <Text>{`${item.nome} - ${item.produto} (Box: ${item.box})`}</Text>
            <Button title="Aceitar" onPress={() => handleAcceptComerciante(item.id)} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.pendingList}
      />
    </SafeAreaView>
  );
};

// Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  const [pendentes, setPendentes] = useState([]);
  const [comerciantesMadalena, setComerciantesMadalena] = useState(initialComerciantesMadalena);
  const [comerciantesEncruzilhada, setComerciantesEncruzilhada] = useState(initialComerciantesEncruzilhada);
  const [comerciantesCasaAmarela, setComerciantesCasaAmarela] = useState(initialComerciantesCasaAmarela);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} setPendentes={setPendentes} />}
        </Stack.Screen>
        <Stack.Screen name="Comerciantes">
          {(props) => (
            <ComercianteScreen
              {...props}
              setPendentes={setPendentes}
              setComerciantesMadalena={setComerciantesMadalena}
              setComerciantesEncruzilhada={setComerciantesEncruzilhada}
              setComerciantesCasaAmarela={setComerciantesCasaAmarela}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Admin">
          {(props) => (
            <AdminScreen
              {...props}
              pendentes={pendentes}
              setPendentes={setPendentes}
              setComerciantesMadalena={setComerciantesMadalena}
              setComerciantesEncruzilhada={setComerciantesEncruzilhada}
              setComerciantesCasaAmarela={setComerciantesCasaAmarela}
            />
          )}
        </Stack.Screen>
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
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Leve brilho
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: 300,
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  imageWrapper: {
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50, // Imagem circular
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 0, 0.5)', // Borda amarela clara
  },
  imageLabel: {
    marginTop: 5,
  },
  adminButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  adminButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 5,
  },
  comerciantesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
  },
  map: {
    width: Dimensions.get('window').width,
    height: 300,
  },
  comercianteItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  comercianteText: {
    fontSize: 16,
  },
  comercianteList: {
    paddingHorizontal: 20,
  },
  pendingItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  pendingList: {
    paddingHorizontal: 20,
  },
  adminTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
  },
});