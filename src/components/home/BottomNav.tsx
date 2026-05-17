import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useResponsive } from '../../utils/responsive';

export type NavKey = 'explorar' | 'roteiro' | 'mapa' | 'perfil';

type BottomNavProps = {
  activeKey: NavKey;
  onChange: (key: NavKey) => void;
  bottomInset: number;
  onPressCenter?: () => void;
};

const NAV_LEFT: Array<{ key: NavKey; label: string; icon: keyof typeof MaterialIcons.glyphMap }> = [
  { key: 'explorar', label: 'Explorar', icon: 'explore' },
  { key: 'roteiro', label: 'Roteiros', icon: 'calendar-today' },
];

const NAV_RIGHT: Array<{ key: NavKey; label: string; icon: keyof typeof MaterialIcons.glyphMap }> = [
  { key: 'mapa', label: 'Mapa', icon: 'place' },
  { key: 'perfil', label: 'Perfil', icon: 'person' },
];

export default function BottomNav({ activeKey, onChange, bottomInset, onPressCenter }: BottomNavProps) {
  const r = useResponsive();
  const navHeight = r.scaleY(72) + bottomInset;

  return (
    <View style={[styles.footer, { height: navHeight, paddingBottom: bottomInset }]}>
      {/* Left items */}
      <View style={styles.side}>
        {NAV_LEFT.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.item}
            onPress={() => onChange(item.key)}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={item.icon}
              size={r.scaleX(24)}
              color={activeKey === item.key ? Colors.primary : Colors.textGray}
            />
            <Text
              style={[
                styles.label,
                { fontSize: r.font(11), marginTop: r.scaleY(3) },
                activeKey === item.key && styles.labelActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Center FAB */}
      <View style={styles.fabWrapper}>
        <TouchableOpacity style={[styles.fab, { bottom: bottomInset + r.scaleY(20) }]} onPress={onPressCenter} activeOpacity={0.85}>
          <MaterialIcons name="add" size={r.scaleX(28)} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Right items */}
      <View style={styles.side}>
        {NAV_RIGHT.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.item}
            onPress={() => onChange(item.key)}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={item.icon}
              size={r.scaleX(24)}
              color={activeKey === item.key ? Colors.primary : Colors.textGray}
            />
            <Text
              style={[
                styles.label,
                { fontSize: r.font(11), marginTop: r.scaleY(3) },
                activeKey === item.key && styles.labelActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    backgroundColor: Colors.inputBackground,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: Colors.inputBorder,
    paddingTop: 10,
  },
  side: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  label: {
    color: Colors.textGray,
  },
  labelActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  fabWrapper: {
    width: 64,
    alignItems: 'center',
    position: 'relative',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
});
