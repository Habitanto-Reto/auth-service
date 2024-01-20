import {IUser} from "../entities/userModel";

export abstract class AuthDatasource {
    abstract saveUser(user: IUser): Promise<IUser>;

    abstract getUserByEmail(email: string): Promise<IUser | null>;

    abstract getUserById(uuid: string): Promise<IUser | null>;
}
