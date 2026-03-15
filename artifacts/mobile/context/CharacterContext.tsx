import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Character, useGetCharacter, getGetCharacterQueryKey } from '@workspace/api-client-react';

interface CharacterContextType {
  characterId: number | null;
  setCharacterId: (id: number | null) => Promise<void>;
  character: Character | undefined;
  isLoading: boolean;
  refreshCharacter: () => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [characterId, setCharacterIdState] = useState<number | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const id = await AsyncStorage.getItem('frieren_character_id');
        if (id) {
          setCharacterIdState(Number(id));
        }
      } catch (e) {
        console.error('Failed to load character ID', e);
      } finally {
        setIsInitializing(false);
      }
    }
    load();
  }, []);

  const setCharacterId = async (id: number | null) => {
    try {
      if (id) {
        await AsyncStorage.setItem('frieren_character_id', id.toString());
      } else {
        await AsyncStorage.removeItem('frieren_character_id');
      }
      setCharacterIdState(id);
    } catch (e) {
      console.error('Failed to save character ID', e);
    }
  };

  const { data: character, isLoading: isCharacterLoading, refetch } = useGetCharacter(characterId || 0, {
    query: {
      enabled: !!characterId,
      queryKey: getGetCharacterQueryKey(characterId || 0),
    }
  });

  return (
    <CharacterContext.Provider value={{
      characterId,
      setCharacterId,
      character,
      isLoading: isInitializing || (!!characterId && isCharacterLoading),
      refreshCharacter: refetch,
    }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
}
