import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { Zona } from "../../app/models/zone";
import { useState } from "react";

export default function MapDetails(){
    const {id} = useParams<{id: string}>();
    const [Zonas, setZonas] = useState<Zona[]>([]);

    

    return (
        <Typography variant="h2">
            Map detail
        </Typography>
    )
}