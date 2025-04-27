export enum FileFormat {
  EXCEL = "excel",
  CSV = "csv",
}

export type Color = "azul" | "verde" | "vermelho" | "amarelo" | "roxo";

export interface ReportOptions {
  filename: string;
  title: string;
  columns: string[];
  data: any[][];
  format: FileFormat;
  color?: string;
  chunkSize?: number;
}
