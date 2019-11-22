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
      return data.map(row => `\n${indent}- ${row}`).join('');
    }

    if (typeof data === 'object') {
      return Object.keys(data)
        .map(heading => {
          const child = this.format(data[heading], depth + 1);
          return `\n${indent}${heading}:${child}`;
        })
        .join('');
    }

    return ` ${data}`;
  }

  static formatBuildspec() {
    const version = 'version:' + this.format(this.version());
    const env = 'env:' + this.format(this.env());
    const phases = 'phases:' + this.format(this.phases());
    const cache = 'cache:' + this.format(this.cache());
    const artifacts = 'artifacts:' + this.format(this.artifacts());
    return `${version}\n${env}\n${phases}\n${cache}\n${artifacts}`;
  }

  static emit(fileName) {
    return fs.writeFileSync(fileName, this.formatBuildspec());
  }
};
