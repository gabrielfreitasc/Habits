import { prisma } from "../lib/prisma";
import dayjs from 'dayjs';
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from 'zod'

export async function appRoutes(app: FastifyInstance) {
    app.get('/', async (req: FastifyRequest, res: FastifyReply) => {
        res.status(200).send({
            hello: 'World'
        })
    })
    
    app.post('/habits', async (request) => {
        // title, weekDays
            // Validação se os dados chegaram na request (Biblioteca Zod)
        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(z.number().min(0).max(6))
        })
        
            const { title, weekDays } = createHabitBody.parse(request.body)
    
            const today = dayjs().startOf('day').toDate() // Evita problemas na hr da criação do habito no dia em relação aos horários de criação

            await prisma.habit.create({
                data: {
                    title,
                    created_at: today,
                    weekDays: {
                        create: weekDays.map(weekDay => {
                            return {
                                week_day: weekDay,
                            }
                        })
                    }
                }
            })
    });

    app.get('/day', async (request) => {
        const getDayParams = z.object({
            date: z.coerce.date() // Vai ser enviar como string pelo Front e vai ser convertido em Date pelo "coerce"
        });

        const { date } = getDayParams.parse(request.query); 
        // return --> localhost:3030/day?date=2023-07-15T00
        
        const parsedDate = dayjs(date).startOf('day')
        const weekDay = parsedDate.get('day')

        // All Habits possibles
        // Habits completed

        const possibleHabits = await prisma.habit.findMany({
            where: {
                created_at: {
                    lte: date, // lte --> lower or equal
                },
                weekDays: {
                    some: {
                        week_day: weekDay,
                    }
                }
            }
        })

        // Searching in the table Day, where the date of the table is equal to the one sent by the user
        const day = await prisma.day.findUnique({
            where: {
                date: parsedDate.toDate(),
            },
            // Returns the dayHabits related to Day
            include: {
                dayHabits: true,
            }
        })

        const completedHabits = day?.dayHabits.map(dayHabit => {
            return dayHabit.habit_id // Return something habit_id
        }) ?? [];

        return {
            possibleHabits,
            completedHabits,
        }
    });

    app.patch('/habits/:id/toggle', async (request) => {
        const toggleHabitParams = z.object({
            id: z.string().uuid(),
        })

        const { id } = toggleHabitParams.parse(request.params)
        const today = dayjs().startOf('day').toDate()

        // Check if the current day exists within the database
        let day = await prisma.day.findUnique({
            where: {
                date: today,
            }
        })

        if (!day) { // if not day exists, the day will be created in the database
            day = await prisma.day.create({
                data: {
                    date: today,
                }
            })
        }

        // Search register in the database in the table dayHabit, checking if user marked the Habit today 
        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id,
                }
            }
        })

        if (dayHabit) {
            // Remove marking completed
            await prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id,
                }
            })
        } else {
            // Complete the Habit today
            await prisma.dayHabit.create({
            data: {
                day_id: day.id,
                habit_id: id,
            }
        })
        }


    })

    app.get('/summary', async (request) => {
        // Return summary ==> Unique Call for database -> [{ date, amountHabits, completedHabits }, { date, amountHabits, completedHabits }, { date, amountHabits, completedHabits }]

        const summary = await prisma.$queryRaw`
            SELECT 
                D.id, 
                D.date,
                (
                    SELECT 
                        cast(count(*) as float)
                    FROM day_habits DH
                    WHERE DH.day_id = D.id
                ) as completed,
                (
                    SELECT
                        cast(count(*) as float)
                    FROM habit_week_days HWD
                    JOIN habits H
                        ON H.id = HWD.habit_id
                    WHERE 
                        HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int) -- Convert to standart time SQLite (Unix epoch Time) for weekday, returning INT
                        AND H.created_at <= D.date -- Check habits created on the date before the day  
                ) as amount
            FROM days D
        `

        return summary
    })
}

