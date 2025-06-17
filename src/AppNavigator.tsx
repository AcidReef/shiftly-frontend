import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
// import ShiftScreen from "./screens/ShiftScreen";
// import LeaveRequestScreen from "./screens/LeaveRequestScreen";
// import SwapRequestScreen from "./screens/SwapRequestScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Shifts: undefined;
  LeaveRequest: undefined;
  SwapRequest: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* <Stack.Screen name="Shifts" component={ShiftScreen} />
        <Stack.Screen name="LeaveRequest" component={LeaveRequestScreen} />
        <Stack.Screen name="SwapRequest" component={SwapRequestScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}