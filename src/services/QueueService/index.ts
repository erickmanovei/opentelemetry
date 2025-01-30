import { JobsOptions, Queue, Worker } from 'bullmq';
import * as jobs from 'jobs';
import redisConfig from 'config/redis';

export const queues = Object.values(jobs).map(job => ({
  queue: new Queue(job.key, {
    connection: redisConfig,
  }),
  name: job.key,
  handle: job.handle,
}));

type JobName = keyof typeof jobs

export const add = async (
  name: JobName,
  data: any,
  options: JobsOptions | undefined,
  extraIdentification: string = ''
): Promise<void> => {
  const queue = queues.find(q => q.name === name);
  if (queue) {
    await queue.queue.add(`${name}-${new Date().getTime()}${extraIdentification}`, data, options);
    const jobs = await queue.queue.getJobs(["active", "waiting", "delayed", "completed"])
    console.log('jobs', jobs)
  } else {
    console.log('Não encontrou este nome de fila')
  }
};

export const processQueues = (): void => {
  queues.forEach(({ name, handle }) => {
    const worker = new Worker(
      name,
      async job => {
        await handle(job.data);
      },
      {
        connection: redisConfig,
      },
    );
    worker.on('failed', (job, err) => {
      console.log('Job failed', name, job?.data);
      console.log(err);
    });
    worker.on('completed', job => {
      console.log(`${job.id} has completed!`);
    });
  });
};
