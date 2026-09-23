//githubservices.ts

import { GithubStartPayload } from '../../interfaces/github-star.interface';
import { GithubIssuesPayload } from '../../interfaces/github-issues.interface';

export class GithubServices {
  constructor() {}

  onStart(payload: GithubStartPayload): string {
    const { action, sender, repository } = payload;

    return `User ${sender.login} ${action} starred the repository ${repository.full_name} `;
  }

  onIssues(payload: GithubIssuesPayload): string {
    const { action, issue, repository } = payload;

    if (issue.state === 'opened') {
      return `Issue ${issue.title} has been opened in the repository ${repository.full_name}`;
    }
    if (issue.state === 'closed') {
      return `Issue ${issue.title} has been closed in the repository ${repository.full_name}`;
    }

    if (issue.state === 'reopened') {
      return `Issue ${issue.title} has been reopened in the repository ${repository.full_name}`;
    }

    return `Issue ${issue.title} has been ${action} in the repository ${repository.full_name}`;
  }
}
