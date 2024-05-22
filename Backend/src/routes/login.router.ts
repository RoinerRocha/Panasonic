import { Router } from "express";
import { getAllUser, login, register } from "../controller/login.controller";
const router = Router();
// Más rutas aquí..

router.get("/", (req, res) => {
  res.send("Hello, Login!");
});

router.post("/register", register);
router.post("/login", login);
router.get("/getUser", getAllUser);

export default router;
