import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '@exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '@exceptions/WrongAuthenticationTokenException';
import DataStoredInToken from '@interfaces/dataStoredInToken.interface';
import RequestWithUser from '@interfaces/requestWithUser.interface';
import userModel from '@users/user.model';

async function authMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
    const cookies = req.cookies;
    if(cookies && cookies.Authorization) {
        const secret = process.env.JWT_SECRET;
        try {
            // 만약 토큰이 잘못됐거나 폐기됐으면 jwt.verify가 error를 던진다.
            const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
            const { isSecondFactorAuthenticated, _id: id } = verificationResponse;
            const user = await userModel.findById(id);
            if (isSecondFactorAuthenticated && user) {
                req.user = user;
                next();
            } else {
                next(new WrongAuthenticationTokenException());
            }
        } catch(error) {
            next(new WrongAuthenticationTokenException());
        }
    } else {
        next(new AuthenticationTokenMissingException());
    }
}

export default authMiddleware;