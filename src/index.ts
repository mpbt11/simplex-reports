// src/index.ts
import { splitDataIntoChunks } from "./utils/chunkUtils";
import { generateExcel } from "./generators/excelGenerator";
import { generateCSV } from "./generators/csvGenerator";
import { FileFormat, ReportOptions } from "./types/reportTypes";

/**
 * Gera relatórios divididos conforme tamanho de chunk informado
 * @param options Opções para gerar o relatório
 * @returns Array de caminhos de arquivos gerados
 */
export async function generateReport(
  options: ReportOptions
): Promise<string[]> {
  const { data, chunkSize = 500_000, format } = options;

  const chunkedData = splitDataIntoChunks(data, chunkSize);

  const generatedFiles: string[] = [];

  for (let i = 0; i < chunkedData.length; i++) {
    const chunkOptions = { ...options, data: chunkedData[i] };

    if (format === FileFormat.EXCEL) {
      const filePath = await generateExcel(chunkOptions, i);
      generatedFiles.push(filePath);
    } else if (format === FileFormat.CSV) {
      const filePath = await generateCSV(chunkOptions, i);
      generatedFiles.push(filePath);
    } else {
      throw new Error("Formato de arquivo não suportado.");
    }
  }

  return generatedFiles;
}
