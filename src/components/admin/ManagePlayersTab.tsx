
import React, { useState } from 'react';
import { Player, GameMode, TierLevel } from '@/services/playerService';
import { useAdminPanel } from '@/hooks/useAdminPanel';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GAMEMODES, TIER_LEVELS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ManagePlayersTab = () => {
  const {
    players,
    updatePlayer,
    deletePlayer,
    createPlayer,
    fetchPlayerScores,
    updatePlayerScores,
  } = useAdminPanel();
  const [newPlayer, setNewPlayer] = useState<Omit<Player, 'id' | 'overall_rank'>>({
    ign: '',
    region: 'NA',
    device: 'PC',
    global_points: 0,
    tier: 'Not Ranked'
  });
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editingPlayerTiers, setEditingPlayerTiers] = useState<Record<GameMode, TierLevel> | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handlePlayerEdit = async (player: Player) => {
    setEditingPlayer(player);
    const scores = await fetchPlayerScores(player.id);
    const initialTiers = GAMEMODES.reduce((acc, gm) => ({ ...acc, [gm.name]: 'Not Ranked' }), {} as Record<GameMode, TierLevel>);
    setEditingPlayerTiers({ ...initialTiers, ...scores });
    setShowEditDialog(true);
  };

  const handlePlayerSave = () => {
    if (editingPlayer && editingPlayerTiers) {
      updatePlayer(editingPlayer);
      updatePlayerScores(editingPlayer.id, editingPlayerTiers);
      setShowEditDialog(false);
      setEditingPlayer(null);
      setEditingPlayerTiers(null);
    }
  };

  const handleTierChange = (gamemode: GameMode, tier: TierLevel) => {
    if (editingPlayerTiers) {
      setEditingPlayerTiers(prev => ({
        ...prev!,
        [gamemode]: tier,
      }));
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Create New Player</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <Label htmlFor="ign-create" className="text-gray-300">IGN</Label>
              <Input id="ign-create" type="text" value={newPlayer.ign} onChange={(e) => setNewPlayer({ ...newPlayer, ign: e.target.value })} className="mt-1 bg-gray-900 border-gray-600"/>
            </div>
            <div>
              <Label htmlFor="global_points-create" className="text-gray-300">Global Points</Label>
              <Input id="global_points-create" type="number" value={newPlayer.global_points} onChange={(e) => setNewPlayer({ ...newPlayer, global_points: parseInt(e.target.value) || 0 })} className="mt-1 bg-gray-900 border-gray-600" />
            </div>
            <div className="md:col-span-2">
              <Button onClick={() => createPlayer(newPlayer)} className="w-full bg-white text-black hover:bg-gray-200">Create Player</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Player List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-700/50">
                <TableHead className="text-white">IGN</TableHead>
                <TableHead className="text-white">Region</TableHead>
                <TableHead className="text-white">Device</TableHead>
                <TableHead className="text-white">Global Points</TableHead>
                <TableHead className="text-right text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((player) => (
                <TableRow key={player.id} className="border-gray-700 hover:bg-gray-700/50">
                  <TableCell className="font-medium">{player.ign}</TableCell>
                  <TableCell>{player.region}</TableCell>
                  <TableCell>{player.device}</TableCell>
                  <TableCell>{player.global_points}</TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => handlePlayerEdit(player)} variant="outline" size="sm" className="bg-gray-700 border-gray-600 hover:bg-gray-600">Edit</Button>
                    <Button onClick={() => deletePlayer(player.id)} variant="destructive" size="sm" className="ml-2">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-3xl bg-gray-800 border border-gray-700 rounded-lg text-white">
          <DialogHeader>
            <DialogTitle>Edit Player: {editingPlayer?.ign}</DialogTitle>
            <DialogDescription className="text-gray-400">
              Edit player details and their tier rankings across different gamemodes.
            </DialogDescription>
          </DialogHeader>
          {editingPlayer && (
            <div className="grid grid-cols-4 gap-6 py-4">
              <div className="col-span-4 md:col-span-2 grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ign-edit" className="text-right">IGN</Label>
                  <Input id="ign-edit" value={editingPlayer.ign} onChange={(e) => setEditingPlayer({ ...editingPlayer, ign: e.target.value })} className="col-span-3 bg-gray-900 border-gray-600" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Region</Label>
                  <div className="col-span-3">
                    <Select value={editingPlayer.region} onValueChange={(value) => setEditingPlayer({ ...editingPlayer, region: value as Player['region'] })}>
                      <SelectTrigger className="bg-gray-900 border-gray-600"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="NA">NA</SelectItem><SelectItem value="EU">EU</SelectItem><SelectItem value="ASIA">ASIA</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Device</Label>
                  <div className="col-span-3">
                    <Select value={editingPlayer.device} onValueChange={(value) => setEditingPlayer({ ...editingPlayer, device: value as Player['device'] })}>
                      <SelectTrigger className="bg-gray-900 border-gray-600"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="PC">PC</SelectItem><SelectItem value="Mobile">Mobile</SelectItem><SelectItem value="Console">Console</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="points-edit" className="text-right">Points</Label>
                  <Input id="points-edit" type="number" value={editingPlayer.global_points} onChange={(e) => setEditingPlayer({ ...editingPlayer, global_points: parseInt(e.target.value) || 0 })} className="col-span-3 bg-gray-900 border-gray-600" />
                </div>
              </div>
              <div className="col-span-4 md:col-span-2">
                <h4 className="font-semibold text-center mb-4">Tier Rankings</h4>
                <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto pr-2">
                  {GAMEMODES.map(({ name, icon: Icon }) => (
                    <div key={name}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4 text-gray-400" />
                        <Label className="font-semibold">{name}</Label>
                      </div>
                      <Select value={editingPlayerTiers?.[name] || 'Not Ranked'} onValueChange={value => handleTierChange(name, value as TierLevel)}>
                        <SelectTrigger className="bg-gray-900 border-gray-600 text-white"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {TIER_LEVELS.map(tier => <SelectItem key={tier} value={tier}>{tier}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
            <Button onClick={() => setShowEditDialog(false)} variant="secondary">Cancel</Button>
            <Button onClick={handlePlayerSave} className="bg-white text-black hover:bg-gray-200">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagePlayersTab;
