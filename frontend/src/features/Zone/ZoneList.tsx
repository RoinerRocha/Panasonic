import { Grid } from "@mui/material";
import { Zona } from "../../app/models/zone";
import ZoneTable from "./ZoneTable";

interface Props{
    zonas: Zona[];
}

export default function ZoneList({zonas}:Props) {
    return (
        <Grid container spacing={4}>
            {zonas.map(zona => (
                <Grid item xs={12} key={zona.id}>
                    <ZoneTable zona={zona} />
                </Grid>
            ))}
        </Grid>
    )
}