import { envs } from '../../config/envs';

export class DiscordService {
  private readonly discordWebhookUrl: string = envs.DISCORD_WEBHOOK_URL;

  constructor() {}

  async notifyDiscord(message: string) {
    const body = {
      content: message,
      embeds: [
        {
          image: {
            url: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnFwaTUyYnhhaDJ6eHJ5N3A3YmY1dnhtOWsxZWU4Ymw3cTNodXNndSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/du3J3cXyzhj75IOgvA/giphy.gif',
          },
        },
      ],
    };

    const res = await fetch(this.discordWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error(`Failed to send message to Discord: ${res.status} ${res.statusText}`);

      return false;
    }

    return true;
  }
}
