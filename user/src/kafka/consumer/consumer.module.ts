import { DynamicModule, Module } from "@nestjs/common";
import { BrokersFunction, ConsumerConfig } from "kafkajs";
import KafkaConsumerService from "./consumer.service";


type Options = {
    clientId: string,
    brokers: string[] | BrokersFunction,
    config: ConsumerConfig
}

@Module({})
export class KafkaConsumerModule {
    static register({ clientId, brokers, config }: Options): DynamicModule {
        return {
            module: KafkaConsumerModule,
            providers: [
                {
                    provide: KafkaConsumerService,
                    useValue: new KafkaConsumerService(clientId, brokers, config)
                }
            ],
            exports: [KafkaConsumerService]
        }
    }
}