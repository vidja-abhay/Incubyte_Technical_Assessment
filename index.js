import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/User.routes.js';
import bookRoutes from './routes/Book.routes.js';

dotenv.config();

const app = express();
const uri = 'mongodb+srv://abhayvidja09:hb4CC6F5pwRLWfEl@cluster0.an2kk.mongodb.net/';

mongoose.set('strictQuery', false);

const connect = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDb database connected');
    } catch (error) {
        console.log(error);
        console.log("MongoDb database connection failed");
    }
};

app.get('/', (req, res) => {
    res.send("Backend Working..");
});

app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/book', bookRoutes);

const PORT = process.env.PORT || 3000;

 app.listen(PORT, () => {
        connect();
        console.log(`Server is running on port ${PORT}`);
    });

export { connect };
