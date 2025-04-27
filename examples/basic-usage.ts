import { generateReport } from "../src";
import { FileFormat } from "../src/types/reportTypes";

async function main() {
  const fakeData = Array.from({ length: 1_000_000 }, (_, i) => [
    i + 1,
    `Nome ${i}`,
    Math.random() * 100,
  ]);

  const options = {
    filename: "relatorio_vendas",
    title: "Relatório de Vendas",
    columns: ["ID", "Nome", "Valor"],
    data: fakeData,
    format: FileFormat.EXCEL, // ou 'CSV'
    color: "verde",
    chunkSize: 100_000,
  };

  const files = await generateReport(options);
  console.log("Relatórios gerados:", files);
}

main();
