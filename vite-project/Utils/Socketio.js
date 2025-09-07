/*import {io} from "socket.io-client";

export const createSocketConnection = () => {
  return io("http://localhost:9000");
}
*/
import { io } from "socket.io-client";

export const createSocketConnection = () => {
  return io("http://localhost:5491", {
    transports: ["websocket"], // force websocket (avoid long polling spam)
  });
};