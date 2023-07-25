import { View, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import Logo from '../assets/logo.svg'

export function Header() {
  const { navigate } = useNavigation();

  return (
    <View className='w-full flex-row items-center justify-between'>
      <Logo />
      <TouchableOpacity
        activeOpacity={0.7}
        className='flex-row h-11 px-4 border border-cyan-500 rounded-lg items-center'
        onPress={() => navigate('new')}
      >
        <Feather
          name='plus'
          size={20}
          color='rgb(6, 182, 212)'
        />

        <Text className='text-white ml-3 font-semibold text-base'>
          New
        </Text>
      </TouchableOpacity>
    </View>
  )
}
