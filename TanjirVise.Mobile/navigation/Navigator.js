import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { Platform, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/appScreens/HomeScreen';
import Login from '../screens/authScreens/Login';
import { getAuthToken, getRoleFromToken } from '../functions/authTokenFunctions';
import UserHomeScreen from '../screens/appScreens/UserHomeScreen';
import UserFoodRequestScreen from '../screens/appScreens/FoodRequestScreens/UserFoodRequestScreen';
import Registration from '../screens/authScreens/Registration';
import { useNavigation } from '@react-navigation/native';
import MyProfileScreen from '../screens/appScreens/AccountScreens/MyProfileScreen';
import CreateNewFoodRequestScreen from '../screens/appScreens/FoodRequestScreens/CreateNewFoodRequestScreen'
import ChangePasswordScreen from '../screens/appScreens/AccountScreens/ChangePasswordScreen';
import EditProfileScreen from '../screens/appScreens/AccountScreens/EditProfileScreen';
import FoodRequestScreen from '../screens/appScreens/FoodRequestScreens/FoodRequestScreen';
import ChangeStatus from '../components/ChangeStatus';


// Authentication Stack Navigator
const AuthStack = createStackNavigator();
function AuthStackScreen () {
    return (
        <AuthStack.Navigator
            initialRouteName='Login'
            screenOptions={ {
                headerShown: false,
                headerBackTitleVisible: false, // This v
                headerStyle: {
                    backgroundColor: 'white', // Promjena boje pozadine zaglavlja
                },
                headerTintColor: '#0891B1', // Promjena boje teksta naslova i back button-a
                headerTitleStyle: {
                    fontSize: 24,
                },
                headerTitleAlign: 'center',
            } }
        >
            <AuthStack.Screen
                name='Login'
                component={ Login }
            />
            <AuthStack.Screen
                name='Registration'
                component={ Registration }
                options={ {
                    headerShown: true, // Show the header for this screen
                    headerTitle: "Registration", // Optional: Set a title
                    headerBackTitleVisible: false, // Hide back button title
                } }
            />
        </AuthStack.Navigator>
    )
}


// Account Stack Navigator
const AccountStack = createStackNavigator();
function AccountStackScreen () {
    return (
        <AccountStack.Navigator
            initialRouteName='MyProfile'
            screenOptions={ {
                headerShown: false,
                headerStyle: {
                    backgroundColor: 'white', // Promjena boje pozadine zaglavlja
                },
                headerTintColor: '#0891B1', // Promjena boje teksta naslova i back button-a
                headerTitleStyle: {
                    fontSize: 24,
                },
                headerTitleAlign: 'center',
            } }
        >
            <AccountStack.Screen
                name='MyProfile'
                component={ MyProfileScreen }
            />
            <AccountStack.Screen
                name='EditProfile'
                component={ EditProfileScreen }
                options={ {
                    headerShown: true,
                    headerTitle: "Edit Profile", // Sakriva naslov
                    headerBackTitleVisible: false, // Sakriva tekst na back dugmetu (ako ga ima)
                } }
            />
            <AccountStack.Screen
                name='ChangePassword'
                options={ {
                    headerShown: true,
                    headerTitle: "Change Password", // Sakriva naslov
                    headerBackTitleVisible: false, // Sakriva tekst na back dugmetu (ako ga ima)
                } }
                component={ ChangePasswordScreen }
            />
        </AccountStack.Navigator>
    )
}


// Stack Navigator for Users
const UserHomeStack = createStackNavigator();
function UserHomeStackScreen () {
    return (
        <UserHomeStack.Navigator
            initialRouteName='UserHome'
            screenOptions={ {
                headerShown: false,
                headerStyle: {
                    backgroundColor: 'white', // Promjena boje pozadine zaglavlja
                },
                headerTintColor: '#0891B1', // Promjena boje teksta naslova i back button-a
                headerTitleStyle: {
                    fontSize: 24,
                },
                headerTitleAlign: 'center',
            } }
        >
            <UserHomeStack.Screen
                //lista items
                name='UserHome'
                component={ UserHomeScreen }
            />
            <UserHomeStack.Screen
                //single screen
                name='UserFoodRequestScreen'
                options={ {
                    headerShown: true,
                    headerTitle: "Food Request", // Sakriva naslov
                    headerBackTitleVisible: false, // Sakriva tekst na back dugmetu (ako ga ima)
                } }
                component={ UserFoodRequestScreen }
            />
            <UserHomeStack.Screen
                name='CreateNewFoodRequestScreen'
                options={ {
                    headerShown: true,
                    headerTitle: "Create New Food Request", // Sakriva naslov
                    headerBackTitleVisible: false, // Sakriva tekst na back dugmetu (ako ga ima)
                } }
                component={ CreateNewFoodRequestScreen }
            />
        </UserHomeStack.Navigator>
    )
}

// Tab Navigator for Users
const TabBarUserConfig = [
    {
        screen: UserHomeStackScreen,
        tabBarLabel: "Food Requests",
        icon: <Ionicons name="home-outline" size={ 23 } color="white" />
    },
    {
        screen: AccountStackScreen,
        tabBarLabel: "My Profile",
        icon: <FontAwesome name="user-o" size={ 23 } color="white" />
    },

];

const UserTab = createBottomTabNavigator();
const UserTabScreen = () => {
    return (
        <UserTab.Navigator
            screenOptions={ ({ route }) => ({
                tabBarStyle: {
                    backgroundColor: "#008CA2", // Plava boja (prilagodi prema potrebi)
                    borderTopWidth: 0,
                    height: Platform.OS === "ios" ? 70 : 67, // Visina navigacije
                    paddingBottom: Platform.OS === "ios" ? 10 : 5, // Padding za iOS i Android
                    elevation: 10, // Efekat sjene
                },
                headerShown: false,
                tabBarShowLabel: false, // Sakriva labelu
                tabBarIcon: ({ focused }) => {
                    const routeConfig = TabBarUserConfig.find(item => item.tabBarLabel === route.name);
                    if (routeConfig)
                    {
                        const activeColor = "#008CA2"; // Boja kad je aktivno
                        const inactiveColor = "white"; // Boja kad je neaktivno

                        return (
                            <View
                                style={ {
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: focused ? "white" : "transparent", // Bijeli krug za aktivne
                                    borderRadius: 50, // Krug
                                    width: 77, // Dimenzije kruga
                                    height: 46,
                                } }
                            >
                                { React.cloneElement(routeConfig.icon, {
                                    color: focused ? activeColor : inactiveColor, // Boja ikone
                                }) }
                            </View>
                        );
                    }
                    return null;
                },
            }) }
        >
            { TabBarUserConfig.map(({ screen, tabBarLabel }) => (
                <UserTab.Screen
                    key={ tabBarLabel }
                    name={ tabBarLabel }
                    component={ screen }
                />
            )) }
        </UserTab.Navigator>
    );
};


// Stack Navigator for Volunteers and Restaurants
const HomeStack = createStackNavigator();
function HomeStackScreen ({ route }) {
    return (
        <HomeStack.Navigator
            initialRouteName='Home'
            screenOptions={ {
                headerShown: false,
                headerStyle: {
                    backgroundColor: 'white', // Promjena boje pozadine zaglavlja
                },
                headerTintColor: '#0891B1', // Promjena boje teksta naslova i back button-a
                headerTitleStyle: {
                    fontSize: 24,
                },
                headerTitleAlign: 'center',

            } }
        >
            <HomeStack.Screen
                //lista items
                name='Home'
                component={ HomeScreen }
                initialParams={ route.params }
            />
            <HomeStack.Screen
                //single screen
                name='FoodRequestScreen'
                component={ FoodRequestScreen }
                initialParams={ route.params }
            />
            <HomeStack.Screen
                name='ChangeStatus'
                component={ ChangeStatus }
                initialParams={ route.params }
            />
        </HomeStack.Navigator>
    )
}

// Tab Navigator for Volunteers and Restaurants
const TabBarConfig = [
    {
        screen: HomeStackScreen,
        param: false,
        tabBarLabel: "Food Requests",
        icon: <Ionicons name="home-outline" size={ 24 } color="black" />
    },
    {
        screen: HomeStackScreen,
        param: true,
        tabBarLabel: "My Food Requests",
        icon: <MaterialCommunityIcons name="silverware-variant" size={ 24 } color="black" />
    },
    {
        screen: AccountStackScreen,
        param: false,
        tabBarLabel: "My Profile",
        icon: <FontAwesome name="user-o" size={ 24 } color="black" />
    },

];

const Tab = createBottomTabNavigator();
const TabScreen = () => {
    return (
        <Tab.Navigator
            screenOptions={ ({ route }) => ({
                tabBarStyle: {
                    backgroundColor: "#008CA2", // Plava boja (prilagodi prema potrebi)
                    borderTopWidth: 0,
                    height: Platform.OS === "ios" ? 70 : 67, // Visina navigacije
                    paddingBottom: Platform.OS === "ios" ? 10 : 5, // Padding za iOS i Android
                    elevation: 10, // Efekat sjene
                },
                headerShown: false,
                tabBarShowLabel: false, // Sakriva labelu
                style: {
                    marginBottom: Platform.OS === "ios" ? 10 : 20,
                    paddingTop: 4,
                    paddingBottom: Platform.OS === "ios" ? 30 : 10,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    const routeConfig = TabBarConfig.find(item => item.tabBarLabel === route.name);
                    if (routeConfig)
                    {
                        const activeColor = "#008CA2"; // Boja kad je aktivno
                        const inactiveColor = "white"; // Boja kad je neaktivno

                        return (
                            <View
                                style={ {
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: focused ? "white" : "transparent", // Bijeli krug za aktivne
                                    borderRadius: 50, // Krug
                                    width: 77, // Dimenzije kruga
                                    height: 46,
                                } }
                            >
                                { React.cloneElement(routeConfig.icon, {
                                    color: focused ? activeColor : inactiveColor, // Boja ikone
                                }) }
                            </View>
                        );
                    }
                    return null;
                },
            }) }>
            { TabBarConfig.map(({ screen, tabBarLabel, param }) => (
                <Tab.Screen
                    key={ tabBarLabel }
                    name={ tabBarLabel }

                    options={ { headerShown: false } }
                    component={ screen }
                    initialParams={ { myRequest: param } }
                />
            )) }
        </Tab.Navigator>
    );
};


// Root Stack Navigator
const defaultStackOptions = {
    headerShown: false,
};

const RootStack = createStackNavigator();
const RootStackScreen = () => {
    const [tokenLoading, setTokenLoading] = useState(true);
    const [authToken, setAuthToken] = useState(null);

    useEffect(() => {
        getAuthToken().then((token) => setAuthToken(token))
            .finally(() => setTokenLoading(false));
    }, [authToken, tokenLoading]);

    const navigation = useNavigation();

    useEffect(() => {
        if (!authToken)
        {
            navigation.navigate("Auth");
        }
    }, [authToken])


    return (
        <RootStack.Navigator
            initialRouteName={ authToken ? getRoleFromToken(authToken) === "User" ? "AppUser" : "App" : "Auth" }
            screenOptions={ {
                ...defaultStackOptions,
            } }>
            <RootStack.Screen name="Auth" component={ AuthStackScreen } />
            <RootStack.Screen name="AppUser" component={ UserTabScreen } />
            <RootStack.Screen name="App" component={ TabScreen } />

        </RootStack.Navigator>
    );
};


export default function Navigator () {
    return <RootStackScreen />;
}
