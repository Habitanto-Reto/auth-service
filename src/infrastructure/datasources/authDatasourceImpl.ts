import User, { IUser } from "../../domain/entities/userModel";
import { AuthDatasource } from "../../domain/datasources/authDatasource";

class AuthDatasourceImpl extends AuthDatasource {
    async saveUser(user: IUser): Promise<IUser> {
        const newUser = new User(user);
        return newUser.save();
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        return User.findOne({email});
    }

    async getUserById(uuid: string): Promise<IUser | null> {
        return User.findOne({uuid});
    }
}

export default AuthDatasourceImpl;
