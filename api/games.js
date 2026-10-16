import fs from "fs";
import path from "path";

export default function handler(req, res) {

    try {

        const gamesDir = path.join(process.cwd(), "Games");

        if (!fs.existsSync(gamesDir)) {
            return res.status(404).json({
                error: "Games folder not found"
            });
        }

        const folders = fs.readdirSync(gamesDir);

        const games = [];

        for (const folder of folders) {

            const folderPath = path.join(gamesDir, folder);

            if (!fs.statSync(folderPath).isDirectory()) {
                continue;
            }

            const files = fs.readdirSync(folderPath);

            const htmlFile = files.find(file =>
                file.toLowerCase().endsWith(".html")
            );

            const coverFile = files.find(file =>
                /\.(png|jpg|jpeg|webp|gif)$/i.test(file)
            );

            if (!htmlFile) {
                continue;
            }

            games.push({
                name: folder,
                url: `/Games/${encodeURIComponent(folder)}/${encodeURIComponent(htmlFile)}`,
                cover: coverFile
                    ? `/Games/${encodeURIComponent(folder)}/${encodeURIComponent(coverFile)}`
                    : "https://via.placeholder.com/400x250?text=No+Cover"
            });

        }

        res.status(200).json(games);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

}
