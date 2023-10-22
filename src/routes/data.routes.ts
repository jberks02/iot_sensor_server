import { RouteOptions } from "fastify/types/route";
import { getCurrentData, getDailyAverageByHour, getMonthsDailyAverage, getWeeksHourlyAverage } from "../controllers/data.controller";

export const dataRoutes: RouteOptions[] = [
    {
        method: 'GET',
        url: '/env/now',
        handler: getCurrentData,
    },
    {
        method: 'GET',
        url: '/env/day',
        handler: getDailyAverageByHour
    },
    {
        method: 'GET',
        url: '/env/week',
        handler: getWeeksHourlyAverage
    },
    {
        method: 'GET',
        url: '/env/month',
        handler: getMonthsDailyAverage
    }
]