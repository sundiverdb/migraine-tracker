import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

function TabIcon({
  name,
  color,
  size,
}: {
  name: IconName;
  color: string;
  size: number;
}) {
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
}

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#9E9E9E',
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: '#fff',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="migraines"
        options={{
          title: 'Migraines',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="head-flash" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="diet"
        options={{
          title: 'Diet',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="food-apple" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="sleep"
        options={{
          title: 'Sleep',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="sleep" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="focus"
        options={{
          title: 'Focus',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="brain" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
