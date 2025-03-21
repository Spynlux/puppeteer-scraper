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
            executablePath: await puppeteer.executablePath(),
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--ignore-certificate-errors"
            ],
            headless: "new"
        });

        const page = await browser.newPage();
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
        );
        await page.goto(url, {
            waitUntil: "networkidle2",
            timeout: 60000
        });

        const content = await page.content();
        await browser.close();
        res.json({ html: content });

    } catch (error) {
        console.error("Error en Puppeteer:", error);
        res.status(500).json({ error: "Error al procesar la URL", details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));