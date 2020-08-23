import { getRepository } from 'typeorm';
import path from 'path';
import User from '../../../models/User';
import uploadConfig from '../../../config/upload';
import fs from 'fs';

import AppError from '../../../errors/AppError';

interface Request{
    user_id: string,
    avatarFileName: string;
}

class UpdateUserAvatarService{

    public async execute({ user_id, avatarFileName }: Request): Promise<User>{

        const userRepository = getRepository(User);

        const user =  await userRepository.findOne(user_id);

        if( !user ){
            throw new AppError('Only authenticated users can change avatar.', 401)
        }

        if( user.avatar ){
            const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar)


            const userAvatarFilePathFileExists = await fs.promises.stat(userAvatarFilePath);

            if( userAvatarFilePathFileExists ){
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

            user.avatar = avatarFileName;

            await userRepository.save(user);

            return user;
    }
}

export default UpdateUserAvatarService;
