import fastify from 'fastify';
import { dataRoutes } from './routes/data.routes';
import { initSqliteDb } from './dao/sqlite.dao';
import { setUpSensorRead } from './controllers/communications.controller';

const routes = [...dataRoutes]

export async function buildApp() {
    const server = await fastify({
        logger: {
            level: 'info'
        }
    });
    server.route({
        method: 'GET',
        url: '/',
        handler: () => ({ message: 'hello world' })
    })
    await server.register((app, _, done) => {
        for (const route of routes) {
            app.route(route);
        }
        done();
    }, { prefix: 'api' })
    await initSqliteDb();
    setUpSensorRead(1);
    return server;
}