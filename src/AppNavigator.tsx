import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import ShiftScreen from "./screens/ShiftScreen";
import LeaveRequestScreen from "./screens/LeaveRequestScreen";
import SwapRequestScreen from "./screens/SwapRequestScreen";
import ManagerLeaveRequestScreen from "./screens/ManagerLeaveRequestScreen";
import ManagerShiftScreen from "./screens/ManagerShiftScreen";
import ManagerSwapRequestScreen from "./screens/ManagerSwapRequestScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Shifts: undefined;
  LeaveRequest: undefined;
  SwapRequest: undefined;
  ManagerLeaveRequest: undefined;
  ManagerShift: undefined;
  ManagerSwapRequest: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Shifts" component={ShiftScreen} />
        <Stack.Screen name="LeaveRequest" component={LeaveRequestScreen} />
        <Stack.Screen name="SwapRequest" component={SwapRequestScreen} />
        <Stack.Screen name="ManagerLeaveRequest" component={ManagerLeaveRequestScreen} />
        <Stack.Screen name="ManagerShift" component={ManagerShiftScreen} />
        <Stack.Screen name="ManagerSwapRequest" component={ManagerSwapRequestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}