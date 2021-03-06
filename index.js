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

      if (file.includes("PhotonUnityNetworking.Editor.csproj")) {
        content = content.replace(/<Compile.*\/>/g, "");
      }

      content = content.replace(/\/opt\/unity\/Editor\/Data\/Managed\/UnityEngine\/UnityEditor/g, "/github/workspace/SonarQube/UnityEditor/UnityEditor");
      content = content.replace(/\/opt\/unity\/Editor\/Data\/Managed\/UnityEngine/g, "/github/workspace/Library/PlayerDataCache/Win64/Data/Managed");
      content = content.replace(/\/opt\/unity\/Editor\/Data\/MonoBleedingEdge\/lib\/mono/g, "/github/workspace/SonarQube/mono");
      content = content.replace(/\/opt\/unity\/Editor\/Data\/PlaybackEngines/g, "/github/workspace/SonarQube/PlaybackEngines");
      content = content.replace(/<Csc.*>/g, "");
      content = content.replace(/<ReferenceOutputAssembly>false<\/ReferenceOutputAssembly>/g, "<ReferenceOutputAssembly>true</ReferenceOutputAssembly>");
      content = content.replace(/\/opt\/unity\/Editor\/Data\/Managed/g, "/github/workspace/SonarQube/UnityEditor");
      fs.writeFileSync('./' + file, content);
  });
} catch (error) {
  core.setFailed(error.message);
}