import {
    Grid, TableContainer, Paper, Table, TableCell,
    TableHead, TableRow, TableBody, Button, TextField,
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, TablePagination,
    styled, alpha
} from "@mui/material";
import { depreciationModel, depreciationFormModel } from "../../app/models/depreciationModel";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../app/api/api";
import { Search, TextFields } from "@mui/icons-material";
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';

interface Props {
    depreciations: depreciationModel[];
    setDepreciations: React.Dispatch<React.SetStateAction<depreciationModel[]>>;
}

const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    setError: (error: string | null) => void
) => {
    const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Enter", ".", "Tab"];
    if (!/[0-9.]/.test(event.key) && !allowedKeys.includes(event.key)) {
        setError("Por favor ingrese un número válido");
        event.preventDefault();
    } else {
        setError(null); // Clear error if the key is valid
    }
};

const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setError: (error: string | null) => void,
    setValue: (value: string) => void
) => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
        // Permite números y un solo punto decimal
        setValue(value);
        setError(null); // Clear error on valid input
    } else {
        setError("Por favor ingrese un número válido");
    }
};

export default function Depreciations({
    depreciations: depreciations,
    setDepreciations: setDepreciations,
}: Props) {
    const [selectedDepreciations, setSelectedDepreciations] =
        useState<depreciationFormModel | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newDepreciation, setNewDepreciation] = useState<
        Partial<depreciationFormModel>//revisar eso aqui y en el model 
    >({
        id: 0,
        Codigo: "",
        Cuenta: "",
        Dolares: "",
        Colones: "",
        Clasificacion: "",
    });

    useEffect(() => {
        // Cargar la lista de depreciaciones al montar el componente
        loadDepreciation();
    }, []);

    const loadDepreciation = async () => {
        try {
            const response = await api.depreciations.getDepreciations();
            setDepreciations(response.data);
        } catch (error) {
            console.error("Error al cargar la lista de depreciaciones:", error);
        }
    };

  /*  const handleDelete = async (id: number) => {
        try {
            await api.depreciations.deleteDepreciation(id);
            toast.success("Depreciación Eliminada");
            loadDepreciation();
        } catch (error) {
            console.error("Error al eliminar la depreciación:", error);
        }
    };*/

  /*  const handleEdit = (depreciation: depreciationModel) => {
        setSelectedDepreciations({
            ...depreciation,
            Dolares: depreciation.Dolares.toString(),
            Colones: depreciation.Colones.toString()
        } as depreciationFormModel); // Asegúrate de que el tipo sea correcto
        setOpenEditDialog(true);
    };*/

   /* const handleUpdate = async () => {
        if (selectedDepreciations) {
            try {
                const updatedDepreciation: depreciationModel = {
                    id: selectedDepreciations.id,
                    Codigo: selectedDepreciations.Codigo,
                    Cuenta: selectedDepreciations.Cuenta,
                    Dolares: parseFloat(selectedDepreciations.Dolares),
                    Colones: parseFloat(selectedDepreciations.Colones),
                    Clasificacion: selectedDepreciations.Clasificacion,
                };
                await api.depreciations.updateDepreciation(updatedDepreciation.id, updatedDepreciation);
                toast.success("Lista de depreciaciones Actualizada");
                setOpenEditDialog(false);
                loadDepreciation();
            } catch (error) {
                console.error("Error al actualizar las depreciaciones:", error);
            }
        }
    };*/

   /* const handleAdd = async () => {
        try {
            const addedDepreciation: depreciationModel = {
                id: newDepreciation.id ?? 0, // Default to 0 if id is undefined
                Codigo: newDepreciation.Codigo!,
                Cuenta: newDepreciation.Cuenta!,
                Dolares: parseFloat(newDepreciation.Dolares || "0"),
                Colones: parseFloat(newDepreciation.Colones || "0"),
                Clasificacion: newDepreciation.Clasificacion!,
            };
            await api.depreciations.saveDepreciation(addedDepreciation);
            toast.success("Depreciación agregada");
            setOpenAddDialog(false);
            loadDepreciation();
        } catch (error) {
            console.error("Error al agregar la depreciación:", error);
        }
    };*/

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedServiceLife = depreciations.slice(startIndex, endIndex);

    const [error, setError] = useState<string | null>(null);

    const [anotherValue, setAnotherValue] = useState<string>("0");
    const [anotherError, setAnotherError] = useState<string | null>(null);


    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.black, 0.15),
        '&:hover': {
          backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(1),
          width: 'auto',
        },
      }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        width: '100%',
        '& .MuiInputBase-input': {
          padding: theme.spacing(1, 1, 1, 0),
          // vertical padding + font size from searchIcon
          paddingLeft: `calc(1em + ${theme.spacing(4)})`,
          transition: theme.transitions.create('width'),
          [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
              width: '20ch',
            },
          },
        },
      }));
