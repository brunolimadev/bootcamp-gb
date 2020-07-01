import { Request, Response, NextFunction} from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';

import AppError from '../errors/AppError';

interface TokenPayload{
    iat: number;
    exp: number,
    sub: string;
}

export default function ensureAuthenticated(request: Request, response: Response, next: NextFunction): void{
    const authHeader = request.headers.authorization;

    if( !authHeader ){
        throw new AppError('JWT is missing!', 401);
    }

    const { secret } = authConfig.jwt

    const [ , token] = authHeader.split(' ');

    try{
        const decoded = verify(token, secret);

        // Aqui nós forçamos a tipagem da variável decoded com o "as"
        const { sub } = decoded as TokenPayload;

        // Só conseguimos incluir o id do usuário, com a sobrescrita do objeto request.
        // Para isso, criamos a pasta @types com o arquivo "express.d.ts"
        request.user = { id: sub };

        return next();
    }catch{
        throw new AppError('Invalid JWT token', 401);
    }


}
