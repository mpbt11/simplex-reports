# simplex-reports

Gere relatórios em Excel ou CSV de forma escalável! Esta biblioteca permite gerar relatórios grandes dividindo os dados em partes menores para melhor performance.

## Instalação

```bash
npm install simplex-reports
```

## Recursos

- Geração de relatórios em Excel (.xlsx) ou CSV
- Divisão automática de dados em partes menores para melhor performance
- Personalização de cores para cabeçalhos em relatórios Excel
- Suporte a títulos e colunas personalizadas
- Geração assíncrona de relatórios

## Exemplo de Uso

```typescript
import { generateReport } from "simplex-reports";
import { FileFormat } from "simplex-reports/types";

async function main() {
  // Exemplo com dados fictícios
  const dados = [
    [1, "João Silva", 1500.50, "Vendas"],
    [2, "Maria Santos", 2200.00, "Marketing"],
    [3, "Pedro Alves", 1800.75, "Vendas"],
    // ... mais dados
  ];

  // Configuração básica
  const options = {
    filename: "relatorio_funcionarios",
    title: "Relatório de Funcionários",
    columns: ["ID", "Nome", "Salário", "Departamento"],
    data: dados,
    format: FileFormat.EXCEL,
    color: "azul", // Opções: azul, verde, vermelho, amarelo, roxo
    chunkSize: 100_000 // Divide os dados em partes de 100 mil registros
  };

  // Gera o relatório
  const arquivosGerados = await generateReport(options);
  console.log("Arquivos gerados:", arquivosGerados);
}

main().catch(console.error);
```

## Opções de Configuração

| Opção | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| filename | string | Sim | Nome base do arquivo (sem extensão) |
| title | string | Sim | Título que aparecerá no relatório |
| columns | string[] | Sim | Array com os nomes das colunas |
| data | any[][] | Sim | Array bidimensional com os dados |
| format | FileFormat | Sim | Formato do arquivo (EXCEL ou CSV) |
| color | string | Não | Cor do cabeçalho (Excel) - padrão: verde |
| chunkSize | number | Não | Tamanho de cada parte - padrão: 500.000 |

## Cores Disponíveis

- azul
- verde (padrão)
- vermelho
- amarelo
- roxo

## Observações

- Os arquivos são gerados em uma pasta `temp` no diretório do projeto
- Para dados muito grandes, serão gerados múltiplos arquivos com sufixo `_parte_X`
- O formato do arquivo é definido pela enum `FileFormat` (EXCEL ou CSV)

## Licença

MIT
