import 'dotenv/config'
import { app } from './app.ts'

const PORT = Number(process.env.PORT ?? 4000)

app.listen(PORT, () => {
  console.log(`Mateka API rodando em http://localhost:${PORT}`)
})
