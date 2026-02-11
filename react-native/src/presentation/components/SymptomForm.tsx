import * as Haptics from 'expo-haptics';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../theme/colors';
import { BorderRadius, Spacing } from '../theme/spacing';

interface SymptomFormProps {
  onSubmit: (description: string) => Promise<boolean>;
  isSaving: boolean;
}

/**
 * Componente de formulário para registro de novos sintomas.
 *
 * Gerencia apenas estado local do input (texto digitado).
 * A lógica de persistência é delegada ao callback `onSubmit`.
 *
 * Inclui feedback háptico ao salvar com sucesso — melhora
 * a percepção tátil de que a ação foi completada.
 *
 * Validação visual: botão desabilitado quando input está vazio.
 */
export const SymptomForm = React.memo(function SymptomForm({
  onSubmit,
  isSaving,
}: SymptomFormProps) {
  const [text, setText] = useState('');

  const handleSubmit = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || isSaving) return;

    const success = await onSubmit(trimmed);
    if (success) {
      setText('');
      Keyboard.dismiss();
      // Feedback háptico de sucesso
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      // Feedback háptico de erro
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [text, isSaving, onSubmit]);

  const isDisabled = !text.trim() || isSaving;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Descreva seu sintoma..."
        placeholderTextColor={Colors.textTertiary}
        multiline
        maxLength={500}
        editable={!isSaving}
        returnKeyType="done"
        blurOnSubmit
        accessibilityLabel="Campo de descrição do sintoma"
      />
      <View style={styles.footer}>
        <Text style={styles.charCount}>
          {text.length}/500
        </Text>
        <TouchableOpacity
          style={[styles.button, isDisabled && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isDisabled}
          activeOpacity={0.7}
          accessibilityLabel="Registrar sintoma"
          accessibilityRole="button"
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={Colors.surface} />
          ) : (
            <Text style={[styles.buttonText, isDisabled && styles.buttonTextDisabled]}>
              Registrar
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    fontSize: 15,
    color: Colors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  charCount: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  buttonDisabled: {
    backgroundColor: Colors.border,
  },
  buttonText: {
    color: Colors.surface,
    fontSize: 15,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: Colors.textTertiary,
  },
});
