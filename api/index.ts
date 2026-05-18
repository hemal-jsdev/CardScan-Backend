import server, { createNestServer } from '../src/main';

export default async (req: any, res: any) => {
  await createNestServer(server);
  return server(req, res);
};
