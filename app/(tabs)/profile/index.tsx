import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  User, 
  MapPin, 
  CreditCard, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Heart,
  Bell,
  Star
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useUserStore } from '@/store/user-store';
import { Button } from '@/components/Button';
import { useReviewStore } from '@/store/review-store';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isLoggedIn, login, logout } = useUserStore();
  const { getUserReviews, loadInitialReviews } = useReviewStore();
  
  useEffect(() => {
    loadInitialReviews();
    
    // Auto-login with mock user data if not logged in
    if (!isLoggedIn) {
      login({
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        addresses: [
          {
            id: '1',
            type: 'home',
            address: '123 Main St, Apt 4B, New York, NY 10001',
            default: true
          },
          {
            id: '2',
            type: 'work',
            address: '456 Park Ave, New York, NY 10022',
            default: false
          }
        ],
        paymentMethods: [
          {
            id: '1',
            type: 'card',
            last4: '4242',
            brand: 'Visa',
            default: true
          }
        ]
      });
    }
  }, []);
  
  const userReviews = user ? getUserReviews(user.id) : [];
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: () => logout(),
          style: 'destructive'
        }
      ]
    );
  };
  
  const navigateToReviews = () => {
    router.push('/profile/reviews');
  };
  
  if (!isLoggedIn || !user) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loginContainer}>
          <User size={64} color={colors.textLight} />
          <Text style={styles.loginTitle}>Sign in to your account</Text>
          <Text style={styles.loginText}>Sign in to view your profile, orders, and more</Text>
          <Button 
            title="Sign In" 
            onPress={() => {}} 
            style={styles.loginButton}
          />
          <Button 
            title="Create Account" 
            onPress={() => {}} 
            variant="outline"
            style={styles.createAccountButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
            </View>
            <View>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.email}>{user.email}</Text>
            </View>
          </View>
          <Button 
            title="Edit Profile" 
            onPress={() => {}} 
            variant="outline"
            size="small"
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: colors.primaryLight }]}>
                <MapPin size={18} color={colors.primary} />
              </View>
              <Text style={styles.menuItemText}>Saved Addresses</Text>
            </View>
            <ChevronRight size={18} color={colors.textLight} />
          </Pressable>
          
          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: colors.secondaryLight }]}>
                <CreditCard size={18} color={colors.secondary} />
              </View>
              <Text style={styles.menuItemText}>Payment Methods</Text>
            </View>
            <ChevronRight size={18} color={colors.textLight} />
          </Pressable>
          
          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: '#FFE0B2' }]}>
                <Heart size={18} color="#FF9800" />
              </View>
              <Text style={styles.menuItemText}>Favorites</Text>
            </View>
            <ChevronRight size={18} color={colors.textLight} />
          </Pressable>
          
          <Pressable style={styles.menuItem} onPress={navigateToReviews}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: '#FFF9C4' }]}>
                <Star size={18} color="#FFC107" />
              </View>
              <Text style={styles.menuItemText}>My Reviews</Text>
              {userReviews.length > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{userReviews.length}</Text>
                </View>
              )}
            </View>
            <ChevronRight size={18} color={colors.textLight} />
          </Pressable>
          
          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: '#E1F5FE' }]}>
                <Bell size={18} color="#03A9F4" />
              </View>
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <ChevronRight size={18} color={colors.textLight} />
          </Pressable>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: '#E8F5E9' }]}>
                <HelpCircle size={18} color="#4CAF50" />
              </View>
              <Text style={styles.menuItemText}>Help Center</Text>
            </View>
            <ChevronRight size={18} color={colors.textLight} />
          </Pressable>
          
          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: '#F3E5F5' }]}>
                <Settings size={18} color="#9C27B0" />
              </View>
              <Text style={styles.menuItemText}>Settings</Text>
            </View>
            <ChevronRight size={18} color={colors.textLight} />
          </Pressable>
        </View>
        
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={18} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  loginText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    width: '100%',
    marginBottom: 12,
  },
  createAccountButton: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  email: {
    fontSize: 14,
    color: colors.textLight,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  badgeContainer: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 16,
  },
  logoutText: {
    fontSize: 16,
    color: colors.error,
    marginLeft: 8,
    fontWeight: '600',
  },
  versionText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
});