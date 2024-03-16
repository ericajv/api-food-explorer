const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const knex = require('../database/knex');

class UsersController {

    async create(request, response) {
        const { name, email, password } = request.body;

        if (password.length < 6) {
           throw new AppError("A senha deve possuir pelo menos 6 caracteres");
        }

        const checkUsersExists = await knex("users").where({ email }).first();

        if (checkUsersExists) {
            throw new AppError("Este email ja está em uso");
        }

        const hashedPassword = await hash(password, 8);

        const [id] = await knex("users").insert({
            name,
            email,
            password: hashedPassword,
            role: "user"
        });

        response.status(201).json({ id });
    }

    async update(request, response) {
        const { name, email, password, old_password } = request.body;

        if (password.length < 6) {
           throw new AppError("A senha deve possuir pelo menos 6 caracteres");
        }

        const id = request.user.id;

        const user = await knex("users").where({ id }).first();

        if (!user) {
            throw new AppError("Usuário não encontrado");
        }

        const userWithUpdatedEmail = await knex("users").where({ email }).first();

        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
            throw new AppError("Este email ja esta em uso!");
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if (password && !old_password) {
            throw new AppError("É necessário informar a senha antiga!");
        }
        if (password && old_password) {
            const checkOldPassword = await compare(old_password, user.password);
            if (!checkOldPassword) {
                throw new AppError("A senha antiga não confere");
            }
            user.password = await hash(password, 8);

        }

        const userData = {
            name: user.name,
            email: user.email,
            password: user.password,
        };

        await knex("users").update(userData).where({ id });

        delete user.password;

        return response.status(201).json(user);
    }
}
module.exports = UsersController;