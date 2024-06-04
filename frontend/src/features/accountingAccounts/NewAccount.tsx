import { useEffect, useState } from "react"
import api from "../../app/api/api"
import { accountingAccount } from "../../app/models/accountingAccount"
import AccountingAccountList from "./AccountingAccountList";

export default function Zone() {
    const [accountingAccounts, setAccountingAccounts] = useState<accountingAccount[]>([]);
    
    useEffect(() => {
        api.AcountingAccounts.getAccountingAccounts()
        .then(response => {
            // Verificamos si la respuesta es un objeto con la propiedad 'data' que es un array
            if (response && Array.isArray(response.data)) {
                // Asignamos el array de Cuentas Contables a setCuentasContables
                setAccountingAccounts(response.data);
            } else {
                console.error("La respuesta de la API no es un array de Cuentas Contables:", response);
            }
        })
        .catch(error => console.error("Error al obtener Cuentas Contables:", error));
    }, []);

    if (!Array.isArray(accountingAccounts)) {
        console.error("El valor de 'Cuentas Contables' no es un array:", accountingAccounts);
        return <div>Error: No se pudieron cargar las Cuentas Contables.</div>;
    }

    return (
        <>
           <AccountingAccountList  accountingAccounts={accountingAccounts} setAccountingAccounts={setAccountingAccounts} /> 
        </>
    )
}