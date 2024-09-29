import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { Zona } from "../../app/models/zone";
import React, { useState, useEffect } from "react";
import api from "../../app/api/api";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from '../../app/context/LanguageContext';
import { toast } from "react-toastify";

interface Props {
    zona: Zona;
    setZona: React.Dispatch<React.SetStateAction<Zona[]>>;
}

export default function ProductCard({zona, setZona }: Props) {
    const [imageUrlMap, setImageUrlMap] = useState<Map<number, Map<string, string>>>(new Map());
    const { t } = useTranslation();
    const { changeLanguage, language } = useLanguage();
    useEffect(() => {
        // Cargar las zonas al montar el componente
        loadZonas();
    }, []);

    const loadZonas: () => Promise<void> = async () => {
        try {
            const response = await api.Zones.getZona();
            setZona(response.data);
            convertImagesToDataUrl(response.data);
        } catch (error) {
            console.error("Error al cargar las zonas:", error);
            toast.error(t('Mapa-toast-error'));
        }
    };

    const convertImagesToDataUrl = (zonesImage: Zona[]) => {
        zonesImage.forEach((zona) =>{
            if (zona.ImagenMapa) {
                setImageUrlMap((prevMap) => {
                    const mapaZona = prevMap.get(zona.id) || new Map();
                    const imageUrl = `http://localhost:5000/${zona.ImagenMapa}`;
                    mapaZona.set('ImagenMapa', imageUrl);
                    return new Map(prevMap).set(zona.id, mapaZona);
                });
            }
        });
    }

    const navigate = useNavigate();

    return (
        <Card>
            <CardHeader 
                avatar={
                    <Avatar sx={{bgcolor: 'primary.main'}}>
                        {zona.nombreZona.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={zona.nombreZona}
                titleTypographyProps={{
                    sx: {fontWeight: 'bold', color: 'primary.main'}
                }}
            />
            <CardMedia
                component="img"
                sx={{ height: 140, backgroundSize: 'contain', bgcolor: 'primary.light' }}
                src={imageUrlMap.get(zona.id)?.get('ImagenMapa')}
                title={zona.nombreZona}
            />
            <CardContent>
                <Typography gutterBottom color="secondary" variant="h5">
                 {t('Mapa-Numero')}: {zona.numeroZona}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                   {t('Mapa-encargado')}: {zona.responsableAreaNom_user}
                </Typography>
            </CardContent>
            <CardActions>
                <Button component={Link} to={`/Details/${zona.id}`} size="small">{t('Mapa-Boton')}</Button>
            </CardActions>
        </Card>
    )
}