import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';

interface EmptyStateProps {
  /** Nome do ícone Ionicons */
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}

/**
 * Componente genérico para estados vazios.
 *
 * Exibido quando listas estão vazias, melhorando a UX
 * ao guiar o usuário sobre o que fazer.
 *
 * Usa Ionicons para ícones vetoriais consistentes
 * entre Android e iOS.
 */
export const EmptyState = React.memo(function EmptyState({
  iconName,
  title,
  subtitle,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons
        name={iconName}
        size={48}
        color={Colors.textTertiary}
        style={styles.icon}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  icon: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
