import * as bcrypt from 'bcrypt';

export const usersArray: Array<any> = [
    {
        "full_name":"Ali Gamal",
        "email":"user@gmail.com",
        "password": bcrypt.hashSync("Asd12345$", 10),
        "phone":"12345",
        "status":"ACTIVE"
    },
];