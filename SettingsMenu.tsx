import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function SettingsMenu({
    speed,
    toggleSpeed,
    isMuted,
    toggleMute,
}: {
    speed: 1 | 2 | 3;
    toggleSpeed: () => void;
    isMuted: boolean;
    toggleMute: () => void;
}) {
    const [open, setOpen] = useState(false);
    const anim = useRef(new Animated.Value(0)).current;

    const toggleMenu = () => {
        const newState = !open;
        setOpen(newState);
        Animated.spring(anim, {
            toValue: newState ? 1 : 0,
            useNativeDriver: true,
            friction: 6,
            tension: 60,
        }).start();
    };

    const closeMenu = () => {
        if (open) {
            setOpen(false);
            Animated.spring(anim, { toValue: 0, useNativeDriver: true }).start();
        }
    };

    return (
        <>
            {open && (
                <TouchableWithoutFeedback onPress={closeMenu}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}
            <View style={styles.container}>
                <TouchableOpacity onPress={toggleMenu} style={styles.button}>
                    <Ionicons name="settings-sharp" size={26} color="#3b4cca" />
                </TouchableOpacity>
                {open && (
                    <Animated.View style={[styles.dropdown, { transform: [{ scaleY: anim }] }]}>
                        <TouchableOpacity style={styles.item} onPress={toggleSpeed}>
                            <Ionicons name="arrow-forward-circle" size={20} color="#3b4cca" style={{ marginRight: 8 }} />
                            <Text style={styles.text}>Speed: {speed}x</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.item} onPress={toggleMute}>
                            <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={20} color="#3b4cca" style={{ marginRight: 8 }} />
                            <Text style={styles.text}>{isMuted ? 'Unmute' : 'Mute'}</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: { position: 'absolute', top: 40, right: 20, alignItems: 'flex-end', zIndex: 50 },
    button: { backgroundColor: '#ffe873', padding: 8, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 5 },
    dropdown: { marginTop: 8, backgroundColor: '#fff', borderRadius: 10, paddingVertical: 8, width: 160, borderWidth: 2, borderColor: '#ffcb05' },
    item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12 },
    text: { fontSize: 16, color: '#3b4cca', fontWeight: 'bold' },
    overlay: { position: 'absolute', top: 0, left: 0, width, height, backgroundColor: 'transparent', zIndex: 40 },
});
