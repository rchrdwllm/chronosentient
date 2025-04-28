import { View } from "react-native";
import Text from "@/components/Text";
import { BACKGROUND_MAIN } from "@/constants/colors";

export default function StatsScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: BACKGROUND_MAIN,
      }}
    >
      <Text weight="bold">Stats Screen</Text>
    </View>
  );
}
