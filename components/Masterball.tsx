import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function MasterBall({ onPress }: { onPress: () => void }) {
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
        <TouchableOpacity style={styles.container} onPress={onPress}>
            {/* Top Half */}
            <View style={styles.topHalf}>
                <LinearGradient
                    colors={['#5D3FD3', '#3B1F91']}
                    style={StyleSheet.absoluteFill}
                />
                {/* Side Arches (smaller now) */}
                <View style={[styles.arch, styles.leftArch]} />
                <View style={[styles.arch, styles.rightArch]} />
                {/* M Label */}
                <Text style={styles.mLabel}>M</Text>
            </View>

            {/* Divider */}
            <View style={styles.blackBand} />

            {/* Bottom Half */}
            <View style={styles.bottomHalf} />

            {/* Central Button (black ring + white center) */}
            <View style={styles.centerRing}>
                <View style={styles.centerButton} />
            </View>

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
    container: {
        width: 80,
        height: 80,
        borderRadius: 40,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#fff',
    },
    topHalf: {
        position: 'absolute',
        top: 0,
        height: '50%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomHalf: {
        position: 'absolute',
        bottom: 0,
        height: '50%',
        width: '100%',
        backgroundColor: '#ffffff',
    },
    blackBand: {
        position: 'absolute',
        top: '48%',
        height: '4%',
        width: '100%',
        backgroundColor: '#000',
        zIndex: 2,
    },
    mLabel: {
        position: 'absolute',
        top: 6,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        zIndex: 3,
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    arch: {
        position: 'absolute',
        width: 18,
        height: 18,
        backgroundColor: '#ff5e5e',
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        top: 5,
        zIndex: 1,
    },
    leftArch: {
        left: -2,
        transform: [{ rotate: '-40deg' }],
    },
    rightArch: {
        right: -2,
        transform: [{ rotate: '40deg' }],
    },
    centerRing: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 26,
        height: 26,
        marginLeft: -13,
        marginTop: -13,
        borderRadius: 13,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
    },
    centerButton: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    shinyOverlay: { width: 80, height: 80, borderRadius: 40 },
});
