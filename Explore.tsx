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
    TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { Region, CollectedData } from './types';
import SettingsMenu from './SettingsMenu';
import Back from './Back';

export default function Explore({
    region,
    collected,
    setCollected,
    onBack,
    onHome,
    toggleMute,
    isMuted,
    stopMusic,
    playMusic,
    playGameOverMusic,
    speed,
    toggleSpeed,
}: {
    region: Region;
    collected: CollectedData;
    setCollected: (data: CollectedData) => void;
    onBack: () => void;
    onHome: () => void;
    toggleMute: () => void;
    isMuted: boolean;
    stopMusic: (immediate?: boolean) => Promise<void>;
    playMusic: () => Promise<void>;
    playGameOverMusic: () => Promise<void>;
    speed: 1 | 2 | 3;
    toggleSpeed: () => void;
}) {
    const [pokemon, setPokemon] = useState<{ id: number; name: string; image: string } | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [revealed, setRevealed] = useState(false);
    const [resultText, setResultText] = useState('');
    const [resultColor, setResultColor] = useState('green');
    const [showNewCollected, setShowNewCollected] = useState(false);
    const [gameTime, setGameTime] = useState(30);
    const [gameOver, setGameOver] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const blinkAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const flashAnim = useRef(new Animated.Value(0)).current;
    const resultTextAnim = useRef(new Animated.Value(0)).current;
    const collectedAnim = useRef(new Animated.Value(0)).current;

    const totalByGen: Record<Region, number> = { Kanto: 151, Johto: 100, Hoenn: 135 };
    const collectedCount = region === 'Kanto' ? collected.kanto.length : region === 'Johto' ? collected.johto.length : collected.hoenn.length;
    const genKey = region === 'Kanto' ? 'kanto' : region === 'Johto' ? 'johto' : 'hoenn';

    const getPokemonRange = () => {
        switch (region) {
            case 'Kanto': return [1, 151];
            case 'Johto': return [152, 251];
            case 'Hoenn': return [252, 386];
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
        setPokemon({ id, name: data.name, image: data.sprites.other['official-artwork'].front_default });
        setOptions(allOptions);
        setRevealed(false);
        setCountdown(0);
        scaleAnim.setValue(1);
        opacityAnim.setValue(0);
        flashAnim.setValue(0);
        resultTextAnim.setValue(0);
        setResultText('');
    };

    useEffect(() => {
        fetchRandomPokemon();
        playMusic();
    }, []);

    // Timer
    useEffect(() => {
        if (!gameOver) {
            setGameTime(30);
            const timer = setInterval(() => {
                setGameTime(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setGameOver(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
        else if (gameOver) {
            playGameOverMusic();
        }
    }, [gameOver]);

    // Blink last 10s
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

    const triggerCollectedAnimation = () => {
        setShowNewCollected(true);
        collectedAnim.setValue(0);
        Animated.sequence([
            Animated.timing(collectedAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(collectedAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]).start(() => setShowNewCollected(false));
    };

    const handleChoice = async (choice: string) => {
        if (!pokemon) return;
        if (choice === pokemon.name) {
            await playSound('correct');
            setRevealed(true);
            setResultText('Correct!');
            setResultColor('green');
            triggerRevealAnimation();

            if (!collected[genKey].includes(pokemon.id)) {
                const updated = { ...collected, [genKey]: [...collected[genKey], pokemon.id].sort((a, b) => a - b) };
                setCollected(updated);
                triggerCollectedAnimation();
            }

            setGameTime(30);

            const baseTime = 5;
            const newTime = baseTime / speed;
            setCountdown(newTime);
            let seconds = newTime;
            const timer = setInterval(() => {
                seconds -= 1;
                setCountdown(seconds);
                if (seconds <= 0) {
                    clearInterval(timer);
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
                setGameOver(true);
            }, 1500);
        }
    };

    const restartGame = () => {
        setGameOver(false);
        fetchRandomPokemon();
        setGameTime(30);
        playMusic();
    };

    const isCollected = (id: number) => collected[genKey].includes(id);

    if (gameOver) {
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={styles.container}>
                    <LinearGradient colors={['#ffe873', '#ffcb05']} style={styles.hud}>
                        <Text style={styles.hudScore}>Collected: {collectedCount} / {totalByGen[region]}</Text>
                        <Text style={styles.hudRegion}>Region: {region}</Text>
                    </LinearGradient>
                    <Text style={styles.title}>Game Over!</Text>
                    {pokemon && (<><Image source={{ uri: pokemon.image }} style={styles.image} /><Text style={styles.pokemonName}>{pokemon.name.toUpperCase()}</Text></>)}
                    <TouchableOpacity style={styles.button} onPress={restartGame}><LinearGradient colors={['#ffe873', '#ffcb05']} style={styles.buttonGradient}><Text style={styles.buttonText}>Play Again</Text></LinearGradient></TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={onHome}><LinearGradient colors={['#ffe873', '#ffcb05']} style={styles.buttonGradient}><Text style={styles.buttonText}>Home</Text></LinearGradient></TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }

    return (
        <TouchableWithoutFeedback>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <Back onBack={onBack} />
                <SettingsMenu speed={speed} toggleSpeed={toggleSpeed} isMuted={isMuted} toggleMute={toggleMute} />

                <LinearGradient colors={['#ffe873', '#ffcb05']} style={styles.hud}>
                    <Text style={styles.hudScore}>Collected: {collectedCount} / {totalByGen[region]}</Text>
                    <Text style={styles.hudRegion}>Region: {region}</Text>
                    <Animated.Text style={[styles.hudTimer, { opacity: blinkAnim }]}>
                        Time Left: {gameTime}s
                    </Animated.Text>
                </LinearGradient>

                {showNewCollected && (
                    <Animated.Text
                        style={[
                            styles.levelUpText,
                            {
                                opacity: collectedAnim,
                                transform: [{ scale: collectedAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }],
                            },
                        ]}
                    >
                        NEW!
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
                    {revealed && (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.pokemonName}>{pokemon?.name.toUpperCase()}</Text>
                            {pokemon && isCollected(pokemon.id)}
                        </View>
                    )}
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
    container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20, paddingTop: 160, backgroundColor: '#fff' },
    title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
    hud: { position: 'absolute', top: 80, alignSelf: 'center', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 5, zIndex: 10, alignItems: 'center' },
    backButton: { position: 'absolute', top: 40, left: 20, zIndex: 20 },
    hudScore: { fontSize: 22, fontWeight: 'bold', color: '#3b4cca' },
    hudRegion: { fontSize: 18, fontWeight: 'bold', color: '#3b4cca', marginTop: 4 },
    hudTimer: { fontSize: 18, fontWeight: 'bold', color: 'red', marginTop: 4 },
    levelUpText: { position: 'absolute', top: 200, alignSelf: 'center', fontSize: 32, fontWeight: 'bold', color: '#ff0000', textShadowColor: '#fff', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 3, zIndex: 25 },
    image: { width: 250, height: 250, marginBottom: 10, resizeMode: 'contain' },
    flash: { ...StyleSheet.absoluteFillObject, backgroundColor: 'white', borderRadius: 10 },
    resultText: { position: 'absolute', top: -30, fontSize: 28, fontWeight: 'bold' },
    pokemonName: { fontSize: 28, fontWeight: 'bold', color: '#3b4cca', marginBottom: 10 },
    optionsContainer: { width: '100%', marginTop: 20 },
    optionButton: { marginVertical: 8, width: '80%', alignSelf: 'center', borderRadius: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 4 },
    optionButtonGradient: { borderRadius: 25, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center' },
    optionText: { fontSize: 18, fontWeight: 'bold', color: '#3b4cca', textAlign: 'center' },
    button: { borderRadius: 8, marginTop: 10, width: '60%', alignSelf: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 5 },
    buttonGradient: { borderRadius: 8, padding: 12, alignItems: 'center' },
    buttonText: { fontSize: 18, fontWeight: 'bold', color: '#3b4cca', textAlign: 'center' },
});
