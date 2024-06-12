import { Router } from "express";
import {
  getAllUser,
  login,
  register,
  getUserById,
  deleteUser,
  updateUser,
  getCurrentUser,
  sendEmailToUserByEmail,
  updatePasswordByEmail
} from "../controller/login.controller";

const router = Router();
// Más rutas aquí..

router.get("/", (req, res) => {
  res.send("Hello, Login!");
});

router.post("/register", register);
router.post("/login", login);

router.get("/getUser", getAllUser);
router.get("/currentUser", getCurrentUser);

router.get("/getUserById/:id", getUserById);
router.put("/updateUser/:id", updateUser);
router.delete("/deleteUser/:id", deleteUser);

router.post("/sendEmails", sendEmailToUserByEmail);
router.post("/updatePasswordByEmail", updatePasswordByEmail);

export default router;

// sxgh rkqy eyvq plsf
