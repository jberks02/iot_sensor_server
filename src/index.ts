import { buildApp } from './app';
const PORT: any = process.env.PORT || 8080

async function main() {
    const app = await buildApp();
    app.listen({ port: 8080 }, (err, address) => {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
        app.log.info('Server listening at: ' + address)
    })
}
main();