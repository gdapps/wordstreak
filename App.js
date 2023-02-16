import {
  SafeAreaView,
  StyleSheet,
  Text,
} from "react-native";

import Game from './src/components/Game/Game';
import { StatusBar } from "expo-status-bar";
import { colors, } from "./src/constants";

export default function App() {
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.title}>WORDstreak</Text>

    <Game/>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 7,
  },

});
