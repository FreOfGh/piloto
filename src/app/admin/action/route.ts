import { NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import { join } from "path";
import fs from "fs";

export async function POST(request: Request) {
  const { id, accion, motivo } = await request.json();
  const mainPath = join(process.cwd(), "data", "registros.json");
  const targetFile = accion === "aprobar" ? "aprobados.json" : "rechazados.json";
  const targetPath = join(process.cwd(), "data", targetFile);

  try {
    const data = await readFile(mainPath, "utf-8");
    let registros = JSON.parse(data);
    const index = registros.findIndex((r: any) => r.id === id);
    if (index === -1) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    const [registro] = registros.splice(index, 1);
    const registroFinal = { ...registro, fechaAccion: new Date().toISOString(), motivoRechazo: motivo || null };

    let destinoData = fs.existsSync(targetPath) ? JSON.parse(await readFile(targetPath, "utf-8")) : [];
    destinoData.push(registroFinal);

    await writeFile(mainPath, JSON.stringify(registros, null, 2));
    await writeFile(targetPath, JSON.stringify(destinoData, null, 2));
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({ error: "Error" }, { status: 500 }); }
}