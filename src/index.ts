import express from 'express';
const PORT: any = process.env.PORT || 8080


const app = express();

app.get('/', (_req, res) => res.send('Server Online'))

app.listen(PORT, () => {
    console.info('Server Listening on port: ', PORT)
})