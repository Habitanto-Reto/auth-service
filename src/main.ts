import express from 'express';
import UserController from './presentation/userController';
import UserService from './services/userService';
import AuthRepositoryImpl from './infrastructure/repositories/authRepositoryImpl';
import AuthDatasourceImpl from './infrastructure/datasources/authDatasourceImpl';
import {Database} from "./domain/entities/database";

export class Server {
    private app: express.Express;
    private readonly port: number | string;
    private database: Database;

    constructor(port: number | string, database: Database) {
        this.app = express();
        this.port = port;
        this.database = database;
        this.app.use(express.json());

        const dataSource = new AuthDatasourceImpl();
        const repository = new AuthRepositoryImpl(dataSource);
        const service = new UserService(repository);
        const controller = new UserController(service);

        this.app.post('/register', (req, res) => controller.registerUser(req, res));
        this.app.post('/login', (req, res) => controller.loginUser(req, res));
        this.app.get('/profile/:userId', (req, res) => controller.viewProfile(req, res));
        this.app.get('/users', (req, res) => controller.getUsers(req, res));
    }

    async start() {
        console.log('⏳ Server starting...');
        try {
            await this.database.connect();
            this.app.listen(this.port, () => {
                console.log(`🚀 Server running on port ${this.port}`);
            });
        } catch (err) {
            console.error('🔥 Error al iniciar el servidor:', err);
        }
    }
}