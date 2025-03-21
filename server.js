const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/scrape", async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "Se requiere una URL" });
    }

    try {
        const browser = await puppeteer.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "domcontentloaded" });

        // Extraer el HTML de la página ya renderizada
        const content = await page.content();

        await browser.close();
        res.json({ html: content });

    } catch (error) {
        console.error("Error en Puppeteer:", error);
        res.status(500).json({ error: "Error al procesar la URL" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));