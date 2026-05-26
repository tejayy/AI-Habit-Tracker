import dotenv from "dotenv"
dotenv.config()
import express from "express";
import cors from "cors"
import { connectDB } from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express()

const allowedOrigins = (process.env.CLIENT_URI || "").split(",").map((s) => s.trim()).filter(Boolean);


const corsOptions = {
    origin(origin, cb) {
        //Allow  requests with no origin (like mobile apps orcurl)
        if (!origin) return cb(null, true)

        //Allow local development
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return cb(null, true)

        //Allow configured origins
        if (allowedOrigins.includes(origin)) return cb(null, true)
        return cb(new Error("Not allowed by CORS"))
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions))
app.options('/{*splat}', cors(corsOptions))
app.use(express.json({ limit: "1mb" }))

app.get("/api/health    ", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() })
})

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 8000

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}).catch((error) => {
    console.error(`Failed to connect to database: ${error.message}`)
    process.exit(1)
})  