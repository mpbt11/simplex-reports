import * as ExcelJS from "exceljs";
import { ReportOptions } from "../types/reportTypes";
import { getColorHex } from "../utils/colorUtils";
import * as fs from "fs";
import * as path from "path";
/**
 * Gera o arquivo Excel em memória e retorna o caminho do arquivo.
 * @param options Opções para gerar o relatório
 * @param index Índice para o nome do arquivo, caso seja dividido em múltiplos lotes
 * @returns Caminho para o arquivo gerado
 */
export async function generateExcel(
  options: ReportOptions,
  index: number = 0
): Promise<string> {
  const { filename, title, columns, data, color = "verde" } = options;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(title);

  // Título
  worksheet.addRow([title]);
  worksheet.addRow([]);

  // Cabeçalho com cor
  const headerRow = worksheet.addRow(columns);
  const fillColor = getColorHex(
    color as "azul" | "verde" | "vermelho" | "amarelo" | "roxo"
  );

  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: fillColor },
    };
  });

  data.forEach((row) => {
    worksheet.addRow(row);
  });

  const outputPath = path.resolve(
    __dirname,
    `../../temp/${filename}_parte_${index + 1}.xlsx`
  );
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  await workbook.xlsx.writeFile(outputPath);

  return outputPath;
}
