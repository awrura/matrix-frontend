import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { TSocketMatrixMessage } from './matrix-socket.type';

@Injectable()
export class MatrixSocketService {
  websocketSubject?: WebSocketSubject<TSocketMatrixMessage>;

  connect(path: string): void {
    this.websocketSubject = new WebSocketSubject<TSocketMatrixMessage>(path);
  }

  send(data: TSocketMatrixMessage): void {
    if (this.websocketSubject) {
      this.websocketSubject.next(data);
    }
  }
}
