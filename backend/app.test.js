

/*
    Título: App Test
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos una app para hacer unit testing de la API
    Fecha: 7/5/2023
    Última Modificación: 8/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const request = require("supertest");

// Bibliotecas propias
const app = require("./app");

/* Declaraciones Constantes */
const testOwnerUsername = "owner";
const testOwnerPassword = "Abc123..";

var ownerToken = "";

/* Pruebas de Cuentas */
describe("accounts", () => {

    it("Shouldn't activate an account", async () => {

        const response = await request(app)
            .put("/accounts/activate/TEST")
            .set("Accept", "application/json")
            .expect(401)

    });

    it("Should login as owner", async () => {

        const response = await request(app)
            .post("/accounts/login")
            .send({ "username": testOwnerUsername, "password": testOwnerPassword })
            .set("Accept", "application/json")
            .expect(200)
        expect(response.body.CONTENT.user.username).toEqual("owner");
        ownerToken = response.body.CONTENT.token;

    });

    it("Should start a password restoration process", async () => {

        const response = await request(app)
            .post("/accounts/restorepassword/email")
            .send({ "email": "test@gmail.com" })
            .set("Accept", "application/json")
            .expect(200)

    });

    it("Shouldn't continue the password restoration process", async () => {

        const response = await request(app)
            .post("/accounts/restorepassword/code")
            .send({ "code": "123456" })
            .set("Accept", "application/json")
            .expect(401)

    });

    it("Shouldn't restore password", async () => {

        const response = await request(app)
            .put("/accounts/restorepassword")
            .send({ "password": "Abc123.." })
            .set("Accept", "application/json")
            .expect(401)

    });

});

/* Pruebas de Admins */
describe("admins", () => {

    it("Should get all the admins", async () => {

        const response = await request(app)
            .get("/admins")
            .auth(ownerToken, { type: "bearer" })
            .set("Accept", "application/json")
            .expect(200)
        expect(response.body.CONTENT[0].username).toEqual("owner");

    });

    it("Should get the first admin", async () => {

        const response = await request(app)
            .get("/admins/1")
            .auth(ownerToken, { type: "bearer" })
            .set("Accept", "application/json")
            .expect(200)
        expect(response.body.CONTENT[0].username).toEqual("owner");

    });

    it("Shouldn't create a new admin", async () => {

        const response = await request(app)
            .post("/admins/register")
            .send({ "username": "testadmin", "name": "Test Admin", "email": "testadmin@gmail.com", "password": "Abc123..", "description": "Test", "avatar": 1, "country": "España", "city": "Madrid", "preferences": ["Hotel", "Restaurant"], "allowAdvertising": false })
            .set("Accept", "application/json")
            .expect(401)

    });

    it("Shouldn't update admin", async () => {

        const response = await request(app)
            .put("/admins/1")
            .send({ "username": "owner", "name": "Owner", "email": "testadmin@gmail.com", "password": "Abc123..", "description": "Test", "avatar": 1, "country": "España", "city": "Madrid", "preferences": ["Hotel", "Restaurant"], "allowAdvertising": false })
            .set("Accept", "application/json")
            .expect(401)

    });

    it("Shouldn't delete admin", async () => {

        const response = await request(app)
            .delete("/admins/1")
            .set("Accept", "application/json")
            .expect(401)

    });

    it("Should promote admin", async () => {

        const response = await request(app)
            .put("/admins/promote/1")
            .auth(ownerToken, { type: "bearer" })
            .set("Accept", "application/json")
            .expect(200)

    });

});

