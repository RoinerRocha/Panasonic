/*import express, { Request, Response } from 'express';
const app = express();
app.use(express.json());

export const register = (req: Request, res: Response) => { res.send("register") }
export const login = (req: Request, res: Response) => { res.send("login")}

export const registerV2 = (req: Request, res: Response) => {
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };
    // save user to database
    res.json({ success: true, message: 'User registered successfully' });
  };*/

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";

export const register = async (req: Request, res: Response) => {
  const {
    nombre,
    primer_apellido,
    segundo_apellido,
    nombre_usuario,
    correo_electronico,
    contrasena,
    perfil_asignado,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const user = await User.create({
      nombre,
      primer_apellido,
      segundo_apellido,
      nombre_usuario,
      correo_electronico,
      contrasena: hashedPassword,
      perfil_asignado,
      imagen_firma: null, // Assuming null for now
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error: any) {
    // Aquí especificamos el tipo de 'error' como 'any'
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { nombre_usuario, contrasena } = req.body;

  try {
    const user = await User.findOne({ where: { nombre_usuario } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
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

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ message: "List of Users successful", data: users });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
