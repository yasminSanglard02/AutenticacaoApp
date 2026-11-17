// src/screens/LoginScreen.js
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { entrar, buscarSessao } from '../auth';

export default function LoginScreen({ onAutenticado, onIrParaCadastro }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function aoEntrar() {
    setErro('');

    if (!email.trim() || !senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }

    setCarregando(true);
    try {
      await entrar({ email: email.trim().toLowerCase(), password: senha });

      // Confirma que a sessão ficou salva no celular.
      const sessao = await buscarSessao();
      if (!sessao) {
        throw new Error(
          'Login feito, mas a sessão não foi salva neste aparelho. Veja a seção de problemas no tutorial.'
        );
      }
      onAutenticado(sessao.user);
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
        <Text style={styles.titulo}>Bem-vindo de volta</Text>
        <Text style={styles.subtitulo}>Entre para acessar sua área.</Text>

        <View style={styles.card}>
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
            placeholder="Sua senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            autoCapitalize="none"
          />

          {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

          <TouchableOpacity
            style={[styles.botao, carregando && styles.botaoDesativado]}
            onPress={aoEntrar}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.botaoTexto}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onIrParaCadastro} style={styles.link}>
          <Text style={styles.linkTexto}>
            Não tem conta? <Text style={styles.linkDestaque}>Cadastre-se</Text>
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
