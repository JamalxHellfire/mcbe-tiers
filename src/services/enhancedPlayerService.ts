
import { playerService, Player, GameMode, TierLevel, PlayerRegion, DeviceType } from './playerService';
import { deepSeekService } from './deepSeekService';

class EnhancedPlayerService {
  async createPlayer(params: {
    ign: string;
    java_username?: string;
    region?: PlayerRegion;
    device?: DeviceType;
  }): Promise<Player | null> {
    try {
      deepSeekService.logApiCall('POST', 'players', params);
      const result = await playerService.createPlayer(params);
      deepSeekService.logApiCall('POST', 'players', params, result);
      return result;
    } catch (error) {
      deepSeekService.logError(error, { operation: 'createPlayer', params });
      throw error;
    }
  }

  async getPlayerByIGN(ign: string): Promise<Player | null> {
    try {
      deepSeekService.logApiCall('GET', `players/ign/${ign}`);
      const result = await playerService.getPlayerByIGN(ign);
      deepSeekService.logApiCall('GET', `players/ign/${ign}`, undefined, result);
      return result;
    } catch (error) {
      deepSeekService.logError(error, { operation: 'getPlayerByIGN', ign });
      throw error;
    }
  }

  async assignTier(tierData: {
    playerId: string;
    gamemode: GameMode;
    tier: TierLevel;
  }): Promise<boolean> {
    try {
      deepSeekService.logApiCall('POST', 'gamemode_scores', tierData);
      const result = await playerService.assignTier(tierData);
      deepSeekService.logApiCall('POST', 'gamemode_scores', tierData, result);
      return result;
    } catch (error) {
      deepSeekService.logError(error, { operation: 'assignTier', tierData });
      throw error;
    }
  }

  async updatePlayer(
    playerId: string,
    params: {
      java_username?: string;
      region?: PlayerRegion;
      device?: DeviceType;
    }
  ): Promise<boolean> {
    try {
      deepSeekService.logApiCall('PUT', `players/${playerId}`, params);
      const result = await playerService.updatePlayer(playerId, params);
      deepSeekService.logApiCall('PUT', `players/${playerId}`, params, result);
      return result;
    } catch (error) {
      deepSeekService.logError(error, { operation: 'updatePlayer', playerId, params });
      throw error;
    }
  }

  async getRankedPlayers(): Promise<Player[]> {
    try {
      deepSeekService.logApiCall('GET', 'players/ranked');
      const result = await playerService.getRankedPlayers();
      deepSeekService.logApiCall('GET', 'players/ranked', undefined, { count: result.length });
      return result;
    } catch (error) {
      deepSeekService.logError(error, { operation: 'getRankedPlayers' });
      throw error;
    }
  }

  // Delegate all other methods to the original service
  getPlayerById = playerService.getPlayerById;
  getPlayerTiers = playerService.getPlayerTiers;
  deletePlayer = playerService.deletePlayer;
  banPlayer = playerService.banPlayer;
  calculateTierPoints = playerService.calculateTierPoints;
  getPlayersByTierAndGamemode = playerService.getPlayersByTierAndGamemode;
}

export const enhancedPlayerService = new EnhancedPlayerService();
