import E from 'wangeditor';
import Vue from 'vue';
const { $, BtnMenu, DropListMenu, PanelMenu, DropList, Panel, Tooltip } = E;

export class AlertMenu extends BtnMenu {
  editor;
  constructor(editor) {
    const $elem = E.$(
      `<div class="w-e-menu" data-title="Alert">
                <div>
                <i class="w-e-icon-image"></i>
</div>
            </div>`
    );
    super($elem, editor);
    this.editor = editor;
  }
  clickHandler() {
    const editor = this.editor;
    const config = editor.config;
    const uploadFile = config.uploadFile;
    if (uploadFile && typeof uploadFile === 'function') {
      uploadFile();
    }
  }
  tryChangeActive() {
    this.active();
  }
}
