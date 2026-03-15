import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import colors from '@/constants/colors';
import { useCharacter } from '@/context/CharacterContext';
import { useCreateCharacter, CharacterClass } from '@workspace/api-client-react';

const CLASSES = [
  {
    id: CharacterClass.mage,
    name: 'Mage',
    icon: 'auto-fix',
    description: "Master of ancient spells. Wields Zoltraak with devastating effect. High MP, powerful magic.",
    color: colors.dark.arcane,
  },
  {
    id: CharacterClass.warrior,
    name: 'Warrior',
    icon: 'sword',
    description: "Frontline fighter forged in battle. High HP, strong physical attack, stalwart defense.",
    color: colors.dark.red,
  },
  {
    id: CharacterClass.priest,
    name: 'Priest',
    icon: 'cross-celtic',
    description: "Healer of the party. Supports allies with holy magic. Can heal in battle.",
    color: colors.dark.gold,
  }
];

export default function CreateCharacterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setCharacterId } = useCharacter();
  
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<CharacterClass>(CharacterClass.mage);

  const { mutateAsync: createChar, isPending } = useCreateCharacter();

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      const res = await createChar({ data: { name, class: selectedClass } });
      if (res) {
        await setCharacterId(res.id);
        router.replace('/(tabs)');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingTop: Math.max(insets.top, 40), paddingBottom: insets.bottom + 40 }
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Forge Your Destiny</Text>
        <Text style={styles.subtitle}>A new journey begins...</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter character name..."
            placeholderTextColor={colors.dark.textMuted}
            maxLength={20}
          />
        </View>

        <Text style={styles.label}>Select Class</Text>
        <View style={styles.classGrid}>
          {CLASSES.map((cls) => {
            const isSelected = selectedClass === cls.id;
            return (
              <TouchableOpacity
                key={cls.id}
                style={[
                  styles.classCard,
                  isSelected && { borderColor: cls.color, backgroundColor: `${cls.color}20` }
                ]}
                onPress={() => setSelectedClass(cls.id as CharacterClass)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${cls.color}30` }]}>
                  <MaterialCommunityIcons name={cls.icon as any} size={32} color={cls.color} />
                </View>
                <Text style={[styles.className, isSelected && { color: cls.color }]}>{cls.name}</Text>
                <Text style={styles.classDesc}>{cls.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity 
          style={[styles.createButton, !name.trim() && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={!name.trim() || isPending}
        >
          {isPending ? (
            <ActivityIndicator color={colors.dark.bg} />
          ) : (
            <Text style={styles.createButtonText}>Begin Your Journey</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.bg,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 32,
    color: colors.dark.gold,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 32,
  },
  label: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 18,
    color: colors.dark.silver,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: colors.dark.bgCard,
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: colors.dark.text,
    fontFamily: 'Inter_500Medium',
  },
  classGrid: {
    gap: 16,
    marginBottom: 40,
  },
  classCard: {
    backgroundColor: colors.dark.bgCard,
    borderWidth: 2,
    borderColor: colors.dark.border,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  className: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 20,
    color: colors.dark.text,
    marginBottom: 8,
  },
  classDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  createButton: {
    backgroundColor: colors.dark.gold,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.dark.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonDisabled: {
    backgroundColor: colors.dark.border,
    shadowOpacity: 0,
  },
  createButtonText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 18,
    color: colors.dark.bg,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
