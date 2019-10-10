import { MatchDescription } from '../../matcher';
import { TBRange } from '../../range';
import { EditFrame } from '../edit-frame';

export interface Formatter {
  recordHistory: boolean;

  format(range: TBRange, frame: EditFrame, matchDescription: MatchDescription): void;
}
