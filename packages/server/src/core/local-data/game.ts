import { v4 } from 'uuid';
import { sign } from 'jsonwebtoken';
import { GameState } from '../../types';

export interface IPlayer {
  playerId: string;
  token: string;
  character: string;
  username: string;
}

export interface IGameObject {
  gameId: string;
  gameCode: string;
  players: IPlayer[];
  state: GameState;
}

const TOKENS_SECRET = 'sdf43tSWDG#%Tsdfw4';

export class GamesManager {
  private activeGames: Map<string, IGameObject> = new Map<string, IGameObject>();

  private generateGameCode(): string {
    const min = 1000;
    const max = 9999;
    let gameCode: string;

    do {
      gameCode = String(Math.floor(Math.random() * (max - min) + min));
    } while (this.activeGames.has(gameCode));

    return gameCode;
  }

  addPlayerToGame(gameId: string, character: string, username: string): IPlayer {
    const game = this.getGameById(gameId);
    const playerId = v4();
    const playerToken = sign({
      gameId: game.gameId,
      playerId,
      username,
    }, TOKENS_SECRET);

    const player: IPlayer = {
      playerId,
      character,
      token: playerToken,
      username,
    };

    game.players.push(player);

    return player;
  }

  createNewGame(): IGameObject {
    const gameId = v4();
    const gameCode = this.generateGameCode();

    const gameObject: IGameObject = {
      gameId,
      gameCode,
      players: [],
      state: 'WAITING',
    };

    this.activeGames.set(gameId, gameObject);

    return gameObject;
  }

  getGameById(id: string): IGameObject {
    if (this.activeGames.has(id)) {
      return this.activeGames.get(id);
    }

    throw new Error('Game does not exists');
  }

  getGameByCode(code: string): IGameObject {
    for (const [key, value] of this.activeGames.entries()) {
      if (value.gameCode === code) {
        return value;
      }
    }

    throw new Error('Game does not exists');
  }
}