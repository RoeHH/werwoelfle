const kv = await Deno.openKv();

export interface Distribution {
  werwolf: number;
  dorfbewohner: number;
  hexe: number;
  seherin: number;
}

export interface Game {
  players: Player[];
  distribution: Distribution;
}

export interface Player {
  id: string;
  name: string;
  role: 'game-master' | 'player';
  playerRole?: 'werwolf' | 'dorfbewohner' | 'hexe' | 'seherin';
}

export const registerPlayer = async (gameId: string, playerName: string) => {
  const game = await kv.get(['game', gameId]);
  
  if (!game.value) {
    return;
  }

  const player: Player = {
    id: crypto.randomUUID(),
    name: playerName,
    role: "player",
  };

  game.value.players.push(player.id);
  game.value.distribution.dorfbewohner += 1;  

  await kv.set(['game', gameId], game.value);
  await kv.set(['player', player.id], player);

  console.log(player, "player registered 1");
  
  return player;
}

export const createGame = async () => {
  const gameId = crypto.randomUUID().split('-')[0];
  const gameMaster: Player = {
    id: crypto.randomUUID(),
    name: 'Game Master',
    role: "game-master",
  };
  console.log(gameId, "new game created", gameMaster);

  await kv.set(['game', gameId], {players: [gameMaster.id], distribution: {werwolf: 0, dorfbewohner: 0, hexe: 0, seherin: 0}});
  await kv.set(['player', gameMaster.id], gameMaster);
  return {gameId, gameMaster};
}

export const getGame = async (gameId: string) => {
  const game = await kv.get(['game', gameId]);
  return game.value as Game;
}

export const getPlayer = async (playerId: string) => {
  const game = await kv.get(['player', playerId]);
  return game.value as Player;
}

export const startGame = async (gameId: string) => {
  const game = await kv.get(['game', gameId]);
  const players = game.value.players;
  console.log(game, players.length, "player start 1");
  
  const roles = getShuffledRoleArrayFromDistribution(game.value.distribution);
  console.log(roles, "player start 1.1");
  
  
  for (const [i, playerId] of players.entries()) {
    console.log(playerId, "player start 1.5");
    
    const player = await kv.get(['player', playerId]);
    console.log(player.value, "player start 2");
    
    if(player.value.role === 'game-master') {
      continue;
    }
    player.value.playerRole = roles[i-1];
    await kv.set(['player', playerId], player.value);
  }
}

export const endGame = async (gameId: string) => {
  const game = await kv.get(['game', gameId]);
  const players = game.value.players;
  for (const playerId of players) {
    const player = (await kv.get(['player', playerId])).value;

    await kv.set(['player', playerId], {id: player.id, name: player.name, role: player.role});
  }
}

export const changeRoleDistribution = async (gameId: string, role: keyof Distribution) => {
  const game = await kv.get(['game', gameId]);
  switch (role) {
    case 'werwolf':
      if(game.value.distribution.dorfbewohner === 0) {
        break;
      }
      game.value.distribution.werwolf += 1;
      game.value.distribution.dorfbewohner -= 1;
      break;
    case 'dorfbewohner':
        if(game.value.distribution.werwolf === 0) {
          break;
        }
        game.value.distribution.werwolf -= 1;
        game.value.distribution.dorfbewohner += 1;
        break;
    case 'hexe':
      if(game.value.distribution.hexe === 0) {
        game.value.distribution.hexe += 1;
        if(game.value.distribution.dorfbewohner === 0) {
          game.value.distribution.werwolf -= 1;
        } else {
          game.value.distribution.dorfbewohner -= 1;
        }
      } else {
        game.value.distribution.hexe -= 1;
        game.value.distribution.dorfbewohner += 1;
      }
      break;
    case 'seherin':
      if(game.value.distribution.seherin === 0) {
        game.value.distribution.seherin += 1;
        if(game.value.distribution.dorfbewohner === 0) {
          game.value.distribution.werwolf -= 1;
        } else {
          game.value.distribution.dorfbewohner -= 1;
        }
      } else {
        game.value.distribution.seherin -= 1;
        game.value.distribution.dorfbewohner += 1;
      }
      break;
  }
  await kv.set(['game', gameId], game.value);
}

function getShuffledRoleArrayFromDistribution(distribution: Distribution){
  const roles = [];
  for (const key in distribution) {
    console.log(key, distribution[key as keyof Distribution], "getShuffledRoleArrayFromDistribution 1");
    for (let i = 0; i < distribution[key as keyof Distribution]; i++) {
      roles.push(key);
    }
    
  }
  return roles.sort(() => Math.random() - 0.5);
}