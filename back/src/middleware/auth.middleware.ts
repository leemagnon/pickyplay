import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from 'src/exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from 'src/exceptions/WrongAuthenticationTokenException';
import DataStoredInToken from 'src/interfaces/dataStoredInToken.interface';
import RequestWithUser from 'src/interfaces/requestWithUser.interface';
import userModel from 'src/models/user.model';

async function authMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
  const cookies = req.cookies;
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    try {
      // 만약 토큰이 잘못됐거나 폐기됐으면 jwt.verify가 error를 던진다.
      const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
      const { isSecondFactorAuthenticated, id } = verificationResponse;
      const user = await userModel.findOne({
        where: { id },
        attributes: {
          exclude: ['password'],
        },
      });
      if (isSecondFactorAuthenticated && user) {
        req.user = user; // 로그인한 사람은 req 객체에 user 정보를 가지고 있는다.
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}

export default authMiddleware;
