import { Plus, X } from 'phosphor-react'
import logoImage from '../assets/logo.svg'
import * as Dialog from '@radix-ui/react-dialog';
import { NewHabit } from './NewHabit';

export function Header() {
  return (
    <div className='w-full max-w-3xl mx-auto flex items-center justify-between'>
      <img src={logoImage} alt="Logo Habits" />

      <Dialog.Root>
        <Dialog.Trigger
          type='button'
          className='border border-cyan-500 font-semibold rounded-lg px-6 py-4 flex items-center gap-3 hover:border-cyan-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:ring-offset-2 focus:ring-offset-bgDefault'
        >
          <Plus size={20} className='text-cyan-500 hover:text-cyan-300 transition-all'/>
          New Habit
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className='w-screen h-screen bg-black/80 fixed inset-0' />
          <Dialog.Content className='absolute p-10 bg-zinc-900 rounded-2xl w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <Dialog.Close className='absolute right-6 top-6 text-zinc-400 hover:text-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2 focus:ring-offset-zinc-900'>
              <X size={24} aria-label='Close' />
            </Dialog.Close>

            <Dialog.Title className='text-3xl leading-tight text-white font-extrabold'>
              Create Habit
            </Dialog.Title>

            <NewHabit />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  )
}

