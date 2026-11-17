// App.js
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { buscarSessao } from './src/auth';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  // 'carregando' | 'login' | 'cadastro' | 'home'
  const [tela, setTela] = useState('carregando');
  const [usuario, setUsuario] = useState(null);

  // Ao abrir o app: já existe uma sessão salva?
  useEffect(() => {
    async function verificar() {
      try {
        const sessao = await buscarSessao();
        if (sessao) {
          setUsuario(sessao.user);
          setTela('home');
        } else {
          setTela('login');
        }
      } catch (e) {
        setTela('login');
      }
    }
    verificar();
  }, []);

  function aoAutenticar(user) {
    setUsuario(user);
    setTela('home');
  }

  function aoSair() {
    setUsuario(null);
    setTela('login');
  }

  let conteudo;
  if (tela === 'carregando') {
    conteudo = (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  } else if (tela === 'login') {
    conteudo = (
      <LoginScreen
        onAutenticado={aoAutenticar}
        onIrParaCadastro={() => setTela('cadastro')}
      />
    );
  } else if (tela === 'cadastro') {
    conteudo = (
      <RegisterScreen
        onAutenticado={aoAutenticar}
        onIrParaLogin={() => setTela('login')}
      />
    );
  } else {
    conteudo = <HomeScreen usuario={usuario} onSair={aoSair} />;
  }

  return (
    <>
      <StatusBar style="dark" />
      {conteudo}
    </>
  );
}

const styles = StyleSheet.create({
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
});
