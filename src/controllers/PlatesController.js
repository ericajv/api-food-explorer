const knex = require("../database/knex");

class PlatesController {
    async create(request, response) {
        const { name, description, price, category, ingredients } = request.body;

        const categoryRegister = await knex("categories").where({ name: category }).first();

        const plate_id = await knex("plates").insert({
            name,
            description,
            price,
            category_id: categoryRegister.id
        });

        const ingredientsInsert = ingredients.map(ingredient => {
            return {
                plate_id,
                name: ingredient
            }
        });

        //await knex("ingredients").insert(ingredientsInsert);

        return response.json()
    }
}

module.exports = PlatesController;