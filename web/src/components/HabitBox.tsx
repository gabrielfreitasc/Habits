import * as Popover from "@radix-ui/react-popover"
import { ProgressBar } from "./ProgressBar"
import clsx from "clsx";
import dayjs from "dayjs";
import { HabitsList } from "./HabitsList";
import { useState } from "react";

interface HabitBoxProps {
  date: Date;
  defaultCompleted?: number;
  amount?: number;
}

export function HabitBox({ amount = 0, defaultCompleted = 0, date }: HabitBoxProps) {
  const [completed, setCompleted] = useState(defaultCompleted);

  const completedPercentage = amount > 0 ? Math.round((completed / amount) * 100) : 0;

  const dayAndMonth = dayjs(date).format('DD/MM');
  const dayOfWeek = dayjs(date).format('dddd');

  function handleCompletedChanged(completed: number) {
    setCompleted(completed);
  }

  return (
    <Popover.Root>
      <Popover.Trigger
        className={clsx('w-10 h-10 border-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:ring-offset-2 focus:ring-offset-bgDefault',
            {
              'bg-zinc-900 border-zinc-800': completedPercentage === 0,
              'bg-cyan-900 border-cyan-700': completedPercentage > 0 && completedPercentage < 20,
              'bg-cyan-800 border-cyan-600': completedPercentage >= 20 && completedPercentage < 40,
              'bg-cyan-700 border-cyan-500': completedPercentage >= 40 && completedPercentage < 60,
              'bg-cyan-600 border-cyan-500': completedPercentage >= 60 && completedPercentage < 80,
              'bg-cyan-500 border-cyan-400': completedPercentage >= 80,
            }
          )}
      />

      <Popover.Portal>
        <Popover.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col">
          <span className="font-semibold text-zinc-400">{dayOfWeek}</span>
          <span className="mt-1 font-extrabold leading-tight text-3xl">{dayAndMonth}</span>

          <ProgressBar progress={completedPercentage} />

          <HabitsList date={date} onCompletedChanged={handleCompletedChanged}/>

          <Popover.Arrow height={8} width={16} className="fill-zinc-900" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export default HabitBox
