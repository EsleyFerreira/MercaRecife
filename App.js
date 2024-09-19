import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text, SafeAreaView, Alert, TouchableOpacity, FlatList, ImageBackground, Dimensions, Modal, TextInput, Button } from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Dados fictícios dos comerciantes
const comerciantesMadalena = [
  { id: '1', nome: 'João Silva', produto: 'Frutas e Verduras', box: '12', latitude: -8.052204, longitude: -34.908682 },
  { id: '2', nome: 'Maria Santos', produto: 'Carnes', box: '18', latitude: -8.052204, longitude: -34.908682 },
];

const comerciantesEncruzilhada = [
  { id: '1', nome: 'Jorge Almeida', produto: 'Pães e Bolos', box: '10', latitude: -8.036935, longitude: -34.892169 },
  { id: '2', nome: 'Carla Souza', produto: 'Peixes e Frutos do Mar', box: '21', latitude: -8.036935, longitude: -34.892169 },
];

const comerciantesCasaAmarela = [
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

  const handlePickerChange = (itemValue) => {
    setSelectedMarket(itemValue);
    if (itemValue === 'mercado_madalena') {
      navigation.navigate('Comerciantes', { market: 'Madalena', comerciantes: comerciantesMadalena });
    } else if (itemValue === 'mercado_encruzilhada') {
      navigation.navigate('Comerciantes', { market: 'Encruzilhada', comerciantes: comerciantesEncruzilhada });
    } else if (itemValue === 'mercado_casa_amarela') {
      navigation.navigate('Comerciantes', { market: 'Casa Amarela', comerciantes: comerciantesCasaAmarela });
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
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

// Tela de Comerciantes
const ComercianteScreen = ({ route }) => {
  const { market, comerciantes } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [produto, setProduto] = useState('');
  const [box, setBox] = useState('');

  const handleAddComerciante = () => {
    const newComerciante = {
      id: (comerciantes.length + 1).toString(),
      nome,
      produto,
      box,
      latitude: -8.052204, // Substitua pela latitude correta
      longitude: -34.908682, // Substitua pela longitude correta
    };
    comerciantes.push(newComerciante);
    setModalVisible(false);
    setNome('');
    setProduto('');
    setBox('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{market}</Text>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: market === 'Madalena' ? -8.052204 : market === 'Encruzilhada' ? -8.036935 : -8.026637,
          longitude: market === 'Madalena' ? -34.908682 : market === 'Encruzilhada' ? -34.892169 : -34.917866,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {comerciantes.map((comerciante) => (
          <Marker
            key={comerciante.id}
            coordinate={{ latitude: comerciante.latitude, longitude: comerciante.longitude }}
            title={comerciante.nome}
            description={comerciante.produto}
          />
        ))}
      </MapView>

      <Text style={styles.comerciantesTitle}>Comerciantes</Text>

      <FlatList
        data={comerciantes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text>Produto: {item.produto}</Text>
            <Text>Box: {item.box}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Icon name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Modal para cadastro de comerciante */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
            <TextInput placeholder="Produto" value={produto} onChangeText={setProduto} style={styles.input} />
            <TextInput placeholder="Número do Box" value={box} onChangeText={setBox} style={styles.input} keyboardType="numeric" />
            <Button title="Cadastrar" onPress={handleAddComerciante} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Stack Navigator
const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Mercados Recife' }} />
        <Stack.Screen name="Comerciantes" component={ComercianteScreen} options={({ route }) => ({ title: route.params.market })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Estilos
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFE2C4',
  },
  splashImage: {
    width: 200,
    height: 200,
  },
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFD700',
  },
  picker: {
    width: '100%',
    height: 50,
    marginBottom: 20,
    color: '#000000',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    marginBottom: 10,
  },
  imageWrapper: {
    alignItems: 'center',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  imageLabel: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  map: {
    width: '100%',
    height: Dimensions.get('window').height * 0.4,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    width: '100%',
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0057A8',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  comerciantesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#0057A8',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#28a745',
    borderRadius: 30,
    padding: 10,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default App;
