import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Zona } from "../../app/models/zone";


interface Props {
    zona: Zona;
}


export default function ZoneTable({zona}: Props) {
    return (
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Numero</TableCell>
            <TableCell align="right">Nombre</TableCell>
            <TableCell align="right">Encargado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow
              key={zona.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="right">{zona.numeroZona}</TableCell>
              <TableCell align="right">{zona.nombreZona}</TableCell>
              <TableCell align="right">{zona.responsableAreaNom_user}</TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}