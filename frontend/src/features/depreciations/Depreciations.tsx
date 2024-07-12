import {
    Grid, TableContainer, Paper, Table, TableCell,
    TableHead, TableRow, TableBody, Button, TextField,
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, TablePagination,
} from "@mui/material";
import { depreciationModel } from "../../app/models/depreciationModel";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../app/api/api";

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
    useState<depreciationModel | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newDepreciation, setNewDepreciation] = useState<
    Partial<depreciationModel & { Dolares: string | number, Colones: string | number }>
    >({
        id: 0,
        Codigo: "",
        Cuenta: "",
        Dolares: 0,
        Colones: 0,
        Clasificacion: "",
    });

    useEffect(() => {
        // Cargar la losta de Mh al montar el componente
        loadDepreciation();
    }, []);

    const loadDepreciation = async () => {
        try {
          const response = await api.depreciations.getDepreciations();
          setSelectedDepreciations(response.data);
        } catch (error) {
          console.error("Error al cargar la lista de depreciaciones:", error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
          await api.depreciations.deleteDepreciation(id);
          toast.success("Depreciacion Eliminada");
          loadDepreciation();
        } catch (error) {
          console.error("Error al eliminar la depreciacion:", error);
        }
    };

    const handleEdit = (depreciation: depreciationModel) => {
        setSelectedDepreciations(depreciation);
        setOpenEditDialog(true);
    };

    const handleUpdate = async () => {
        if (selectedDepreciations) {
          try {
            const depreciationId = selectedDepreciations.id;
            const updatedDepreciation = {
              Codigo: selectedDepreciations.Codigo,
              Cuenta: selectedDepreciations.Cuenta,
              Dolares: selectedDepreciations.Dolares,
              Colones: selectedDepreciations.Colones,
              Clasificacion: selectedDepreciations.Clasificacion,
            };
            await api.depreciations.updateDepreciation(
              depreciationId,
              updatedDepreciation
            );
            toast.success("Lista de depreciaciones Actualizada");
            setOpenEditDialog(false);
            loadDepreciation();
          } catch (error) {
            console.error("Error al actualizar las depreciaciones:", error);
          }
        }
    };

    const handleAdd = async () => {
        try {
            const addedDepreciation = await api.depreciations.saveDepreciation({
                ...newDepreciation,
                Dolares: parseFloat(newDepreciation.Dolares?.toString() || "0"),
                Colones: parseFloat(newDepreciation.Colones?.toString() || "0"),
            });
            toast.success("Depreciacion agregada");
            setOpenAddDialog(false);
            loadDepreciation();
        } catch (error) {
            console.error("Error al agregar la depreciacion:", error);
        }
    };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedServiceLife = depreciations.slice(startIndex, endIndex);

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
                Agregar Depreciacion
            </Button>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Codigo
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Cuenta
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
                                Colones
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Clasificacion
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Configuraciones
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {paginatedServiceLife.map((depreciation) => (
                        <TableRow key={depreciation.id}>
                            <TableCell align="center">{depreciation.Codigo}</TableCell>
                            <TableCell align="center">{depreciation.Cuenta}</TableCell>
                            <TableCell align="center">{depreciation.Dolares}</TableCell>
                            <TableCell align="center">{depreciation.Colones}</TableCell>
                            <TableCell align="center">{depreciation.Clasificacion}</TableCell>
                            <TableCell align="center">
                                <Button
                                    variant="contained"
                                    color="info"
                                    sx={{ margin: "5px" }}
                                    onClick={() => handleEdit(depreciation)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    sx={{ margin: "5px" }}
                                    onClick={() => handleDelete(depreciation.id)}
                                >
                                    Eliminar
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 15, 25]}
                component="div"
                count={depreciations.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) =>
                setRowsPerPage(parseInt(event.target.value, 10))
                }
            />
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Editar Depreciacion </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Cpdigo"
                        value={selectedDepreciations?.Codigo || null}
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
                        value={selectedDepreciations?.Cuenta || null}
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
                        label="Dolares"
                        value={selectedDepreciations?.Dolares || null}
                        onChange={(e) =>
                            setSelectedDepreciations(
                                selectedDepreciations
                                ? {
                                    ...selectedDepreciations,
                                    Dolares: parseFloat(e.target.value),
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
                        value={selectedDepreciations?.Colones || null}
                        onChange={(e) =>
                            setSelectedDepreciations(
                                selectedDepreciations
                                ? {
                                    ...selectedDepreciations,
                                    Colones: parseFloat(e.target.value),
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
                        value={selectedDepreciations?.Clasificacion || null}
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
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
                    <Button onClick={handleUpdate}>Actualizar</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
                <DialogTitle>Agregar depreciacion</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nuevo Codigo"
                        value={newDepreciation?.Codigo}
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
                        value={newDepreciation?.Cuenta}
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
                        label="Dolares"
                        value={newDepreciation?.Dolares || ""}
                        onChange={(e) =>
                            handleChange(e, setError, (val) =>
                                setNewDepreciation({
                                    ...newDepreciation,
                                    Dolares: parseFloat(val),
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
                                    Colones: parseFloat(val),
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
                        label="Clasificacion"
                        value={newDepreciation?.Clasificacion}
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
                </DialogActions>

            </Dialog>
        </Grid>
    );
}
