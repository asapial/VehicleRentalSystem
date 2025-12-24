
import express from 'express';
import { connectDB } from './config/db';
import { usersRoute } from './modules/users/users.route.';
import { authRoute } from './modules/auth/auth.route';
import { vehicleRoute } from './modules/vehicles/vehicles.route';
import { bookingRoute } from './modules/bookings/booking.route';
const app = express();

app.use(express.json());

// Connect to the database
connectDB();

// Routes would go here
app.use("/api/v1/users", usersRoute);

app.use("/api/v1/auth", authRoute);

app.use("/api/v1/vehicles", vehicleRoute);

app.use("/api/v1/booking", bookingRoute);

app.get('/', (req, res) => {
  res.send('Hello 🚗 Vehicle Rental System');
})



export default app;