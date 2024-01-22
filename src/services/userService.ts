import { IUser } from '../domain/entities/userModel';
import {AuthRepository} from "../domain/repositories/authRepository";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as process from "process";

class UserService {
    private repository: AuthRepository;

    constructor(repository: AuthRepository) {
        this.repository = repository;
    }

    async createUser(user: IUser): Promise<IUser | null> {
        // Verificar si el usuario (por email) ya existe
        const existingUser = await this.repository.findUserByEmail(user.email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Encriptar la contraseña (basic)
        const saltRounds = 10;
        user.password = await bcrypt.hash(user.password, saltRounds);

        return this.repository.addUser(user);
    }

    async authenticateUser(email: string, password: string): Promise<{ user: IUser, token: string } | null> {
        const user = await this.repository.findUserByEmail(email);

        if (!user) {
            throw new Error('User does not exist');
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined');
        }

        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                //jwt
                const token = jwt.sign(
                    { id: user.uuid, email: user.email, username: user.name },
                    jwtSecret,
                    { expiresIn: '5h', algorithm: 'HS256' }
                );
                return { user, token };
            }
        }
        return null;
    }

    async getUserProfile(uuid: string): Promise<IUser | null> {
        return this.repository.getUserById(uuid);
    }

    async getUsers(): Promise<IUser[]> {
        return this.repository.getUsers();
    }
}

export default UserService;
