import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Modal,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Region, CollectedData } from '../configs/types';
import Settings from '../components/Settings';
import Back from '../components/Back';

const typeColors: Record<string, string> = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dark: '#705848',
    dragon: '#7038F8',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
    normal: '#A8A878',
};

export default function Collection({
    region,
    collected,
    onBack,
    speed,
    toggleSpeed,
    isMuted,
    toggleMute,
    playClickSound
}: {
    region: Region;
    collected: CollectedData;
    onBack: () => void;
    speed: 1 | 2 | 3;
    toggleSpeed: () => void;
    isMuted: boolean;
    toggleMute: () => void;
    playClickSound: () => void;
}) {
    const [selectedPokemon, setSelectedPokemon] = useState<number | null>(null);
    const [pokemonDetails, setPokemonDetails] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const totalByGen: Record<Region, number> = { Kanto: 151, Johto: 100, Hoenn: 135 };
    const genKey = region === 'Kanto' ? 'kanto' : region === 'Johto' ? 'johto' : 'hoenn';
    const collectedIds = collected[genKey];

    const fetchDetails = async (id: number) => {
        setLoading(true);
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await res.json();
            setPokemonDetails(data);
        } catch (e) {
            setPokemonDetails(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (id: number) => {
        setSelectedPokemon(id);
        fetchDetails(id);
    };

    const closeModal = () => {
        setSelectedPokemon(null);
        setPokemonDetails(null);
    };

    return (
        <View style={styles.container}>
            <Back onBack={onBack} />
            <Settings speed={speed} toggleSpeed={toggleSpeed} isMuted={isMuted} toggleMute={toggleMute} playClickSound={playClickSound} />
            <LinearGradient colors={['#ffe873', '#ffcb05']} style={styles.hud}>
                <Text style={styles.hudTitle}>Collection - {region}</Text>
                <Text style={styles.hudText}>{collectedIds.length} / {totalByGen[region]}</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.grid}>
                {Array.from({ length: totalByGen[region] }, (_, idx) => {
                    const id = (region === 'Kanto' ? 1 : region === 'Johto' ? 152 : 252) + idx;
                    const isCollected = collectedIds.includes(id);
                    return (
                        <TouchableOpacity key={id} style={styles.card} onPress={() => isCollected && handleSelect(id)}>
                            {isCollected ? (
                                <Image source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png` }} style={styles.image} />
                            ) : (
                                <Text style={styles.placeholder}>#{id}</Text>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Full-Screen Modal */}
            <Modal visible={selectedPokemon !== null} transparent={false} animationType="slide">
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                        <Ionicons name="close" size={32} color="#3b4cca" />
                    </TouchableOpacity>
                    {loading ? (
                        <ActivityIndicator size="large" color="#3b4cca" />
                    ) : pokemonDetails ? (
                        <>
                            <Text style={styles.modalId}>#{pokemonDetails.id}</Text>
                            <Image source={{ uri: pokemonDetails.sprites.other['official-artwork'].front_default }} style={styles.modalImage} />
                            <Text style={styles.modalName}>{pokemonDetails.name.toUpperCase()}</Text>
                            <View style={styles.typeContainer}>
                                {pokemonDetails.types.map((t: any, index: number) => (
                                    <View
                                        key={index}
                                        style={[styles.typeBadge, { backgroundColor: typeColors[t.type.name] || '#ccc' }]}
                                    >
                                        <Text style={styles.typeText}>{t.type.name.toUpperCase()}</Text>
                                    </View>
                                ))}
                            </View>
                        </>
                    ) : (
                        <Text>Failed to load Pokémon data.</Text>
                    )}
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingTop: 80 },
    hud: { position: 'relative', top: 0, alignSelf: 'center', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 5, zIndex: 10, alignItems: 'center' },
    hudTitle: { fontSize: 22, fontWeight: 'bold', color: '#3b4cca' },
    hudText: { fontSize: 18, fontWeight: 'bold', color: '#3b4cca', marginTop: 4 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingBottom: 20 },
    card: { width: 80, height: 80, margin: 5, backgroundColor: '#fff', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    image: { width: 70, height: 70, resizeMode: 'contain' },
    placeholder: { fontSize: 12, color: '#999' },
    modalContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
    closeButton: { position: 'absolute', bottom: 100, zIndex: 100 },
    modalId: { position: 'absolute', top: 100, fontSize: 18, fontWeight: 'bold', color: '#999' },
    modalImage: { width: Dimensions.get('window').width * 0.8, height: 300, resizeMode: 'contain' },
    modalName: { fontSize: 32, fontWeight: 'bold', color: '#3b4cca', marginVertical: 12 },
    typeContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
    typeBadge: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 20, marginHorizontal: 6 },
    typeText: { color: '#fff', fontWeight: 'bold' },
});
