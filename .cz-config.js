module.exports = {
  types: [
    { value: ':sparkles: feat', name: 'feat ✨  A new feature' },
    { value: ':fire: delete', name: 'delete 🔥    Remove code or files' },
    { value: ':bug: fix', name: 'fix 🐛    A bug fix' },
    { value: ':memo: docs', name: 'docs 📝     Documentation only changes' },
    { value: ':art: style', name: 'style 🎨    Changes that do not affect the meaning of the code\n            (white-space, formatting, missing semi-colons, etc)' },
    { value: ':recycle: refactor', name: 'refactor ♻️  Refactoring Code' },
    { value: ':white_check_mark: test', name: 'test ✅    Adding unit tests or e2e test' },
    { value: ':zap: perf', name: 'perf ⚡️     A code change that improves performance' },
    { value: ':lock: security', name: 'security 🔒️      Fixing security issues' },
    { value: ':rocket: deploy', name: 'deploy 🚀   Deploying applications' },
    { value: ':package: build', name: 'build 📦️    Build process, external dependency changes (such as upgrading npm packages, modifying webpack configuration, etc.' },
    { value: ':construction_worker: ci', name: 'ci 👷       Modify CI configuration, scripts' },
    { value: ':green_heart: ci', name: 'ci 💚       Fix CI Build' },
    { value: ':wrench: chore', name: 'chore 🔧   Changes to the build process or auxiliary tools\n            and libraries such as documentation generation' },
    { value: ':revert: revert', name: 'revert ⏪️   Revert to a commit' },
    { value: ':construction: wip', name: 'wip 🚧      Work in progress' },
    { value: ':bricks: infra', name: 'infra 🧱    Infrastructure related changes' },
    { value: ':building_construction: arch', name: 'arch 🏗️     make Architectural changes' },
    { value: ':boom:', name: 'BREAKING CHANGES 💥    introduce breaking changes' },
    { value: ':arrow_up: deps', name: 'deps ⬆️	upgrade dependencies' },
    { value: ':arrow_down: deps', name: 'deps ⬇️	downgrade dependencies' },
    { value: ':push_pin: deps', name: 'deps 📌	pin dependencies' },
    { value: ':rocket: deploy', name: 'deploy 🚀  Deploy configuration' }
  ],
  scopes: [
    { name: 'marvin' },
    { name: 'django' },
    { name: 'prefect' },
    { name: 'users' },
    { name: 'core' },
    { name: 'config' },
    { name: 'db' },
  ],

  usePreparedCommit: false, // to re-use commit from ./.git/COMMIT_EDITMSG
  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: 'TICKET-',
  ticketNumberRegExp: '\\d{1,5}',

  // it needs to match the value for field type. Eg.: 'fix'
  /*
    scopeOverrides: {
      fix: [
  
        {name: 'merge'},
        {name: 'style'},
        {name: 'e2eTest'},
        {name: 'unitTest'}
      ]
    },
    */
  // override the messages, defaults are as follows
  messages: {
    type: "Select the type of change that you're committing:",
    scope: '\nDenote the SCOPE of this change (required):',
    // used if allowCustomScopes is true
    customScope: 'Denote the SCOPE of this change:',
    subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
    body: 'Provide a LONGER description of the change (required). Use "|" to break new line:\n',
    breaking: 'List any BREAKING CHANGES (optional):\n',
    footer:
      'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n',
    confirmCommit: 'Are you sure you want to proceed with the commit above?',
  },

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  // skip any questions you want
  // skipQuestions: ['scope', 'body'],

  // limit subject length
  subjectLimit: 100,
  // breaklineChar: '|', // It is supported for fields body and footer.
  // footerPrefix : 'ISSUES CLOSED:'
  // askForBreakingChangeFirst : true, // default is false
};