//faltan agregar en el model los otos encabezdos de la tabla
    return (
        <Grid container spacing={1}>
             <Grid item xs={12} sm={6} md={3}></Grid>
            <TextField
                        label=""
                        type="date"
                        disabled= {false}
                        
                        fullWidth
                        margin="dense"
                    />
           {/* <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenAddDialog(true)}
            >
                Agregar Depreciación
            </Button>*/}

            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                />
            </Search>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                        <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                {/**Aqui va el contador de row */}
                                Contador
                            </TableCell>
                        <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                CTA
                            </TableCell>
                        <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Activo Fijo
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                CTA
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Dep Acumulada
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Detalle
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Colones
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Dolares
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Fecha Compra
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Vida Util
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Total Cuotas
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Cuotas Consumidas
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Gap
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Cuota Depreciada
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Cuota Pendiente
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Depreciación x mes CRC
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Depreciación x mes USD
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Depreciación del mes CRC
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Depreciación del mes USD
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Depreciación Acumulada CRC
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Depreciación Acumulada USD
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Valor en Libro CRC
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Valor en Libro USD
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Valor Rescate CRC
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Valor en Libro USD
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedServiceLife.map((depreciation) => (
                            <TableRow key={depreciation.id}>
                                <TableCell align="center">{depreciation.CodCuenta}</TableCell>
                                <TableCell align="center">{depreciation.ActivoFijo}</TableCell>
                                <TableCell align="center">{depreciation.CodCuentaGasto}</TableCell>
                                <TableCell align="center">{depreciation.GastoCuenta}</TableCell>
                                <TableCell align="center">{depreciation.CodCuentaDepAcumulada}</TableCell>
                                <TableCell align="center">{depreciation.DepAcumulada}</TableCell>
                                <TableCell align="center">{depreciation.Detalle}</TableCell>
                                <TableCell align="center">{depreciation.Dolares}</TableCell>
                                <TableCell align="center">{depreciation.Colones}</TableCell>
                                <TableCell align="center">{depreciation.FechaCompra.toISOString()}</TableCell>
                                <TableCell align="center">{depreciation.VidaUtil}</TableCell>
                                <TableCell align="center">{depreciation.TotalCuotas}</TableCell>
                                <TableCell align="center">{depreciation.CuotaConsumidas}</TableCell>
                                <TableCell align="center">{depreciation.Gap}</TableCell>
                                <TableCell align="center">{depreciation.CuotasDepreciadas}</TableCell>
                                <TableCell align="center">{depreciation.CuotasPendiente}</TableCell>
                                <TableCell align="center">{depreciation.DepreciacionXmesCRC}</TableCell>
                                <TableCell align="center">{depreciation.DepreciacionXmesUSD}</TableCell>
                                <TableCell align="center">{depreciation.DepreciacionDelMesCRC}</TableCell>
                                <TableCell align="center">{depreciation.DepreciacionDelMesUSD}</TableCell>
                                <TableCell align="center">{depreciation.DepreciacionAcumuladaCRC}</TableCell>
                                <TableCell align="center">{depreciation.DepreciacionAcumuladaUSD}</TableCell>
                                <TableCell align="center">{depreciation.ValorEnLibroCRC}</TableCell>
                                <TableCell align="center">{depreciation.ValorEnLibroUSD}</TableCell>
                                <TableCell align="center">{depreciation.ValorRescateCRC}</TableCell>
                                <TableCell align="center">{depreciation. ValorRescateUSD}</TableCell>
                                <TableCell align="center">{depreciation.Fecha.toISOString()}</TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={depreciations.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0); // Reset page to 0 when rows per page changes
                    }}
                />
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Editar Depreciación</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Código"
                        value={selectedDepreciations?.Codigo || ""}
                        onChange={(e) =>
                            setSelectedDepreciations(
                                selectedDepreciations
                                ? {
                                    ...selectedDepreciations,
                                    Codigo: e.target.value,
                                }
                                : null
                            )
                        }
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogContent>
                    <TextField
                        label="Cuenta"
                        value={selectedDepreciations?.Cuenta || ""}
                        onChange={(e) =>
                            setSelectedDepreciations(
                                selectedDepreciations
                                ? {
                                    ...selectedDepreciations,
                                    Cuenta: e.target.value,
                                }
                                : null
                            )
                        }
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogContent>
                    <TextField
                        label="Dólares"
                        value={selectedDepreciations?.Dolares || ""}
                        onChange={(e) =>
                            setSelectedDepreciations(
                                selectedDepreciations
                                ? {
                                    ...selectedDepreciations,
                                    Dolares: e.target.value,
                                }
                                : null
                            )
                        }
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogContent>
                    <TextField
                        label="Colones"
                        value={selectedDepreciations?.Colones || ""}
                        onChange={(e) =>
                            setSelectedDepreciations(
                                selectedDepreciations
                                ? {
                                    ...selectedDepreciations,
                                    Colones: e.target.value,
                                }
                                : null
                            )
                        }
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogContent>
                    <TextField
                        label="Clasificación"
                        value={selectedDepreciations?.Clasificacion || ""}
                        onChange={(e) =>
                            setSelectedDepreciations(
                                selectedDepreciations
                                ? {
                                    ...selectedDepreciations,
                                    Clasificacion: e.target.value,
                                }
                                : null
                            )
                        }
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
               {/* <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
                    <Button onClick={handleUpdate}>Actualizar</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
                <DialogTitle>Agregar Depreciación</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nuevo Código"
                        value={newDepreciation?.Codigo || ""}
                        onChange={(e) =>
                            setNewDepreciation({
                                ...newDepreciation,
                                Codigo: e.target.value,
                            })
                        }
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogContent>
                    <TextField
                        label="Nueva Cuenta"
                        value={newDepreciation?.Cuenta || ""}
                        onChange={(e) =>
                            setNewDepreciation({
                                ...newDepreciation,
                                Cuenta: e.target.value,
                            })
                        }
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogContent>
                    <TextField
                        label="Dólares"
                        value={newDepreciation?.Dolares || ""}
                        onChange={(e) =>
                            handleChange(e, setError, (val) =>
                                setNewDepreciation({
                                    ...newDepreciation,
                                    Dolares: val,
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
                </DialogContent>
                <DialogContent>
                    <TextField
                        label="Colones"
                        value={newDepreciation?.Colones || ""}
                        onChange={(e) =>
                            handleChange(e, setError, (val) =>
                                setNewDepreciation({
                                    ...newDepreciation,
                                    Colones: val,
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
                </DialogContent>
                <DialogContent>
                    <TextField
                        label="Clasificación"
                        value={newDepreciation?.Clasificacion || ""}
                        onChange={(e) =>
                            setNewDepreciation({
                                ...newDepreciation,
                                Clasificacion: e.target.value,
                            })
                        }
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)}>Cancelar</Button>
                    <Button onClick={handleAdd}>Agregar</Button>
                </DialogActions>*/}
            </Dialog>
        </Grid>
    );
}
