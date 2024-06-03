import {
  Grid,
  TableContainer,
  Paper,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { accountingAccount } from "../../app/models/accountingAccount";
import { useState } from "react";
import api from "../../app/api/api";
import { toast } from "react-toastify";

interface Props {
  accountingAccounts: accountingAccount[];
}
const handleKeyDown = (
  event: React.KeyboardEvent<HTMLDivElement>,
  setError: (error: string | null) => void
) => {
  const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Enter"];
  if (!/[0-99999999]/.test(event.key) && !allowedKeys.includes(event.key)) {
    setError("Por favor ingrese un número");
    event.preventDefault();
  } else {
    setError(null); // Clear error if the key is valid
  }
};

const handleChange = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setError: (error: string | null) => void,
  setValue: (value: number) => void
) => {
  const value = event.target.value;
  if (/^\d*$/.test(value)) {
    // Solo permite números
    setValue(parseInt(value) || 0);
    setError(null); // Clear error on valid input
  } else {
    setError("Por favor ingrese un número");
  }
};

export default function AccountingAccountList({ accountingAccounts }: Props) {
  const [selectedAccountingAccount, setSelectedAccountingAccount] =
    useState<accountingAccount | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newAccountingAccount, setNewAccountingAccount] = useState<
    Partial<accountingAccount>
  >({
    codigoCuenta: 0,
    nombreCuentaPrincipal: "",
    gastos: 0,
    nombreCuentaGastos: "",
    depreciacion: 0,
    nombreCuentadDepreciacion: "",
  });
  const handleDelete = async (id: number) => {
    try {
      await api.AcountingAccounts.deleteAccountingAccount(id);
      toast.success("Cuenta Contable Eliminada");
      setTimeout(() => {
        window.location.reload();
      }, 1000); // 1000ms = 1 segundo
    } catch (error) {
      console.error("Error al eliminar la Cuenta Contable:", error);
    }
  };

  const handleEdit = (accountingAccount: accountingAccount) => {
    setSelectedAccountingAccount(accountingAccount);
    setOpenEditDialog(true);
  };

  const handleUpdate = async () => {
    if (selectedAccountingAccount) {
      try {
        const accountingAccountId = selectedAccountingAccount.id;
        const updatedAccountingAccount = {
          codigoCuenta: selectedAccountingAccount.codigoCuenta,
          nombreCuentaPrincipal: selectedAccountingAccount.nombreCuentaPrincipal,
          gastos: selectedAccountingAccount.gastos,
          nombreCuentaGastos: selectedAccountingAccount.nombreCuentaGastos,
          depreciacion: selectedAccountingAccount.depreciacion,
          nombreCuentadDepreciacion: selectedAccountingAccount.nombreCuentadDepreciacion,
        };
        await api.AcountingAccounts.updateAccountingAccount(
          accountingAccountId,
          updatedAccountingAccount
        );
        toast.success("Cuenta Contable Actualizada");
        setOpenEditDialog(false);
        setTimeout(() => {
          window.location.reload();
        }, 1000); // 1000ms = 1 segundo
      } catch (error) {
        console.error("Error al actualizar la Cuenta Contable:", error);
      }
    }
  };
  const handleAdd = async () => {
    try {
      const addedZona = await api.AcountingAccounts.saveAccountingAccount(
        newAccountingAccount
      );
      toast.success("Cuenta Contable Agregada");
      setOpenAddDialog(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000); // 1000ms = 1 segundo
    } catch (error) {
      console.error("Error al agregar la Cuenta Contable:", error);
    }
  };

  const [error, setError] = useState<string | null>(null);

  const [anotherValue, setAnotherValue] = useState<number>(0);
  const [anotherError, setAnotherError] = useState<string | null>(null);

  return (
    <Grid container spacing={1}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenAddDialog(true)}
      >
        Agregar Cuenta Contable
      </Button>
      <TableContainer component={Paper}>
  <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
    <TableHead>
      <TableRow>
        <TableCell align="center" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
          CÓDIGO CUENTA PRINCIPAL
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
          NOMBRE CUENTA
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
          GASTOS (D)
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
          NOMBRE CUENTA
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
          DEPRECIACIÓN (H)
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
          NOMBRE CUENTA
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
          CONFIGURACIONES
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {accountingAccounts.map((accountingAccount) => (
        <TableRow key={accountingAccount.id}>
          <TableCell align="center">
            {accountingAccount.codigoCuenta}
          </TableCell>
          <TableCell align="center">
            {accountingAccount.nombreCuentaPrincipal}
          </TableCell>
          <TableCell align="center">{accountingAccount.gastos}</TableCell>
          <TableCell align="center">
            {accountingAccount.nombreCuentaGastos}
          </TableCell>
          <TableCell align="center">
            {accountingAccount.depreciacion}
          </TableCell>
          <TableCell align="center">
            {accountingAccount.nombreCuentadDepreciacion}
          </TableCell>
          <TableCell align="center">
            <Button
              variant="contained"
              color="info"
              sx={{ margin: "0 8px" }}
              onClick={() => handleEdit(accountingAccount)}
            >
              Editar
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ margin: "0 8px" }}
              onClick={() => handleDelete(accountingAccount.id)}
            >
              Eliminar
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Editar Cuenta Contable</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edita la Cuenta Contable seleccionada
          </DialogContentText>
          <TextField
            label="Codigo Cuenta"
            value={selectedAccountingAccount?.codigoCuenta || null}
            onChange={(e) =>
              setSelectedAccountingAccount(
                selectedAccountingAccount
                  ? {
                      ...selectedAccountingAccount,
                      codigoCuenta: parseInt(e.target.value),
                    }
                  : null
              )
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Nombre Cuenta Principal"
            value={selectedAccountingAccount?.nombreCuentaPrincipal || ""}
            onChange={(e) =>
              setSelectedAccountingAccount(
                selectedAccountingAccount
                  ? {
                      ...selectedAccountingAccount,
                      nombreCuentaPrincipal: e.target.value,
                    }
                  : null
              )
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Gastos"
            value={selectedAccountingAccount?.gastos || ""}
            onChange={(e) =>
              setSelectedAccountingAccount(
                selectedAccountingAccount
                  ? {
                      ...selectedAccountingAccount,
                      gastos: parseInt(e.target.value),
                    }
                  : null
              )
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Nombre Cuenta Gastos"
            value={selectedAccountingAccount?.nombreCuentaGastos || ""}
            onChange={(e) =>
              setSelectedAccountingAccount(
                selectedAccountingAccount
                  ? {
                      ...selectedAccountingAccount,
                      nombreCuentaGastos: e.target.value,
                    }
                  : null
              )
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Depreciación"
            value={selectedAccountingAccount?.depreciacion || ""}
            onChange={(e) =>
              setSelectedAccountingAccount(
                selectedAccountingAccount
                  ? {
                      ...selectedAccountingAccount,
                      depreciacion: parseInt(e.target.value),
                    }
                  : null
              )
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Nombre Cuenta Depreciación"
            value={selectedAccountingAccount?.nombreCuentadDepreciacion || ""}
            onChange={(e) =>
              setSelectedAccountingAccount(
                selectedAccountingAccount
                  ? {
                      ...selectedAccountingAccount,
                      nombreCuentadDepreciacion: e.target.value,
                    }
                  : null
              )
            }
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
          <Button onClick={handleUpdate}>Actualizar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Agregar Cuenta Contable</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Agrega una Nueva Cuenta Contable
          </DialogContentText>

          <TextField
            label="Codigo Cuenta"
            value={newAccountingAccount.codigoCuenta}
            onChange={(e) =>
              handleChange(e, setError, (val) =>
                setNewAccountingAccount({
                  ...newAccountingAccount,
                  codigoCuenta: val,
                })
              )
            }
            onKeyDown={(e) =>
              handleKeyDown(e as React.KeyboardEvent<HTMLDivElement>, setError)
            }
            fullWidth
            margin="dense"
            error={Boolean(error)}
            helperText={error}
          />
          <TextField
            label="Nombre Cuenta Principal"
            value={newAccountingAccount?.nombreCuentaPrincipal}
            onChange={(e) =>
              setNewAccountingAccount({
                ...newAccountingAccount,
                nombreCuentaPrincipal: e.target.value,
              })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Gastos"
            value={newAccountingAccount?.gastos}
            onChange={(e) =>
              handleChange(e, setError, (val) =>
                setNewAccountingAccount({
                  ...newAccountingAccount,
                  gastos: val,
                })
              )
            }
            onKeyDown={(e) =>
              handleKeyDown(e as React.KeyboardEvent<HTMLDivElement>, setError)
            }
            fullWidth
            margin="dense"
            error={Boolean(error)}
            helperText={error}
          />
          <TextField
            label="Nombre Cuenta Gastos"
            value={newAccountingAccount.nombreCuentaGastos}
            onChange={(e) =>
              setNewAccountingAccount({
                ...newAccountingAccount,
                nombreCuentaGastos: e.target.value,
              })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Depreciación"
            value={newAccountingAccount.depreciacion}
            onChange={(e) =>
              handleChange(e, setError, (val) =>
                setNewAccountingAccount({
                  ...newAccountingAccount,
                  depreciacion: val,
                })
              )
            }
            onKeyDown={(e) =>
              handleKeyDown(e as React.KeyboardEvent<HTMLDivElement>, setError)
            }
            fullWidth
            margin="dense"
            error={Boolean(error)}
            helperText={error}
          />
          <TextField
            label="Nombre Cuenta Depreciación"
            value={newAccountingAccount.nombreCuentadDepreciacion}
            onChange={(e) =>
              setNewAccountingAccount({
                ...newAccountingAccount,
                nombreCuentadDepreciacion: e.target.value,
              })
            }
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancelar</Button>
          <Button onClick={handleAdd}>Agregar</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
