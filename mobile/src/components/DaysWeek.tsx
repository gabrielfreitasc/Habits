import { View, Text } from 'react-native';
import { daySize } from './HabitDay';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export function DaysWeek() {
  return (
    <View className="flex-row mt-6 mb-2">
    {
      weekDays.map((weekDay, i) => (
        <Text key={`${weekDay}-${i}`} className="text-zinc-400 text-xl font-bold text-center mx-1" style={{ width: daySize }}>
          {weekDay}
        </Text>
      ))
    }
    </View>
  )
}
