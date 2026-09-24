import { Request, Response } from 'express';
import { DiscordService } from '../services/discord.service';
import { GithubServices } from '../services/github.services';

export class GithubController {
  //injecting the GithubServices class into the controller
  constructor(
    private readonly githubServices = new GithubServices(),
    private readonly discordService = new DiscordService(),
  ) {}

  webhookHandler = (req: Request, res: Response) => {
    // Handle GitHub webhook payload here

    const githubEvent = req.header('x-github-event') ?? 'unknown';
    const signature = req.header('x-hub-signature-256') ?? 'unknown';
    const payload = req.body;
    let message: string;

    switch (githubEvent) {
      case 'issues':
        message = this.githubServices.onIssues(payload);
        // Handle issues event
        break;
      case 'star':
        message = this.githubServices.onStart(payload);
        // Handle star event
        break;
      default:
        message = `Unhandled GitHub event: ${githubEvent}`;
    }

    this.discordService
      .notifyDiscord(message)
      .then(() => {
        res.status(200).send('Webhook received and processed');
      })
      .catch(() => {
        res.status(500).send('Failed to process webhook');
      });
  };
}
