import { pool } from "../config/db";


export const autoReturnBookings = async () => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Find expired active bookings
        const expired = await client.query(`
            SELECT id, vehicle_id
            FROM bookings
            WHERE status = 'active'
            AND rent_end_date < CURRENT_DATE
        `);

        if (expired.rowCount === 0) {
            await client.query("COMMIT");
            return;
        }

        const bookingIds = expired.rows.map(b => b.id);
        const vehicleIds = expired.rows.map(b => b.vehicle_id);

        // Update bookings
        await client.query(`
            UPDATE bookings
            SET status = 'returned'
            WHERE id = ANY($1)
        `, [bookingIds]);

        // Update vehicles
        await client.query(`
            UPDATE vehicles
            SET availability_status = 'available'
            WHERE id = ANY($1)
        `, [vehicleIds]);

        await client.query("COMMIT");

        console.log(`Auto-returned ${bookingIds.length} bookings`);

    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Auto-return error:", err);
    } finally {
        client.release();
    }
};
