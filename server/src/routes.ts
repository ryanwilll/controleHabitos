import dayjs from 'dayjs';
import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { prisma } from "./lib/prisma";


export async function appRoutes(app: FastifyInstance) {

app.post("/habits", async (request) => {
       
const createHabitBody = z.object({
    title: z.string(),
    weekDays: z.array(z.number().min(0).max(6))
})


const { title, weekDays} = createHabitBody.parse(request.body)

//
const today = dayjs().startOf('day').toDate()

await prisma.habit.create({
  data: {
    title,
    created_at: today,
    weekDays: {
      create: weekDays.map(weekDay => {
        return {
          week_day: weekDay
        }
      })
    }
  }
})
});


app.get('/day', async(request) => {
  const getDayParams = z.object({
    date: z.coerce.date()
  })

  const {date} = getDayParams.parse(request.query)
  const parsedDate = dayjs(date).startOf('day')
  const weekDay = parsedDate.get('day')

  const possibleHabits = await prisma.habit.findMany({
    where: {
      created_at: {
        lte: date,
      },
      weekDays: {
        some: {
          week_day: weekDay,
        }
      }
    }
  })


const day = await prisma.day.findUnique({
  where:{
    date: parsedDate.toDate(),
  },
  include: {
    dayHabits: true,
  }
})
const completeHabits = day?.dayHabits.map(dayHabits => {
  return dayHabits.habit_id
})


  return{
    possibleHabits,
    
  }
})



// Completa habito / undo
app.patch('/habits/:id/toogle', async (request) => {
  const toogleHabitParams = z.object({
    id: z.string().uuid(),
  })

  const {id} = toogleHabitParams.parse(request.params)

  const today = dayjs().startOf('day').toDate()

  let day = await prisma.day.findUnique({
    where:{
      date: today
    }
  })
  if (!day){
    day = await prisma.day.create({
      data:{
        date: today,
      }
    })
  }

  const dayHabit = await prisma.dayHabit.findUnique({
    where: {
      day_id_habit_id:{ 
        day_id: day.id,
        habit_id: id
      }
    }
  })

  if (dayHabit) {
    await prisma.dayHabit.delete({
      where: {
        id: dayHabit.id,
        
      }
    })
  }else{
    //completar habito do dia
    await prisma.dayHabit.create({
      data:{
        day_id: day.id,
        habit_id: id,
      }
  })
}

  

})


app.get('/sumary', async() => {
  
  const summary = await prisma.$queryRaw`

    SELECT D.id, 
    D.date
    (
      SELECT 
       cast( count(*) as float )
      FROM day_habits DH
      where DH.day_id = D.id
    ) as Completed
    (
      SELECT
        cast( count(*) as float)
      FROM habit_week_days HWD
      WHERE
        HWD.week_day = strftime('%W', D.date)
    ) as amount
    FROM days D

  `
  return summary

})
}
