/**
 * Divide os dados em múltiplos lotes de tamanho específico.
 * @param data Dados a serem divididos
 * @param chunkSize Tamanho do lote
 * @returns Dados divididos em partes menores
 */
export function splitDataIntoChunks(data: any[], chunkSize: number): any[][] {
  const chunks: any[][] = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }
  return chunks;
}
