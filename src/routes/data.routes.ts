import { RouteOptions } from "fastify/types/route";
import { getCurrentData } from "../controllers/data.controller";

export const dataRoutes: RouteOptions[] = [
    {
        method: 'GET',
        url: '/env/now',
        handler: getCurrentData,
    },
    {
        method: 'GET',
        url: '/env/day',
        handler: () => null
    }
]