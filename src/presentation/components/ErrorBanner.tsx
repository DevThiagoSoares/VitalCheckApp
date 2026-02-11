import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';
import { BorderRadius, Spacing } from '../theme/spacing';

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
  /** Auto-dismiss após X milissegundos. Default: 5000 */
  autoDismissMs?: number;
}

/**
 * Banner de erro reutilizável.
 *
 * Exibe mensagens de erro com opção de dismissal manual ou automático.
 * Estratégia de erro: informar o usuário sem bloquear a interação.
 *
 * Ícone de fechar usa Ionicons ao invés de caractere Unicode
 * para consistência visual com o restante da interface.
 */
export const ErrorBanner = React.memo(function ErrorBanner({
  message,
  onDismiss,
  autoDismissMs = 5000,
}: ErrorBannerProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(timer);
  }, [onDismiss, autoDismissMs]);

  return (
    <View style={styles.container}>
      <Ionicons
        name="alert-circle"
        size={18}
        color={Colors.error}
        style={styles.alertIcon}
      />
      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>
      <TouchableOpacity
        onPress={onDismiss}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityLabel="Fechar mensagem de erro"
        accessibilityRole="button"
      >
        <Ionicons name="close" size={18} color={Colors.error} />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorLight,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm + 4,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
  },
  alertIcon: {
    marginRight: Spacing.sm,
  },
  message: {
    flex: 1,
    fontSize: 13,
    color: Colors.error,
    lineHeight: 18,
  },
});
