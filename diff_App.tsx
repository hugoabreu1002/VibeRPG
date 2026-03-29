diff --git a/src/App.tsx b/src/App.tsx
index 89f6183..ca0c59b 100644
--- a/src/App.tsx
+++ b/src/App.tsx
@@ -113,7 +113,6 @@ function AppContent() {
 
   // Celebration state
   const [previousLevel, setPreviousLevel] = useState<number | null>(null);
-  const [showReviveOverlay, setShowReviveOverlay] = useState(false);
 
   // Load all characters
   useEffect(() => {
@@ -122,15 +121,12 @@ function AppContent() {
     });
   }, []);
 
-  // Poki Compliance States
-  const [gameStarted, setGameStarted] = useState(false);
-
   // Audio initialization and BGM control
   useEffect(() => {
     // Synchronize master mute with our local state
     audioManager.setMasterMute(!isMusicEnabled);
 
-    if (isMusicEnabled && gameStarted) {
+    if (isMusicEnabled) {
       audioManager.start();
       if (activeTab === "World Map" || activeTab === "Inventory" || activeTab === "Shop" || activeTab === "Guild") {
         audioManager.playBgm("main");
@@ -138,7 +134,7 @@ function AppContent() {
     } else {
       audioManager.stopBgm();
     }
-  }, [isMusicEnabled, activeTab, gameStarted]);
+  }, [isMusicEnabled, activeTab]);
 
   const toggleMusic = () => {
     const nextState = !isMusicEnabled;
@@ -153,9 +149,6 @@ function AppContent() {
       audioManager.stopBgm();
     }
   };
-
-
-
   // Auto-save character
   const saveCharacter = (char: Character) => {
     dbUpdateCharacter({
@@ -196,12 +189,6 @@ function AppContent() {
   const handleAcceptQuestFromNPC = async (quest: Quest) => {
     if (!character) return;
 
-    // Trigger commercial break before starting a quest
-    await pokiService.commercialBreak(() => {
-      audioManager.setAdMute(true);
-    });
-    audioManager.setAdMute(false);
-
     const result = await acceptQuestFromNPC(character, quest);
     if (result.success) {
       setCharacter(result.updatedCharacter);
@@ -212,7 +199,6 @@ function AppContent() {
         message: `New Quest: ${quest.title}`,
         icon: "⚔️"
       });
-      pokiService.gameplayStart();
     }
   };
 
@@ -230,8 +216,6 @@ function AppContent() {
       rewardSkill
     );
 
-    pokiService.gameplayStop();
-
     // Update local state with the result
     if (result.updatedCharacter) {
       setCharacter(result.updatedCharacter);
@@ -435,66 +419,26 @@ function AppContent() {
       return;
     }
 
-    // Signal gameplay stop on defeat
-    pokiService.gameplayStop();
-
-    // Show Revive Overlay instead of direct defeat
-    setShowReviveOverlay(true);
-  };
-
-  const handleReviveWithAd = async () => {
-    if (!character) return;
-
-    const success = await pokiService.rewardedBreak({
-      onStart: () => audioManager.setAdMute(true)
-    });
-
-    audioManager.setAdMute(false);
-
-    if (success) {
-      // Revive with full HP/MP
-      setCharacter({
-        ...character,
-        hp: character.maxHp,
-        mp: character.maxMp
-      });
-      setShowReviveOverlay(false);
-      setQuestState("active"); // Resume quest
-      setActiveEnemy(null); // Clear enemy to allow retry/continue
-
-      // Signal gameplay start after revive
-      pokiService.gameplayStart();
-
-      setToast({
-        message: "Revived with full energy!",
-        icon: "✨"
-      });
-      audioManager.playSfx("victory");
-    }
-  };
-
-  const handleAcceptDefeat = () => {
-    if (!character) return;
-
     // Take HP damage on defeat - restore half HP
     const newHp = Math.max(1, Math.floor(character.maxHp / 2));
 
+    // Reset quest state instead of completing it - quest can be attempted again
     setCharacter({
       ...character,
       hp: newHp,
+      questState: "list" as QuestState
     });
 
-    // Clear quest state
+    // Clear quest state without marking quest as completed
     setActiveQuest(null);
     setQuestState("list");
     setActiveEnemy(null);
     setSelectedChoice(null);
-    setShowReviveOverlay(false);
 
-    // Redirect to shop
+    // Redirect to shop on defeat to allow buying healing items
     setActiveTab("Shop");
     setQuestToast({
-      message: "Defeated! Visit the shop to buy healing items.",
+      message: "Defeated! Visit the shop to buy healing items, then try the quest again.",
       icon: "💀"
     });
   };
@@ -583,51 +527,6 @@ function AppContent() {
     });
   }, []);
 
-  const handleWatchAd = async () => {
-    if (!character) return;
-
-    const success = await pokiService.rewardedBreak({
-      onStart: () => audioManager.setAdMute(true)
-    });
-
-    audioManager.setAdMute(false);
-
-    if (success) {
-      const newGold = character.gold + 50;
-      setCharacter({ ...character, gold: newGold });
-      setToast({
-        message: "Watched ad! +50 Gold awarded.",
-        icon: "💰"
-      });
-      audioManager.playSfx("victory");
-    }
-  };
-
-  const handleStartGame = async () => {
-    console.log("Start Game Button Clicked");
-    try {
-      // Show commercial break before starting game as per Poki recommendations
-      await pokiService.commercialBreak(() => {
-        audioManager.setAdMute(true);
-      });
-      audioManager.setAdMute(false);
-
-      setGameStarted(true);
-      audioManager.start();
-      pokiService.gameplayStart();
-    } catch (err) {
-      console.error("Error starting game:", err);
-      // Ensure we still try to start even if SDK/Audio fails
-      setGameStarted(true);
-    }
-  };
-
-  const handleStopGame = () => {
-    pokiService.gameplayStop();
-    setGameStarted(false);
-    audioManager.stopBgm();
-  };
-
   // Map selection handler
   const handleRegionChange = (regionId: string) => {
     if (!character) return;
@@ -775,12 +674,6 @@ function AppContent() {
 
   return (
     <div className="h-full flex flex-col overflow-y-auto bg-background text-foreground ambient-particles custom-scrollbar">
-      {/* Poki Ad Overlay */}
-      {pokiService.isAdActive() && (
-        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-md flex items-center justify-center">
-          <div className="text-white text-2xl font-bold animate-pulse">Advertisement playing...</div>
-        </div>
-      )}
       {/* Fantasy Header */}
       <header className="fantasy-header px-4 py-1 relative shrink-0">
         <div className="mx-auto max-w-7xl flex items-center justify-between">
@@ -1034,61 +927,39 @@ function AppContent() {
         )}
       </AnimatePresence>
 
-      {/* Start Game Landing Overlay */}
-      {!gameStarted && (
-        <div className="fixed inset-0 z-[10000] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6">
-          <div className="max-w-md w-full fantasy-card p-10 text-center relative overflow-hidden group">
-            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
-
-            <div className="mb-8 relative">
-              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-amber-900/40 rotate-12 group-hover:rotate-0 transition-transform duration-500">
-                <Gamepad2 size={48} className="text-slate-950" />
-              </div>
-              <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xl shadow-lg animate-bounce">⚔️</div>
-            </div>
-
-            <h2 className="text-4xl font-bold mb-4 text-white uppercase tracking-widest" style={{ fontFamily: "var(--font-serif)" }}>
-              Vibe <span className="text-amber-500">RPG</span>
-            </h2>
-
-            <p className="text-slate-400 mb-10 text-lg leading-relaxed">
-              Embark on a mythical journey where your choices shape destiny.
-            </p>
-
-            <button
-              onClick={handleStartGame}
-              className="w-full btn-fantasy py-5 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 shadow-2xl shadow-amber-500/20 relative z-[10001] pointer-events-auto cursor-pointer"
-            >
-              <Play fill="currentColor" size={24} />
-              START JOURNEY
-            </button>
-
-            <div className="mt-8 pt-8 border-t border-slate-800/50 flex justify-center gap-6 opacity-60">
-              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold uppercase tracking-tighter">
-                <Trophy size={14} className="text-gold" /> Epic Loot
-              </div>
-              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold uppercase tracking-tighter">
-                <Users size={14} className="text-blue-400" /> Deep Lore
-              </div>
+      <div className="flex-1 min-h-0 overflow-hidden px-3 py-2">
+        {isLoading ? (
+          <div className="mx-auto max-w-3xl fantasy-card rounded-xl p-6">
+            <div className="flex items-center gap-3">
+              <motion.div
+                animate={{ rotate: 360 }}
+                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
+                className="text-2xl"
+              >
+                ⚙️
+              </motion.div>
+              <span className="text-slate-300">Loading...</span>
             </div>
           </div>
-        </div>
-      )}
-
-      {/* Main Content Area */}
-      {gameStarted && (
-        <div className="flex-1 min-h-0 overflow-hidden px-3 py-2">
-          {isLoading ? (
-            <div className="mx-auto max-w-3xl fantasy-card rounded-xl p-6">
-              <div className="flex items-center gap-3">
+        ) : !character ? (
+          <main className="mx-auto max-w-lg">
+            <motion.div
+              initial={{ opacity: 0, y: 30 }}
+              animate={{ opacity: 1, y: 0 }}
+              className="fantasy-card rounded-xl p-8"
+            >
+              <div className="text-center mb-6">
                 <motion.div
-                  animate={{ rotate: 360 }}
-                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
-                  className="text-2xl"
+                  animate={{ scale: [1, 1.1, 1] }}
+                  transition={{ duration: 2, repeat: Infinity }}
+                  className="text-5xl mb-3"
                 >
-                  ⚙️
+                  ⚔️
                 </motion.div>
-                <span className="text-slate-300">Loading...</span>
+                <h2 className="text-2xl font-bold text-gold mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
+                  Begin Your Adventure
+                </h2>
+                <p className="text-sm text-slate-400">Create your first hero to start your journey</p>
               </div>
               <form className="space-y-4" onSubmit={submitCreate}>
                 <div>
@@ -1124,508 +995,267 @@ function AppContent() {
               </form>
             </motion.div>
           </main>
-      ) : (
-      <div className="w-full min-h-full grid gap-2 md:grid-cols-12">
-        {/* Sidebar */}
-        <aside className="md:col-span-3 flex flex-col gap-2 overflow-y-auto min-h-0 max-h-[calc(100vh-120px)] custom-scrollbar">
-          <div className="fantasy-card rounded-xl p-4">
-            <div className="flex flex-wrap md:flex-col gap-1">
-              <button
-                onClick={() => setActiveTab("World Map")}
-                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${activeTab === "World Map" ? "bg-amber-600/20 text-amber-200 border border-amber-500/30 shadow-lg shadow-amber-900/10" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
-              >
-                <MapTabIcon size={18} />
-                World Map
-              </button>
-              <button
-                onClick={() => setActiveTab("Inventory")}
-                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${activeTab === "Inventory" ? "bg-amber-600/20 text-amber-200 border border-amber-500/30 shadow-lg shadow-amber-900/10" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
-              >
-                <InventoryTabIcon size={18} />
-                Inventory
-              </button>
-              <button
-                onClick={() => setActiveTab("Shop")}
-                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${activeTab === "Shop" ? "bg-amber-600/20 text-amber-200 border border-amber-500/30 shadow-lg shadow-amber-900/10" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
-              >
-                <ShopTabIcon size={18} />
-                Shop
-              </button>
-              <button
-                onClick={() => setActiveTab("Guild")}
-                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${activeTab === "Guild" ? "bg-amber-600/20 text-amber-200 border border-amber-500/30 shadow-lg shadow-amber-900/10" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
-              >
-                <RankIcon size={18} className="translate-y-[-1px]" />
-                Guild
-              </button>
-            </div>
-          </div>
+        ) : (
+          <div className="w-full min-h-full grid gap-2 md:grid-cols-12">
+            {/* Sidebar */}
+            <aside className="md:col-span-3 flex flex-col gap-2 overflow-y-auto min-h-0 max-h-[calc(100vh-120px)] custom-scrollbar">
+              <div className="fantasy-card rounded-xl p-4">
+                <div className="flex flex-wrap md:flex-col gap-1">
+                  <button
+                    onClick={() => setActiveTab("World Map")}
+                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${activeTab === "World Map" ? "bg-amber-600/20 text-amber-200 border border-amber-500/30 shadow-lg shadow-amber-900/10" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
+                  >
+                    <MapTabIcon size={18} />
+                    World Map
+                  </button>
+                  <button
+                    onClick={() => setActiveTab("Inventory")}
+                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${activeTab === "Inventory" ? "bg-amber-600/20 text-amber-200 border border-amber-500/30 shadow-lg shadow-amber-900/10" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
+                  >
+                    <InventoryTabIcon size={18} />
+                    Inventory
+                  </button>
+                  <button
+                    onClick={() => setActiveTab("Shop")}
+                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${activeTab === "Shop" ? "bg-amber-600/20 text-amber-200 border border-amber-500/30 shadow-lg shadow-amber-900/10" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
+                  >
+                    <ShopTabIcon size={18} />
+                    Shop
+                  </button>
+                  <button
+                    onClick={() => setActiveTab("Guild")}
+                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${activeTab === "Guild" ? "bg-amber-600/20 text-amber-200 border border-amber-500/30 shadow-lg shadow-amber-900/10" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
+                  >
+                    <RankIcon size={18} className="translate-y-[-1px]" />
+                    Guild
+                  </button>
+                </div>
+              </div>
 
-          {/* Character Info */}
-          <div className="fantasy-card rounded-xl p-2">
-            <h3 className="text-[9px] font-bold text-amber-200/60 uppercase tracking-wider mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Hero Stats</h3>
-            <div className="space-y-1">
-              {statusBar("HP", character.hp, character.maxHp, "hp")}
-              {statusBar("MP", character.mp, character.maxMp, "mp")}
-              {statusBar("XP", character.xp, character.xpToNext, "xp")}
-            </div>
-          </div>
+              {/* Character Info */}
+              <div className="fantasy-card rounded-xl p-2">
+                <h3 className="text-[9px] font-bold text-amber-200/60 uppercase tracking-wider mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Hero Stats</h3>
+                <div className="space-y-1">
+                  {statusBar("HP", character.hp, character.maxHp, "hp")}
+                  {statusBar("MP", character.mp, character.maxMp, "mp")}
+                  {statusBar("XP", character.xp, character.xpToNext, "xp")}
+                </div>
+              </div>
 
-          {/* Quest Board */}
-          <QuestBoard
-            character={character}
-            completedQuests={completedQuests}
-            onAcceptQuest={(quest) => {
-              handleAcceptQuestFromNPC(quest);
-              setActiveTab("World Map");
-            }}
-            onCompleteQuest={handleCompleteQuest}
-            activeQuestId={activeQuest?.id}
-          />
-        </aside>
+              {/* Quest Board */}
+              <QuestBoard
+                character={character}
+                completedQuests={completedQuests}
+                onAcceptQuest={(quest) => {
+                  handleAcceptQuestFromNPC(quest);
+                  setActiveTab("World Map");
+                }}
+                onCompleteQuest={handleCompleteQuest}
+                activeQuestId={activeQuest?.id}
+              />
+            </aside>
 
-        {/* Main Content */}
-        <section className="md:col-span-9 h-full flex flex-col min-h-[400px]">
-          <AnimatePresence mode="wait">
-            {/* Monster Battle - Takes priority over normal tabs */}
-            {questState === "battle" && activeEnemy && character && (
-              <motion.div
-                key="monster-battle"
-                initial={{ opacity: 0, scale: 0.95 }}
-                animate={{ opacity: 1, scale: 1 }}
-                exit={{ opacity: 0, scale: 0.95 }}
-                transition={{ duration: 0.3 }}
-                className="h-full"
-              >
-                <MonsterBattle
-                  character={character}
-                  enemy={activeEnemy}
-                  onVictory={handleBattleVictory}
-                  onDefeat={handleBattleDefeat}
-                  onFlee={handleBattleFlee}
-                  onUpdateCharacter={handleUpdateCharacter}
-                />
-              </motion.div>
-            )}
+            {/* Main Content */}
+            <section className="md:col-span-9 h-full flex flex-col min-h-[400px]">
+              <AnimatePresence mode="wait">
+                {/* Monster Battle - Takes priority over normal tabs */}
+                {questState === "battle" && activeEnemy && character && (
+                  <motion.div
+                    key="monster-battle"
+                    initial={{ opacity: 0, scale: 0.95 }}
+                    animate={{ opacity: 1, scale: 1 }}
+                    exit={{ opacity: 0, scale: 0.95 }}
+                    transition={{ duration: 0.3 }}
+                    className="h-full"
+                  >
+                    <MonsterBattle
+                      character={character}
+                      enemy={activeEnemy}
+                      onVictory={handleBattleVictory}
+                      onDefeat={handleBattleDefeat}
+                      onFlee={handleBattleFlee}
+                      onUpdateCharacter={handleUpdateCharacter}
+                    />
+                  </motion.div>
+                )}
 
-            {activeTab === "Inventory" && questState !== "battle" && (
-              <motion.div
-                animate={{ scale: [1, 1.1, 1] }}
-                transition={{ duration: 2, repeat: Infinity }}
-                className="text-5xl mb-3"
-              >
-                ⚔️
-              </motion.div>
-            )}
+                {activeTab === "Inventory" && questState !== "battle" && (
+                  <motion.div
+                    key="inventory"
+                    initial={{ opacity: 0, x: 20 }}
+                    animate={{ opacity: 1, x: 0 }}
+                    exit={{ opacity: 0, x: -20 }}
+                    transition={{ duration: 0.3 }}
+                    className="space-y-4"
+                  >
+                    <Inventory
+                      inventory={inventory}
+                      selectedItem={selectedItem}
+                      onSelectItem={setSelectedItem}
+                      onToggleEquip={handleToggleEquip}
+                      onConsumeFood={handleConsumeFood}
+                      onSellItem={handleSellItem}
+                      characterClass={character.class}
+                    />
+                  </motion.div>
+                )}
 
-            {activeTab === "Shop" && character && questState !== "battle" && (
-              <motion.div
-                key="shop"
-                initial={{ opacity: 0, x: 20 }}
-                animate={{ opacity: 1, x: 0 }}
-                exit={{ opacity: 0, x: -20 }}
-                transition={{ duration: 0.3 }}
-              >
-                <Shop
-                  gold={character.gold}
-                  shopItems={SHOP_ITEMS}
-                  onBuyItem={handleBuyItem}
-                />
-              </motion.div>
-            )}
+                {activeTab === "Shop" && character && questState !== "battle" && (
+                  <motion.div
+                    key="shop"
+                    initial={{ opacity: 0, x: 20 }}
+                    animate={{ opacity: 1, x: 0 }}
+                    exit={{ opacity: 0, x: -20 }}
+                    transition={{ duration: 0.3 }}
+                  >
+                    <Shop
+                      gold={character.gold}
+                      shopItems={SHOP_ITEMS}
+                      onBuyItem={handleBuyItem}
+                    />
+                  </motion.div>
+                )}
 
-            {activeTab === "Guild" && character && questState !== "battle" && (
-              <motion.div
-                key="guild"
-                initial={{ opacity: 0, x: 20 }}
-                animate={{ opacity: 1, x: 0 }}
-                exit={{ opacity: 0, x: -20 }}
-                transition={{ duration: 0.3 }}
-                className="h-full"
-              >
-                <GuildMenu
-                  character={character}
-                  completedQuests={completedQuests}
-                  activeQuestId={activeQuest?.id}
-                  onEvolve={(updatedCharacter) => {
-                    setCharacter(updatedCharacter);
-                    saveCharacter(updatedCharacter);
-                    audioManager.playSfx("victory");
-                  }}
-                  onAcceptQuest={(quest) => {
-                    handleAcceptQuestFromNPC(quest);
-                    setActiveTab("World Map");
-                  }}
-                  onCompleteQuest={handleCompleteQuest}
-                  onClose={() => setActiveTab("World Map")}
-                />
-              </motion.div>
-            )}
+                {activeTab === "Guild" && character && questState !== "battle" && (
+                  <motion.div
+                    key="guild"
+                    initial={{ opacity: 0, x: 20 }}
+                    animate={{ opacity: 1, x: 0 }}
+                    exit={{ opacity: 0, x: -20 }}
+                    transition={{ duration: 0.3 }}
+                    className="h-full"
+                  >
+                    <GuildMenu
+                      character={character}
+                      completedQuests={completedQuests}
+                      activeQuestId={activeQuest?.id}
+                      onEvolve={(updatedCharacter) => {
+                        setCharacter(updatedCharacter);
+                        saveCharacter(updatedCharacter);
+                        audioManager.playSfx("victory");
+                      }}
+                      onAcceptQuest={(quest) => {
+                        handleAcceptQuestFromNPC(quest);
+                        setActiveTab("World Map");
+                      }}
+                      onCompleteQuest={handleCompleteQuest}
+                      onClose={() => setActiveTab("World Map")}
+                    />
+                  </motion.div>
+                )}
 
-            {activeTab === "World Map" && character && questState !== "battle" && (
-              <motion.div
-                key="world-map"
-                initial={{ opacity: 0, x: 20 }}
-                animate={{ opacity: 1, x: 0 }}
-                exit={{ opacity: 0, x: -20 }}
-                transition={{ duration: 0.3 }}
-                className="grid gap-2 h-full md:grid-cols-12 relative"
-              >
-                {/* Map Section */}
-                <div className="md:col-span-12 flex-1 md:h-full min-h-[50vh] md:min-h-0 overflow-hidden relative border border-amber-500/10 rounded-2xl">
-                  {/* Active Bounty Progress Bar */}
-                  {activeQuest?.bounty && character && (
-                    <motion.div
-                      initial={{ y: -50, opacity: 0 }}
-                      animate={{ y: 0, opacity: 1 }}
-                      className="absolute top-4 left-1/2 -translate-x-1/2 z-[4000] w-full max-w-sm pointer-events-none px-4"
-                    >
-                      <div className="bg-slate-900/90 backdrop-blur-xl border border-amber-500/40 rounded-2xl p-3 shadow-2xl flex flex-col gap-2">
-                        <div className="flex justify-between items-center px-1">
-                          <div className="flex items-center gap-2">
-                            <SwordIcon size={14} className="text-amber-500" />
-                            <span className="text-[10px] font-black text-amber-100 uppercase tracking-widest whitespace-nowrap">
-                              Tracked Bounty: {activeQuest.bounty.targetMonsterId.replace(/-/g, ' ')}s
-                            </span>
+                {activeTab === "World Map" && character && questState !== "battle" && (
+                  <motion.div
+                    key="world-map"
+                    initial={{ opacity: 0, x: 20 }}
+                    animate={{ opacity: 1, x: 0 }}
+                    exit={{ opacity: 0, x: -20 }}
+                    transition={{ duration: 0.3 }}
+                    className="grid gap-2 h-full md:grid-cols-12 relative"
+                  >
+                    {/* Map Section */}
+                    <div className="md:col-span-12 flex-1 md:h-full min-h-[50vh] md:min-h-0 overflow-hidden relative border border-amber-500/10 rounded-2xl">
+                      {/* Active Bounty Progress Bar */}
+                      {activeQuest?.bounty && character && (
+                        <motion.div
+                          initial={{ y: -50, opacity: 0 }}
+                          animate={{ y: 0, opacity: 1 }}
+                          className="absolute top-4 left-1/2 -translate-x-1/2 z-[4000] w-full max-w-sm pointer-events-none px-4"
+                        >
+                          <div className="bg-slate-900/90 backdrop-blur-xl border border-amber-500/40 rounded-2xl p-3 shadow-2xl flex flex-col gap-2">
+                            <div className="flex justify-between items-center px-1">
+                              <div className="flex items-center gap-2">
+                                <SwordIcon size={14} className="text-amber-500" />
+                                <span className="text-[10px] font-black text-amber-100 uppercase tracking-widest whitespace-nowrap">
+                                  Tracked Bounty: {activeQuest.bounty.targetMonsterId.replace(/-/g, ' ')}s
+                                </span>
+                              </div>
+                              <span className="text-[10px] font-mono font-bold text-amber-400">
+                                {character.questProgress?.[activeQuest.id] || 0} / {activeQuest.bounty.targetCount}
+                              </span>
+                            </div>
+                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
+                              <motion.div
+                                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
+                                initial={{ width: 0 }}
+                                animate={{ width: `${Math.min(100, (((character.questProgress?.[activeQuest.id] || 0) / activeQuest.bounty.targetCount) * 100))}%` }}
+                                transition={{ type: "spring", stiffness: 50 }}
+                              />
+                            </div>
                           </div>
-                          <span className="text-[10px] font-mono font-bold text-amber-400">
-                            {character.questProgress?.[activeQuest.id] || 0} / {activeQuest.bounty.targetCount}
-                          </span>
-                        </div>
-                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
-                          <motion.div
-                            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
-                            initial={{ width: 0 }}
-                            animate={{ width: `${Math.min(100, (((character.questProgress?.[activeQuest.id] || 0) / activeQuest.bounty.targetCount) * 100))}%` }}
-                            transition={{ type: "spring", stiffness: 50 }}
-                          />
-                        </div>
-                      </div>
-                    </motion.div>
-                  )}
-                  {(() => {
-                    const mapData = getRegionMapData(character.currentRegion);
-                    return mapData && (
-                      <WorldMap
-                        mapData={mapData}
-                        character={character}
-                        playerClass={character.class}
-                        inventory={inventory}
-                        onNPCInteract={(npc: NPC) => {
-                          if (npc.questId && !completedQuests.includes(npc.questId) && activeQuest?.id !== npc.questId) {
-                            const quest = QUESTS.find(q => q.id === npc.questId);
-                            if (quest && (quest.class === character.class || hasFinishedMainStory(character))) {
+                        </motion.div>
+                      )}
+                      {(() => {
+                        const mapData = getRegionMapData(character.currentRegion);
+                        return mapData && (
+                          <WorldMap
+                            mapData={mapData}
+                            character={character}
+                            playerClass={character.class}
+                            inventory={inventory}
+                            onNPCInteract={(npc: NPC) => {
+                              if (npc.questId && !completedQuests.includes(npc.questId) && activeQuest?.id !== npc.questId) {
+                                const quest = QUESTS.find(q => q.id === npc.questId);
+                                if (quest && (quest.class === character.class || hasFinishedMainStory(character))) {
+                                  handleAcceptQuestFromNPC(quest);
+                                }
+                              }
+                            }}
+                            onQuestAccepted={(quest: Quest) => {
                               handleAcceptQuestFromNPC(quest);
-                            }
-                          }
-                        }}
-                        onQuestAccepted={(quest: Quest) => {
-                          handleAcceptQuestFromNPC(quest);
-                        }}
-                        completedQuests={completedQuests}
-                        activeQuestId={activeQuest?.id}
-                        allQuests={QUESTS}
-                        onBack={() => { }}
-                        onNavigateToRegion={handleRegionChange}
-                        onMobInteract={handleMobBattle}
-                        onUpdateCharacter={(updates) => character && setCharacter({ ...character, ...updates })}
-                      />
-                    );
-                  })()}
-                </div>
-
-                {/* Map Controls Removed as requested */}
-              </motion.div>
-            )}
-          </AnimatePresence>
-        </section>
-      </div>
-        )}
-    </div>
-
-                {/* Character Info */ }
-  <div className="fantasy-card rounded-xl p-3">
-    <h3 className="text-[10px] font-bold text-amber-200/60 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-serif)" }}>Hero Stats</h3>
-    <div className="space-y-2">
-      {statusBar("HP", character.hp, character.maxHp, "hp")}
-      {statusBar("MP", character.mp, character.maxMp, "mp")}
-      {statusBar("XP", character.xp, character.xpToNext, "xp")}
-      <div className="h-px bg-slate-800/50 my-1"></div>
-      {statusBar("Attack Power", character.attack, character.attack + 20, "attack")}
-    </div>
-  </div>
-              </aside >
+                            }}
+                            completedQuests={completedQuests}
+                            activeQuestId={activeQuest?.id}
+                            allQuests={QUESTS}
+                            onBack={() => { }}
+                            onNavigateToRegion={handleRegionChange}
+                            onMobInteract={handleMobBattle}
+                            onUpdateCharacter={(updates) => character && setCharacter({ ...character, ...updates })}
+                          />
+                        );
+                      })()}
+                    </div>
 
-    {/* Main Content */ }
-    < section className = "md:col-span-9 h-full flex flex-col min-h-[400px]" >
-      <AnimatePresence mode="wait">
-        {activeTab === "Inventory" && (
-          <motion.div
-            key="inventory"
-            initial={{ opacity: 0, x: 20 }}
-            animate={{ opacity: 1, x: 0 }}
-            exit={{ opacity: 0, x: -20 }}
-            transition={{ duration: 0.3 }}
-            className="space-y-4"
-          >
-            <Inventory
-              inventory={inventory}
-              selectedItem={selectedItem}
-              onSelectItem={setSelectedItem}
-              onToggleEquip={handleToggleEquip}
-              onConsumeFood={handleConsumeFood}
-              onSellItem={handleSellItem}
-              characterClass={character.class}
-            />
-          </motion.div>
+                    {/* Map Controls Removed as requested */}
+                  </motion.div>
+                )}
+              </AnimatePresence>
+            </section>
+          </div>
         )}
+      </div>
 
-        {activeTab === "Shop" && character && (
-          <motion.div
-            key="shop"
-            initial={{ opacity: 0, x: 20 }}
-            animate={{ opacity: 1, x: 0 }}
-            exit={{ opacity: 0, x: -20 }}
-            transition={{ duration: 0.3 }}
-          >
-            <Shop
-              gold={character.gold}
-              shopItems={SHOP_ITEMS}
-              onBuyItem={handleBuyItem}
-              onWatchAd={handleWatchAd}
-            />
-          </motion.div>
-        )}
 
-        {activeTab === "Guild" && character && (
-          <motion.div
-            key="guild"
-            initial={{ opacity: 0, x: 20 }}
-            animate={{ opacity: 1, x: 0 }}
-            exit={{ opacity: 0, x: -20 }}
-            transition={{ duration: 0.3 }}
-          >
-            <GuildEvolution
-              character={character}
-              onEvolve={(updatedCharacter) => {
-                setCharacter(updatedCharacter);
-                audioManager.playSfx("victory");
-              }}
-              onClose={() => setActiveTab("World Map")}
-            />
-          </motion.div>
+      {/* Celebration Overlay */}
+      <AnimatePresence>
+        {celebration && (
+          <CelebrationOverlay
+            type={celebration.type}
+            title={celebration.title}
+            subtitle={celebration.subtitle}
+            onDismiss={() => setCelebration(null)}
+          />
         )}
+      </AnimatePresence>
 
-        {activeTab === "World Map" && character && (
-          <motion.div
-            key="world-map"
-            initial={{ opacity: 0, x: 20 }}
-            animate={{ opacity: 1, x: 0 }}
-            exit={{ opacity: 0, x: -20 }}
-            transition={{ duration: 0.3 }}
-            className="grid gap-2 h-full md:grid-cols-12 relative"
-          >
-            {/* Map - takes more columns when controls are minimized */}
-            <div className={`${isMapControlsMinimized ? "md:col-span-12" : "md:col-span-8"} flex-1 md:h-full min-h-[50vh] md:min-h-0 overflow-hidden relative border border-amber-500/10 rounded-2xl`}>
-              <button
-                onClick={() => setIsMapControlsMinimized(!isMapControlsMinimized)}
-                className="absolute top-4 right-4 z-[4000] px-3 py-1.5 bg-slate-900/90 backdrop-blur-md rounded-xl border border-amber-500/40 text-amber-200 hover:text-white transition-all shadow-xl pointer-events-auto flex items-center gap-2 text-xs font-bold"
-                title={isMapControlsMinimized ? "Show Quests" : "Maximize Map"}
-              >
-                {isMapControlsMinimized ? "📜 Show Quests ◀" : "🗺️ Maximize Map ▶"}
-              </button>
-              {(() => {
-                const mapData = getRegionMapData(character.currentRegion);
-                return mapData && (
-                  <QuestMap
-                    mapData={mapData}
-                    character={character}
-                    playerClass={character.class}
-                    inventory={inventory}
-                    onNPCInteract={(npc: NPC) => {
-                      if (npc.questId && !completedQuests.includes(npc.questId) && activeQuest?.id !== npc.questId) {
-                        const quest = QUESTS.find(q => q.id === npc.questId);
-                        if (quest && (quest.class === character.class || hasFinishedMainStory(character))) {
-                          handleAcceptQuestFromNPC(quest);
-                        }
-                      }
-                    }}
-                    onQuestAccepted={(quest: Quest) => {
-                      handleAcceptQuestFromNPC(quest);
-                    }}
-                    completedQuests={completedQuests}
-                    activeQuestId={activeQuest?.id}
-                    allQuests={QUESTS}
-                    onBack={() => { }}
-                    onNavigateToRegion={handleRegionChange}
-                  />
-                );
-              })()}
-            </div>
-
-            {/* Map Controls - collapsible */}
-            {!isMapControlsMinimized && (
-              <motion.aside
-                layout
-                initial={{ opacity: 0, x: 20 }}
-                animate={{ opacity: 1, x: 0 }}
-                exit={{ opacity: 0, x: 20 }}
-                className="md:col-span-4 flex flex-col gap-2 min-h-0 overflow-y-auto"
-              >
-                <MapControls
-                  character={character}
-                  currentRegion={character.currentRegion}
-                  onRegionChange={handleRegionChange}
-                />
-              </motion.aside>
-            )}
-          </motion.div>
+      {/* Quick Toast */}
+      <AnimatePresence>
+        {toast && (
+          <QuickToast
+            message={toast.message}
+            icon={toast.icon}
+            onDismiss={() => setToast(null)}
+          />
         )}
-
-        {activeTab === "Quests" && character && (
-          <motion.div
-            key="quests"
-            initial={{ opacity: 0, x: 20 }}
-            animate={{ opacity: 1, x: 0 }}
-            exit={{ opacity: 0, x: -20 }}
-            transition={{ duration: 0.3 }}
-          >
-            {questState === "battle" && activeEnemy ? (
-              <QuestBattle
-                character={{ ...character, inventory }}
-                enemy={activeEnemy}
-                onVictory={handleBattleVictory}
-                onDefeat={handleBattleDefeat}
-                onFlee={handleBattleFlee}
-                onUpdateCharacter={handleUpdateCharacter}
-                onBattleComplete={(result) => {
-                  if (result.success) {
-                    handleBattleVictory(result.xp, result.gold);
-                  }
-                }}
-              />
-            ) : questState === "map" && activeQuest ? (
-              (() => {
-                const mapData = getQuestMap(activeQuest.region);
-                return mapData ? (
-                  <QuestMap
-                    quest={activeQuest}
-                    mapData={getQuestMap(activeQuest.region)}
-                    character={character}
-                    playerClass={character.class}
-                    inventory={inventory}
-                    completedQuests={completedQuests}
-                    activeQuestId={activeQuest?.id}
-                    allQuests={QUESTS}
-                    onNPCInteract={(npc: NPC) => {
-                      if (npc.questId === activeQuest?.id) {
-                        setQuestState("active");
-                      }
-                    }}
-                    onBack={resetQuest}
-                  />
-                ) : (
-                  <Quests
-                    character={character}
-                    quests={QUESTS}
-                    questState="active"
-                    activeQuest={activeQuest}
-                    questResult={questResult}
-                    completedQuests={completedQuests}
-                    onStartQuest={startQuest}
-                    onAttemptChoice={attemptQuestChoice}
-                    onResetQuest={resetQuest}
-                  />
-                );
-              })()
-            ) : (
-              <Quests
-                character={character}
-                quests={QUESTS}
-                questState={questState}
-                activeQuest={activeQuest}
-                questResult={questResult}
-                completedQuests={completedQuests}
-                onStartQuest={startQuest}
-                onAttemptChoice={attemptQuestChoice}
-                onResetQuest={resetQuest}
-              />
-            )}
-          </motion.div>
+        {questToast && (
+          <QuickToast
+            message={questToast.message}
+            icon={questToast.icon}
+            onDismiss={() => setQuestToast(null)}
+          />
         )}
       </AnimatePresence>
-              </section >
-            </div >
-          )
-}
-        </div >
-      )}
-
-{/* Celebration Overlay */ }
-<AnimatePresence>
-  {celebration && (
-    <CelebrationOverlay
-      type={celebration.type}
-      title={celebration.title}
-      subtitle={celebration.subtitle}
-      onDismiss={() => setCelebration(null)}
-    />
-  )}
-</AnimatePresence>
-
-{/* Revive Overlay */ }
-<AnimatePresence>
-  {showReviveOverlay && (
-    <div className="fixed inset-0 z-[10005] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6">
-      <motion.div
-        initial={{ scale: 0.9, opacity: 0 }}
-        animate={{ scale: 1, opacity: 1 }}
-        exit={{ scale: 0.9, opacity: 0 }}
-        className="max-w-sm w-full fantasy-card p-8 text-center"
-      >
-        <div className="text-5xl mb-4">💀</div>
-        <h2 className="text-2xl font-bold text-red-400 mb-2" style={{ fontFamily: "var(--font-serif)" }}>Hero Defeated</h2>
-        <p className="text-slate-400 mb-8 text-sm">
-          You have fallen in battle. Would you like to watch a short vision to revive with full strength?
-        </p>
-
-        <div className="space-y-3">
-          <button
-            onClick={handleReviveWithAd}
-            className="w-full btn-fantasy py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
-          >
-            <span>🎬</span> Revive with Full HP/MP
-          </button>
-          <button
-            onClick={handleAcceptDefeat}
-            className="w-full py-3 rounded-xl font-semibold text-slate-400 hover:text-slate-200 transition-colors"
-          >
-            Return to Town
-          </button>
-        </div>
-      </motion.div>
     </div>
-  )}
-</AnimatePresence>
-
-{/* Quick Toast */ }
-<AnimatePresence>
-  {toast && (
-    <QuickToast
-      message={toast.message}
-      icon={toast.icon}
-      onDismiss={() => setToast(null)}
-    />
-  )}
-  {questToast && (
-    <QuickToast
-      message={questToast.message}
-      icon={questToast.icon}
-      onDismiss={() => setQuestToast(null)}
-    />
-  )}
-</AnimatePresence>
-    </div >
   );
 }
 
