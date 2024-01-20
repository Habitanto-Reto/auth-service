import { IUser } from "../entities/userModel";

export abstract class AuthRepository {
    abstract addUser(user: IUser): Promise<IUser>;

    abstract findUserByEmail(email: string): Promise<IUser | null>;

    abstract getUserById(uuid: string): Promise<IUser | null>;
}
