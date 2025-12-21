
import express from 'express';
import { connectDB } from './config/db';
import { usersRoute } from './modules/users/users.route.';
import { authRoute } from './modules/auth/auth.route';
const app = express();

app.use(express.json());

// Connect to the database
connectDB();

// Routes would go here
app.use("/users", usersRoute);

app.use("/auth", authRoute);

app.get('/', (req, res) => {
  res.send('Hello 🚗 Vehicle Rental System');
})



export default app;