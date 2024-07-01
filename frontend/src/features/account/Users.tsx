import { useEffect, useState } from "react"
import api from "../../app/api/api"
import { User } from "../../app/models/user"
import UserList from "./UserList"

export default function Users(){
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        api.Account.getAllUser()
        .then(response => {
            if (response && Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                console.error("La respuesta de la API no es un array de Usuarios:", response);
            }
        })
        .catch(error => console.error("Error al obtener usuarios:", error));
    }, []);

    if (!Array.isArray(users)) {
        console.error("El valor de 'users' no es un array:", users);
        return <div>Error: No se pudieron cargar los usuarios.</div>;
    }

    return (
        <>
            <UserList users={users} setUsers={setUsers} />
        </>
    )
}
