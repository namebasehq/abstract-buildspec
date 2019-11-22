const fs = require('fs');

module.exports = class AbstractBuildspec {
  constructor() {
    if (new.target === AbstractBuildspec) {
      throw new Error('Abstract.');
    }
  }

  static getIndent(depth) {
    return '  '.repeat(depth);
  }

  static format(data, depth = 1) {
    const indent = this.getIndent(depth);

    if (Array.isArray(data)) {
      if (data.length > 0) {
        return data.map(row => `\n${indent}- ${row}`).join('');
      } else {
        return '';
      }
    }

    if (typeof data === 'object') {
      return Object.keys(data)
        .map(heading => {
          const child = this.format(data[heading], depth + 1);
          if (child) {
            return `\n${indent}${heading}:${child}`;
          } else {
            return '';
          }
        })
        .join('');
    }

    return ` ${data}`;
  }

  static formatBuildspec() {
    return this.format({
      'version': this.version(),
      'env': this.env(),
      'phases': this.phases(),
      'cache': this.cache(),
      'artifacts': this.artifacts(),
    }, 0).trim();
  }

  static emit(fileName) {
    return fs.writeFileSync(fileName, this.formatBuildspec());
  }
};
