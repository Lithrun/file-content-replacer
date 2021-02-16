const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);

  fs.readdirSync('./').forEach(x => {
      console.log(x);
  });
  const files = fs.readdirSync('./').filter(x => x.includes('.csproj'));
  console.log('Files found: ' + files.length);

  files.forEach(file => {
      console.log('Attempting to overwrite: ' + file);
      let content = fs.readFileSync('./' + file, "utf8");
      content = content.replace(/\/opt\/unity\/Editor\/Data\/Managed\/UnityEngine/g, "/github/workspace/Library/PlayerDataCache/Win64/Data/Managed")
      fs.writeFileSync('./' + file, content);
  });
} catch (error) {
  core.setFailed(error.message);
}