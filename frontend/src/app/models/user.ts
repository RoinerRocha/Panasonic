export interface User {
    nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
    nombre_usuario: string;
    correo_electronico: string;
    contrasena: string;
    imagen_firma: Blob;
    perfil_asignado: string;
    token: string;
}