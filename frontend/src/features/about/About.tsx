import { Button, ButtonGroup, Container, Typography } from "@mui/material";
import api from "../../app/api/api";

export default function AboutPage() {
    return (
        <Container>
            <Typography gutterBottom variant='h2'>Testing errors</Typography>
            <ButtonGroup fullWidth>
                <Button variant='contained' onClick={() => api.TestErrors.getBadRequest().catch(error => console.log(error))}>BadRequest</Button>
                <Button variant='contained' onClick={() => api.TestErrors.getNotFound().catch(error => console.log(error))}>NotFound</Button>
                <Button variant='contained' onClick={() => api.TestErrors.getServerError().catch(error => console.log(error))}>ServerError</Button>
                <Button variant='contained' onClick={() => api.TestErrors.getUnauthorised().catch(error => console.log(error))}>Unauthorised</Button>
                <Button variant='contained' onClick={() => api.TestErrors.getValidationError().catch(error => console.log(error))}>ValidationError</Button>
            </ButtonGroup>
        </Container>
    )
}