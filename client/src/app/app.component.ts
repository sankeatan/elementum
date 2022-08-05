import { Component, OnInit, AfterViewInit } from '@angular/core'
import { io, Socket } from 'socket.io-client'
import { environment } from 'src/environments/environment.prod'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit {
  private socket: Socket
  public readonly title: string = "Elementum Client"

  public ngOnInit(): void {
    this.socket = io(environment.serverURL, environment.IoConnectionOptions)

    this.socket.on("connect_error", (err) => {
      console.error(err)
    })

    window.addEventListener('beforeunload', () => {
      this.socket.close()
    })
  }

  public ngAfterViewInit(): void {
  }
}
