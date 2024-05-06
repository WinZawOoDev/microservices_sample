import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { BrokersFunction, Kafka, Message, Producer, ProducerBatch, TopicMessages } from 'kafkajs'

interface CustomMessageFormat { a: string }

@Injectable()
export default class KafkaProducerService {
    private producer: Producer

    constructor(
        private readonly clientId: string,
        private readonly brokers: string[] | BrokersFunction
    ) {
        this.producer = this.createProducer(clientId, brokers)
    }

    public async start(): Promise<void> {
        try {
            await this.producer.connect();
        } catch (error) {
            console.log('Error connecting the producer: ', error)
        }
    }

    public async shutdown(): Promise<void> {
        await this.producer.disconnect()
    }

    public async sendBatch(topic: string, messages: Array<Record<string, any>>): Promise<void> {
        const kafkaMessages: Array<Message> = messages.map((message) => {
            return {
                value: JSON.stringify(message)
            }
        })

        const topicMessages: TopicMessages = {
            topic,
            messages: kafkaMessages
        }

        const batch: ProducerBatch = {
            topicMessages: [topicMessages]
        }

        await this.producer.sendBatch(batch)
    }

    private createProducer(clientId: string, brokers: string[] | BrokersFunction): Producer {
        const kafka = new Kafka({
            clientId,
            brokers,
        })

        return kafka.producer()
    }


}