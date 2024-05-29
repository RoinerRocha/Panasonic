import { Grid, TableContainer, Paper, Table, TableCell, TableHead, TableRow, TableBody, Button } from "@mui/material";
import { Zona } from "../../app/models/zone";
import { useState } from "react";
import api from "../../app/api/api";
import { toast } from 'react-toastify';


interface Props{
    zonas: Zona[];
}

export default function ZoneList({zonas}:Props) {
    const handleDelete = async (id: number) => {
        try {
            await api.Zones.deleteZona(id);
            // Aquí puedes actualizar la lista de zonas después de eliminar
            toast.success('Zona Eliminada');
            setTimeout(() => {
                window.location.reload();
            }, 1000); // 1000ms = 1 segundo
        } catch (error) {
            console.error("Error al eliminar la zona:", error);
        }
    };

    return (
        <Grid container spacing={1}>
            <TableContainer  component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Numero</TableCell>
                            <TableCell align="center">Nombre</TableCell>
                            <TableCell align="center">Encargado</TableCell>
                            <TableCell align="center" >Configuracion</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {zonas.map(zona => (
                            <TableRow key={zona.id}>
                                <TableCell align="center">{zona.numeroZona}</TableCell>
                                <TableCell align="center">{zona.nombreZona}</TableCell>
                                <TableCell align="center">{zona.responsableAreaNom_user}</TableCell>
                                <TableCell align='center' >
                                    <Button variant='contained' color='info' sx={{ margin: '0 8px' }}>editar</Button>
                                    <Button variant='contained' color='error' sx={{ margin: '0 8px' }} onClick={() => handleDelete(zona.id)}>Eliminar</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    )
}