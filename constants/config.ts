import { config } from 'dotenv'

config()

export const envConfig = {
    PUCLIC_URL: process.env.NEXT_PUBLIC_URL as string,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY as string,
    DB_USER: process.env.DB_USER as string,
    DB_PASSWORD: process.env.DB_PASSWORD as string,
    DB_NAME: process.env.DB_NAME as string,
    DB_MESSAGES_COLLECTION: process.env.DB_MESSAGES_COLLECTION as string,
  } as const