/* Pruebas de Favs */
describe("favs", () => {

    it("Should get all favs (404 if there are not favs)", async () => {

        const response = await request(app)
            .get("/favs")
            .set("Accept", "application/json")
            .expect([200, 404])

    });

    it("Should get all favs of user with ID 1 (404 if there are not favs)", async () => {

        const response = await request(app)
            .get("/favs/user/1")
            .set("Accept", "application/json")
            .expect([200, 404])

    });

    it("Should get all favs of webpage with ID 1 (404 if there are not favs)", async () => {

        const response = await request(app)
            .get("/favs/webpage/1")
            .set("Accept", "application/json")
            .expect([200, 404])

    });

    it("Should get fav with ID 1 (404 if there are not favs)", async () => {

        const response = await request(app)
            .get("/favs/1")
            .set("Accept", "application/json")
            .expect([200, 404])

    });

    it("Should check if fav exist", async () => {

        const response = await request(app)
            .get("/favs/check/1")
            .auth(ownerToken, { type: "bearer" })
            .set("Accept", "application/json")
            .expect(200)

    });

    it("Shouldn't create a fav", async () => {

        const response = await request(app)
            .post("/favs")
            .send({ "id": "1" })
            .set("Accept", "application/json")
            .expect(401)

    });

    it("Shouldn't delete a fav", async () => {

        const response = await request(app)
            .delete("/favs/1")
            .set("Accept", "application/json")
            .expect(401)

    });

});

/* Pruebas de Comerciantes */
describe("merchants", () => {

    it("Should get all merchants (404 if there are not merchants)", async () => {

        const response = await request(app)
            .get("/merchants")
            .auth(ownerToken, { type: "bearer" })
            .set("Accept", "application/json")
            .expect([200, 404])

    });

    it("Should get the first merchant (404 if there are not merchants)", async () => {

        const response = await request(app)
            .get("/merchants/1")
            .auth(ownerToken, { type: "bearer" })
            .set("Accept", "application/json")
            .expect([200, 404])

    });

    it("Shouldn't register a new merchant", async () => {

        const response = await request(app)
            .post("/merchants/register")
            .send({})
            .set("Accept", "application/json")
            .expect(400)

    });

    it("Shouldn't login as a merchant", async () => {

        const response = await request(app)
            .post("/merchants/login")
            .send({})
            .set("Accept", "application/json")
            .expect(400)

    });

    it("Should start a merchant password restoration", async () => {

        const response = await request(app)
            .post("/merchants/restorepassword/email")
            .send({ "email": "merchanttest@gmail.com" })
            .set("Accept", "application/json")
            .expect(200)

    });

    it("Shouldn't continue the merchant password restoration", async () => {

        const response = await request(app)
            .post("/merchants/restorepassword/code")
            .send({ "code": "123456" })
            .set("Accept", "application/json")
            .expect(401)

    });

    it("Shouldn't restore password", async () => {

        const response = await request(app)
            .put("/merchants/restorepassword")
            .send({ "password": "Abc123.." })
            .set("Accept", "application/json")
            .expect(401)

    });

    it("Shouldn't update merchant", async () => {

        const response = await request(app)
            .put("/merchants/1")
            .send({})
            .set("Accept", "application/json")
            .expect(400)

    });

    it("Shouldn't delete merchant", async () => {

        const response = await request(app)
            .delete("/merchants/1")
            .set("Accept", "application/json")
            .expect(401)

    });

    it("Shouldn't activate a merchant", async () => {

        const response = await request(app)
            .put("/merchants/activate/1")
            .set("Accept", "application/json")
            .expect(401)

    });

    it("Shouldn't accept a merchant", async () => {

        const response = await request(app)
            .put("/merchants/accept/1")
            .set("Accept", "application/json")
            .expect(401)

    });

});

/* Pruebas de Posts */
describe("posts", () => {

    it("Should get all posts (404 if there are not posts)", async () => {

        const response = await request(app)
            .get("/posts")
            .set("Accept", "application/json")
            .expect([200, 404])

    });

    it("Should get the first post (404 if there are not posts)", async () => {

        const response = await request(app)
            .get("/posts/1")
            .set("Accept", "application/json")
            .expect([200, 404])

    });

    it("Should get all the posts of the first webpage (404 if there are not posts)", async () => {

        const response = await request(app)
            .get("/posts/webpage/1")
            .set("Accept", "application/json")
            .expect([200, 404])

    });

    it("Shouldn't create a new post", async () => {

        const response = await request(app)
            .post("/posts")
            .send({ "webpageID": "1", "content": "Contenido", "attachment": "1" })
            .set("Accept", "application/json")
            .expect(401)

    });

    it("Shouldn't update a post", async () => {

        const response = await request(app)
            .put("/posts/1")
            .send({ "webpageID": "1", "content": "Contenido", "attachment": "1" })
            .set("Accept", "application/json")
            .expect(401)

    });

    it("Shouldn't delete a post", async () => {

        const response = await request(app)
            .delete("/posts/1")
            .set("Accept", "application/json")
            .expect(401)

    });

});

