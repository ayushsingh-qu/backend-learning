import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: process.env.redis_password,
    socket: {
        host: process.env.redis_url,
        port: process.env.redis_port
    }
});




export {client}