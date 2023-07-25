import { useNavigation } from "@react-navigation/native";
import { Text } from "react-native";

export function HabitsEmpty() {
  const { navigate } = useNavigation();

  return (
    <Text className="text-zinc-400 text-base" >
      Your list of habits is Empty. {' '}

      <Text className="text-cyan-400 text-base underline active:text-cyan-500" onPress={() => navigate('new')}>
        Create your Habit now
      </Text>
    </Text>
  )
}
