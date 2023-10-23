import { buildApp } from './app';
const PORT: any = process.env.PORT || 8080

async function main() {
    const app = await buildApp();
    await app.listen({ port: PORT, host: '0.0.0.0' })
}
main();