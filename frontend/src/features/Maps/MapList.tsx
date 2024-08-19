import { Typography } from "@mui/material";
import { Zona } from "../../app/models/zone"

interface Props {
    zonas: Zona[];
    setZonas: React.Dispatch<React.SetStateAction<Zona[]>>;
}

export default function MapList({zonas, setZonas}: Props) {
    return (
        <>
            <ul>
                {zonas.map(zona => (
                    <li key={zona.id}> {zona.nombreZona} - {zona.numeroZona}</li>
                ))}
            </ul>
        </>
    )
}