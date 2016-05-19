import Message from './message';
import { messageField } from './helpers';

// jsdoc-ignore-start
@messageField(['_lctext', '_lcattrs'])
// jsdoc-ignore-end
export default class TypedMessage extends Message {
  /**
   * 所有内置的富媒体消息均继承自本类
   * @extends Message
   */
  constructor() {
    super();
    this._ = {};
  }

  /**
   * @type {Number}
   * @readonly
   */
  get type() {
    return this.constructor.TYPE;
  }

  /** @type {String} */
  set text(text) {
    return this.setText(text);
  }
  get text() {
    return this.getText();
  }

  /** @type {Object} */
  set attributes(attributes) {
    return this.setAttributes(attributes);
  }
  get attributes() {
    return this.getAttributes();
  }

  /**
   * @param {String} text
   * @return {TypedMessage} self
   */
  setText(text) {
    this._lctext = text;
    return this;
  }
  /**
   * @return {String}
   */
  getText() {
    return this._lctext;
  }

  /**
   * @param {Object} attributes
   * @return {TypedMessage} self
   */
  setAttributes(attributes) {
    this._lcattrs = attributes;
    return this;
  }
  /**
   * @return {Object}
   */
  getAttributes() {
    return this._lcattrs;
  }

  _getCustomFields() {
    const fields = Array.isArray(this.constructor._customFields)
      ? this.constructor._customFields : [];
    return fields.reduce((result, field) => {
      if (typeof field !== 'string') return result;
      result[field] = this[field]; // eslint-disable-line no-param-reassign
      return result;
    }, {});
  }

  _getType() {
    throw new Error('not implemented');
  }

  toJSON() {
    return Object.assign({
      _lctext: this.getText(),
      _lcattrs: this.getAttributes(),
    }, this._getCustomFields(), this._getType());
  }

  /**
   * 解析处理消息内容
   * <pre>
   * 为给定的 message 设置 text 与 attributes 属性，返回该 message
   * 如果子类没有提供 message，new this()
   * @protected
   * @param  {Object}  json    json 格式的消息内容
   * @param  {TypedMessage} message 子类提供的 message
   * @return {TypedMessage}
   * @implements AVMessage.parse
   */
  static parse(json, message = new this()) {
    message.content = json; // eslint-disable-line no-param-reassign
    let fields = Array.isArray(message.constructor._customFields)
      ? message.constructor._customFields : [];
    fields = fields.reduce((result, field) => {
      if (typeof field !== 'string') return result;
      result[field] = json[field]; // eslint-disable-line no-param-reassign
      return result;
    }, {});
    Object.assign(message, fields);
    return super.parse(json, message);
  }
}
