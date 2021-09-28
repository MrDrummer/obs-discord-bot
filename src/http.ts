import express, { Request, Response, NextFunction } from "express"
import parseBearerToken from "parse-bearer-token"
import { remote } from "./common"
import { users, secrets } from "./config"

const server = express()
server.use(express.json())
server.use(express.urlencoded({ extended: false }))

const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = parseBearerToken(req)
  const found = users.users.findIndex(u => u.token === token)
  if (found < 0) {
    res.status(401).send("Unauthorised")
    return
  }
  next()
}

const process = async (req: Request, res: Response): Promise<void> => {
  const data: remote.RemoteData = req.body
  await remote.parseAndExecuteRemoteCommand(data)
  console.log("HTTP :", data.rawCommand)
  res.status(200).send("Great Success!")
}

server.post("/api/command", authenticate, process)

export default (): void => {
  server.listen(secrets.http.port)
  console.log("Listening on port", secrets.http.port)
}
