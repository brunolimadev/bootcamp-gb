import { Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionRoutes = Router();

sessionRoutes.post('/', async (request, response) => {
    const { email, password } = request.body;

    try{
        const authenticateUser = new AuthenticateUserService();

        const { user, token } = await authenticateUser.execute({
            email,
            password,
        })

        delete user.password

        return response.json({ user, token });
    }catch(err){
        response.status(err.statusCode).json({ message: err.message })
    }
})

export default sessionRoutes;
