import * as fs from "fs";
import * as path from "path";
import * as csvWriter from "csv-writer";
import { ReportOptions } from "../types/reportTypes";

/**
 * Gera o arquivo CSV em memória e retorna o caminho do arquivo.
 * @param options Opções para gerar o relatório
 * @param index Índice para o nome do arquivo, caso seja dividido em múltiplos lotes
 * @returns Caminho para o arquivo gerado
 */
export async function generateCSV(
  options: ReportOptions,
  index: number = 0
): Promise<string> {
  const { filename, columns, data } = options;

  const outputPath = path.resolve(
    __dirname,
    `../../temp/${filename}_parte_${index + 1}.csv`
  );
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const writer = csvWriter.createObjectCsvWriter({
    path: outputPath,
    header: columns.map((column) => ({ id: column, title: column })),
  });

  await writer.writeRecords(data);

  return outputPath;
}
