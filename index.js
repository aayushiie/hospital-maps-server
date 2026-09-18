import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/api/hospitals', async (req, res) => {
    try {
        const query = req.body?.data;
        if (!query) {
            return res.status(400).json({
                error: "Missing query data"
            });
        }
        const response = await fetch(
            "https://overpass-api.de/api/interpreter",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "User-Agent": "EmergencyHospitalMaps/1.0"
                },
                body: `data=${encodeURIComponent(query)}`
            }
        );
        const responseText = await response.text();

        if (!response.ok) {
            return res.status(response.status).send(responseText);
        }
        const data = JSON.parse(responseText);
        return res.json(data);

    } catch (error) {
        console.error("BACKEND ERROR:", error);
        return res.status(500).json({
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

