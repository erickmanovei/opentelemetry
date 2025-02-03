import { metrics } from '@opentelemetry/api';
import os from 'os';
import si from 'systeminformation';

// Obtém o meter global com um identificador para as métricas do servidor
const meter = metrics.getMeter('server-metrics');

// Variáveis para armazenar valores coletados periodicamente
let memoryUsagePercent = 0;
let diskUsagePercent = 0;
let networkRxBytes = 0;
let networkTxBytes = 0;

const UPDATE_INTERVAL_MS = 5000; // atualiza a cada 5 segundos

// Atualiza a porcentagem de memória utilizada
setInterval(async () => {
  try {
    const memData = await si.mem();
    memoryUsagePercent = (memData.used / memData.total) * 100;
  } catch (err) {
    console.error('Erro ao coletar métricas de memória:', err);
  }
}, UPDATE_INTERVAL_MS);

// Atualiza a porcentagem de uso do disco (para o filesystem principal)
setInterval(async () => {
  try {
    const fsData = await si.fsSize();
    const root = fsData.find(fs => fs.mount === '/') || fsData[0];
    if (root) {
      diskUsagePercent = root.use; // geralmente já vem em porcentagem
    }
  } catch (err) {
    console.error('Erro ao coletar métricas de disco:', err);
  }
}, UPDATE_INTERVAL_MS);

// Atualiza os bytes de rede (recebidos e transmitidos)
setInterval(async () => {
  try {
    const netStats = await si.networkStats();
    networkRxBytes = netStats.reduce((sum, iface) => sum + iface.rx_bytes, 0);
    networkTxBytes = netStats.reduce((sum, iface) => sum + iface.tx_bytes, 0);
  } catch (err) {
    console.error('Erro ao coletar métricas de rede:', err);
  }
}, UPDATE_INTERVAL_MS);

//
// Criação dos instrumentos observáveis com o callback usando addCallback
//

// 1. Carga de CPU (média dos últimos 1 minuto)
const cpuGauge = meter.createObservableGauge('cpu_load_1m', {
  description: 'Carga média da CPU nos últimos 1 minuto',
});
cpuGauge.addCallback((observableResult) => {
  const load1 = os.loadavg()[0];
  observableResult.observe(load1);
});

// 2. Uso de memória em porcentagem
const memoryGauge = meter.createObservableGauge('memory_usage_percent', {
  description: 'Porcentagem de memória utilizada',
});
memoryGauge.addCallback((observableResult) => {
  observableResult.observe(memoryUsagePercent);
});

// 3. Uso de disco em porcentagem (filesystem principal)
const diskGauge = meter.createObservableGauge('disk_usage_percent', {
  description: 'Porcentagem de uso do disco (filesystem principal)',
});
diskGauge.addCallback((observableResult) => {
  observableResult.observe(diskUsagePercent);
});

// 4. Bytes recebidos na rede (total)
const networkRxGauge = meter.createObservableGauge('network_rx_bytes', {
  description: 'Total de bytes recebidos na rede',
});
networkRxGauge.addCallback((observableResult) => {
  observableResult.observe(networkRxBytes);
});

// 5. Bytes transmitidos na rede (total)
const networkTxGauge = meter.createObservableGauge('network_tx_bytes', {
  description: 'Total de bytes transmitidos na rede',
});
networkTxGauge.addCallback((observableResult) => {
  observableResult.observe(networkTxBytes);
});

console.log('[SystemMetrics] Métricas do servidor registradas.');

export default meter;
