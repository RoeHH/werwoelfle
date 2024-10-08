import { Handlers } from "$fresh/server.ts";
import { changeRoleDistribution } from "../../../../../../utils/game.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    
    const {gameId, roleName} = ctx.params;

    await changeRoleDistribution(gameId, roleName);

    console.log('changeRoleDistribution', gameId, roleName);
    

    return new Response(null, {status: 200});
  },
};  