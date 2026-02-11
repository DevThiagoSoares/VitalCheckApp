import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymptomEntry } from '../../domain/entities/SymptomEntry';
import { EmptyState } from '../components/EmptyState';
import { ErrorBanner } from '../components/ErrorBanner';
import { SymptomForm } from '../components/SymptomForm';
import { SymptomItem } from '../components/SymptomItem';
import { useSymptomLog } from '../hooks/useSymptomLog';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';

/**
 * Tela de Diário de Sintomas.
 *
 * Permite ao usuário registrar e visualizar o histórico de sintomas.
 * Toda lógica de estado e operações está no hook useSymptomLog.
 *
 * Padrões de UX aplicados:
 * - Feedback visual durante operações (loading, saving)
 * - Empty state informativo
 * - Tratamento de erros não-bloqueante
 * - KeyboardAvoidingView para melhor UX com teclado
 */
export function SymptomLogScreen() {
  const {
    entries,
    isLoading,
    isSaving,
    error,
    addEntry,
    removeEntry,
    clearError,
  } = useSymptomLog();

  /**
   * Extrai a chave única para cada item da FlatList.
   * Memoizado para evitar recriação desnecessária.
   */
  const keyExtractor = useCallback(
    (item: SymptomEntry) => item.id,
    []
  );

  /**
   * Renderiza cada item da lista.
   * Uso de useCallback para manter referência estável e evitar
   * re-renders de SymptomItem via React.memo.
   */
  const renderItem = useCallback(
    ({ item }: { item: SymptomEntry }) => (
      <SymptomItem entry={item} onDelete={removeEntry} />
    ),
    [removeEntry]
  );

  const renderEmpty = useCallback(
    () =>
      !isLoading ? (
        <EmptyState
          iconName="clipboard-outline"
          title="Nenhum sintoma registrado"
          subtitle="Use o campo acima para registrar como você está se sentindo."
        />
      ) : null,
    [isLoading]
  );

  const renderHeader = useCallback(
    () => (
      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>Histórico</Text>
        <Text style={styles.sectionCount}>
          {entries.length} {entries.length === 1 ? 'registro' : 'registros'}
        </Text>
      </View>
    ),
    [entries.length]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Diário de Sintomas</Text>
            <Text style={styles.subtitle}>Registre como você está se sentindo</Text>
          </View>

          {/* Erro */}
          {error && (
            <View style={styles.errorContainer}>
              <ErrorBanner message={error} onDismiss={clearError} />
            </View>
          )}

          {/* Formulário de entrada */}
          <View style={styles.formContainer}>
            <SymptomForm onSubmit={addEntry} isSaving={isSaving} />
          </View>

          {/* Loading */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Carregando histórico...</Text>
            </View>
          ) : (
            /* Lista de sintomas */
            <FlatList
              data={entries}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              ListHeaderComponent={renderHeader}
              ListEmptyComponent={renderEmpty}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              // Otimizações de performance para listas longas
              initialNumToRender={15}
              maxToRenderPerBatch={10}
              windowSize={5}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  errorContainer: {
    paddingHorizontal: Spacing.md,
  },
  formContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  sectionCount: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
