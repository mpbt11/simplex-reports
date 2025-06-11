import * as ExcelJS from "exceljs";
import { ReportOptions } from "../types/reportTypes";
import { getColorHex } from "../utils/colorUtils";
import * as fs from "fs";
import * as path from "path";

type CellValue = string | number | Date | null | undefined;

interface CellStyle {
  alignment?: Partial<ExcelJS.Alignment>;
  border?: Partial<ExcelJS.Borders>;
  fill?: ExcelJS.Fill;
  font?: Partial<ExcelJS.Font>;
  numFmt?: string;
}

function createWorkbook(outputPath: string): ExcelJS.stream.xlsx.WorkbookWriter {
  return new ExcelJS.stream.xlsx.WorkbookWriter({
    filename: outputPath,
    useStyles: true,
    useSharedStrings: true
  });
}

function setupWorksheet(
  workbook: ExcelJS.stream.xlsx.WorkbookWriter,
  title: string,
  columns: string[],
  color: string
): ExcelJS.Worksheet {
  const worksheet = workbook.addWorksheet(title, {
    views: [{ state: 'frozen', ySplit: 3 }],
    properties: { tabColor: { argb: getColorHex(color as "azul" | "verde" | "vermelho" | "amarelo" | "roxo") } }
  });

  worksheet.columns = columns.map(col => ({
    header: col,
    width: Math.max(col.length + 5, 15)
  }));

  return worksheet;
}

async function addTitleRow(worksheet: ExcelJS.Worksheet, title: string, columnsLength: number): Promise<void> {
  const titleRow = worksheet.addRow([title]);
  applyStyles(titleRow, {
    font: { bold: true, size: 14 },
    alignment: { horizontal: 'center', vertical: 'middle' }
  });
  titleRow.height = 25;
  worksheet.mergeCells(`A1:${String.fromCharCode(64 + columnsLength)}1`);
  await titleRow.commit();
}

async function addHeaderRow(worksheet: ExcelJS.Worksheet, columns: string[], color: string): Promise<void> {
  const headerRow = worksheet.addRow(columns);
  const fillColor = getColorHex(color as "azul" | "verde" | "vermelho" | "amarelo" | "roxo");
  
  applyStyles(headerRow, {
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: fillColor }
    },
    font: { bold: true, color: { argb: 'FFFFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
  });
  
  await headerRow.commit();
}

function applyStyles(row: ExcelJS.Row, styles: CellStyle): void {
  row.eachCell(cell => {
    if (styles.alignment) cell.alignment = styles.alignment;
    if (styles.border) cell.border = styles.border;
    if (styles.fill) cell.fill = styles.fill;
    if (styles.font) cell.font = styles.font;
    if (styles.numFmt) cell.numFmt = styles.numFmt;
  });
}

function determineValueFormat(value: CellValue): CellStyle {
  if (value === null || value === undefined || value === '') {
    return { alignment: { horizontal: 'left' } };
  }

  if (value instanceof Date) {
    return {
      numFmt: 'dd/mm/yyyy',
      alignment: { horizontal: 'center' }
    };
  }

  if (typeof value === 'number') {
    return {
      numFmt: Number.isInteger(value) ? '#,##0' : '#,##0.00',
      alignment: { horizontal: 'right' }
    };
  }
  
  return { alignment: { horizontal: 'left' } };
}

async function processDataBatch(
  worksheet: ExcelJS.Worksheet,
  data: CellValue[][],
  startIndex: number,
  batchSize: number
): Promise<void> {
  const endIndex = Math.min(startIndex + batchSize, data.length);
  const batch = data.slice(startIndex, endIndex);

  for (const row of batch) {
    const excelRow = worksheet.addRow(row);
    
    excelRow.eachCell((cell, colNumber) => {
      const value = cell.value as CellValue;
      const format = determineValueFormat(value);
      
      applyStyles(excelRow, {
        ...format,
        border: {
          top: { style: 'hair' },
          left: { style: 'hair' },
          bottom: { style: 'hair' },
          right: { style: 'hair' }
        }
      });
    });

    if (startIndex % 2 === 0) {
      applyStyles(excelRow, {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFAFAFA' }
        }
      });
    }

    await excelRow.commit();
  }
}

/**
 * Gera o arquivo Excel usando streams para melhor performance com grandes volumes de dados.
 * @param options Opções para gerar o relatório
 * @param index Índice para o nome do arquivo, caso seja dividido em múltiplos lotes
 * @returns Caminho para o arquivo gerado
 */
export async function generateExcel(
  options: ReportOptions,
  index: number = 0
): Promise<string> {
  const { filename, title, columns, data, color = "verde" } = options;
  const outputPath = path.resolve(__dirname, `../../temp/${filename}_parte_${index + 1}.xlsx`);
  
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const workbook = createWorkbook(outputPath);
  const worksheet = setupWorksheet(workbook, title, columns, color);

  await addTitleRow(worksheet, title, columns.length);
  await worksheet.addRow([]).commit();
  await addHeaderRow(worksheet, columns, color);

  const BATCH_SIZE = 1000;
  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    await processDataBatch(worksheet, data, i, BATCH_SIZE);
  }

  await workbook.commit();
  return outputPath;
}
