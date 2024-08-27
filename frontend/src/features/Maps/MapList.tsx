import { Grid, List, Typography } from "@mui/material";
import { Zona } from "../../app/models/zone"
import ProductCard from "./MapCard";

interface Props {
    zonas: Zona[];
    setZonas: React.Dispatch<React.SetStateAction<Zona[]>>;
}

export default function MapList({zonas, setZonas}: Props) {
    return (
        <Grid container spacing={4}>
            {zonas.map(zona => (
                <Grid item xs={3} key={zona.id}>
                    <ProductCard zona={zona}  setZona={setZonas} />
                </Grid>
            ))}
        </Grid>
    )
}