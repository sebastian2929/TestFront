import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let client;

export function connect(onConnectCallback) {
    client = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        onConnect: () => {
            console.log('Connected');
            onConnectCallback();
        },
        onStompError: (error) => {
            console.error('STOMP error', error);
        }
    });

    client.activate();
}


export function sendMessage(destination, body) {
    if (client && client.connected) {
        client.publish({ destination, body });
    } else {
        console.error('STOMP client not connected, retrying...');
        setTimeout(() => {
            if (client && client.connected) {
                client.publish({ destination, body });
            }
        }, 1000); // Reintenta después de 1 segundo
    }
}

export function subscribeToTopic(destination, callback) {
    if (client && client.connected) {
        client.subscribe(destination, callback);
    } else {
        console.error('STOMP client not connected, retrying subscription...');
        setTimeout(() => {
            if (client && client.connected) {
                client.subscribe(destination, callback);
            }
        }, 1000); // Reintenta después de 1 segundo
    }
}

