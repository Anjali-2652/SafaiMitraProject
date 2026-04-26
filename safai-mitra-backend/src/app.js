import express from "express";
import cors from "cors";
import authMiddleware from "./middleware/auth.middleware.js";
import reportRoutes from "../src/routes/report.routes.js"
import authRoutes from "./routes/auth.routes.js"; 
import adminRoutes from "./routes/admin.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import userRoutes from "./routes/user.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";


const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Safai Mitra API running...");
});

app.get("/api/protected", authMiddleware, (req, res)=>{
    res.json({
        message: "You are authenticated",
        user: req.user
    })
})

// routes
app.use("/api/auth", authRoutes); 
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/user", userRoutes);
app.use("/api/analytics", analyticsRoutes);


export default app;
