const request = require("supertest");
const app = require("../../app");

describe("Health Test Check", () => {
    it("Deve retornar status 200 e mensagem ok na rota /health", async () => {
        const response = await request(app).get("/health");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status", "ok");
        expect(response.body).toHaveProperty("uptime");
    })
})