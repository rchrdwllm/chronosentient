import { View } from "react-native";
import Text from "@/components/Text";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text weight="bold">Home Screen</Text>
    </View>
  );
}
