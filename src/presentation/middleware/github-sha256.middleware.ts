import { NextFunction, Request, Response } from 'express';

export class GithubSha256Middleware {
  private static encoder = new TextEncoder();

  static async verifyGithubSignature(req: Request, res: Response, next: NextFunction) {
    const xHubSignature256 = req.headers['x-hub-signature-256'] as string;
    const body = JSON.stringify(req.body);
    const secret = process.env.SECRET_TOKEN as string;

    const isValid = await GithubSha256Middleware.verifySignature(secret, xHubSignature256, body);

    if (isValid) {
      next();
    } else {
      res.status(401).send('Unauthorized');
    }
  }

  private static async verifySignature(secret: string, header: string, payload: string) {
    try {
      const parts = header.split('=');

      if (parts.length !== 2 || !parts[1]) {
        return false;
      }

      const sigHex = parts[1];

      const algorithm = {
        name: 'HMAC',
        hash: { name: 'SHA-256' },
      };

      const keyBytes = GithubSha256Middleware.encoder.encode(secret);
      const extractable = false;

      const key = await crypto.subtle.importKey('raw', keyBytes, algorithm, extractable, ['sign', 'verify']);

      const sigBytes = GithubSha256Middleware.hexToBytes(sigHex);
      const dataBytes = GithubSha256Middleware.encoder.encode(payload);

      const equal = await crypto.subtle.verify(algorithm.name, key, sigBytes, dataBytes);

      return equal;
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  }

  private static hexToBytes(hex: string) {
    let len = hex.length / 2;
    let bytes = new Uint8Array(len);

    let index = 0;
    for (let i = 0; i < hex.length; i += 2) {
      let c = hex.slice(i, i + 2);
      let b = parseInt(c, 16);
      bytes[index] = b;
      index += 1;
    }

    return bytes;
  }
}
