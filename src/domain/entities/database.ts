import mongoose from 'mongoose';

export class Database {
    private readonly mongoUri: string;

    constructor(mongoUri: string) {
        this.mongoUri = mongoUri;
    }

    connect() {
        console.log('🛢 Conectando a MongoDB🍃...');
        return mongoose.connect(this.mongoUri)
            .then(() => console.log('Conexión a MongoDB🍃 establecida 🟢'))
            .catch(err => console.error('Error conectando a MongoDB ⛔', err));
    }
}