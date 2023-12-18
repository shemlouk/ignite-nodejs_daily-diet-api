import { envs } from "@/lib/envs";
import { app } from "./app";

app
  .listen({
    port: envs.PORT,
  })
  .then(() => {
    console.log("Server started!");
  });
