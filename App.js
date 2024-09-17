import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, SafeAreaView, Alert, TouchableOpacity, FlatList, ImageBackground, Dimensions, TextInput, Button } from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';

// Dados fictícios dos comerciantes
const comerciantesMadalena = [
  { id: '1', nome: 'João Silva', produto: 'Frutas e Verduras', box: '12' },
  { id: '2', nome: 'Maria Santos', produto: 'Carnes', box: '18' },
  { id: '3', nome: 'Pedro Oliveira', produto: 'Peixes', box: '5' },
  { id: '4', nome: 'Ana Souza', produto: 'Queijos e Frios', box: '23' },
  { id: '5', nome: 'Lucas Lima', produto: 'Padaria', box: '9' },
  { id: '6', nome: 'Clara Mendes', produto: 'Doces e Bolos', box: '14' },
  { id: '7', nome: 'Paulo Araújo', produto: 'Tempero e Especiarias', box: '16' },
  { id: '8', nome: 'Rita Fernandes', produto: 'Hortifruti', box: '20' },
  { id: '9', nome: 'Carlos Silva', produto: 'Bebidas', box: '22' },
  { id: '10', nome: 'Fernanda Costa', produto: 'Artesanato', box: '8' },
];

const comerciantesEncruzilhada = [
  { id: '1', nome: 'Jorge Almeida', produto: 'Pães e Bolos', box: '10' },
  { id: '2', nome: 'Carla Souza', produto: 'Peixes e Frutos do Mar', box: '21' },
  { id: '3', nome: 'Lucas Pereira', produto: 'Frutas', box: '4' },
  { id: '4', nome: 'Paula Mendes', produto: 'Queijos', box: '13' },
  { id: '5', nome: 'Rafael Lima', produto: 'Doces Caseiros', box: '6' },
  { id: '6', nome: 'Beatriz Silva', produto: 'Flores e Plantas', box: '7' },
  { id: '7', nome: 'Carlos Oliveira', produto: 'Carnes', box: '15' },
  { id: '8', nome: 'Fernanda Alves', produto: 'Produtos Naturais', box: '19' },
  { id: '9', nome: 'José Pereira', produto: 'Especiarias', box: '2' },
  { id: '10', nome: 'Mariana Costa', produto: 'Bebidas Artesanais', box: '11' },
];

const comerciantesCasaAmarela = [
  { id: '1', nome: 'Juliana Almeida', produto: 'Produtos Orgânicos', box: '1' },
  { id: '2', nome: 'Eduardo Silva', produto: 'Queijos e Embutidos', box: '11' },
  { id: '3', nome: 'Luana Costa', produto: 'Pães e Bolos', box: '14' },
  { id: '4', nome: 'Marcelo Lima', produto: 'Carnes e Aves', box: '19' },
  { id: '5', nome: 'Ana Paula', produto: 'Frutas e Verduras', box: '22' },
  { id: '6', nome: 'Roberta Fernandes', produto: 'Especiarias', box: '7' },
  { id: '7', nome: 'Carlos Almeida', produto: 'Flores e Plantas', box: '13' },
  { id: '8', nome: 'Simone Pereira', produto: 'Artesanato', box: '3' },
  { id: '9', nome: 'Tiago Santos', produto: 'Bebidas', box: '16' },
  { id: '10', nome: 'Mariana Silva', produto: 'Doces e Bolos', box: '8' },
];

// Coordenadas dos mercados
const MARKET_COORDINATES = {
  Madalena: { latitude: -8.052204, longitude: -34.908682 }, // Exemplo de coordenadas
  Encruzilhada: { latitude: -8.036935, longitude: -34.892169 }, // Exemplo de coordenadas
  CasaAmarela: { latitude: -8.026637, longitude: -34.917866 }, // Exemplo de coordenadas
};

