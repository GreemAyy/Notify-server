import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "socket.io";


@WebSocketGateway()
export class TasksGetaway{
    @WebSocketServer()
    server: Socket;

    @SubscribeMessage('update')
    onTaskCreated(@MessageBody() body: any){ 
        console.log(body);
        this.server.emit('update', body);
    }
    @SubscribeMessage('change')
    onTaskChange(@MessageBody() body: any){ 
        this.server.emit('change', body);
    }
    @SubscribeMessage('delete')
    onTaskDelete(@MessageBody() body: any){ 
        this.server.emit('delete', body);
    }
}    