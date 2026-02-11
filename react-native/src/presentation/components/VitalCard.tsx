import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme/colors';
import { BorderRadius, Spacing } from '../theme/spacing';

interface VitalCardProps {
  /** Título do indicador (ex: "Frequência Cardíaca") */
  title: string;
  /** Valor numérico do indicador */
  value: number;
  /** Unidade de medida (ex: "bpm", "passos") */
  unit: string;
  /** Nome do ícone Ionicons */
  iconName: keyof typeof Ionicons.glyphMap;
  /** Cor de destaque do card */
  accentColor: string;
  /** Cor de fundo suave do card */
  backgroundColor: string;
}

/**
 * Componente de card para exibição de um indicador vital.
 *
 * Inclui animação de escala sutil quando o valor é atualizado,
 * dando feedback visual ao usuário de que dados novos chegaram.
 *
 * Ícones: usa Ionicons (@expo/vector-icons) para renderização
 * vetorial nítida em qualquer densidade de tela — substituindo emojis
 * que renderizam de forma inconsistente entre plataformas.
 */
export const VitalCard = React.memo(function VitalCard({
  title,
  value,
  unit,
  iconName,
  accentColor,
  backgroundColor,
}: VitalCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevValueRef = useRef(value);

  /**
   * Animação de "pulse" quando o valor muda.
   * Escala de 1 → 1.04 → 1 em 300ms — sutil mas perceptível.
   */
  useEffect(() => {
    if (prevValueRef.current !== value) {
      prevValueRef.current = value;

      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.04,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [value, scaleAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View style={styles.header}>
        <Ionicons name={iconName} size={24} color={accentColor} />
        <Text style={[styles.title, { color: accentColor }]}>{title}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color: accentColor }]}>
          {value.toLocaleString('pt-BR')}
        </Text>
        <Text style={[styles.unit, { color: accentColor }]}>{unit}</Text>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.xs,
    minHeight: 140,
    justifyContent: 'space-between',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.xs,
  },
  value: {
    fontSize: 36,
    fontWeight: '700',
  },
  unit: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
  },
});
