import {
  Component,
  HostListener,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { LocalStorageService } from '../../core/storage/local-storage.service';
import { EStorageKeys } from '../../core/storage/local-storage.enum';
import { MatrixSocketService } from '../../core/matrix-socket/matrix-socket.service';
import {
  deserializeMatrix,
  serializeMatrix,
} from '../../core/matrix-socket/matrix-socket.trasnformer';
import { TMatrix } from './matrix-editor.type';
import { map } from 'rxjs';
import { SvgIconComponent } from 'angular-svg-icon';
import { createDefaultMatrix } from './matrix-editor.utils';
import { DEFAULT_CELL_VALUE } from './matrix-editor.const';

@Component({
  selector: 'app-matrix-editor',
  templateUrl: './matrix-editor.component.html',
  styleUrl: './matrix-editor.component.scss',
  standalone: true,
  imports: [
    RouterOutlet,
    ColorPickerModule,
    ReactiveFormsModule,
    SvgIconComponent,
  ],
  providers: [MatrixSocketService],
})
export class MatrixEditorComponent implements OnInit {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly matrixSocketService = inject(MatrixSocketService);

  readonly selectedColor = signal('rgb(255,255,255)');
  readonly isMouseDown = signal(false);
  readonly isBrushSelected = signal(true);

  readonly matrix: WritableSignal<TMatrix> = signal([]);

  constructor() {
    this.matrix.set(createDefaultMatrix());
  }

  @HostListener('window:beforeunload')
  onClose() {
    this.localStorageService.setItem(
      EStorageKeys.MATRIX,
      JSON.stringify(this.matrix())
    );
  }

  ngOnInit(): void {
    this.subOnSocketMessage();

    const savedState = this.localStorageService.getItem(EStorageKeys.MATRIX);
    if (savedState) {
      this.matrix.set(JSON.parse(savedState));
    }

    this.matrixSocketService.connect('ws://{base}/matrix/rgb/{matrix-name}');
  }

  subOnSocketMessage(): void {
    this.matrixSocketService.websocketSubject
      ?.pipe(map((dto) => deserializeMatrix(dto)))
      .subscribe((data) => {
        this.matrix.set(data);
      });
  }

  setColor(line: number, block: number): void {
    if (this.isMouseDown()) {
      this.matrix.update((value) => {
        value[line][block] = this.isBrushSelected()
          ? this.selectedColor()
          : DEFAULT_CELL_VALUE;
        return value;
      });
    }
  }

  clearMatrix(): void {
    this.matrix.set(createDefaultMatrix());
  }

  sendMatrix(): void {
    this.matrixSocketService.send(serializeMatrix(this.matrix()));
  }
}
