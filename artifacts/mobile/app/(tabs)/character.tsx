import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { 
  useGetCharacter,
  getGetCharacterQueryKey,
} from '@workspace/api-client-react';

import colors from '@/constants/colors';
import { useCharacter } from '@/context/CharacterContext';
import { useQueryClient } from '@tanstack/react-query';

const CLASS_SPELLS: Record<string, string[]> = {
  mage: ['Zoltraak', 'Jetzt', 'Sense', "Flamme's Spell", 'Aura Disruption'],
  warrior: ['Zweihander Strike', 'Iron Wall', 'Battle Cry'],
  priest: ['Holy Light', 'Mending Grace', 'Barrier of Serenity'],
};

export default function CharacterScreen() {
  const insets = useSafeAreaInsets();
  const { characterId, setCharacterId, character: ctxCharacter } = useCharacter();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);

  const { data: character, refetch } = useGetCharacter(characterId || 0, {
    query: {
      enabled: !!characterId,
      initialData: ctxCharacter
    }
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleNewGame = async () => {
    await setCharacterId(null);
  };

  if (!character) return null;

  const xpPercent = Math.min((character.xp / character.xpToNext) * 100, 100);
  const spells = CLASS_SPELLS[character.class] || [];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top || 20 }]}>
        <Text style={styles.headerTitle}>Hero Profile</Text>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.dark.gold} />}
      >
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarCircle}>
              <MaterialCommunityIcons 
                name={
                  character.class === 'mage' ? 'auto-fix' :
                  character.class === 'warrior' ? 'sword' : 'cross-celtic'
                } 
                size={40} 
                color={colors.dark.gold} 
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{character.name}</Text>
              <Text style={styles.className}>{character.class.toUpperCase()}</Text>
              <Text style={styles.level}>Level {character.level}</Text>
            </View>
          </View>

          <View style={styles.xpContainer}>
            <View style={styles.xpTextRow}>
              <Text style={styles.xpLabel}>Experience</Text>
              <Text style={styles.xpValue}>{character.xp} / {character.xpToNext}</Text>
            </View>
            <View style={styles.xpBarBg}>
              <View style={[styles.xpBarFill, { width: `${xpPercent}%` }]} />
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Attributes</Text>
        <View style={styles.statsGrid}>
          <StatBox icon="heart" label="HP" value={`${character.hp}/${character.maxHp}`} color={colors.dark.hp} />
          <StatBox icon="water" label="MP" value={`${character.mp}/${character.maxMp}`} color={colors.dark.mp} />
          <StatBox icon="sword" label="Attack" value={character.attack.toString()} color={colors.dark.text} />
          <StatBox icon="shield" label="Defense" value={character.defense.toString()} color={colors.dark.text} />
          <StatBox icon="star-four-points" label="Magic" value={character.magicPower.toString()} color={colors.dark.arcaneLight} />
          <StatBox icon="gold" label="Gold" value={character.gold.toString()} color={colors.dark.gold} />
        </View>

        <Text style={styles.sectionTitle}>Grimoire / Abilities</Text>
        <View style={styles.skillsContainer}>
          {spells.map((spell, idx) => (
            <View key={idx} style={styles.skillRow}>
              <MaterialCommunityIcons name="book-open-page-variant" size={20} color={colors.dark.silver} />
              <Text style={styles.skillName}>{spell}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.newGameButton} onPress={handleNewGame}>
          <Text style={styles.newGameText}>Retire Character & Start New Game</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

function StatBox({ icon, label, value, color }: { icon: string, label: string, value: string, color: string }) {
  return (
    <View style={styles.statBox}>
      <MaterialCommunityIcons name={icon as any} size={24} color={color} style={styles.statIcon} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.bg,
  },
  header: {
    backgroundColor: colors.dark.bgCard,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 20,
    color: colors.dark.gold,
  },
  scrollContent: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: colors.dark.bgCard,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.dark.border,
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.dark.bgSecondary,
    borderWidth: 2,
    borderColor: colors.dark.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 24,
    color: colors.dark.text,
    marginBottom: 4,
  },
  className: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    letterSpacing: 2,
    color: colors.dark.silver,
    marginBottom: 4,
  },
  level: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: colors.dark.textSecondary,
  },
  xpContainer: {
    marginTop: 8,
  },
  xpTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  xpLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: colors.dark.textSecondary,
  },
  xpValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: colors.dark.xp,
  },
  xpBarBg: {
    height: 8,
    backgroundColor: colors.dark.bg,
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: colors.dark.xp,
    borderRadius: 4,
  },
  sectionTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 20,
    color: colors.dark.goldLight,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statBox: {
    width: '31%',
    backgroundColor: colors.dark.bgCard,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: colors.dark.text,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: colors.dark.textMuted,
  },
  skillsContainer: {
    backgroundColor: colors.dark.bgCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.dark.border,
    marginBottom: 40,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  skillName: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: colors.dark.text,
    marginLeft: 16,
  },
  newGameButton: {
    borderWidth: 1,
    borderColor: colors.dark.red,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  newGameText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: colors.dark.red,
  }
});
