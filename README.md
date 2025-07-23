# Twilio Realtime WebApp

Next.js web application for monitoring and managing Twilio Realtime API calls.

## Features

- Real-time call transcript display
- Session configuration panel
- Function calls monitoring
- WebSocket connection to server
- Responsive UI with Tailwind CSS

## Environment Variables

- `TWILIO_ACCOUNT_SID`: Your Twilio Account SID
- `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token
- `NEXT_PUBLIC_WEBSOCKET_URL`: Your websocket server domain (without https://)

## Deployment

This webapp is designed to be deployed on Railway.

### Railway Deployment

1. Connect this repository to Railway
2. Set environment variables:
   - `TWILIO_ACCOUNT_SID`: Your Twilio Account SID
   - `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token
   - `NEXT_PUBLIC_WEBSOCKET_URL`: Your websocket server domain
3. Railway will automatically build and deploy

## Local Development

```bash
npm install
cp .env.example .env
# Add your Twilio credentials to .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Technologies

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Radix UI Components
- WebSocket API