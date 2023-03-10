interface HabitDayProps {
  completed: number;
}

export function HabitDay(props: HabitDayProps) {
  return (
    <div className="bg-zinc-900 w-10 h-10 text-white rounded m-1 text-center flex items-center justify-center">
       <div className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg "></div>
    </div>
  );
}
