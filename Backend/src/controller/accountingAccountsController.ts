import { Request, Response } from "express";
import accountingAccountsModel from "../models/accountingAccountsModel";

// Método para guardar una cuenta contable
export const saveAccountingAccount = async (req: Request, res: Response) => {
  const { codigoCuenta, nombreCuentaPrincipal, gastos, nombreCuentaGastos, depreciacion, nombreCuentadDepreciacion } = req.body;

  try {
    const account = await accountingAccountsModel.create({
      codigoCuenta,
      nombreCuentaPrincipal,
      gastos,
      nombreCuentaGastos,
      depreciacion,
      nombreCuentadDepreciacion,
    });

    res.status(201).json({ message: "Accounting account created successfully", data: account });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Método para obtener todas las cuentas contables
export const getAccountingAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = await accountingAccountsModel.findAll();
    res.status(200).json({ message: "List of accounting accounts successful", data: accounts });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Método para eliminar una cuenta contable por ID
export const deleteAccountingAccount = async (req: Request, res: Response) => {
  const accountId = req.params.id;

  try {
    const account = await accountingAccountsModel.destroy({
      where: { id: accountId },
    });

    if (account === null) {
      return res.status(404).json({ message: "Accounting account not found" });
    }

    res.status(200).json({ message: "Delete accounting account successful", data: account });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Método para actualizar una cuenta contable por ID
export const updateAccountingAccount = async (req: Request, res: Response) => {
  const accountId = req.params.id;
  const { codigoCuenta, nombreCuentaPrincipal, gastos, nombreCuentaGastos, depreciacion, nombreCuentadDepreciacion } = req.body;

  try {
    const [updated] = await accountingAccountsModel.update(
      { codigoCuenta, nombreCuentaPrincipal, gastos, nombreCuentaGastos, depreciacion, nombreCuentadDepreciacion },
      {
        where: { id: accountId },
        returning: true,
      }
    );

    if (updated) {
      const updatedAccount = await accountingAccountsModel.findByPk(accountId);
      res.status(200).json({ message: "Update accounting account successful", data: updatedAccount });
    } else {
      res.status(404).json({ message: "Accounting account not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
