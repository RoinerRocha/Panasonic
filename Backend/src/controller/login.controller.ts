import { Request, Response } from "express";
import { Op } from 'sequelize';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import EmailService from "../Services/EmailServices";

export const register = async (req: Request, res: Response) => {
  const {
    nombre,
    primer_apellido,
    segundo_apellido,
    nombre_usuario,
    correo_electronico,
    contrasena,
    perfil_asignado,
    imagen_firma,
  } = req.body;

  try {
    // Verificar si el nombre_usuario ya está registrado
    const existingUsername = await User.findOne({ where: { nombre_usuario } });
    if (existingUsername) {
      return res.status(400).json({ message: "El nombre de usuario ya está registrado" });
    }

    // Verificar si el correo_electronico ya está registrado
    const existingEmail = await User.findOne({ where: { correo_electronico } });
    if (existingEmail) {
      return res.status(400).json({ message: "El correo electrónico ya está registrado" });
    }

    // Si el nombre_usuario y el correo_electronico no están registrados, crear un nuevo usuario
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const user = await User.create({
      nombre,
      primer_apellido,
      segundo_apellido,
      nombre_usuario,
      correo_electronico,
      contrasena: hashedPassword,
      perfil_asignado,
      imagen_firma,
    });

    res.status(201).json({ message: "Usuario creado exitosamente", user });
  } catch (error: any) {
    // Manejar otros errores
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { nombre_usuario, contrasena } = req.body;

  try {
    const user = await User.findOne({ where: { nombre_usuario } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña Invalida" });
    }

    const token = jwt.sign(
      { id: user.id, nombre_usuario: user.nombre_usuario },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error: any) {
    // Aquí especificamos el tipo de 'error' como 'any'
    res.status(500).json({ error: error.message });
  }
};

//metodo para obtener la lista de usuarios registrados
export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ message: "List of Users successful", data: users });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // Obtener el token del encabezado de la solicitud
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token de autorización no encontrado" });
    }

    // Verificar el token
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET as string);

    // Buscar al usuario en la base de datos
    const user = await User.findOne({ where: { nombre_usuario: decodedToken.nombre_usuario } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Crear un nuevo token con la misma información del usuario
    const userToken = jwt.sign(
      { id: user.id, nombre_usuario: user.nombre_usuario },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    // Devolver el token
    return res.status(200).json({ token: userToken });
  } catch (error) {
    // Manejar cualquier error
    return res.status(500).json({ message: "Error al obtener el usuario actual" });
  }
};


//Metodo para buscar usuario por id
export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);

    if (user === null) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Found User successful: ", data: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Método para eliminar una usuario por ID
export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    //const user = await User.findByPk(userId);
    const user = await User.destroy({
      where: { id: userId },
    });

    if (user === null) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Delete User successful: ", data: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//Metodo para actualizar Usuario
export const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const {
    nombre,
    primer_apellido,
    segundo_apellido,
    nombre_usuario,
    correo_electronico,
    contrasena,
    perfil_asignado,
    imagen_firma,
  } = req.body;

  try {
    const [updated] = await User.update(
      {
        nombre,
        primer_apellido,
        segundo_apellido,
        nombre_usuario,
        correo_electronico,
        contrasena,
        perfil_asignado,
        imagen_firma,
      },
      {
        where: { id: userId },
        returning: true,
      }
    );

    if (updated) {
      const updatedUser = await User.findByPk(userId);
      res
        .status(200)
        .json({ message: "Update User successful", data: updatedUser });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const sendEmailToUserByEmail = async (req: Request, res: Response) => {
  const { email, link } = req.body;

  try {
    await EmailService.sendPasswordResetLink( email, link);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePasswordByEmail = async (req: Request, res: Response) => {
  const { email, Password } = req.body;

  try {
    // Buscar al usuario por su email
    const user = await User.findOne({ where: { correo_electronico: email } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Actualizar la contraseña del usuario
    user.contrasena = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Contraseña actualizada exitosamente" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


