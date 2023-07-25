// Back-end: API RESTfull
// Fastify é um framework semelhante ao Express, porem possui suportes melhores
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { appRoutes } from './routes/routes';

const app = Fastify();


app.register(cors); // Permite o acesso do front-end aos dados do back-end
app.register(appRoutes);

app.listen({
    port: 3030,
    host: '0.0.0.0'
}).then(() => {
    console.log('HTTP Server running! http://0.0.0.0:3030');
})