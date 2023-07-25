import { View, ScrollView, Text, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';

import { api } from "../lib/axios";
import { generateProgressPercentage } from '../utils/generate-progress-percentage'

import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { CheckBox } from "../components/CheckBox";
import { Loading } from "../components/Loading";
import { HabitsEmpty } from "../components/HabitsEmpty";
import clsx from "clsx";


interface Params {
  date: string;
}

interface IdayInfo {
  completedHabits: Array<string>;
  possibleHabits: Array<{
    id: string;
    title: string;
  }>
}

export function Habit() {
  const [loading, setLoading] = useState(true)
  const [dayInfo, setDayInfo] = useState<IdayInfo | null>(null);  // State armazers information of habits
  const [completedHabits, setCompletedHabits] = useState<string[]>([])  // State armazer habits completed

  const route = useRoute();
  const { date } = route.params as Params; // Sending date selected

  const parsedDate = dayjs(date);
  const isDateInPast = parsedDate.endOf('day').isBefore(new Date());
  const dayOfWeek = parsedDate.format('dddd');
  const dayAndMonth = parsedDate.format('DD/MM');

  const habitsProgress = dayInfo?.possibleHabits.length ? generateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length) : 0;

  async function fetchHabits() {
    try {
      setLoading(true);

      const response = await api.get('/day', { params: { date } });
      setDayInfo(response.data);
      setCompletedHabits(response.data.completedHabits);

    } catch (err) {
      console.log(err);
      Alert.alert('Error Loading Habits', 'Not possible loading information habits');
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleHabit(habitId: string) {
    try {
      await api.patch(`/habits/${habitId}/toggle`);

      if (completedHabits.includes(habitId)) {
        setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId));
      } else {
        setCompletedHabits(prevState => [...prevState, habitId]);
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Error update habits state', 'Not possible updating the states of habit.')
    }
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <View className="flex-1 bg-bgDefault px-8 pt-16">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress}/>

        <View className={clsx("mt-6", {
          ["opacity-50"]: isDateInPast,
          ["cursor-not-allowed"]: isDateInPast
        })}>
          {
            dayInfo?.possibleHabits ?
              dayInfo?.possibleHabits.map(habit => (
                <CheckBox
                  key={habit.id}
                  title={habit.title}
                  checked={completedHabits.includes(habit.id)}
                  // disabled={isDateInPast}
                  onPress={() => handleToggleHabit(habit.id)} />
              ))
              : <HabitsEmpty />
          }
        </View>

        {
          isDateInPast && (
            <Text className="text-white mt-10 text-center">
              You cannot edit habits with past dates.
            </Text>
          )
        }
      </ScrollView>
    </View>
  )
}
