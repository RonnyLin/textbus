import { Matcher, RangeMatchState, SelectionMatchState } from './matcher';
import { BranchComponent, DivisionComponent, Constructor, LeafComponent, Renderer, TBSelection } from '../../core/_api';
import { HighlightState } from '../help';
import { rangeContentInComponent } from './utils/range-content-in-component';

export class MediaMatcher implements Matcher {
  constructor(public componentConstructor: Constructor<LeafComponent>, public tagName: string,
              private excludeComponents: Array<Constructor<BranchComponent | DivisionComponent>> = []) {
  }

  queryState(selection: TBSelection, renderer: Renderer): SelectionMatchState {
    if (selection.rangeCount === 0) {
      return {
        srcStates: [],
        matchData: null,
        state: HighlightState.Normal
      }
    }

    for (const range of selection.ranges) {
      let isDisable = rangeContentInComponent(range, renderer, this.excludeComponents);
      if (isDisable) {
        return {
          state: HighlightState.Disabled,
          matchData: null,
          srcStates: []
        };
      }
    }

    const states: RangeMatchState<LeafComponent>[] = selection.ranges.map(range => {
      if (range.startFragment === range.endFragment && range.endIndex - range.startIndex === 1) {
        const content = range.startFragment.sliceContents(range.startIndex, range.endIndex);
        if (content[0] instanceof this.componentConstructor && content[0].tagName === this.tagName) {
          return {
            srcData: content[0],
            fromRange: range,
            state: HighlightState.Highlight
          };
        }
      }
      return {
        state: HighlightState.Normal,
        fromRange: range,
        srcData: null
      };
    });
    for (const s of states) {
      if (s.state !== HighlightState.Highlight) {
        return {
          state: HighlightState.Normal,
          srcStates: states,
          matchData: states[0]?.srcData
        }
      }
    }
    return {
      state: HighlightState.Highlight,
      srcStates: states,
      matchData: states[0]?.srcData
    }
  }
}
