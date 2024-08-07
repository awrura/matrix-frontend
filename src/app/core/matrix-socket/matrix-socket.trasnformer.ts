import { TSocketMatrixMessage } from './matrix-socket.type';
import { TMatrix } from '../../components/matrix-editor/matrix-editor.type';

export function deserializeMatrix(dto: TSocketMatrixMessage): TMatrix {
  const processedArray = dto.data.map((cell) => {
    return `rgb(${cell.red}, ${cell.green}, ${cell.blue})`;
  });

  const newArray = [];
  for (let i = 0; i < 16; i++) {
    newArray.push(processedArray.splice(0, 16));
  }

  return newArray;
}

export function serializeMatrix(data: TMatrix): TSocketMatrixMessage {
  return {
    data: data.flat(1).map((cell) => {
      const splittedParams = cell.slice(4, -1).split(', ');
      return {
        red: +splittedParams[0],
        green: +splittedParams[1],
        blue: +splittedParams[2],
      };
    }),
  };
}
