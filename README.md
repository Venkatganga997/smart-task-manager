# Smart Task Manager

Node.js + TypeScript REST API with AI-powered task prioritization using OpenAI GPT-4. Started this as a side project to solve my own problem with task overload, turned it into a full REST API with JWT auth, AI analysis, and daily digests.

## Tech

- Node.js 20, TypeScript, Express.js
- - Prisma ORM + PostgreSQL
  - - OpenAI GPT-4 (task prioritization and effort estimation)
    - - Redis (caching, rate limiting)
      - - Jest (unit + integration tests)
        - - Docker Compose
         
          - ## What the AI does
         
          - When you submit a task, the AI endpoint analyzes it and returns:
          - - Priority score (0-100)
            - - Estimated effort in hours
              - - Task category (development/design/ops/etc)
                - - Brief reasoning
                  - - Suggested order relative to other tasks
                   
                    - Daily digest endpoint returns your top 5 tasks ranked by AI priority score.
                   
                    - ## Structure
                   
                    - ```
                      src/
                        controllers/   taskController.ts, aiController.ts, authController.ts
                        services/      taskService.ts, aiService.ts, authService.ts
                        middleware/    auth.ts, rateLimiter.ts, errorHandler.ts
                        routes/        taskRoutes.ts, aiRoutes.ts
                        utils/         logger.ts, openaiClient.ts
                        app.ts
                      prisma/schema.prisma
                      tests/
                      ```

                      ## Run locally

                      ```bash
                      cp .env.example .env
                      # fill in DATABASE_URL, OPENAI_API_KEY, JWT_SECRET, REDIS_URL

                      npm install
                      npx prisma migrate dev
                      npm run dev
                      ```

                      ## API endpoints

                      ```
                      POST /api/auth/register
                      POST /api/auth/login

                      GET    /api/tasks
                      POST   /api/tasks
                      PATCH  /api/tasks/:id
                      DELETE /api/tasks/:id

                      POST /api/ai/analyze/:id     - AI analysis for one task
                      GET  /api/ai/daily-digest    - top 5 tasks for today
                      POST /api/ai/batch-analyze   - analyze all open tasks
                      ```

                      ## Tests

                      ```bash
                      npm test
                      ```
