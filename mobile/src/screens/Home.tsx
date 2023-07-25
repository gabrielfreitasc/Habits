import { useState, useCallback } from "react";
import { View, ScrollView, Alert } from "react-native";
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { Header } from "../components/Header";
import { HabitDay, daySize } from "../components/HabitDay";
import { DaysWeek } from "../components/DaysWeek";
import { Loading } from "../components/Loading";

import { api } from "../lib/axios";
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";
import dayjs from "dayjs";

const datesFromYearStart = generateDatesFromYearBeginning();
const minimumSummaryDatesSizes = 18 * 5;
const amountOfDaysToFill = minimumSummaryDatesSizes - datesFromYearStart.length;

type SummaryProps = Array<{
  id: string;
  date: string;
  amount: number;
  completed: number;
}>

export function Home() {
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<SummaryProps | null>(null)

  async function fetchData() {
    try {
      setLoading(true);
      const response = await api.get('/summary');
      setSummary(response.data);
    } catch (e) {
      Alert.alert('Ops', 'It was Not possible loaded summary habits');
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(useCallback(() => { // When the page receives focus again. it will perform the database request
    fetchData();
  }, []));

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <View className="flex-1 bg-bgDefault px-8 pt-16">
      <Header />

      <DaysWeek />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

          {
            summary && // Component html will only be displayed, if summary exist
            <View className="flex-row flex-wrap">
                {
                  datesFromYearStart.map((date) => {
                    const dayWithHabits = summary.find(day => {
                      return dayjs(date).isSame(day.date, 'day');
                    })

                    return (
                      <HabitDay
                        key={date.toISOString()}
                        date={date}
                        amountOfHabits={dayWithHabits?.amount}
                        amountCompleted={dayWithHabits?.completed}
                        onPress={() => navigate('habit', { date: date.toISOString() })}
                      />
                    )
                  })
                }

                {
                  amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) => (
                    <View
                      key={i}
                      className='bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800'
                      style={{ width: daySize, height: daySize }}
                    />
                  ))
                }
              </View>
          }
        </ScrollView>
      </View>
  )
}
