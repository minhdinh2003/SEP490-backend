import { sign, verify } from 'jsonwebtoken';
import { UserEntity } from 'src/model/entity/user.entity';
import { JwtPayload } from 'jsonwebtoken';

const generateToken = (user: Partial<UserEntity>): string => {
  return sign(user, process.env.JWT_SECRET || 'superSecret', { expiresIn: '2d' });
}
  
export const validateToken = (token: string): JwtPayload | null => {
  try {
    const decoded = verify(token, process.env.JWT_SECRET || 'superSecret') as JwtPayload;
    return decoded; 
  } catch (error) {
    return null; 
  }
};


export default generateToken;