import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function Back({
    onBack
}: {
    onBack: () => void;
}) {
    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={onBack} style={styles.button}>
                    <Ionicons name="arrow-back" size={28} color="#3b4cca" />
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: { position: 'absolute', top: 40, left: 20, alignItems: 'flex-end', zIndex: 50 },
    button: { backgroundColor: '#ffe873', padding: 8, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 5 },
    dropdown: { marginTop: 8, backgroundColor: '#fff', borderRadius: 10, paddingVertical: 8, width: 160, borderWidth: 2, borderColor: '#ffcb05' },
    item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12 },
    text: { fontSize: 16, color: '#3b4cca', fontWeight: 'bold' },
    overlay: { position: 'absolute', top: 0, left: 0, width, height, backgroundColor: 'transparent', zIndex: 40 },
});
