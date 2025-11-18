# AI Accessory Generator

Describe any accessory—rings, bags, headbands—and this tiny Next.js app will call OpenAI’s image API to render it for you.

## Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS 4
- API Route at `/api/generate-accessory` that proxies to OpenAI Images (DALL·E / `gpt-image-1`)

## Getting started

1. Install dependencies
   ```bash
   npm install
   ```
2. Create `.env` based on the sample:
   ```bash
   cp .env.example .env
   # then edit .env and drop in your real OPENAI_API_KEY
   ```
3. Run the dev server
   ```bash
   npm run dev
   ```
4. Visit [http://localhost:3000](http://localhost:3000) and enter a prompt such as “silver minimalist ring” or “vintage leather shoulder bag”.

## Notes

- The UI shows a loading state, generated image, and the prompt used. Errors from OpenAI are surfaced in-line.
- The API route returns a ready-to-render data URL if the OpenAI response does not include a hosted URL.
- Tailwind 4 is imported globally via `app/globals.css`; no additional configuration is required besides `tailwind.config.ts`.
