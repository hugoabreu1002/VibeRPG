import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  useStartBattle, 
  useGetBattle, 
  useBattleAction,
  getGetCharacterQueryKey
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';

import colors from '@/constants/colors';
import { useCharacter } from '@/context/CharacterContext';
import { BattleStatus, BattleAction } from '@workspace/api-client-react';

const ENEMIES = [
  { name: 'Slime', icon: 'ghost', level: 1, color: '#10B981' },
  { name: 'Goblin', icon: 'skull-outline', level: 3, color: '#3B82F6' },
  { name: 'Demon Demon', icon: 'meteor', level: 10, color: '#EF4444' },
  { name: 'Aura', icon: 'crown', level: 20, color: '#8B5CF6' },
];

export default function BattleScreen() {
  const insets = useSafeAreaInsets();
  const { characterId, character } = useCharacter();
  const queryClient = useQueryClient();
  const scrollViewRef = useRef<ScrollView>(null);

  const [battleId, setBattleId] = useState<number | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('frieren_battle_id').then(id => {
      if (id) setBattleId(Number(id));
    });
  }, []);

  const saveBattleId = async (id: number | null) => {
    if (id) await AsyncStorage.setItem('frieren_battle_id', id.toString());
    else await AsyncStorage.removeItem('frieren_battle_id');
    setBattleId(id);
  };

  const { data: battle, refetch: refetchBattle } = useGetBattle(battleId || 0, {
    query: {
      enabled: !!battleId,
      refetchInterval: (query) => query.state.data?.status === BattleStatus.ongoing ? 3000 : false
    }
  });

  const { mutateAsync: startBattle } = useStartBattle();
  const { mutateAsync: doAction, isPending: actionPending } = useBattleAction();

  const handleStartBattle = async (enemyName: string) => {
    if (!characterId) return;
    try {
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      const res = await startBattle({ data: { characterId, enemyName } });
      await saveBattleId(res.id);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to start battle');
    }
  };

  const handleAction = async (action: BattleAction) => {
    if (!battleId) return;
    try {
      if (Platform.OS !== 'web') {
        if (action === 'attack') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        else if (action === 'spell') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      const req = { action };
      // Simplification: spellName omitted or could open a sub-menu
      const res = await doAction({ battleId, data: req });
      
      if (res.battle.status !== BattleStatus.ongoing) {
        // Battle ended
        queryClient.invalidateQueries({ queryKey: getGetCharacterQueryKey(characterId || 0) });
      }

      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    } catch (e) {
      console.error(e);
    }
  };

  const exitBattle = async () => {
    await saveBattleId(null);
  };

  if (!battle || battle.status === 'victory' || battle.status === 'defeat') {
    if (battle && (battle.status === 'victory' || battle.status === 'defeat')) {
      return (
        <View style={[styles.container, styles.centerAll]}>
          <Text style={[styles.resultTitle, battle.status === 'victory' ? { color: colors.dark.gold } : { color: colors.dark.red }]}>
            {battle.status === 'victory' ? 'VICTORY' : 'DEFEAT'}
          </Text>
          <Text style={styles.resultText}>XP Gained: {battle.xpReward || 0}</Text>
          <Text style={styles.resultText}>Gold Gained: {battle.goldReward || 0}</Text>
          
          <TouchableOpacity style={styles.actionBtn} onPress={exitBattle}>
            <Text style={styles.actionBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top || 20 }]}>
          <Text style={styles.headerTitle}>Select Foe</Text>
        </View>
        <ScrollView contentContainerStyle={styles.enemyList}>
          {ENEMIES.map(enemy => (
            <TouchableOpacity 
              key={enemy.name} 
              style={styles.enemyCard}
              onPress={() => handleStartBattle(enemy.name)}
            >
              <View style={[styles.enemyIcon, { backgroundColor: `${enemy.color}20` }]}>
                <MaterialCommunityIcons name={enemy.icon as any} size={40} color={enemy.color} />
              </View>
              <View style={styles.enemyInfo}>
                <Text style={styles.enemyName}>{enemy.name}</Text>
                <Text style={styles.enemyLevel}>Level {enemy.level}</Text>
              </View>
              <MaterialCommunityIcons name="sword-cross" size={24} color={colors.dark.textSecondary} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  // Active Battle
  const enemyHpPct = Math.max((battle.enemy.hp / battle.enemy.maxHp) * 100, 0);
  const charHpPct = character ? Math.max((battle.characterHp / character.maxHp) * 100, 0) : 100;
  const charMpPct = character ? Math.max((battle.characterMp / character.maxMp) * 100, 0) : 100;

  return (
    <View style={styles.container}>
      <View style={[styles.battleHeader, { paddingTop: insets.top || 20 }]}>
        <Text style={styles.roundText}>Round {battle.round}</Text>
      </View>

      <View style={styles.arena}>
        {/* Enemy Panel */}
        <View style={styles.combatantPanel}>
          <Text style={styles.combatantName}>{battle.enemy.name}</Text>
          <View style={styles.hpBarBg}>
            <View style={[styles.hpBarFill, { width: `${enemyHpPct}%` }]} />
          </View>
          <Text style={styles.hpText}>{battle.enemy.hp} / {battle.enemy.maxHp}</Text>
          <MaterialCommunityIcons name="ghost" size={80} color={colors.dark.red} style={styles.enemySprite} />
        </View>

        {/* Player Panel */}
        <View style={styles.combatantPanel}>
          <Text style={styles.combatantName}>{character?.name}</Text>
          <View style={styles.hpBarBg}>
            <View style={[styles.hpBarFill, { width: `${charHpPct}%` }]} />
          </View>
          <View style={[styles.hpBarBg, { marginTop: 4 }]}>
            <View style={[styles.hpBarFill, { backgroundColor: colors.dark.mp, width: `${charMpPct}%` }]} />
          </View>
          <Text style={styles.hpText}>HP: {battle.characterHp} | MP: {battle.characterMp}</Text>
        </View>
      </View>

      <View style={styles.logContainer}>
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.logContent}>
          {battle.logs.map((log, idx) => (
            <Text key={idx} style={[
              styles.logText,
              log.actor === character?.name ? { color: colors.dark.silver } : { color: colors.dark.red }
            ]}>
              [{log.round}] {log.message}
            </Text>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.actionGrid, { paddingBottom: insets.bottom + 100 }]}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleAction('attack' as BattleAction)} disabled={actionPending}>
          <MaterialCommunityIcons name="sword" size={24} color={colors.dark.bg} />
          <Text style={styles.actionBtnText}>Attack</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.spellBtn]} onPress={() => handleAction('spell' as BattleAction)} disabled={actionPending}>
          <MaterialCommunityIcons name="auto-fix" size={24} color={colors.dark.bg} />
          <Text style={styles.actionBtnText}>Spell</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.defendBtn]} onPress={() => handleAction('defend' as BattleAction)} disabled={actionPending}>
          <MaterialCommunityIcons name="shield" size={24} color={colors.dark.bg} />
          <Text style={styles.actionBtnText}>Defend</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.fleeBtn]} onPress={() => handleAction('flee' as BattleAction)} disabled={actionPending}>
          <MaterialCommunityIcons name="run-fast" size={24} color={colors.dark.bg} />
          <Text style={styles.actionBtnText}>Flee</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.bg,
  },
  centerAll: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
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
  enemyList: {
    padding: 20,
    gap: 16,
  },
  enemyCard: {
    backgroundColor: colors.dark.bgSecondary,
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  enemyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  enemyInfo: {
    flex: 1,
  },
  enemyName: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 18,
    color: colors.dark.text,
  },
  enemyLevel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginTop: 4,
  },
  battleHeader: {
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  roundText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 18,
    color: colors.dark.silver,
  },
  arena: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 20,
  },
  combatantPanel: {
    flex: 1,
    backgroundColor: colors.dark.bgCard,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.dark.border,
    alignItems: 'center',
  },
  combatantName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: colors.dark.text,
    marginBottom: 8,
  },
  hpBarBg: {
    width: '100%',
    height: 10,
    backgroundColor: colors.dark.bg,
    borderRadius: 5,
    overflow: 'hidden',
  },
  hpBarFill: {
    height: '100%',
    backgroundColor: colors.dark.hp,
    borderRadius: 5,
  },
  hpText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: colors.dark.textSecondary,
    marginTop: 4,
  },
  enemySprite: {
    marginTop: 20,
    opacity: 0.8,
  },
  logContainer: {
    flex: 1,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.dark.border,
  },
  logContent: {
    padding: 16,
    gap: 8,
  },
  logText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
    backgroundColor: colors.dark.bgCard,
  },
  actionBtn: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.dark.red,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  spellBtn: {
    backgroundColor: colors.dark.arcane,
  },
  defendBtn: {
    backgroundColor: colors.dark.silver,
  },
  fleeBtn: {
    backgroundColor: colors.dark.border,
  },
  actionBtnText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 16,
    color: colors.dark.bg,
  },
  resultTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 40,
    marginBottom: 20,
  },
  resultText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: colors.dark.text,
    marginBottom: 10,
  }
});
