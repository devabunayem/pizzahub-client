import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { jwt } from 'better-auth/plugins';
import { MongoClient } from 'mongodb';

const uri =
  process.env.MONGODB_URI ||
  'mongodb+srv://abunayemprogrammer_db_user:Mllknw6QNgQA2yfX@cluster0.qjqm5dx.mongodb.net/pizzahub?retryWrites=true&w=majority&appName=Cluster0';

let client: MongoClient;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri);
  }
  client = global._mongoClient;
} else {
  client = new MongoClient(uri);
}

const db = client.db(process.env.DB_NAME || 'pizzahub');

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret:
    process.env.BETTER_AUTH_SECRET ||
    'pizzahub_jwt_super_secret_production_key_2026_secure_token_9876543210',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
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
