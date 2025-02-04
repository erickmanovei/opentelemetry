import { NodeSDK } from "@opentelemetry/sdk-node";
import { diag, DiagConsoleLogger, DiagLogLevel, metrics } from '@opentelemetry/api'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { MySQLInstrumentation } from "@opentelemetry/instrumentation-mysql";
import { PrismaInstrumentation } from '@prisma/instrumentation'
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

// Definição do nome do serviço
const serviceName = process.env.OTEL_PROJECT_NAME ?? '';

// Exportador de traces via OTLP para OpenTelemetry Collector (e depois para o Jaeger)
const traceExporter = new OTLPTraceExporter({
  url: "http://localhost:4317",
  // compression: CompressionAlgorithm.GZIP,
});

// Exportador de métricas para Prometheus
const metricExporter = new OTLPMetricExporter({
  url: "http://localhost:4317", // Endpoint do OpenTelemetry Collector
});


const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 5000, // Exporta métricas a cada 5 segundos
});


const sdk = new NodeSDK({
  serviceName,
  traceExporter,
  metricReader,
  instrumentations: [
    getNodeAutoInstrumentations(),
    // new HttpInstrumentation(),
    // new ExpressInstrumentation(),
    // new MySQLInstrumentation(),
    new PrismaInstrumentation(),
  ],
});

// ✅ Forma correta de iniciar o OpenTelemetry
sdk.start();
console.log(`[OpenTelemetry] 🚀 Inicializado para o serviço: ${serviceName}`);

// Captura o evento de encerramento para desligar o SDK corretamente
process.on("SIGTERM", async () => {
  await sdk.shutdown();
  console.log(`[OpenTelemetry] 🛑 Finalizado`);
  process.exit(0);
});
