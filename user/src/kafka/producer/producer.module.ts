import { DynamicModule, Module } from "@nestjs/common";
import ProducerService from "./producer.service";
import { BrokersFunction } from "kafkajs";


type Config = {
    clientId: string,
    brokers: string[] | BrokersFunction
}

@Module({})
export class ProducerModule {
    static register({ clientId, brokers }: Config): DynamicModule {
        return {
            module: ProducerModule,
            providers: [
                {
                    provide: ProducerService,
                    useValue: new ProducerService(clientId, brokers),
                }
            ],
            exports: [ProducerService]
        }
    }
}