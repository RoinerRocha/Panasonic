import { Typography, Box } from "@mui/material";
import backgroundImage from '../../images/panasonic.png'

export default function HomePage() {
  return (
    <Box
      sx={{
        position: 'absolute', // Posiciona el Box de forma absoluta
        top: 0, // Alinea al borde superior de la ventana
        left: 0, // Alinea al borde izquierdo de la ventana
        width: '100vw', // Asegura que el Box ocupe todo el ancho de la ventana
        height: '100vh', // Asegura que el Box ocupe toda la altura de la ventana
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover', // Ajusta el tamaño para cubrir todo el área del Box
        backgroundPosition: 'center', // Centra la imagen en el Box
        backgroundRepeat: 'no-repeat', // Evita la repetición de la imagen
        display: 'flex',
        flexDirection: 'column', // Alinea el contenido en una columna
        alignItems: 'center', // Centra horizontalmente el contenido
        justifyContent: 'flex-start', // Alinea verticalmente al principio (arriba)
        paddingTop: 20, // Ajusta el espacio desde el borde superior si es necesario
        zIndex: -1, // Asegura que el Box esté detrás de otros contenidos si es necesario
      }}
    >
      <Typography variant="h2" sx={{ color: 'white' }}>
        
      </Typography>
    </Box>

  );
}