import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Difficulty, CollectedData } from './types';
import SettingsMenu from './SettingsMenu';

const generationRanges: Record<Difficulty, [number, number]> = {
    Gen1: [1, 151],
    Gen2: [152, 251],
    Gen3: [252, 386],
};

const Collection = ({
    difficulty,
    collected,
    onBack,
    toggleMute,
    isMuted,
    speed,
    toggleSpeed,
}: {
    difficulty: Difficulty;
    collected: CollectedData;
    onBack: () => void;
    toggleMute: () => void;
    isMuted: boolean;
    speed: 1 | 2 | 3;
    toggleSpeed: () => void;
}) => {
    const [startId, endId] = generationRanges[difficulty];
    const collectedIds = collected[difficulty.toLowerCase() as keyof CollectedData];

    const renderPokemon = (id: number) => {
        const isCaught = collectedIds.includes(id);
        const imageUri = isCaught
            ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
            : undefined;

        return (
            <View key={id} style={styles.pokemonContainer}>
                {isCaught ? (
                    <Image source={{ uri: imageUri }} style={styles.pokemonImage} />
                ) : (
                    <View style={styles.placeholder} />
                )}
                <Text style={styles.pokemonText}>
                    {isCaught ? `#${id}` : `#${id}`}
                </Text>
            </View>
        );
    };

    const allPokemon = [];
    for (let id = startId; id <= endId; id++) {
        allPokemon.push(renderPokemon(id));
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Ionicons name="arrow-back" size={28} color="#3b4cca" />
            </TouchableOpacity>
            <SettingsMenu
                isMuted={isMuted}
                toggleMute={toggleMute}
                speed={speed}
                toggleSpeed={toggleSpeed}
            />
            <LinearGradient colors={['#ffe873', '#ffcb05']} style={styles.hud}>
                <Text style={styles.hudText}>
                    {collectedIds.length} / {endId - startId + 1}
                </Text>
                <Text style={styles.hudDifficulty}>Difficulty: {difficulty}</Text>
            </LinearGradient>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.grid}>{allPokemon}</View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
    },
    hud: {
        position: 'absolute',
        top: 80,
        alignSelf: 'center',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 25,
        zIndex: 5,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    hudText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#3b4cca',
    },
    hudDifficulty: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3b4cca',
        marginTop: 4,
    },
    scrollContainer: {
        paddingTop: 160,
        paddingHorizontal: 10,
        paddingBottom: 40,
        alignItems: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    pokemonContainer: {
        alignItems: 'center',
        margin: 8,
        width: 90,
    },
    pokemonImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    placeholder: {
        width: 80,
        height: 80,
        backgroundColor: '#ddd',
        borderRadius: 40,
    },
    pokemonText: {
        marginTop: 4,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3b4cca',
    },
});

export default Collection;
