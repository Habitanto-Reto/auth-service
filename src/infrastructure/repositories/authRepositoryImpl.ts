import { IUser } from "../../domain/entities/userModel";
import {AuthRepository} from "../../domain/repositories/authRepository";
import AuthDatasourceImpl from "../../infrastructure/datasources/authDatasourceImpl";

class AuthRepositoryImpl extends AuthRepository {
    private dataSource: AuthDatasourceImpl;

    constructor(dataSource: AuthDatasourceImpl) {
        super();
        this.dataSource = dataSource;
    }

    async addUser(user: IUser): Promise<IUser> {
        return this.dataSource.saveUser(user);
    }

    async findUserByEmail(email: string): Promise<IUser | null> {
        return this.dataSource.getUserByEmail(email);
    }

    async getUserById(uuid: string): Promise<IUser | null> {
        return this.dataSource.getUserById(uuid);
    }

    async getUsers(): Promise<IUser[]> {
        return this.dataSource.getUsers();
    }
}

export default AuthRepositoryImpl;
