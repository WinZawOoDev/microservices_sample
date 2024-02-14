import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const Context = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    console.log(ctx);
    return ctx;
})