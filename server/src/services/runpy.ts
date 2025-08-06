import { spawn } from "child_process";
import path from "path";
import fs from "fs";

const runpy = (filename: string, id: string) => {
  const pathFile = path.join(
    __dirname,
    "..",
    "python",
    "venv",
    "verify_speaker.py"
  );
  //   console.log(pathFile);
  const jsonPath = path.join(__dirname, "..", "db", "user.json");
  const pythonProcess = spawn("python", [pathFile, filename, jsonPath, id]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(`Python output: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python error: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    fs.unlinkSync(filename); // cleanup
    console.log(`Python process exited with code ${code}`);
  });
};
export default runpy;
