import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Modal, FlatList, Pressable, Text, TextInput, StyleSheet, View } from 'react-native';
import Colors from '../constants/Colors';

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.surfaceColorSecondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 7,
  },
  overlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)', padding: 20 },
  sheet: { maxHeight: '70%', borderRadius: 10, backgroundColor: Colors.surfaceColorSecondary },
  option: { paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ccc' },
  optionText: { color: '#000', fontSize: 18 },
  cancelText: { color: 'red', fontSize: 18, textAlign: 'center' },
});

const SelectModal = ({ data = [], initValue, value, onChange, onModalClose, disabled, arrowDropDown }) => {
  const [visible, setVisible] = useState(false);

  const close = () => {
    setVisible(false);
    onModalClose?.();
  };

  return (
    <>
      <Pressable disabled={disabled} onPress={() => setVisible(true)}>
        <View style={styles.inputContainer} pointerEvents="none">
          <TextInput style={{ color: '#000' }} editable={false} placeholder="Select an item..." value={value ?? initValue} />
          {arrowDropDown && <Ionicons name="caret-down" size={23} color={Colors.primaryColor} />}
        </View>
      </Pressable>
      <Modal transparent animationType="fade" visible={visible} onRequestClose={close}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <FlatList
              data={data}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onChange?.(item);
                    close();
                  }}
                >
                  <Text style={[styles.optionText, item.label === (value ?? initValue) && { color: 'blue', fontStyle: 'italic' }]}>
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
            <Pressable style={styles.option} onPress={close}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default SelectModal;
