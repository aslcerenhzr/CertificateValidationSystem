import { Router, Request, Response } from "express";
import { register, login } from "../controllers/authController";

const router = Router();

// Type the route handlers with Request and Response
router.post("/register", async (req: Request, res: Response) => {
    await register(req, res);
});

router.post("/login", async (req: Request, res: Response) => {
    await login(req, res);
});

export default router;