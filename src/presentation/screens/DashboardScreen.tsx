import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatRelativeDate } from '../../shared/utils/dateFormatter';
import { ErrorBanner } from '../components/ErrorBanner';
import { VitalCard } from '../components/VitalCard';
import { useVitalSigns } from '../hooks/useVitalSigns';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';

/**
 * Tela principal: Dashboard de Sinais Vitais.
 *
 * Exibe os indicadores de frequência cardíaca e passos em tempo real.
 * A tela é puramente declarativa — toda a lógica de estado está
 * encapsulada no hook useVitalSigns (ViewModel).
 *
 * Princípio: a View apenas renderiza estado e delega ações.
 */
export function DashboardScreen() {
  const { currentReading, isLoading, error, retry } = useVitalSigns();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>VitalCheck</Text>
          <Text style={styles.subtitle}>Seus sinais vitais em tempo real</Text>
        </View>

        {/* Erro */}
        {error && <ErrorBanner message={error} onDismiss={retry} />}

        {/* Loading */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>
              Conectando aos sensores...
            </Text>
          </View>
        )}

        {/* Cards de sinais vitais */}
        {currentReading && (
          <>
            <View style={styles.cardsRow}>
              <VitalCard
                title="Freq. Cardíaca"
                value={currentReading.heartRate}
                unit="bpm"
                iconName="heart"
                accentColor={Colors.heartRate}
                backgroundColor={Colors.heartRateLight}
              />
              <VitalCard
                title="Passos"
                value={currentReading.steps}
                unit="passos"
                iconName="footsteps"
                accentColor={Colors.steps}
                backgroundColor={Colors.stepsLight}
              />
            </View>

            {/* Status de atualização */}
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>
                Atualizado: {formatRelativeDate(currentReading.timestamp)}
              </Text>
            </View>

            {/* Informação sobre dados simulados */}
            <View style={styles.infoContainer}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={Colors.textSecondary}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>
                Os dados exibidos são simulados. Em uma versão de produção,
                estes valores seriam obtidos de sensores reais via Google Fit
                ou Apple HealthKit.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.lg,
    marginTop: Spacing.sm,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
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
  cardsRow: {
    flexDirection: 'row',
    marginHorizontal: -Spacing.xs,
    marginBottom: Spacing.lg,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  statusText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginTop: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
});
