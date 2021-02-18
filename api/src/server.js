import express from 'express';
import kafkajs from 'kafkajs';

const routes = require("./routers")

const kafka = new kafkajs.Kafka({
    clientId: "api",
    brokers: ["localhost:4080"],
    logLevel: kafkajs.logLevel.WARN,
    retry: {
        initialRetryTime: 300,
        retries: 10
    }
})

const producer = kafka.producer();
const consumer = kafka.consumer();

app.use((req, res, next) => {
    req.producer = producer;
  
    return next();
})

app.use(routes);

async function run() {
  await producer.connect()
  await consumer.connect()

  await consumer.subscribe({ topic: 'certification-response' });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('Resposta', String(message.value));
    },
  });

  app.listen(3333);
}

run().catch(console.error)