// Tela de Splash
const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home'); // Substitui a tela de splash pela tela principal
    }, 3000); // Exibe a splash screen por 3 segundos

    return () => clearTimeout(timer); // Limpa o timeout se o componente for desmontado
  }, [navigation]);

  return (
    <SafeAreaView style={styles.splashContainer}>
      <Image
        source={require('./assets/logo1.jpg')} // Imagem local na raiz do projeto
        style={styles.splashImage}
      />
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

  const handleImagePress = (marketName) => {
    if (marketName === 'Madalena') {
      navigation.navigate('Comerciantes', { market: 'Madalena', comerciantes: comerciantesMadalena });
    } else if (marketName === 'Encruzilhada') {
      navigation.navigate('Comerciantes', { market: 'Encruzilhada', comerciantes: comerciantesEncruzilhada });
    } else if (marketName === 'Casa Amarela') {
      navigation.navigate('Comerciantes', { market: 'Casa Amarela', comerciantes: comerciantesCasaAmarela });
    } else {
      Alert.alert(`Você clicou na imagem do ${marketName}`);
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
            <TouchableOpacity onPress={() => handleImagePress('Madalena')}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Mercadomadalena.jpg/1200px-Mercadomadalena.jpg' }}
                  style={styles.image}
                />
                <Text style={styles.imageLabel}>Madalena</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleImagePress('Encruzilhada')}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/p/AF1QipOCjlYcY5FPgYe-ut5P1IkpN6zxlQfWzvdUsYSs=s680-w680-h510' }}
                  style={styles.image}
                />
                <Text style={styles.imageLabel}>Encruzilhada</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleImagePress('Casa Amarela')}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: 'https://visit.recife.br/wp-content/uploads/2018/04/o-que-fazer-mercado-de-casa-amarela-topo-mobile.jpg' }}
                  style={styles.image}
                />
                <Text style={styles.imageLabel}>Casa Amarela</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -8.058,
            longitude: -34.891,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={MARKET_COORDINATES.Madalena}
            title="Mercado da Madalena"
            onPress={() => handleImagePress('Madalena')}
          />
          <Marker
            coordinate={MARKET_COORDINATES.Encruzilhada}
            title="Mercado da Encruzilhada"
            onPress={() => handleImagePress('Encruzilhada')}
          />
          <Marker
            coordinate={MARKET_COORDINATES.CasaAmarela}
            title="Mercado de Casa Amarela"
            onPress={() => handleImagePress('Casa Amarela')}
          />
        </MapView>
      </View>
    </SafeAreaView>
  );
};

// Tela de Comerciantes
const ComercianteScreen = ({ route, navigation }) => {
  const { comerciantes, market } = route.params;

  const handleCadastroPress = () => {
    navigation.navigate('Cadastro', { market });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={comerciantes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.comercianteContainer}>
            <Text style={styles.comercianteText}>Nome: {item.nome}</Text>
            <Text style={styles.comercianteText}>Produto: {item.produto}</Text>
            <Text style={styles.comercianteText}>Box: {item.box}</Text>
          </View>
        )}
      />
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={handleCadastroPress}
      >
        <Icon name="plus" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// Tela de Cadastro
const CadastroScreen = ({ route }) => {
  const { market } = route.params;
  const [box, setBox] = useState('');
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');

  const handleCadastro = () => {
    // Implementar lógica de cadastro aqui
    alert(`Cadastro realizado com sucesso para o mercado ${market}!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Cadastro de Comerciante</Text>
      <TextInput
        style={styles.input}
        placeholder="Número do Box"
        value={box}
        onChangeText={setBox}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Nome da Pessoa"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Categoria"
        value={categoria}
        onChangeText={setCategoria}
      />
      <Button title="Cadastrar" onPress={handleCadastro} />
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
        <Stack.Screen name="Comerciantes" component={ComercianteScreen} options={({ route }) => ({ title: `Comerciantes do ${route.params.market}` })} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ title: 'Cadastro' }} />
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
  container: {
    flex: 1,
    padding: 20,
  },
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  picker: {
    width: 200,
    height: 50,
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribui as imagens com espaço igual
    marginBottom: 20,
  },
  imageWrapper: {
    alignItems: 'center',
    marginHorizontal: 10, // Espaçamento horizontal entre as imagens
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  imageLabel: {
    marginTop: 5,
    fontSize: 16,
  },
  button: {
    marginTop: 20,
  },
  mapContainer: {
    flex: 1,
    marginTop: 20,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
  },
  comercianteContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  comercianteText: {
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
