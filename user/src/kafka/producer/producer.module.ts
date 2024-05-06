import { DynamicModule, Module } from "@nestjs/common";
import KafkaProducerService from "./producer.service";
import { BrokersFunction } from "kafkajs";


type Config = {
    clientId: string,
    brokers: string[] | BrokersFunction
}

@Module({})
export class KafkaProducerModule {
    static register({ clientId, brokers }: Config): DynamicModule {
        return {
            module: KafkaProducerModule,
            providers: [
                {
                    provide: KafkaProducerService,
                    useValue: new KafkaProducerService(clientId, brokers),
                }
            ],
            exports: [KafkaProducerService]
        }
    }
}