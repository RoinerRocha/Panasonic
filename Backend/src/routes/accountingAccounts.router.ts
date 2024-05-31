import { Router } from "express";
import {
  saveAccountingAccount,
  getAccountingAccounts,
  deleteAccountingAccount,
  updateAccountingAccount,
} from "../controller/accountingAccountsController";

const router = Router();

// Ruta para verificar la conexión
router.get("/", (req, res) => {
  res.send("Hello, accounting accounts");
});

// Rutas para las operaciones CRUD de las cuentas contables
router.post("/saveAccountingAccount", saveAccountingAccount);
router.get("/getAccountingAccounts", getAccountingAccounts);
router.put("/accountingAccounts/:id", updateAccountingAccount);
router.delete("/deleteAccountingAccount/:id", deleteAccountingAccount);

export default router;