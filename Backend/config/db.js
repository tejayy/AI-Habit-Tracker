import mongoose from 'mongoose'


export const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI

        if (!uri) {
            throw new Error('please provide MONGO_URI')
        }

        const conn = await mongoose.connect(uri)
        console.log('Connected to db:' + conn.connection.host)

    } catch (error) {
        console.error('error to connect db: ' + error.message)
        process.exit(1)
    }
}