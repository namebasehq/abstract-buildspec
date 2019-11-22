AbstractBuildspec
==

Helps you create buildspec.yml files that inherit from each other.

## Usage

Create a buildspec.js file like this:

```javascript
const AbstractBuildspec = require('abstract-buildspec');

class Buildspec extends AbstractBuildspec {
  static version() {
    return '0.2';
  }

  static env() {
    return {
      variables: {
        AAA: 'a',
      },
      'parameter-store': {
        BBB: '/a/b',
        CCC: '/c/d',
      },
    };
  }

  static phases() {
    return {
      install: {
        commands: ['echo Installing dependencies...'],
        'runtime-versions': {
          nodejs: '10',
        },
      },
      pre_build: {
        commands: [
          'echo Setting something up...',
        ],
      },
      build: {
        commands: [
          'echo Building files...',
        ],
      },
      post_build: {
        commands: [
          'echo Cleaning up...',
        ],
      },
    };
  }

  static cache() {
    return {
      paths: ['folder'],
    };
  }

  static artifacts() {
    return {
      files: [
        "'item1'",
        "'item2'",
      ],
      'base-directory': "'.'",
      'discard-paths': 'no',
    };
  }
}
```

Then you can reuse it to generate a slightly different buildspec like this:

```javascript
class CustomBuildspec extends Buildspec {
  static phases() {
    const base = super.phases();
    const extraCommands = ['echo Migrating the database...'];
    base.post_build.commands = extraCommands.concat(base.post_build.commands);
    return base;
  }
}
```

Finally, you can emit the buildspecs to the filesystem by doing:

```javascript
Buildspec.emit('buildspec.yml');
CustomBuildspec.emit('buildspec-custom.yml');
```

## License

MIT License
