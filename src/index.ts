import express from 'express';
import dotenv from 'dotenv';
import uploadRouter from './routes/upload.router';
import invoiceRouter from './routes/invoice.router';
import orderRouter from './routes/order.router';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use('/order', orderRouter);
app.use('/invoice', invoiceRouter);
app.use('/upload', uploadRouter);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

