import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';
import dayjs from 'dayjs';

interface HabitListProps {
  date: Date,
  onCompletedChanged: (completed: number) => void,
}

interface IHabitsInfo {
  possibleHabits: Array<{
    id: string,
    title: string,
    created_at: string
  }>,
  completedHabits: Array<string>
}

export function HabitsList({ date, onCompletedChanged }: HabitListProps) {
  const [habitsInfo, setHabitsInfo] = useState<IHabitsInfo>()

  useEffect(() => {
    api.get('day', {
      params: {
        date: date.toISOString(),
      }
    }).then(response => {
      setHabitsInfo(response.data);
    })
  }, []);

  const isDateInPast = dayjs(date).endOf('day').isBefore(new Date()); // Disable checked Past dates

  async function handleToggleHabit(habitId: string) { // Function toggle check habits
    const isHabitAlreadyCompleted = habitsInfo?.completedHabits.includes(habitId);

    await api.patch(`/habits/${habitId}/toggle`)

    let completedHabits: string[] = [];

    if (isHabitAlreadyCompleted) {
      // remove habit of completed list
      completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId); // "!" asserts to TypeScript that "habitinfo" is to be loaded

      setHabitsInfo({
        possibleHabits: habitsInfo!.possibleHabits,
        completedHabits,
      })
    } else {
      // add habit completed list
      completedHabits = [...habitsInfo!.completedHabits, habitId]
    }

    setHabitsInfo({
      possibleHabits: habitsInfo!.possibleHabits,
      completedHabits,
    })

    onCompletedChanged(completedHabits.length);
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      {habitsInfo?.possibleHabits.map(habit => {
        return (
          <Checkbox.Root
            key={habit.id}
            onCheckedChange={() => handleToggleHabit(habit.id)}
            checked={habitsInfo.completedHabits.includes(habit.id)}
            disabled={isDateInPast}
            className="flex items-center group focus:outline-none disabled:cursor-not-allowed"
          >
            <div className="h-8 w-8 rounded-lg flex items-center justify-center mr-3 bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-cyan-700 group-focus:ring-offset-2 group-focus:ring-offset-bgDefault">
              <Checkbox.Indicator>
                <Check size={20} className="text-white"/>
              </Checkbox.Indicator>
            </div>

            <span className="font-semibold text-white text-xl leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
              {habit.title}
            </span>
          </Checkbox.Root>
        )
      })}
      </div>
  )
}
