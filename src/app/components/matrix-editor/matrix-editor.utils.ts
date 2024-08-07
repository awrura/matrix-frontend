import { TMatrix, TMatrixLine } from './matrix-editor.type';
import { DEFAULT_CELL_VALUE, MATRIX_SIZE } from './matrix-editor.const';

export function createDefaultMatrix(): TMatrix {
  const matrix: TMatrixLine[] = [];

  for (let i = 0; i < MATRIX_SIZE; i++) {
    matrix.push([] as unknown as TMatrixLine);

    for (let j = 0; j < MATRIX_SIZE; j++) {
      matrix[i].push(DEFAULT_CELL_VALUE);
    }
  }

  return matrix;
}
