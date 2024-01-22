import { Request, Response } from 'express';
import UserService from '../services/userService';
import Joi from "joi";
class UserController {
    private service: UserService;

    constructor(service: UserService) {
        this.service = service;
    }

    async registerUser(req: Request, res: Response): Promise<Response> {
        try {
            const schema = Joi.object({
                email: Joi.string().email().required().min(1),
                name: Joi.string().required().min(1),
                password: Joi.string().required().min(1)
            });

            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const user = await this.service.createUser(req.body);
            if (!user) {
                return res.status(400).json({ message: 'Error creating a user' });
            }
            return res.status(201).json({ message: 'User successfully created', uuid: user.uuid, name: user.name, email: user.email });
        } catch (error) {
            return res.status(400).json({ message: (error as Error).message });
        }
    }

    async loginUser(req: Request, res: Response): Promise<Response> {
        try {
            const schema = Joi.object({
                email: Joi.string().email().required().min(1),
                password: Joi.string().required().min(1)
            });

            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const { email, password } = req.body;
            const user = await this.service.authenticateUser(email, password);
            if (user) {
                return res.status(200).json({ message: 'Authentication successful', token: user.token, uuid: user.user.uuid, name: user.user.name, email: user.user.email });
            }
            return res.status(401).json({ message: 'Authentication failed' });
        } catch (error) {
            return res.status(500).json({ message: (error as Error).message });
        }
    }

    async viewProfile(req: Request, res: Response): Promise<Response> {
        try {
            const { userId } = req.params;
            const user = await this.service.getUserProfile(userId);
            if (user) {
                return res.status(200).json({ uuid: user.uuid, name: user.name, email: user.email });
            }
            return res.status(404).json({ message: 'User not found' });
        } catch (error) {
            return res.status(500).json({ message: (error as Error).message });
        }
    }

    async getUsers(req: Request, res: Response): Promise<Response> {
        try {
            const users = await this.service.getUsers();
            return res.status(200).json( users.map( user => ({ uuid: user.uuid, name: user.name, email: user.email })));
        } catch (error) {
            return res.status(500).json({ message: (error as Error).message });
        }
    }
}

export default UserController;
