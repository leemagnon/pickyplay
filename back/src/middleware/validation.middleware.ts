import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import express from 'express';
import HttpException from '@exceptions/HttpException';

function validationMiddleware<T>(type: any, skipMissingProperties = false): express.RequestHandler {
    return async (req, res, next) => {
        const errors: ValidationError[] = await validate(plainToClass(type, req.body), { skipMissingProperties });
        if (errors.length > 0) {
            const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
            next(new HttpException(400, message));
        } else {
            next();
        }
    };
}

export default validationMiddleware;

/**
 * class-transformer : plain object인 request 객체의 body 부분을 class로 바꾸기 위해 사용.
 * class-validator : object의 유효성을 검사. 
 * class-validator로 에러를 발견하면 validationMiddleware가 next 함수를 호출한다. 
 * next 함수로 에러를 전달하며 Express error middleware가 처리한다. 
 * errors 변수는 error 객체로 이루어진 배열이며, 각각은 constraints 객체를 가지고 있다.
 */