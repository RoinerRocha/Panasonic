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
import { useState, useEffect } from "react";
import api from "../../app/api/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLanguage } from '../../app/context/LanguageContext';

interface Props {
  accountingAccounts: accountingAccount[];
  setAccountingAccounts: React.Dispatch<React.SetStateAction<accountingAccount[]>>;
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

export default function AccountingAccountList({ accountingAccounts, setAccountingAccounts }: Props) {
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

  useEffect(() => {
    // Cargar las zonas al montar el componente
    loadAccoutingAccount();
  }, []);

  const loadAccoutingAccount = async () => {
    try {
        const response = await api.AcountingAccounts.getAccountingAccounts();
        setAccountingAccounts(response.data);
    } catch (error) {
        console.error("Error al cargar las zonas:", error);
        toast.error(t('Toast-Cuenta-Datos'));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.AcountingAccounts.deleteAccountingAccount(id);
      toast.success(t('Toast-Cuenta-Eliminar'));
      loadAccoutingAccount();
    } catch (error) {
      console.error("Error al eliminar la Cuenta Contable:", error);
      toast.error(t('Toast-Cuenta-Eliminar-Error'));
    }
  };

  const handleEdit = (accountingAccount: accountingAccount) => {
    setSelectedAccountingAccount(accountingAccount);
    setOpenEditDialog(true);
  };

  const { t } = useTranslation();
  const { changeLanguage, language } = useLanguage();

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
        toast.success(t('Toast-Cuenta-Editar'));
        setOpenEditDialog(false);
        loadAccoutingAccount();
      } catch (error) {
        console.error("Error al actualizar la Cuenta Contable:", error);
        toast.error(t('Toast-Cuenta-Editar-Error'));
      }
    }
  };
  const handleAdd = async () => {
    try {
      const addedZona = await api.AcountingAccounts.saveAccountingAccount(
        newAccountingAccount
      );
      toast.success(t('Toast-Cuenta-Agregar'));
      setOpenAddDialog(false);
      loadAccoutingAccount();
    } catch (error) {
      console.error("Error al agregar la Cuenta Contable:", error);
      toast.error(t('Toast-Cuenta-Agregar-Error'));
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
        {t('Agregar_CuentaContable')}
      </Button>
      <TableContainer component={Paper}>
  <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
    <TableHead>
      <TableRow>
        <TableCell align="center" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
          {t('Codigo_CuentaContable')}
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
          {t('Nombre_CuentaContable')}
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
          {t('Gastos_CuentaContable')}
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
          {t('Nombre2_CuentaContable')}
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
          {t('DEPRECIACIÓN_CuentaContable')}
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
          {t('Nombre3_CuentaContable')}
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
          {t('Configuracion_CuentaContable')}
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
              sx={{ margin: "5px" }}
              onClick={() => handleEdit(accountingAccount)}
            >
              {t('Editar_CuentaContable')}
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ margin: "5px" }}
              onClick={() => handleDelete(accountingAccount.id)}
            >
              {t('Eliminar_CuentaContable')}
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>{t('titulo1_EditDialog_CuentaContable')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('titulo2_EditDialog_CuentaContable')}
          </DialogContentText>
          <TextField
            label={t('codigo_EditDialog_CuentaContable')}
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
            label={t('nombre_EditDialog_CuentaContable')}
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
            label={t('gastos_EditDialog_CuentaContable')}
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
            label={t('nombre2_EditDialog_CuentaContable')}
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
            label={t('depreciacion_EditDialog_CuentaContable')}
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
            label={t('nombre3_EditDialog_CuentaContable')}
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
          <Button onClick={() => setOpenEditDialog(false)}>{t('cancelar_EditDialog_CuentaContable')}</Button>
          <Button onClick={handleUpdate}>{t('editar_EditDialog_CuentaContable')}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>{t('titulo1_AddtDialog_CuentaContable')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('titulo2_AddDialog_CuentaContable')}
          </DialogContentText>

          <TextField
            label={t('codigo_AddDialog_CuentaContable')}
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
            label={t('nombre_AddDialog_CuentaContable')}
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
            label={t('gastos_AddDialog_CuentaContable')}
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
            label={t('nombre2_AddDialog_CuentaContable')}
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
            label={t('depreciacion_AddDialog_CuentaContable')}
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
            label={t('nombre3_AddDialog_CuentaContable')}
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
          <Button onClick={() => setOpenAddDialog(false)}>{t('cancelar_AddDialog_CuentaContable')}</Button>
          <Button onClick={handleAdd}>{t('agregar_AddDialog_CuentaContable')}</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
