import express, { json } from 'express';
import kfkajs from 'kafkajs';
const routes = express.Router();

routes.post("/logs", async (req, resp) => {
    try {
        const content = {
            user: "NoOther",
            log: "This content it's about log"
        }
    
        await req.producer.send({
            topic: "test-logs",
            compression: kfkajs.CompressionTypes.GZIP,
            message: [
                {value: JSON.stringify(content)}
            ]
        })
        return resp.status(201).json("ok")
    } catch (error) {
        return resp.status(500),json("internsal-server-error")
    }
})

export default routes;