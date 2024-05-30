import { 
    Grid, TableContainer, Paper, Table, TableCell, TableHead, TableRow, TableBody, 
    Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle 
} from "@mui/material";
import { useState } from "react";
import api from "../../app/api/api";
import { toast } from 'react-toastify';
import { User } from "../../app/models/user";
import { Link } from 'react-router-dom';

interface Props {
    users: User[];
}
export default function UserList({ users }: Props){
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    return(
        <Grid container spacing={1}>
            <Button variant="contained" color="primary" component={Link} to="/register">
                Registrar Usuario
            </Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                    <TableRow>
                            <TableCell align="center">Nombre</TableCell>
                            <TableCell align="center">Primer Apellido</TableCell>
                            <TableCell align="center">Segundo Apellido</TableCell>
                            <TableCell align="center">Correo electronico</TableCell>
                            <TableCell align="center">Perfil Asignado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((users)=>(
                            <TableRow key={users.id}>
                                <TableCell align="center">{users.nombre}</TableCell>
                                <TableCell align="center">{users.primer_apellido}</TableCell>
                                <TableCell align="center">{users.segundo_apellido}</TableCell>
                                <TableCell align="center">{users.correo_electronico}</TableCell>
                                <TableCell align="center">{users.perfil_asignado}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    )
}