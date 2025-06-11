import { generateReport } from "../src";
import { FileFormat } from "../src/types/reportTypes";

async function main() {
  try {
    // Dados de exemplo
    const dados = [
      [1, "Produto A", 150.50, new Date("2024-03-01"), 10],
      [2, "Produto B", 299.99, new Date("2024-03-02"), 5],
      [3, "Produto C", 1500.00, new Date("2024-03-03"), 2],
    ];

    const options = {
      filename: "produtos",
      title: "Lista de Produtos",
      columns: ["ID", "Produto", "Preço", "Data", "Quantidade"],
      data: dados,
      format: FileFormat.EXCEL,
      color: "azul",
      chunkSize: 1000
    };

    console.log("Gerando relatório...");
    const files = await generateReport(options);
    console.log("✅ Relatório gerado:", files[0]);
  } catch (error) {
    console.error("❌ Erro:", error);
    process.exit(1);
  }
}

main(); 