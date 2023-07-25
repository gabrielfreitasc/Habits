import { TouchableOpacity, TouchableOpacityProps , Dimensions } from 'react-native';
import { generateProgressPercentage } from '../utils/generate-progress-percentage';
import clsx from 'clsx';
import dayjs from 'dayjs';

// Define the height and width of the Boxes, based on the amount of screen available
const weekDays = 7;
const screenHorizontalPadding = (32 * 2) / 5;

export const dayMarginBetween = 8; // Gap Boxes
export const daySize = (Dimensions.get('screen').width / weekDays) - (screenHorizontalPadding + 5) // Real Size Boxes

interface Props extends TouchableOpacityProps {
  amountOfHabits?: number;
  amountCompleted?: number;
  date: Date;
};

export function HabitDay({amountOfHabits = 0, amountCompleted = 0, date, ...rest}: Props) {
  const amountAccomplishedPercentage = amountOfHabits > 0 ? generateProgressPercentage(amountOfHabits, amountCompleted) : 0
  const today = dayjs().startOf('day').toDate();
  const isCurrentDay = dayjs(date).isSame(today);

  return (
    <TouchableOpacity
      className={clsx("rounded-lg border-2 m-1", {
        ["bg-zinc-900 border-zinc-800"] : amountAccomplishedPercentage === 0,
        ["bg-cyan-900 border-cyan-700"] : amountAccomplishedPercentage > 0 && amountAccomplishedPercentage < 20,
        ["bg-cyan-800 border-cyan-600"] : amountAccomplishedPercentage > 20 && amountAccomplishedPercentage < 40,
        ["bg-cyan-700 border-cyan-500"] : amountAccomplishedPercentage > 40 && amountAccomplishedPercentage < 60,
        ["bg-cyan-600 border-cyan-500"] : amountAccomplishedPercentage > 60 && amountAccomplishedPercentage < 80,
        ["bg-cyan-500 border-cyan-400"] : amountAccomplishedPercentage > 80,
        ["border-cyan-100 border-3"] : isCurrentDay
      })}
      style={{ width: daySize, height: daySize }}
      activeOpacity={0.7}
      {...rest}
    >

    </TouchableOpacity>
  )
}
