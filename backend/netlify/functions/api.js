import serverless from 'serverless-http';
import app from '../../src/app.js';
import { connectDB } from '../../src/config/db.js';

process.env.NODE_ENV = 'production';

const functionPrefix = '/.netlify/functions/api';
const expressHandler = serverless(app);
let initialization;

export default async (request, context) => {
  initialization ??= connectDB();
  await initialization;

  const url = new URL(request.url);
  const path = url.pathname.startsWith(functionPrefix)
    ? `/api${url.pathname.slice(functionPrefix.length)}`
    : url.pathname;
  const event = {
    httpMethod: request.method,
    path,
    headers: Object.fromEntries(request.headers),
    queryStringParameters: Object.fromEntries(url.searchParams),
    body: ['GET', 'HEAD'].includes(request.method) ? null : await request.text(),
    isBase64Encoded: false,
    requestContext: {
      identity: { sourceIp: context.ip || request.headers.get('x-nf-client-connection-ip') },
    },
  };
  const result = await expressHandler(event, context);

  return new Response(result.body, {
    status: result.statusCode,
    headers: result.headers,
  });
};
