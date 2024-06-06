import { Router } from "express";
import {
  saveProfile,
  getProfiles,
  deleteProfile,
  updateProfile,
} from "../controller/profileController";

const router = Router();

// Rutas adicionales aquí...
router.get("/", (req, res) => {
  res.send("Hello, profiles");
});

router.post("/saveProfile", saveProfile);
router.get("/getProfiles", getProfiles);

router.put("/profiles/:id", updateProfile);

router.delete("/deleteProfile/:id", deleteProfile);

export default router;
