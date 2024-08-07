import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatrixEditorComponent } from './components/matrix-editor/matrix-editor.component';
import { SvgIconRegistryService } from 'angular-svg-icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [RouterOutlet, MatrixEditorComponent],
  providers: [SvgIconRegistryService],
})
export class AppComponent {}
