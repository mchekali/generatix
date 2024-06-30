import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import path from "path";

// Config for the API route
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb", // Set desired value here
    },
  },
};

// Handle POST requests
export async function POST(req, res) {
  try {
    const { file, filename } = await req.json();

    if (!file || !filename) {
      return res.status(400).json({ error: "File and filename are required" });
    }

    const base64Data = file.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const uniqueFilename = `${uuidv4()}-${filename}`;
    const filePath = path.join(
      "/home/remedeasy/htdocs/www.remedeasy.com/node/uploads",
      uniqueFilename,
    );

    await fs.writeFile(filePath, buffer);

    const imageUrl = `http://design.remedeasy.com/upload/${uniqueFilename}`;
    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error uploading file" });
  }
}
