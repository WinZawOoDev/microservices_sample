import { Logger } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsString, Validate, ValidateIf, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator"

enum AnswerType {
    yes_no = "yes_no",
    text = "text",
    multiple_choice = "multiple_choice"
}

class MultipleChoice {
    [key: string]: boolean,
}

@ValidatorConstraint({ name: "answer", async: false })
class Answer implements ValidatorConstraintInterface {

    private message: string[] = [];

    private readonly logger = new Logger('answer_validations');

    validate(value: boolean | string | MultipleChoice, { object }: ValidationArguments): boolean | Promise<boolean> {

        const isNotYesOrNo = (object['answerType'] === AnswerType.yes_no) &&
            (typeof value !== "boolean");
        const isNotText = (object['answerType'] === AnswerType.text) &&
            (typeof value !== "string")
        const isNotMultipleChoice = (object['answerType'] === AnswerType.multiple_choice) &&
            (typeof value !== "object");

        if (isNotYesOrNo || isNotText || isNotMultipleChoice) {
            const msg = 'answer must be valid answer_type'
            if (!this.message.includes(msg)) {
                this.message.push(msg);
            }

            return false;
        }


        if (typeof value === "string")
            return this.validateString(value);

        if (typeof value === "object")
            return this.validateObject(value);


        return true;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return this.message.join(',')
    }

    private validateString(str: string) {
        return str.length < 1 || str.length > 300
    }

    private validateObject(obj: Record<string, any>) {
        const keys = Object.keys(obj);
        const isNotBool = Object.values(obj).some(val => typeof val !== "boolean");
        if (isNotBool) {
            const msg = 'answer'
            return false;
        }

        return true
    }
}


export class CreateUserDto {

    @IsString()
    name: string

    @IsEmail()
    email: string

    @IsEnum(AnswerType)
    @IsNotEmpty()
    answerType: AnswerType


    @ValidateIf(o => (o.answerType === AnswerType.yes_no) || (o.answerType === AnswerType.text) || (o.answerType === AnswerType.multiple_choice))
    @Validate(Answer)
    @IsNotEmpty()
    answer: boolean | string | MultipleChoice

}


export class QueryDto {

    @TransformBooleanParam()
    @IsBoolean()
    is_user: boolean

}


function TransformBooleanParam() {
    return Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value)
}