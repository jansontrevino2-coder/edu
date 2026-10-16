import fs from "fs";
import path from "path";

export default function handler(req, res) {
    const gamesDir = path.join(process.cwd(), "public", "Games");

    const folders = fs.readdirSync(gamesDir);

    const games = folders.map(folder => {

        const folderPath = path.join(gamesDir, folder);

        const files = fs.readdirSync(folderPath);

        const htmlFile =
            files.find(f => f.toLowerCase().endsWith(".html"));

        const coverFile =
            files.find(f =>
                /\.(png|jpg|jpeg|webp|gif)$/i.test(f)
            );

        return {
            name: folder,
            url: `/Games/${folder}/${htmlFile}`,
            cover: coverFile
                ? `/Games/${folder}/${coverFile}`
                : null
        };
    });

    res.status(200).json(games);
}