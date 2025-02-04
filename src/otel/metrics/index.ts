import './systemMetrics';
import { metrics } from '@opentelemetry/api';

const meter = metrics.getMeter(process.env.OTEL_PROJECT_NAME ?? '');
console.log(`[OpenTelemetry] 📏 Métricas iniciadas para o serviço: ${process.env.OTEL_PROJECT_NAME}`);

const counterMetricNames = [
  {
    name: 'access_denied',
    description: 'Contador de autenticações falhadas',
  },
  {
    name: 'list_users',
    description: 'Contador de requisições a listagem de usuários',
  },
] as const;

type CounterMetricName = typeof counterMetricNames[number]['name'];

const counterMetrics = counterMetricNames.map(e => ({
  name: e.name,
  metric: meter.createCounter(e.name, {
    description: e.description,
  })
}))

export const counterMetric = (name: CounterMetricName) => {
  const metric = counterMetrics.find(e => e.name === name)?.metric;
  if (!metric) {
    throw new Error(`[OpenTelemetry] ❌ Métrica ${name} não encontrada`);
  }
  return metric;
}
