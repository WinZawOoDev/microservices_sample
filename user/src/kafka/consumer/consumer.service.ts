import { Consumer, ConsumerSubscribeTopics, EachBatchPayload, Kafka, EachMessagePayload, BrokersFunction, ConsumerConfig } from 'kafkajs'

export default class KafkaConsumerService {

    private kafkaConsumer: Consumer

    public constructor(
        private readonly clientId: string,
        private readonly brokers: string[] | BrokersFunction,
        private readonly config: ConsumerConfig
    ) {
        this.kafkaConsumer = this.createKafkaConsumer(clientId, brokers, config)
    }

    public async startConsumer(topics: string[]): Promise<void> {
        const topic: ConsumerSubscribeTopics = {
            topics,
            fromBeginning: false
        }

        try {
            await this.kafkaConsumer.connect()
            await this.kafkaConsumer.subscribe(topic)

            await this.kafkaConsumer.run({
                eachMessage: async (messagePayload: EachMessagePayload) => {
                    const { topic, partition, message } = messagePayload
                    const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
                    console.log(`- ${prefix} ${message.key}#${message.value}`)
                }
            })
        } catch (error) {
            console.log('Error: ', error)
        }
    }

    public async startBatchConsumer(topics: string[]): Promise<void> {
        const topic: ConsumerSubscribeTopics = {
            topics,
            fromBeginning: false
        }

        try {
            await this.kafkaConsumer.connect()
            await this.kafkaConsumer.subscribe(topic)
            await this.kafkaConsumer.run({
                eachBatch: async (eachBatchPayload: EachBatchPayload) => {
                    const { batch } = eachBatchPayload
                    for (const message of batch.messages) {
                        const prefix = `${batch.topic}[${batch.partition} | ${message.offset}] / ${message.timestamp}`
                        console.log(`- ${prefix} ${message.key}#${message.value}`)
                    }
                }
            })
        } catch (error) {
            console.log('Error: ', error)
        }
    }

    public async shutdown(): Promise<void> {
        await this.kafkaConsumer.disconnect()
    }

    private createKafkaConsumer(clientId: string, brokers: string[] | BrokersFunction, config: ConsumerConfig): Consumer {
        const kafka = new Kafka({
            clientId,
            brokers
        })
        const consumer = kafka.consumer(config)
        return consumer
    }
}