import express from 'express';
import cors, { CorsOptions } from 'cors'; 
import dotenv from 'dotenv';
import { router as accountRouter } from "./routes/accountRoutes";
import { router as userRouter } from "./routes/userRoutes";
import { router as categoryRouter } from "./routes/categoryRoutes";
import { router as transactionRouter } from "./routes/transactionRoutes";


dotenv.config();

const app = express();
const port = process.env.PORT || 7000;

const corsOptions: CorsOptions = {
  origin: '*', 
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/account", accountRouter);
app.use("/api/user", userRouter);  
app.use("/api/category", categoryRouter); 
app.use("/api/transaction", transactionRouter); 

app.get('/', (req, res) => {
  res.json("server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
