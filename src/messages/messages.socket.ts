import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "socket.io";

type MessageInput = {'group_id':string};
export type DeleteMessageInput = {"group_id":number, "message_id":number};
type ConnectInput = {"group_id":number};
type DisconnectInput = {"group_id":number};

@WebSocketGateway()
export class MessageGetaway implements OnGatewayDisconnect, OnGatewayConnection{
    @WebSocketServer()
    server: Socket;

    connectedUsers:{[id:number]:Socket[]} = {};

    @SubscribeMessage('connect-to-chat')
    onChatConnect(
        @MessageBody() body: ConnectInput,
        @ConnectedSocket() client: Socket
    ){
        const alreadyExist = Boolean((this.connectedUsers[body.group_id]??[]).filter(e=>e.id==client.id).length)
        if(alreadyExist) return;
        console.log('Connect to chat = group: ',body.group_id," id:",client.id)
        const groupId = body.group_id;
        if(this.connectedUsers[groupId])
            this.connectedUsers[groupId].push(client);
        else 
            this.connectedUsers[groupId] = [client]; 
    }

    @SubscribeMessage('disconnect-from-chat')
    onChatDisconnect(
        @MessageBody() body: DisconnectInput,
        @ConnectedSocket() client: Socket
    ){
        console.log('Disconnect from chat = group: ',body.group_id," id:",client.id)
        const groupId = body.group_id;
        const sockets = this.connectedUsers[groupId];
        this.connectedUsers[groupId] = sockets.filter(c=>c.id!=client.id);
    }

    handleConnection(client: any, ...args: any[]) {
        console.log('Connect ',"id: ",client.id)   
    }

    handleDisconnect(client: Socket) {
        for(var groupId in this.connectedUsers){ 
            const clients = this.connectedUsers[groupId];
            this.connectedUsers[groupId] = clients.filter(c=>c.id!=client.id)
            console.log('Disconnect ',"id: ",client.id)
       }
    } 

    @SubscribeMessage('message')
    onSendMessage(@MessageBody() body: MessageInput){ 
        console.log('Message =',body)
        this.connectedUsers[body.group_id]?.forEach((client:Socket) => {
            client.emit('message', body);
        })
    }

    @SubscribeMessage('delete-message')
    onDeleteMessage(@MessageBody() body: DeleteMessageInput){
        console.log('Delete message = ', body)
        this.connectedUsers[body.group_id]?.forEach((client:Socket) => {
            client.emit('delete-message', body);
        })
    }

    @SubscribeMessage('update-message')
    onUpdateMessages(@MessageBody() body: MessageInput){ 
        console.log('Message =',body)
        this.connectedUsers[body.group_id]?.forEach((client:Socket) => {
            client.emit('update-message', body);
        })
    }
}    