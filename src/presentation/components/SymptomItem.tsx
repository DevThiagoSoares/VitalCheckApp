import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SymptomEntry } from '../../domain/entities/SymptomEntry';
import { formatRelativeDate } from '../../shared/utils/dateFormatter';
import { Colors } from '../theme/colors';
import { BorderRadius, Spacing } from '../theme/spacing';

interface SymptomItemProps {
  entry: SymptomEntry;
  onDelete: (id: string) => void;
}

/**
 * Componente de item para exibição de um registro de sintoma.
 *
 * Puro e sem estado — apenas renderiza dados recebidos.
 * Memoizado para evitar re-renders desnecessários em FlatList.
 *
 * Inclui confirmação de exclusão via Alert nativo para prevenir
 * deleções acidentais — padrão de UX defensivo essencial em apps de saúde.
 */
export const SymptomItem = React.memo(function SymptomItem({
  entry,
  onDelete,
}: SymptomItemProps) {
  /**
   * Confirmação antes de excluir — previne deleções acidentais.
   * Usa Alert nativo do sistema para padrão de UX consistente.
   */
  const handleDelete = useCallback(() => {
    Alert.alert(
      'Remover registro',
      `Deseja realmente remover este registro?\n\n"${entry.description.substring(0, 80)}${entry.description.length > 80 ? '...' : ''}"`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => onDelete(entry.id),
        },
      ],
      { cancelable: true }
    );
  }, [entry.id, entry.description, onDelete]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.dot} />
          <Text style={styles.timestamp}>
            {formatRelativeDate(entry.timestamp)}
          </Text>
        </View>
        <Text style={styles.description}>{entry.description}</Text>
      </View>
      <TouchableOpacity
        onPress={handleDelete}
        style={styles.deleteButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="Remover sintoma"
        accessibilityRole="button"
      >
        <Ionicons name="close-circle-outline" size={20} color={Colors.textTertiary} />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  description: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginLeft: Spacing.md,
  },
  deleteButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.sm,
  },
});
