import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Vibration,
  Animated,
  ActivityIndicator,
  Easing,
  TouchableWithoutFeedback,
} from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    (async () => {
      await Font.loadAsync({ Pokemon: require('./assets/fonts/PokemonSolid.ttf') });
      setFontsLoaded(true);
    })();
  }, []);

  const [level, setLevel] = useState(0);
  const [highestEasy, setHighestEasy] = useState(0);
  const [highestMedium, setHighestMedium] = useState(0);
  const [highestHard, setHighestHard] = useState(0);
  const [highestMaster, setHighestMaster] = useState(0);
  const [pokemon, setPokemon] = useState<{ name: string; image: string } | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [started, setStarted] = useState(false);
  const [resultText, setResultText] = useState('');
  const [resultColor, setResultColor] = useState('green');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Master' | ''>('');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [speed, setSpeed] = useState<1 | 2 | 3>(1);
  const [bgMusic, setBgMusic] = useState<Audio.Sound | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [gameTime, setGameTime] = useState(30);
  const blinkAnim = useRef(new Animated.Value(1)).current;

  const settingsAnim = useRef(new Animated.Value(0)).current;
  const musicIdRef = useRef(0);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;
  const resultTextAnim = useRef(new Animated.Value(0)).current;
  const levelUpAnim = useRef(new Animated.Value(0)).current;

  const shineX = useRef(new Animated.Value(-120)).current;
  const shineY = useRef(new Animated.Value(60)).current;
  const shineOpacity = useRef(new Animated.Value(0.5)).current;
  const shineXMaster = useRef(new Animated.Value(-120)).current;
  const shineYMaster = useRef(new Animated.Value(60)).current;
  const shineOpacityMaster = useRef(new Animated.Value(0.9)).current;

  const startShineAnimations = () => {
    shineX.setValue(-120);
    shineY.setValue(60);
    shineXMaster.setValue(-120);
    shineYMaster.setValue(60);

    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(shineX, { toValue: 120, duration: 2500, easing: Easing.linear, useNativeDriver: true }),
          Animated.timing(shineX, { toValue: -120, duration: 0, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(shineY, { toValue: -60, duration: 2500, easing: Easing.linear, useNativeDriver: true }),
          Animated.timing(shineY, { toValue: 60, duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();

    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(shineXMaster, { toValue: 120, duration: 1500, easing: Easing.linear, useNativeDriver: true }),
          Animated.timing(shineXMaster, { toValue: -120, duration: 0, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(shineYMaster, { toValue: -60, duration: 1500, easing: Easing.linear, useNativeDriver: true }),
          Animated.timing(shineYMaster, { toValue: 60, duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();
  };

  useEffect(() => {
    if (!started) startShineAnimations();
  }, [started]);

  useEffect(() => {
    (async () => {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const easy = await AsyncStorage.getItem('highestEasy');
      const medium = await AsyncStorage.getItem('highestMedium');
      const hard = await AsyncStorage.getItem('highestHard');
      const master = await AsyncStorage.getItem('highestMaster');
      const savedSpeed = await AsyncStorage.getItem('gameSpeed');
      if (easy) setHighestEasy(parseInt(easy));
      if (medium) setHighestMedium(parseInt(medium));
      if (hard) setHighestHard(parseInt(hard));
      if (master) setHighestMaster(parseInt(master));
      if (savedSpeed) setSpeed(parseInt(savedSpeed) as 1 | 2 | 3);
    })();
  }, []);

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

  const playBackgroundMusic = async (file: any, loop = true) => {
    musicIdRef.current += 1;
    const currentId = musicIdRef.current;

    await stopBackgroundMusic(true);

    const { sound } = await Audio.Sound.createAsync(file, { isLooping: loop, volume: 0 });
    if (currentId !== musicIdRef.current) { await sound.unloadAsync(); return; }
    setBgMusic(sound);
    await sound.playAsync();
    if (currentId === musicIdRef.current) await fadeAudio(sound, isMuted ? 0 : 0.5, 300);
  };

  const playStartMusic = async () => await playBackgroundMusic(require('./assets/music/opening.mp3'));
  const playEndMusic = async () => await playBackgroundMusic(require('./assets/music/ending.mp3'), false);

  const playDifficultyMusic = async (diff: string) => {
    let file;
    switch (diff) {
      case 'Easy': file = require('./assets/music/easy.mp3'); break;
      case 'Medium': file = require('./assets/music/medium.mp3'); break;
      case 'Hard': file = require('./assets/music/hard.mp3'); break;
      case 'Master': file = require('./assets/music/master.mp3'); break;
    }
    await playBackgroundMusic(file);
  };

  const toggleMute = async () => {
    setIsMuted(prev => {
      if (bgMusic) bgMusic.setVolumeAsync(prev ? 0.5 : 0);
      return !prev;
    });
  };

  useEffect(() => {
    if (!started) playStartMusic();
  }, [started]);

  const getPokemonRange = () => {
    switch (difficulty) {
      case 'Easy': return [1, 151];
      case 'Medium': return [152, 251];
      case 'Hard': return [252, 386];
      case 'Master': return [1, 898];
      default: return [1, 151];
    }
  };

  const fetchRandomPokemon = async () => {
    const [minId, maxId] = getPokemonRange();
    const id = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    const randomIds = new Set<number>();
    while (randomIds.size < 3) {
      const rand = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
      if (rand !== id) randomIds.add(rand);
    }
    const optionResponses = await Promise.all(
      Array.from(randomIds).map(rid =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${rid}`).then(res => res.json())
      )
    );
    const optionNames = optionResponses.map(p => p.name);
    const allOptions = [...optionNames, data.name].sort(() => Math.random() - 0.5);
    setPokemon({ name: data.name, image: data.sprites.other['official-artwork'].front_default });
    setOptions(allOptions);
    setRevealed(false);
    setCountdown(0);
    scaleAnim.setValue(1);
    opacityAnim.setValue(0);
    flashAnim.setValue(0);
    progressAnim.setValue(1);
    resultTextAnim.setValue(0);
    setResultText('');
  };

  useEffect(() => {
    if (started && difficulty) {
      fetchRandomPokemon();
      playDifficultyMusic(difficulty);
    }
  }, [started]);

  // GAME TIMER 30s
  useEffect(() => {
    if (started && !gameOver) {
      setGameTime(30);
      const timer = setInterval(() => {
        setGameTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            stopBackgroundMusic(true);
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [started, gameOver]);

  // BLINK under 10s
  useEffect(() => {
    if (gameTime <= 10 && gameTime > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
          Animated.timing(blinkAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      blinkAnim.setValue(1);
    }
  }, [gameTime]);

  useEffect(() => {
    if (gameOver) {
      playEndMusic();  // Play only when gameOver screen is active
    }
  }, [gameOver]);


  const playSound = async (type: 'correct' | 'wrong') => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        type === 'correct' ? require('./assets/correct.mp3') : require('./assets/wrong.mp3'),
        { shouldPlay: true }
      );
      if (type === 'correct') Vibration.vibrate(50);
      else Vibration.vibrate([0, 200]);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) sound.unloadAsync();
      });
    } catch { }
  };

  const triggerRevealAnimation = () => {
    Animated.parallel([
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.sequence([
        Animated.spring(scaleAnim, { toValue: 1.2, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        Animated.timing(flashAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]),
      Animated.timing(resultTextAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  };

  const triggerLevelUpAnimation = () => {
    setShowLevelUp(true);
    levelUpAnim.setValue(0);
    Animated.sequence([
      Animated.timing(levelUpAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(levelUpAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start(() => setShowLevelUp(false));
  };

  const updateHighestLevel = (newLevel: number) => {
    switch (difficulty) {
      case 'Easy': if (newLevel > highestEasy) { setHighestEasy(newLevel); AsyncStorage.setItem('highestEasy', newLevel.toString()); } break;
      case 'Medium': if (newLevel > highestMedium) { setHighestMedium(newLevel); AsyncStorage.setItem('highestMedium', newLevel.toString()); } break;
      case 'Hard': if (newLevel > highestHard) { setHighestHard(newLevel); AsyncStorage.setItem('highestHard', newLevel.toString()); } break;
      case 'Master': if (newLevel > highestMaster) { setHighestMaster(newLevel); AsyncStorage.setItem('highestMaster', newLevel.toString()); } break;
    }
  };

  const toggleSpeed = () => {
    setSpeed(prev => {
      const next = prev === 1 ? 2 : prev === 2 ? 3 : 1;
      AsyncStorage.setItem('gameSpeed', next.toString());
      return next;
    });
  };

  const toggleSettings = () => {
    setSettingsOpen(prev => !prev);
    Animated.spring(settingsAnim, {
      toValue: settingsOpen ? 0 : 1,
      useNativeDriver: true,
      friction: 6,
      tension: 60,
    }).start();
  };

  const closeSettings = () => {
    if (settingsOpen) {
      setSettingsOpen(false);
      Animated.spring(settingsAnim, { toValue: 0, useNativeDriver: true }).start();
    }
  };

  const handleChoice = async (choice: string) => {
    if (!pokemon) return;
    if (choice === pokemon.name) {
      await playSound('correct');
      setRevealed(true);
      setResultText('Correct!');
      setResultColor('green');
      triggerRevealAnimation();
      triggerLevelUpAnimation();

      setGameTime(30); // reset timer on correct guess

      const baseTime = 5;
      const newTime = baseTime / speed;
      setCountdown(newTime);
      Animated.timing(progressAnim, { toValue: 0, duration: newTime * 1000, useNativeDriver: false }).start();
      let seconds = newTime;
      const timer = setInterval(() => {
        seconds -= 1;
        setCountdown(seconds);
        if (seconds <= 0) {
          clearInterval(timer);
          const newLevel = level + 1;
          setLevel(newLevel);
          updateHighestLevel(newLevel);
          fetchRandomPokemon();
        }
      }, 1000 / speed);
    } else {
      await playSound('wrong');
      setRevealed(true);
      setResultText('Incorrect!');
      setResultColor('red');
      triggerRevealAnimation();
      setTimeout(() => {
        stopBackgroundMusic(true);
        setGameOver(true);
      }, 1500);
    }
  };

  const restartGame = () => {
    updateHighestLevel(level);
    setLevel(0);
    setGameOver(false);
    setStarted(false);
    setDifficulty('');
    playStartMusic();
  };

  const handleBackToMenu = () => {
    updateHighestLevel(level);
    setLevel(0);
    setStarted(false);
    setDifficulty('');
    playStartMusic();
  };

  if (!fontsLoaded) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#3b4cca' }}><ActivityIndicator size="large" color="#ffcb05" /></View>;
  }

  // START SCREEN
  if (!started) {
    return (
      <View style={styles.startScreen}>
        <Text style={styles.startTitle}>Who's That</Text>
        <Text style={styles.startTitle}>Pokémon?</Text>
        <View style={styles.pokeballRow}>
          {['Easy', 'Medium', 'Hard', 'Master'].map((diff) => {
            const highScore = diff === 'Easy' ? highestEasy : diff === 'Medium' ? highestMedium : diff === 'Hard' ? highestHard : highestMaster;
            const isMaster = diff === 'Master';
            return (
              <View key={diff} style={{ alignItems: 'center' }}>
                <TouchableOpacity style={styles.playButton} onPress={() => { setDifficulty(diff as any); setStarted(true); }}>
                  <LinearGradient colors={isMaster ? ['#b566d4', '#a040a0'] : ['#ff5e5e', '#cc0000']} style={styles.pokeballTop} />
                  <LinearGradient colors={['#ffffff', '#e6e6e6']} style={styles.pokeballBottom} />
                  <View style={styles.pokeballButton} />
                  {isMaster && (<><Text style={styles.masterBallText}>M</Text><View style={[styles.masterBallCircle, styles.masterBallCircleLeft]} /><View style={[styles.masterBallCircle, styles.masterBallCircleRight]} /></>)}
                  <Animated.View style={[styles.shineWrapper, { transform: [{ translateX: isMaster ? shineXMaster : shineX }, { translateY: isMaster ? shineYMaster : shineY }, { rotate: '-30deg' }], opacity: isMaster ? shineOpacityMaster : shineOpacity }]}>
                    <LinearGradient colors={[isMaster ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.7)', 'rgba(255,255,255,0)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.shine} />
                  </Animated.View>
                </TouchableOpacity>
                <Text style={styles.difficultyLabel}>{diff}</Text>
                <Text style={styles.highScoreLabel}>High: {highScore}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  // GAME OVER SCREEN
  if (gameOver) {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container}>
          <LinearGradient colors={['#ffe873', '#ffcb05']} style={styles.hud}>
            <Text style={styles.hudScore}>Level: {level}</Text>
            <Text style={styles.hudSub}>Highest Level: {difficulty === 'Easy' ? highestEasy : difficulty === 'Medium' ? highestMedium : difficulty === 'Hard' ? highestHard : highestMaster}</Text>
            <Text style={styles.hudDifficulty}>Difficulty: {difficulty}</Text>
          </LinearGradient>
          <Text style={styles.title}>Game Over!</Text>
          {pokemon && (<><Image source={{ uri: pokemon.image }} style={styles.image} /><Text style={styles.pokemonName}>{pokemon.name.toUpperCase()}</Text></>)}
          <TouchableOpacity style={styles.button} onPress={restartGame}><LinearGradient colors={['#ffe873', '#ffcb05']} style={styles.buttonGradient}><Text style={styles.buttonText}>Play Again</Text></LinearGradient></TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // GAMEPLAY SCREEN
  return (
    <TouchableWithoutFeedback onPress={closeSettings}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToMenu}><Ionicons name="arrow-back" size={28} color="#3b4cca" /></TouchableOpacity>

        {/* Settings Gear */}
        <View style={styles.settingsContainer}>
          <TouchableOpacity onPress={toggleSettings} style={styles.settingsButton}>
            <Ionicons name="settings-sharp" size={26} color="#3b4cca" />
          </TouchableOpacity>
          {settingsOpen && (
            <Animated.View style={[styles.dropdownMenu, { transform: [{ scaleY: settingsAnim }] }]}>
              <TouchableOpacity style={styles.dropdownItem} onPress={toggleSpeed}>
                <Ionicons name="arrow-forward-circle" size={20} color="#3b4cca" style={{ marginRight: 8 }} />
                <Text style={styles.dropdownText}>Speed: {speed}x</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dropdownItem} onPress={toggleMute}>
                <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={20} color="#3b4cca" style={{ marginRight: 8 }} />
                <Text style={styles.dropdownText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        <LinearGradient colors={['#ffe873', '#ffcb05']} style={styles.hud}>
          <Text style={styles.hudScore}>Level: {level}</Text>
          <Text style={styles.hudDifficulty}>Difficulty: {difficulty}</Text>
          <Animated.Text style={[styles.hudTimer, { opacity: blinkAnim }]}>
            Time Left: {gameTime}s
          </Animated.Text>
        </LinearGradient>

        {showLevelUp && (
          <Animated.Text
            style={[
              styles.levelUpText,
              {
                opacity: levelUpAnim,
                transform: [{ scale: levelUpAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }],
              },
            ]}
          >
            LEVEL UP!
          </Animated.Text>
        )}

        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {pokemon && (
            <View style={{ position: 'relative', alignItems: 'center' }}>
              <Image source={{ uri: pokemon.image }} style={[styles.image, { tintColor: 'black', position: 'absolute' }]} />
              <Animated.Image source={{ uri: pokemon.image }} style={[styles.image, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]} />
              <Animated.View style={[styles.flash, { opacity: flashAnim }]} />
              {resultText !== '' && (
                <Animated.Text style={[styles.resultText, { opacity: resultTextAnim, transform: [{ scale: resultTextAnim }], color: resultColor }]}>{resultText}</Animated.Text>
              )}
            </View>
          )}
          {revealed && <Text style={styles.pokemonName}>{pokemon?.name.toUpperCase()}</Text>}
          {!revealed && (
            <View style={styles.optionsContainer}>
              {options.map((opt, idx) => (
                <TouchableOpacity key={idx} onPress={() => handleChoice(opt)} style={styles.optionButton}>
                  <LinearGradient colors={['#ffe873', '#ffcb05']} style={styles.optionButtonGradient}>
                    <Text style={styles.optionText}>{opt.toUpperCase()}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  startScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#3b4cca', paddingHorizontal: 10 },
  startTitle: { fontFamily: 'Pokemon', fontSize: 48, color: '#ffcb05', textShadowColor: '#2a2a72', textShadowOffset: { width: 4, height: 4 }, textShadowRadius: 3 },
  pokeballRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 30 },
  playButton: { width: 80, height: 80, borderRadius: 40, overflow: 'hidden', position: 'relative', justifyContent: 'center', alignItems: 'center' },
  pokeballTop: { height: '50%', width: '100%' },
  pokeballBottom: { height: '50%', width: '100%' },
  pokeballButton: { position: 'absolute', width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', borderWidth: 3, borderColor: '#000' },
  masterBallText: { position: 'absolute', top: 8, fontSize: 14, fontWeight: 'bold', color: '#fff', zIndex: 2 },
  masterBallCircle: { position: 'absolute', top: 5, width: 10, height: 10, borderRadius: 5, backgroundColor: '#e6b3f0' },
  masterBallCircleLeft: { left: 12 },
  masterBallCircleRight: { right: 12 },
  shineWrapper: { position: 'absolute', width: 180, height: 180, borderRadius: 90 },
  shine: { width: '100%', height: '100%', borderRadius: 90 },
  difficultyLabel: { marginTop: 6, fontSize: 14, fontWeight: 'bold', color: '#fff' },
  highScoreLabel: { fontSize: 12, color: '#fff', marginTop: 2 },
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20, paddingTop: 160, backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  hud: { position: 'absolute', top: 80, alignSelf: 'center', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 5, zIndex: 10, alignItems: 'center' },
  backButton: { position: 'absolute', top: 40, left: 20, zIndex: 20 },
  settingsContainer: { position: 'absolute', top: 40, right: 20, alignItems: 'flex-end', zIndex: 20 },
  settingsButton: { backgroundColor: '#ffe873', padding: 8, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 5 },
  dropdownMenu: { marginTop: 8, backgroundColor: '#fff', borderRadius: 10, paddingVertical: 8, width: 160, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 4, elevation: 6, borderWidth: 2, borderColor: '#ffcb05', transform: [{ scaleY: 0 }], transformOrigin: 'top' },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12 },
  dropdownText: { fontSize: 16, color: '#3b4cca', fontWeight: 'bold' },
  hudScore: { fontSize: 22, fontWeight: 'bold', color: '#3b4cca' },
  hudSub: { fontSize: 16, fontWeight: '500', color: '#3b4cca', marginTop: 4 },
  hudDifficulty: { fontSize: 18, fontWeight: 'bold', color: '#3b4cca', marginTop: 4 },
  hudTimer: { fontSize: 18, fontWeight: 'bold', color: 'red', marginTop: 4 },
  levelUpText: { position: 'absolute', top: 80, alignSelf: 'center', fontSize: 32, fontWeight: 'bold', color: '#ff0000', textShadowColor: '#fff', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 3, zIndex: 25 },
  image: { width: 250, height: 250, marginBottom: 10, resizeMode: 'contain' },
  flash: { ...StyleSheet.absoluteFillObject, backgroundColor: 'white', borderRadius: 10 },
  resultText: { position: 'absolute', top: -30, fontSize: 28, fontWeight: 'bold' },
  pokemonName: { fontSize: 28, fontWeight: 'bold', color: '#3b4cca', marginBottom: 10 },
  progressBar: { width: '80%', height: 10, backgroundColor: '#ddd', borderRadius: 5, marginTop: 8 },
  progress: { height: '100%', backgroundColor: '#3b4cca', borderRadius: 5 },
  optionsContainer: { width: '100%', marginTop: 20 },
  optionButton: { marginVertical: 8, width: '80%', alignSelf: 'center', borderRadius: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 4 },
  optionButtonGradient: { borderRadius: 25, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center' },
  optionText: { fontSize: 18, fontWeight: 'bold', color: '#3b4cca', textAlign: 'center' },
  button: { borderRadius: 8, marginTop: 10, width: '60%', alignSelf: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 5 },
  buttonGradient: { borderRadius: 8, padding: 12, alignItems: 'center' },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: '#3b4cca', textAlign: 'center' },
});
