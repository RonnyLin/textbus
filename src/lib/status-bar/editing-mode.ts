import { Observable, Subject } from 'rxjs';

export class EditingMode {
  onChange: Observable<boolean>;
  elementRef = document.createElement('button');

  set sourceCode(b: boolean) {
    this._sourceCode = b;
    this.icon.className = b ? 'textbus-icon-quill' : 'textbus-icon-code';
    this.elementRef.title = b ? '切换为富文本编辑模式' : '切换为源代码编辑模式';
  }

  get sourceCode() {
    return this._sourceCode;
  }

  private _sourceCode = false;
  private icon = document.createElement('span');
  private changeEvent = new Subject<boolean>();

  constructor() {
    this.onChange = this.changeEvent.asObservable();
    this.elementRef.type = 'button';
    this.elementRef.title = '切换为源代码编辑模式';
    this.elementRef.className = 'textbus-editing-mode';
    this.icon.className = 'textbus-icon-code';
    this.elementRef.appendChild(this.icon);
    this.elementRef.addEventListener('click', () => {
      this.sourceCode = !this.sourceCode;
      this.changeEvent.next(this.sourceCode);
    });
  }
}
