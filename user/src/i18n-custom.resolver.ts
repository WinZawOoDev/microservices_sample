import { Injectable, ExecutionContext } from '@nestjs/common';
import { Metadata } from '@grpc/grpc-js';
import { I18nResolver, I18nResolverOptions } from 'nestjs-i18n';

@Injectable()
export class I18nCustomResolver implements I18nResolver {
    constructor(
        @I18nResolverOptions()
        private keys: string[] = ['lang'],
    ) { }

    async resolve(
        context: ExecutionContext,
    ): Promise<string | string[] | undefined> {
        let lang: string;
        const metadata = context.switchToRpc().getContext()
        console.log(metadata);

        switch (context.getType() as string) {
            case 'rpc':
                const metadata = context.switchToRpc().getContext() as Metadata;
                for (const key of this.keys) {
                    const [value] = metadata.get(key);
                    if (!!value) {
                        lang = value as string;
                        break;
                    }
                }
        }

        return lang;
    }
}