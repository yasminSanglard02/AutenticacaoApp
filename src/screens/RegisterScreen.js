// src/screens/RegisterScreen.js
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { cadastrar, buscarSessao } from '../auth';

export default function RegisterScreen({ onAutenticado, onIrParaLogin }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function aoCadastrar() {
    setErro('');

    if (!nome.trim() || !email.trim() || !senha) {
      setErro('Preencha nome, e-mail e senha.');
      return;
    }
    if (senha.length < 8) {
      setErro('A senha precisa ter pelo menos 8 caracteres.');
      return;
    }

    setCarregando(true);
    try {
      await cadastrar({
        name: nome.trim(),
        email: email.trim().toLowerCase(),
        password: senha,
      });

      // Depois do cadastro, o Neon já cria a sessão. Vamos confirmar.
      const sessao = await buscarSessao();
      if (sessao) {
        onAutenticado(sessao.user);
      } else {
        // Acontece se a verificação de e-mail estiver ligada.
        Alert.alert('Conta criada', 'Agora faça login para continuar.');
        onIrParaLogin();
      }
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.titulo}>Criar conta</Text>
        <Text style={styles.subtitulo}>Leva menos de um minuto.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="voce@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Mínimo 8 caracteres"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            autoCapitalize="none"
          />

          {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

          <TouchableOpacity
            style={[styles.botao, carregando && styles.botaoDesativado]}
            onPress={aoCadastrar}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.botaoTexto}>Cadastrar</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onIrParaLogin} style={styles.link}>
          <Text style={styles.linkTexto}>
            Já tem conta? <Text style={styles.linkDestaque}>Entrar</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#F3F4F6' },
  conteudo: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingTop: 60 },
  titulo: { fontSize: 30, fontWeight: '700', color: '#111827' },
  subtitulo: { fontSize: 15, color: '#6B7280', marginTop: 4, marginBottom: 24 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
  },
  erro: { color: '#DC2626', fontSize: 14, marginBottom: 12 },
  botao: {
    backgroundColor: '#4F46E5',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  botaoDesativado: { opacity: 0.6 },
  botaoTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  link: { marginTop: 20, alignItems: 'center' },
  linkTexto: { fontSize: 15, color: '#6B7280' },
  linkDestaque: { color: '#4F46E5', fontWeight: '600' },
});
