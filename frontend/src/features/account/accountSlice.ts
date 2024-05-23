import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User } from "../../app/models/user";
import { FieldValues } from "react-hook-form";
import api from "../../app/api/api";

// Define la forma del estado de la cuenta
interface AccountState {
    user: User | null; // El usuario actual, puede ser nulo si no hay sesión activa
    isAuthenticated: boolean; // Indica si el usuario está autenticado
}

// Estado inicial de la cuenta
const initialState: AccountState = {
    user: null,
    isAuthenticated: false, // Al principio, el usuario no está autenticado
}

// Acción asíncrona para iniciar sesión
export const signInUser = createAsyncThunk<User, FieldValues>(
    'account/signInUser', // Nombre de la acción
    async (data, thunkAPI) => { // Función para realizar la acción
        try {
            const user = await api.Account.login(data); // Llama a la API para iniciar sesión
            localStorage.setItem('user', JSON.stringify(user)); // Guarda el usuario en el almacenamiento local
            thunkAPI.dispatch(setAuthenticated(true)); // Establece isAuthenticated en true
            return user; // Devuelve el usuario obtenido
        } catch (error: any) { // Maneja los errores
            // Si las credenciales son incorrectas, maneja el error y rechaza la promesa con un mensaje de error
            if (error.response.status === 401 || error.response.status === 404) {
                localStorage.removeItem('user'); // Elimina el usuario del almacenamiento local
                throw new Error('Credenciales incorrectas'); // Lanza un error
            } else {
                return thunkAPI.rejectWithValue({error: error.data}); // Rechaza la promesa con el valor del error
            }
        }
    }
)

// Acción asíncrona para obtener el usuario actual
export const fetchCurrentUser = createAsyncThunk<User>(
    'account/fetchCurrentUser', // Nombre de la acción
    async (_, thunkAPI) => { // Función para realizar la acción
        try {
            const user = await api.Account.currentUser(); // Llama a la API para obtener el usuario actual
            localStorage.setItem('user', JSON.stringify(user)); // Guarda el usuario en el almacenamiento local
            thunkAPI.dispatch(setAuthenticated(true)); // Establece isAuthenticated en true
            return user; // Devuelve el usuario obtenido
        } catch (error: any) { // Maneja los errores
            return thunkAPI.rejectWithValue({error: error.data}); // Rechaza la promesa con el valor del error
        }
    }
)

// Crea un slice de Redux para manejar el estado de la cuenta
export const accountSlice = createSlice({
    name: 'account', // Nombre del slice
    initialState, // Estado inicial
    reducers: {
        // Reducer para establecer el estado de autenticación
        setAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload; // Actualiza isAuthenticated con el valor proporcionado
        }
    },
    // Reducers adicionales para manejar los resultados de las acciones asíncronas
    extraReducers: (builder => {
        builder.addMatcher(isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled), (state, action) => {
            state.user = action.payload; // Actualiza el usuario con el valor obtenido de la acción
        });
        builder.addMatcher(isAnyOf(signInUser.rejected, fetchCurrentUser.rejected), (state, action) => {
            console.log(action.payload); // Maneja los errores de las acciones asíncronas
        })
    })
})

// Exporta las acciones y reducers definidos en el slice de Redux
export const { setAuthenticated } = accountSlice.actions; 

