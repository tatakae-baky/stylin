import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FONTS, FONT_SIZES } from '../../constants/fonts';

// Temporary mock data
const USER_DATA = {
  name: 'Shakib Khan',
  email: 'shakibkhan@gmail.com',
  avatar: require('../../assets/images/avatar-placeholder.jpg'),
};

const MENU_ITEMS = [
  {
    title: 'Orders',
    subtitle: '2 in progress',
    icon: 'cube-outline',
  },
  {
    title: 'Saved',
    subtitle: '12 items',
    icon: 'bookmark-outline',
  },
  {
    title: 'Recently Viewed',
    icon: 'time-outline',
  },
  {
    title: 'Addresses',
    icon: 'location-outline',
  },
  {
    title: 'Payment',
    icon: 'card-outline',
  },
  {
    title: 'Settings',
    icon: 'settings-outline',
  },
  {
    title: 'Help',
    icon: 'help-circle-outline',
  },
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.avatarSection}>
              <Image
                source={USER_DATA.avatar}
                style={styles.avatar}
                resizeMode="cover"
              />
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera-outline" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{USER_DATA.name}</Text>
              <Text style={styles.userEmail}>{USER_DATA.email}</Text>
              <TouchableOpacity style={styles.editProfileButton}>
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={[styles.statItem, styles.statBorder]}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.menuItem,
                index === MENU_ITEMS.length - 1 && styles.lastMenuItem,
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon as any} size={22} color="#000" />
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuItemText}>{item.title}</Text>
                  {item.subtitle && (
                    <Text style={styles.menuItemSubtext}>{item.subtitle}</Text>
                  )}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  headerTop: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  avatarSection: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f5f5f5',
  },
  editAvatarButton: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    backgroundColor: '#000',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  userName: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.lg,
    color: '#000',
    marginBottom: 2,
  },
  userEmail: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: '#666',
    marginBottom: 8,
  },
  editProfileButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  editProfileText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.xs,
    color: '#000',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#f5f5f5',
  },
  statNumber: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.lg,
    color: '#000',
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: '#666',
  },
  menuContainer: {
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuTextContainer: {
    marginLeft: 12,
  },
  menuItemText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.base,
    color: '#000',
  },
  menuItemSubtext: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: '#666',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  logoutText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: '#FF3B30',
    marginLeft: 8,
  },
}); 