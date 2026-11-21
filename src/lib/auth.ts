import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { jwt } from 'better-auth/plugins';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
if (!uri && process.env.NODE_ENV === 'production') {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let client: MongoClient;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

if (!global._mongoClient) {
  global._mongoClient = new MongoClient(uri, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
  });
}
client = global._mongoClient;

const db = client.db(process.env.DB_NAME || 'pizzahub');

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET || 'dev_secret_only_for_local_development_placeholder_key',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  trustedOrigins: [
    'http://localhost:3000',
    'https://pizzahub-client-smoky.vercel.app',
    'https://pizzahub-client-etarnity.vercel.app',
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
  ],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: 'customer',
        input: true,
      },
      isBlocked: {
        type: 'boolean',
        required: false,
        defaultValue: false,
      },
      businessName: {
        type: 'string',
        required: false,
        defaultValue: '',
        input: true,
      },
      subscriptionPlan: {
        type: 'string',
        required: false,
        defaultValue: 'free',
      },
      subscriptionExpiresAt: {
        type: 'date',
        required: false,
      },
    },
  },
  plugins: [
    jwt({
      jwt: {
        expirationTime: '7d',
      },
    }),
  ],
});
