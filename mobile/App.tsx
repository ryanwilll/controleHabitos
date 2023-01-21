import { StatusBar } from "expo-status-bar";

import {
  useFonts,
  Inter_400Regular,
  Inter_900Black,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";

import { Loading } from "./src/components/Loading";
import { Homes } from "./src/screens/Homes";

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_900Black,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <>
      <Homes />
      <StatusBar style="auto" />
    </>
  );
}

