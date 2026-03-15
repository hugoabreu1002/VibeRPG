import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { 
  useListQuests, 
  useGetCharacterQuests, 
  useStartQuest, 
  useCompleteQuest,
  getGetCharacterQuestsQueryKey,
  getGetCharacterQueryKey
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';

import colors from '@/constants/colors';
import { useCharacter } from '@/context/CharacterContext';

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: colors.dark.green,
  medium: colors.dark.gold,
  hard: colors.dark.red,
  legendary: colors.dark.arcane,
};

export default function WorldScreen() {
  const insets = useSafeAreaInsets();
  const { character, characterId } = useCharacter();
  const queryClient = useQueryClient();

  const [refreshing, setRefreshing] = useState(false);

  const { data: quests, refetch: refetchQuests } = useListQuests();
  const { data: activeQuests, refetch: refetchActive } = useGetCharacterQuests(characterId || 0, {
    query: { enabled: !!characterId }
  });

  const { mutateAsync: startQuest } = useStartQuest();
  const { mutateAsync: completeQuest } = useCompleteQuest();

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchQuests(), refetchActive()]);
    setRefreshing(false);
  };

  const onAccept = async (questId: number) => {
    if (!characterId) return;
    try {
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await startQuest({ questId, data: { characterId } });
      queryClient.invalidateQueries({ queryKey: getGetCharacterQuestsQueryKey(characterId) });
    } catch (e) {
      console.error(e);
    }
  };

  const onComplete = async (questId: number) => {
    if (!characterId) return;
    try {
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await completeQuest({ questId, data: { characterId } });
      queryClient.invalidateQueries({ queryKey: getGetCharacterQuestsQueryKey(characterId) });
      queryClient.invalidateQueries({ queryKey: getGetCharacterQueryKey(characterId) });
    } catch (e) {
      console.error(e);
    }
  };

  if (!character) return null;

  const inProgressQuests = activeQuests?.filter(q => q.status === 'active') || [];
  const completedQuestIds = new Set(activeQuests?.filter(q => q.status === 'completed').map(q => q.questId) || []);
  const activeQuestIds = new Set(inProgressQuests.map(q => q.questId));

  const availableQuests = quests?.filter(q => !completedQuestIds.has(q.id) && !activeQuestIds.has(q.id)) || [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top || 20 }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.characterName}>{character.name}</Text>
            <Text style={styles.characterLevel}>Level {character.level} {character.class.charAt(0).toUpperCase() + character.class.slice(1)}</Text>
          </View>
          <View style={styles.goldContainer}>
            <MaterialCommunityIcons name="gold" size={20} color={colors.dark.gold} />
            <Text style={styles.goldText}>{character.gold}</Text>
          </View>
        </View>

        <View style={styles.barsContainer}>
          <View style={styles.barWrapper}>
            <View style={[styles.barFill, { backgroundColor: colors.dark.hp, width: `${(character.hp / character.maxHp) * 100}%` }]} />
            <Text style={styles.barText}>HP {character.hp}/{character.maxHp}</Text>
          </View>
          <View style={styles.barWrapper}>
            <View style={[styles.barFill, { backgroundColor: colors.dark.mp, width: `${(character.mp / character.maxMp) * 100}%` }]} />
            <Text style={styles.barText}>MP {character.mp}/{character.maxMp}</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.dark.gold} />
        }
      >
        {inProgressQuests.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Active Quests</Text>
            {inProgressQuests.map(cq => (
              <View key={cq.id} style={[styles.questCard, styles.activeQuestCard]}>
                <View style={styles.questHeader}>
                  <Text style={styles.questName}>{cq.quest.name}</Text>
                  <View style={[styles.badge, { backgroundColor: `${DIFFICULTY_COLORS[cq.quest.difficulty]}20` }]}>
                    <Text style={[styles.badgeText, { color: DIFFICULTY_COLORS[cq.quest.difficulty] }]}>
                      {cq.quest.difficulty.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.questLore}>{cq.quest.lore}</Text>
                
                <View style={styles.rewardsRow}>
                  <Text style={styles.rewardText}>XP: {cq.quest.xpReward}</Text>
                  <Text style={styles.rewardText}>Gold: {cq.quest.goldReward}</Text>
                </View>

                <TouchableOpacity 
                  style={styles.completeButton}
                  onPress={() => onComplete(cq.quest.id)}
                >
                  <Text style={styles.completeButtonText}>Complete Quest</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <Text style={styles.sectionTitle}>Quest Board</Text>
        {availableQuests.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={48} color={colors.dark.border} />
            <Text style={styles.emptyStateText}>No new quests available right now.</Text>
          </View>
        ) : (
          availableQuests.map(q => {
            const isLocked = character.level < q.requiredLevel;
            
            return (
              <View key={q.id} style={[styles.questCard, isLocked && styles.lockedCard]}>
                <View style={styles.questHeader}>
                  <Text style={styles.questName}>{q.name}</Text>
                  <View style={[styles.badge, { backgroundColor: `${DIFFICULTY_COLORS[q.difficulty]}20` }]}>
                    <Text style={[styles.badgeText, { color: DIFFICULTY_COLORS[q.difficulty] }]}>
                      {q.difficulty.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.regionText}>
                  <MaterialCommunityIcons name="map-marker-outline" size={14} /> {q.region}
                </Text>
                <Text style={styles.questLore}>{q.lore}</Text>
                
                <View style={styles.rewardsRow}>
                  <Text style={styles.rewardText}>XP: {q.xpReward}</Text>
                  <Text style={styles.rewardText}>Gold: {q.goldReward}</Text>
                </View>

                {isLocked ? (
                  <View style={styles.lockedOverlay}>
                    <MaterialCommunityIcons name="lock" size={24} color={colors.dark.textSecondary} />
                    <Text style={styles.lockedText}>Requires Level {q.requiredLevel}</Text>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.acceptButton}
                    onPress={() => onAccept(q.id)}
                  >
                    <Text style={styles.acceptButtonText}>Accept Quest</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  characterName: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 24,
    color: colors.dark.text,
  },
  characterLevel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.dark.silver,
    marginTop: 2,
  },
  goldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.dark.gold}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  goldText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: colors.dark.gold,
    marginLeft: 6,
  },
  barsContainer: {
    gap: 8,
  },
  barWrapper: {
    height: 20,
    backgroundColor: colors.dark.border,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  barFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 10,
  },
  barText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: colors.dark.text,
    lineHeight: 20,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 20,
    color: colors.dark.goldLight,
    marginBottom: 16,
    marginTop: 8,
  },
  questCard: {
    backgroundColor: colors.dark.bgSecondary,
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  activeQuestCard: {
    borderColor: colors.dark.gold,
    backgroundColor: colors.dark.bgCard,
  },
  lockedCard: {
    opacity: 0.6,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  questName: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 18,
    color: colors.dark.text,
    flex: 1,
    marginRight: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
  },
  regionText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: colors.dark.textSecondary,
    marginBottom: 12,
  },
  questLore: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#D4D4CE', // parchment-ish text
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  rewardsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  rewardText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: colors.dark.silver,
  },
  acceptButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.dark.gold,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    color: colors.dark.gold,
  },
  completeButton: {
    backgroundColor: colors.dark.gold,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButtonText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    color: colors.dark.bg,
  },
  lockedOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.dark.border,
    paddingVertical: 12,
    borderRadius: 8,
  },
  lockedText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: colors.dark.textSecondary,
    marginTop: 12,
  }
});
