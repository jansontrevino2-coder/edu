import fs from "fs";
import path from "path";

export default async function handler(req, res) {

    const gamesDir = path.join(process.cwd(), "Games");

    const folders = fs.readdirSync(gamesDir);

    const games = [];

    for (const folder of folders) {

        const folderPath = path.join(gamesDir, folder);

        if (!fs.statSync(folderPath).isDirectory()) continue;

        const files = fs.readdirSync(folderPath);

        const htmlFile = files.find(file =>
            file.toLowerCase().endsWith(".html")
        );

        const coverFile = files.find(file =>
            /\.(png|jpg|jpeg|webp|gif)$/i.test(file)
        );

        if (!htmlFile) continue;

        games.push({
            name: folder,
            url: `/Games/${encodeURIComponent(folder)}/${encodeURIComponent(htmlFile)}`,
            cover: coverFile
                ? `/Games/${encodeURIComponent(folder)}/${encodeURIComponent(coverFile)}`
                : "https://via.placeholder.com/400x250?text=No+Cover"
        });
    }

    res.status(200).json(games);
}
