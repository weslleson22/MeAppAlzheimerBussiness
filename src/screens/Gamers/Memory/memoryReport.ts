import { getMemoryGameStats, MemoryGameStats } from '../../../libs/storage';

export async function generateMemoryReportSummary(): Promise<MemoryGameStats> {
  return await getMemoryGameStats();
}
