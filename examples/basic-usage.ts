import { generateReport } from "../src";
import { FileFormat } from "../src/types/reportTypes";

async function main() {
  try {
    // Simulando dados de vendas (1 milhão de registros)
    const fakeData = Array.from({ length: 1_000_000 }, (_, i) => {
      const valor = Math.floor(Math.random() * 1000) + 100; // Valores entre 100 e 1100
      const vendedor = `Vendedor ${Math.floor(i / 1000) + 1}`; // Agrupa por vendedor
      const data = new Date(2024, 0, 1 + Math.floor(i / 1000)); // Data da venda

      return [
        i + 1, // ID
        vendedor,
        valor.toFixed(2), // Formatando valor com 2 casas decimais
        data.toLocaleDateString('pt-BR'), // Data formatada
        valor > 500 ? 'Alto' : 'Normal', // Classificação da venda
      ];
    });

    const options = {
      filename: "relatorio_vendas",
      title: "Relatório de Vendas - 2024",
      columns: ["ID", "Vendedor", "Valor (R$)", "Data", "Classificação"],
      data: fakeData,
      format: FileFormat.EXCEL, // Altere para FileFormat.CSV se preferir
      color: "verde", // Cores disponíveis: azul, verde, vermelho, amarelo, roxo
      chunkSize: 100_000, // Divide em partes de 100 mil registros
    };

    console.log("Gerando relatório...");
    const files = await generateReport(options);
    console.log("✅ Relatórios gerados com sucesso:", files);
    console.log(`📊 Total de arquivos gerados: ${files.length}`);
  } catch (error) {
    console.error("❌ Erro ao gerar relatório:", error);
    process.exit(1);
  }
}

// Executa o exemplo
main();
