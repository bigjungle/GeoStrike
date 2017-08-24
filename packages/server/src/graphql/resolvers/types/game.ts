import { IGameObject } from '../../../core/local-data/game';

const resolvers = {
  Game: {
    id: (game: IGameObject) => game.gameId,
    gameCode: (game: IGameObject) => game.gameCode,
    players: (game: IGameObject) => game.players,
    state: (game: IGameObject) => game.state,
  },
  CreateOrJoinResult: {
    game: result => result.game,
    player: result => result.player,
    playerToken: result => result.player.token,
  },
};

export default resolvers;