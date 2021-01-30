import * as path from "path";
import * as tmrm from "azure-pipelines-task-lib/mock-run";

import { setVariable, mockTfsApi } from "./_helpers";

const TEAM_PROJECT_ID = "project";
const TARGET_BRANCH = "develop";
const ACCESS_TOKEN = "access_token";
const DEFINITION_ID = "500";

const tmr = new tmrm.TaskMockRunner(path.join(__dirname, "..", "index.js"));

setVariable("System.TeamProjectId", TEAM_PROJECT_ID);
setVariable("System.TeamFoundationCollectionUri", "https://dev.azure.com/orga");
setVariable("System.AccessToken", ACCESS_TOKEN);
setVariable("System.DefinitionId", DEFINITION_ID);
setVariable("System.PullRequest.TargetBranch", TARGET_BRANCH);

tmr.setInput("rules", "**");
tmr.setInput("variable", "HasChanged");
tmr.setInput("isOutput", "true");
tmr.setInput("verbose", "true");

tmr.setAnswers({
    which: {
        "git": "/bin/git"
    },
    exist: {
        "/bin/git": true
    },
    checkPath: {
        "/bin/git": true
    },
    exec: {
        "/bin/git fetch origin develop": { code: 0 },
        "/bin/git cat-file -t develop": { code: 0 },
        "/bin/git diff --name-only HEAD develop .": {
            code: 0,
            stdout: "src/file1.ts\nsrc/file2.ts\ndocs/index.md"
        }
    },
});

mockTfsApi();

tmr.run();

