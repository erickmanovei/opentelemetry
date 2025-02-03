import './otel/metrics/systemMetrics';
import { metrics } from '@opentelemetry/api';

const meter = metrics.getMeter('exemplo-opentelemetry');

const accessDeniedCounter = () => {
  return meter.createCounter('list_users', {
    description: 'Contador de requisições a usuários',
  });
}

export const allMetrics = [
  {
    name: 'access_denied',
    metric: meter.createCounter('access_denied', {
      description: 'Contador de autenticações falhadas',
    })
  }
]
