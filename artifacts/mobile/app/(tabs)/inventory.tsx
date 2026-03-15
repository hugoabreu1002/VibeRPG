import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Platform, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { 
  useGetInventory,
  useEquipItem,
  getGetInventoryQueryKey,
  useGetCharacter,
  getGetCharacterQueryKey
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';

import colors from '@/constants/colors';
import { useCharacter } from '@/context/CharacterContext';

export default function InventoryScreen() {
  const insets = useSafeAreaInsets();
  const { characterId, character } = useCharacter();
  const queryClient = useQueryClient();

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [filter, setFilter] = useState<string>('all');

  const { data: inventory } = useGetInventory(characterId || 0, {
    query: { enabled: !!characterId }
  });

  const { mutateAsync: equipItem } = useEquipItem();

  const handleEquipToggle = async (invItemId: number, equip: boolean) => {
    try {
      await equipItem({ data: { inventoryItemId: invItemId, equip } });
      queryClient.invalidateQueries({ queryKey: getGetInventoryQueryKey(characterId || 0) });
      queryClient.invalidateQueries({ queryKey: getGetCharacterQueryKey(characterId || 0) });
      setSelectedItem(null);
    } catch (e) {
      console.error(e);
    }
  };

  const categories = ['all', 'weapon', 'armor', 'accessory', 'consumable'];

  const filteredItems = inventory?.filter(i => filter === 'all' || i.item.type === filter) || [];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top || 20 }]}>
        <Text style={styles.headerTitle}>Inventory</Text>
        {character && (
          <View style={styles.statsRow}>
            <Text style={styles.statText}>ATK: {character.attack}</Text>
            <Text style={styles.statText}>DEF: {character.defense}</Text>
            <Text style={styles.statText}>MAG: {character.magicPower}</Text>
          </View>
        )}
      </View>

      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
          {categories.map(cat => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.filterChip, filter === cat && styles.filterChipActive]}
              onPress={() => setFilter(cat)}
            >
              <Text style={[styles.filterText, filter === cat && styles.filterTextActive]}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={[styles.grid, { paddingBottom: insets.bottom + 100 }]}>
        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="bag-personal-outline" size={48} color={colors.dark.border} />
            <Text style={styles.emptyText}>Your inventory is empty.</Text>
          </View>
        ) : (
          filteredItems.map(invItem => (
            <TouchableOpacity 
              key={invItem.id} 
              style={[styles.itemCard, invItem.equipped && styles.itemCardEquipped]}
              onPress={() => setSelectedItem(invItem)}
            >
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons 
                  name={getItemIcon(invItem.item.type)} 
                  size={32} 
                  color={invItem.equipped ? colors.dark.gold : colors.dark.silver} 
                />
              </View>
              {invItem.equipped && (
                <View style={styles.equippedBadge}>
                  <Text style={styles.equippedText}>E</Text>
                </View>
              )}
              <Text style={styles.itemName} numberOfLines={2}>{invItem.item.name}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Item Details Modal */}
      <Modal visible={!!selectedItem} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <Text style={styles.modalTitle}>{selectedItem.item.name}</Text>
                <Text style={styles.modalType}>{selectedItem.item.type.toUpperCase()}</Text>
                <Text style={styles.modalDesc}>{selectedItem.item.description}</Text>

                <View style={styles.modalStats}>
                  {selectedItem.item.attackBonus > 0 && <Text style={styles.modalStatText}>+ {selectedItem.item.attackBonus} Attack</Text>}
                  {selectedItem.item.defenseBonus > 0 && <Text style={styles.modalStatText}>+ {selectedItem.item.defenseBonus} Defense</Text>}
                  {selectedItem.item.hpBonus > 0 && <Text style={styles.modalStatText}>+ {selectedItem.item.hpBonus} HP</Text>}
                  {selectedItem.item.mpBonus > 0 && <Text style={styles.modalStatText}>+ {selectedItem.item.mpBonus} MP</Text>}
                  {selectedItem.item.magicPowerBonus > 0 && <Text style={styles.modalStatText}>+ {selectedItem.item.magicPowerBonus} Magic</Text>}
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setSelectedItem(null)}>
                    <Text style={styles.modalBtnCancelText}>Close</Text>
                  </TouchableOpacity>
                  
                  {selectedItem.item.type !== 'consumable' && (
                    <TouchableOpacity 
                      style={styles.modalBtnAction}
                      onPress={() => handleEquipToggle(selectedItem.id, !selectedItem.equipped)}
                    >
                      <Text style={styles.modalBtnActionText}>
                        {selectedItem.equipped ? 'Unequip' : 'Equip'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function getItemIcon(type: string): any {
  switch (type) {
    case 'weapon': return 'sword';
    case 'armor': return 'shield-half-full';
    case 'accessory': return 'ring';
    case 'consumable': return 'flask';
    default: return 'help-circle';
  }
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
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: colors.dark.silver,
  },
  filters: {
    backgroundColor: colors.dark.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.dark.bg,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  filterChipActive: {
    borderColor: colors.dark.gold,
    backgroundColor: `${colors.dark.gold}20`,
  },
  filterText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  filterTextActive: {
    color: colors.dark.gold,
  },
  grid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  itemCard: {
    width: '30%',
    aspectRatio: 0.8,
    backgroundColor: colors.dark.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.dark.border,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  itemCardEquipped: {
    borderColor: colors.dark.gold,
    backgroundColor: `${colors.dark.gold}10`,
  },
  iconWrapper: {
    marginBottom: 12,
  },
  itemName: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: colors.dark.text,
    textAlign: 'center',
  },
  equippedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.dark.gold,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  equippedText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: colors.dark.bg,
  },
  emptyState: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontFamily: 'Inter_400Medium',
    fontSize: 16,
    color: colors.dark.textSecondary,
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: colors.dark.bgCard,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.dark.gold,
  },
  modalTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 24,
    color: colors.dark.goldLight,
    marginBottom: 4,
  },
  modalType: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: colors.dark.textMuted,
    marginBottom: 16,
    letterSpacing: 1,
  },
  modalDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: colors.dark.text,
    lineHeight: 24,
    marginBottom: 20,
  },
  modalStats: {
    backgroundColor: colors.dark.bg,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    gap: 8,
  },
  modalStatText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: colors.dark.green,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalBtnCancel: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  modalBtnCancelText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: colors.dark.text,
  },
  modalBtnAction: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: colors.dark.gold,
  },
  modalBtnActionText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    color: colors.dark.bg,
  },
});
