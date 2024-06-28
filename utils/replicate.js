import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function replicateRun(model, input) {
  const output = await replicate.run(model, { input });
  return output;
}
