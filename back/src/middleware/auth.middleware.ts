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
            const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
        } catch(error) {
            next(new WrongAuthenticationTokenException());
        }
    }
}

export default authMiddleware;