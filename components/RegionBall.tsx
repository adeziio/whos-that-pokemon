import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Region = 'Kanto' | 'Johto' | 'Hoenn';

export default function RegionBall({
    region,
    onPress
}: {
    region: Region;
    onPress: () => void;
}) {
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

    const getTopColors = (): [string, string] => {
        switch (region) {
            case 'Kanto':
                return ['#ff5e5e', '#cc0000']; // red
            case 'Johto':
                return ['#4e9af1', '#3161a3']; // blue
            case 'Hoenn':
                return ['#64e664', '#3b9c3b']; // green
        }
    };

    return (
        <TouchableOpacity style={styles.playButton} onPress={onPress}>
            <LinearGradient colors={getTopColors()} style={styles.topHalf} />
            <LinearGradient colors={['#ffffff', '#e6e6e6']} style={styles.bottomHalf} />
            <View style={styles.centerButton} />

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
    playButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    topHalf: {
        height: '50%',
        width: '100%',
    },
    bottomHalf: {
        height: '50%',
        width: '100%',
    },
    centerButton: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
        borderWidth: 3,
        borderColor: '#000',
    },
    shinyOverlay: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
});