/* Pruebas de Reviews */
describe("reviews", () => {

    it("Should get all reviews from first webpage (404 if there are not reviews)", async () => {

        const response = await request(app)
            .get("/reviews/webpage/1")
            .set("Accept", "application/json")
            .expect([200, 404])

    });

    it("Should get all reviews from first user (404 if there are not reviews)", async () => {

        const response = await request(app)
            .get("/reviews/user/1")
            .set("Accept", "application/json")
            .expect([200, 404])

    });

    it("Shouldn't create a review", async () => {

        const response = await request(app)
            .post("/reviews")
            .send({ "webpageID": "1", "content": "Contenido de la review", "rating": 4.5 })
            .set("Accept", "application/json")
            .expect(401)

    });

    it("Shouldn't update a review", async () => {

        const response = await request(app)
            .put("/reviews/1")
            .send({ "webpageID": "1", "content": "Contenido de la review", "rating": 4.5 })
            .set("Accept", "application/json")
            .expect(401)

    });

    it("Shouldn't delete a review", async () => {

        const response = await request(app)
            .delete("/reviews/1")
            .set("Accept", "application/json")
            .expect(401)

    });

});

/* Pruebas de Almacenamiento */
describe("storage", () => {

    it("Shouldn't upload a file", async () => {

        const response = await request(app)
            .post("/storage/images")
            .set("Accept", "application/json")
            .expect(401)

    });

});

/* Pruebas de Usuarios */
describe('users', () => {

    it("Shouldn't register a user", async () => {

        const response = await request(app)
            .post("/users/register")
            .send({})
            .set("Accept", "application/json")
            .expect(400)

    });

    it("Should get all users (404 if there are not users)", async () => {

        const response = await request(app)
            .get("/users")
            .set("Accept", "application/json")
            .expect([200, 404])

    });

    it("Should get the first user (404 if there are not users)", async () => {

        const response = await request(app)
            .get("/users/1")
            .set("Accept", "application/json")
            .expect([200, 404])

    });

    it("Shouldn't get users by their preferences", async () => {

        const response = await request(app)
            .get("/users/preferences/Ropa")
            .set("Accept", "application/json")
            .expect(401)

    });

    it("Shouldn't update user", async () => {

        const response = await request(app)
            .put("/users/1")
            .send({})
            .set("Accept", "application/json")
            .expect(400)

    });

    it("Shouldn't delete user", async () => {

        const response = await request(app)
            .delete("/users/1")
            .set("Accept", "application/json")
            .expect(401)

    });

});

/* Pruebas de Comercios */
describe("webpages", () => {

    it("Should get all webpages (404 if there are not webpages)", async () => {

        const response = await request(app)
            .get("/webpages")
            .set("Accept", "application/json")
            .expect([200, 404])

    });

    it("Should get all webpages filtered (404 if there are not webpages)", async () => {

        const response = await request(app)
            .get("/webpages/Tienda/ASC/España/Madrid/Ropa")
            .set("Accept", "application/json")
            .expect([200, 404])

    });

    it("Shouldn't get webpages filtered as logged user", async () => {

        const response = await request(app)
            .get("/webpages/Tienda/ASC/NULL/NULL/NULL/false/true")
            .set("Accept", "application/json")
            .expect(401)

    });

    it("Should get the first webpage (404 if there are not webapges)", async () => {

        const response = await request(app)
            .get("/webpages/1")
            .set("Accept", "application/json")
            .expect([200, 404])

    });

    it("Shouldn't create a new webpage", async () => {

        const response = await request(app)
            .post("/webpages")
            .send({})
            .set("Accept", "application/json")
            .expect(400)

    });

    it("Shouldn't update a webpage", async () => {

        const response = await request(app)
            .put("/webpages/1")
            .send({})
            .set("Accept", "application/json")
            .expect(400)

    });

    it("Shouldn't delete a webpage", async () => {

        const response = await request(app)
            .delete("/webpages/1")
            .set("Accept", "application/json")
            .expect(401)

    });

});