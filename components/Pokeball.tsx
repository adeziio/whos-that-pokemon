import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Pokeball({ onPress }: { onPress: () => void }) {
    const shimmerAnim = useRef(new Animated.Value(-1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const translateX = shimmerAnim.interpolate({
        inputRange: [-1, 1],
        outputRange: [-80, 80],
    });

    return (
        <TouchableOpacity style={styles.playButton} onPress={onPress}>
            <LinearGradient colors={['#ff5e5e', '#cc0000']} style={styles.pokeballTop} />
            <LinearGradient colors={['#ffffff', '#e6e6e6']} style={styles.pokeballBottom} />
            <View style={styles.pokeballButton} />

            {/* ✨ Shiny overlay */}
            <Animated.View
                pointerEvents="none"
                style={[
                    StyleSheet.absoluteFillObject,
                    { transform: [{ translateX }] },
                ]}
            >
                <LinearGradient
                    colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.shinyOverlay}
                />
            </Animated.View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    playButton: { width: 80, height: 80, borderRadius: 40, overflow: 'hidden', position: 'relative', justifyContent: 'center', alignItems: 'center' },
    pokeballTop: { height: '50%', width: '100%' },
    pokeballBottom: { height: '50%', width: '100%' },
    pokeballButton: { position: 'absolute', width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', borderWidth: 3, borderColor: '#000' },
    shinyOverlay: { width: 80, height: 80, borderRadius: 40 },
});