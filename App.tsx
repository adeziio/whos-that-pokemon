import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Explore from './Explore';
import Collection from './Collection';
import { Region, RegionOrEmpty, CollectedData } from './types';
import SettingsMenu from './SettingsMenu';
import Back from './Back';
import Pokeball from './Pokeball';
import Masterball from './Masterball';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [mode, setMode] = useState<'menu' | 'exploreRegion' | 'collectionRegion' | 'explore' | 'collection'>('menu');
  const [region, setRegion] = useState<RegionOrEmpty>('');
  const [collected, setCollected] = useState<CollectedData>({ kanto: [], johto: [], hoenn: [] });
  const [bgMusic, setBgMusic] = useState<Audio.Sound | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState<1 | 2 | 3>(1);
  const musicIdRef = useRef(0);

  const totalByGen: Record<Region, number> = { Kanto: 151, Johto: 100, Hoenn: 135 };

  // --- Dedicated Tracks ---
  const startScreenTrack = require('./assets/music/Opening.mp3');
  const gameOverTrack = require('./assets/music/PokemonFlute.mp3');

  // --- Playlist ---
  const musicTracks = [
    require('./assets/music/ThemeOfPalletTown.mp3'),
    require('./assets/music/Cycling.mp3'),
    require('./assets/music/ViridianForest.mp3'),
    require('./assets/music/TeamRocketHideout.mp3'),
  ];
  const playlistRef = useRef<any[]>([]);

  const shuffleArray = (arr: any[]) => arr.sort(() => Math.random() - 0.5);

  useEffect(() => {
    (async () => {
      await Font.loadAsync({ Pokemon: require('./assets/fonts/PokemonSolid.ttf') });
      setFontsLoaded(true);
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const stored = await AsyncStorage.getItem('collected');
      if (stored) setCollected(JSON.parse(stored));
      const savedSpeed = await AsyncStorage.getItem('gameSpeed');
      if (savedSpeed) setSpeed(parseInt(savedSpeed) as 1 | 2 | 3);

      playlistRef.current = shuffleArray([...musicTracks]);
      playStartScreenMusic(); // Start screen music
    })();
  }, []);

  const saveCollected = async (newCollected: CollectedData) => {
    setCollected(newCollected);
    await AsyncStorage.setItem('collected', JSON.stringify(newCollected));
  };

  const fadeAudio = async (sound: Audio.Sound, toVolume: number, duration: number) => {
    if (!sound) return;
    const steps = 10;
    const stepTime = duration / steps;
    const status = await sound.getStatusAsync();
    if (!status.isLoaded) return;
    let currentVolume = status.volume || 0;
    const step = (toVolume - currentVolume) / steps;
    for (let i = 0; i < steps; i++) {
      currentVolume += step;
      await sound.setVolumeAsync(currentVolume);
      await new Promise(res => setTimeout(res, stepTime));
    }
  };

  const stopBackgroundMusic = async (immediate = false) => {
    if (bgMusic) {
      if (immediate) await bgMusic.stopAsync();
      else await fadeAudio(bgMusic, 0, 300);
      await bgMusic.unloadAsync();
      setBgMusic(null);
    }
  };

  const playSpecificTrack = async (track: any, loop = false, resumePlaylist = true) => {
    musicIdRef.current += 1;
    const currentId = musicIdRef.current;
    await stopBackgroundMusic(false);

    const { sound } = await Audio.Sound.createAsync(track, { isLooping: loop, volume: 0 });
    if (currentId !== musicIdRef.current) { await sound.unloadAsync(); return; }
    setBgMusic(sound);
    await sound.playAsync();
    if (currentId === musicIdRef.current) await fadeAudio(sound, isMuted ? 0 : 0.5, 300);

    sound.setOnPlaybackStatusUpdate((status) => {
      if ('didJustFinish' in status && status.didJustFinish && !status.isLooping && resumePlaylist) {
        playNextTrack();
      }
    });
  };

  const playNextTrack = async () => {
    musicIdRef.current += 1;
    const currentId = musicIdRef.current;

    await stopBackgroundMusic(false);

    const track = playlistRef.current.shift();
    playlistRef.current.push(track);

    const { sound } = await Audio.Sound.createAsync(track, { isLooping: false, volume: 0 });
    if (currentId !== musicIdRef.current) { await sound.unloadAsync(); return; }

    setBgMusic(sound);
    await sound.playAsync();
    if (currentId === musicIdRef.current) await fadeAudio(sound, isMuted ? 0 : 0.5, 300);

    sound.setOnPlaybackStatusUpdate((status) => {
      if ('didJustFinish' in status && status.didJustFinish && !status.isLooping) {
        playNextTrack();
      }
    });
  };

  const playStartScreenMusic = async () => await playSpecificTrack(startScreenTrack, true, false);
  const playGameOverMusic = async () => await playSpecificTrack(gameOverTrack, false, false);

  const toggleMute = async () => {
    setIsMuted(prev => {
      if (bgMusic) bgMusic.setVolumeAsync(prev ? 0.5 : 0);
      return !prev;
    });
  };

  const toggleSpeed = () => {
    setSpeed(prev => {
      const next = prev === 1 ? 2 : prev === 2 ? 3 : 1;
      AsyncStorage.setItem('gameSpeed', next.toString());
      return next;
    });
  };

  const collectedCount = (gen: Region) => gen === 'Kanto' ? collected.kanto.length : gen === 'Johto' ? collected.johto.length : collected.hoenn.length;

  if (!fontsLoaded) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#3b4cca' }}><ActivityIndicator size="large" color="#ffcb05" /></View>;
  }

  // MENU
  if (mode === 'menu') {
    return (
      <View style={styles.startScreen}>
        <Text style={styles.startTitle}>Who's That</Text>
        <Text style={styles.startTitle}>Pokémon?</Text>
        <SettingsMenu speed={speed} toggleSpeed={toggleSpeed} isMuted={isMuted} toggleMute={toggleMute} />
        <View style={styles.pokeballRow}>
          <View style={{ alignItems: 'center' }}>
            <Pokeball onPress={() => { setMode('exploreRegion'); }} />
            <Text style={styles.regionLabel}>Explore</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Masterball onPress={() => { setMode('collectionRegion'); }} />
            <Text style={styles.regionLabel}>Collection</Text>
          </View>
        </View>
      </View>
    );
  }

  // REGION SELECT
  if (mode === 'exploreRegion' || mode === 'collectionRegion') {
    const isExplore = mode === 'exploreRegion';
    return (
      <View style={styles.startScreen}>
        <Back onBack={() => { setMode('menu'); }} />
        <SettingsMenu speed={speed} toggleSpeed={toggleSpeed} isMuted={isMuted} toggleMute={toggleMute} />
        <Text style={styles.startTitle}>Select a Region</Text>
        <View style={styles.pokeballRow}>
          {(['Kanto', 'Johto', 'Hoenn'] as Region[]).map((gen) => (
            <View key={gen} style={{ alignItems: 'center' }}>
              <Pokeball onPress={() => {
                setRegion(gen);
                setMode(isExplore ? 'explore' : 'collection');
              }} />
              <Text style={styles.regionLabel}>{gen}</Text>
              <Text style={styles.ratioLabel}>
                {collectedCount(gen)} / {totalByGen[gen]}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  // EXPLORE MODE
  if (mode === 'explore' && region) {
    return (
      <Explore
        region={region as Region}
        collected={collected}
        setCollected={saveCollected}
        onBack={() => { playStartScreenMusic(); setMode('exploreRegion'); }}
        onHome={() => { playStartScreenMusic(); setMode('menu'); }}
        toggleMute={toggleMute}
        isMuted={isMuted}
        stopMusic={stopBackgroundMusic}
        playMusic={playNextTrack}
        playGameOverMusic={playGameOverMusic}
        speed={speed}
        toggleSpeed={toggleSpeed}
      />
    );
  }

  // COLLECTION MODE
  if (mode === 'collection' && region) {
    return (
      <Collection
        region={region as Region}
        collected={collected}
        onBack={() => { setMode('collectionRegion'); }}
        speed={speed}
        toggleSpeed={toggleSpeed}
        isMuted={isMuted}
        toggleMute={toggleMute}
      />
    );
  }

  return null;
}

const styles = StyleSheet.create({
  startScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#3b4cca', paddingHorizontal: 10 },
  startTitle: { fontFamily: 'Pokemon', fontSize: 48, color: '#ffcb05', textShadowColor: '#2a2a72', textShadowOffset: { width: 4, height: 4 }, textShadowRadius: 3 },
  pokeballRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 30 },
  playButton: { width: 80, height: 80, borderRadius: 40, overflow: 'hidden', position: 'relative', justifyContent: 'center', alignItems: 'center' },
  pokeballTop: { height: '50%', width: '100%' },
  pokeballBottom: { height: '50%', width: '100%' },
  pokeballButton: { position: 'absolute', width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', borderWidth: 3, borderColor: '#000' },
  regionLabel: { marginTop: 6, fontSize: 14, fontWeight: 'bold', color: '#fff' },
  ratioLabel: { fontSize: 12, color: '#fff', marginTop: 2 },
  backButton: { position: 'absolute', top: 40, left: 20, zIndex: 20 },
});
