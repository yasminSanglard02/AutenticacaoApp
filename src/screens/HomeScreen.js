// src/screens/HomeScreen.js
import { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { sair } from '../auth';

export default function HomeScreen({ usuario, onSair }) {
  const [saindo, setSaindo] = useState(false);
  const [erro, setErro] = useState('');

  const inicial = (usuario.name || usuario.email || '?').charAt(0).toUpperCase();

  async function aoSair() {
    setErro('');
    setSaindo(true);
    try {
      await sair(); // apaga a sessão no servidor
      onSair(); // volta para a tela de login
    } catch (e) {
      setErro(e.message);
      setSaindo(false);
    }
  }

  return (
    <View style={styles.tela}>
      <View style={styles.avatar}>
        <Text style={styles.avatarTexto}>{inicial}</Text>
      </View>

      <Text style={styles.titulo}>Olá, {usuario.name || 'usuário'}!</Text>
      <Text style={styles.subtitulo}>Você está na área logada.</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Seu e-mail</Text>
        <Text style={styles.cardValor}>{usuario.email}</Text>

        <Text style={[styles.cardLabel, { marginTop: 16 }]}>Seu ID</Text>
        <Text style={styles.cardValor}>{usuario.id}</Text>
      </View>

      {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

      <TouchableOpacity
        style={[styles.botaoSair, saindo && styles.botaoDesativado]}
        onPress={aoSair}
        disabled={saindo}
      >
        {saindo ? (
          <ActivityIndicator color="#DC2626" />
        ) : (
          <Text style={styles.botaoSairTexto}>Sair</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 24,
    paddingTop: 90,
    alignItems: 'center',
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarTexto: { color: '#FFFFFF', fontSize: 36, fontWeight: '700' },
  titulo: { fontSize: 26, fontWeight: '700', color: '#111827' },
  subtitulo: { fontSize: 15, color: '#6B7280', marginTop: 4, marginBottom: 24 },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardLabel: { fontSize: 13, color: '#6B7280' },
  cardValor: { fontSize: 16, color: '#111827', fontWeight: '600', marginTop: 2 },
  erro: { color: '#DC2626', fontSize: 14, marginTop: 16 },
  botaoSair: {
    marginTop: 32,
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#DC2626',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  botaoDesativado: { opacity: 0.6 },
  botaoSairTexto: { color: '#DC2626', fontSize: 16, fontWeight: '600' },
});
