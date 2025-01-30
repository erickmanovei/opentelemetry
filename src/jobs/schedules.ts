import schedule from 'node-schedule';
import { add } from 'services/QueueService';

export default (): void => {
  // Executa a cada 1 minuto
  schedule.scheduleJob('*/1 * * * *', async () => {
    // await qualquercoisa();
  });

  // Executa todo dia, as 07 da manhã
  // schedule.scheduleJob('0 7 * * *', async () => {
  //   await chargeRetry({
  //     daysLeft: [3, 5]
  //   });
  // });
};
