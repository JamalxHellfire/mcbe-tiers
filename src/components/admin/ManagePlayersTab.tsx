
import React, { useState } from 'react';
import { Player } from '@/services/playerService';
import { useAdminPanel } from '@/hooks/useAdminPanel';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const ManagePlayersTab = () => {
  const {
    players,
    updatePlayer,
    deletePlayer,
    createPlayer,
    assignTiersBulk,
  } = useAdminPanel();
  const [newPlayer, setNewPlayer] = useState<Omit<Player, 'id' | 'overall_rank'>>({
    ign: '',
    region: 'NA',
    device: 'PC',
    global_points: 0,
    tier: 'Not Ranked'
  });
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handlePlayerEdit = (player: Player) => {
    setEditingPlayer(player);
    setShowEditDialog(true);
  };

  const handlePlayerSave = () => {
    if (editingPlayer) {
      updatePlayer(editingPlayer);
      setShowEditDialog(false);
      setEditingPlayer(null);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Player Management</h2>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Create New Player</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="ign-create">IGN</Label>
            <Input id="ign-create" type="text" value={newPlayer.ign} onChange={(e) => setNewPlayer({ ...newPlayer, ign: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="global_points-create">Global Points</Label>
            <Input id="global_points-create" type="number" value={newPlayer.global_points} onChange={(e) => setNewPlayer({ ...newPlayer, global_points: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="self-end">
            <Button onClick={() => createPlayer(newPlayer)} className="w-full">Create Player</Button>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Player List</h3>
        <div className="space-y-4">
          {players.map((player) => (
            <div key={player.id} className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
              <div>
                <h4 className="text-lg font-semibold">{player.ign}</h4>
                <p className="text-gray-400 text-sm">
                  {player.region} • {player.device} • {player.global_points} points
                  {player.tier && ` • ${player.tier}`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handlePlayerEdit(player)} variant="outline">Edit</Button>
                <Button onClick={() => deletePlayer(player.id)} variant="destructive">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 border border-gray-700 rounded-lg text-white">
          <DialogHeader>
            <DialogTitle>Edit Player</DialogTitle>
          </DialogHeader>
          {editingPlayer && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ign-edit" className="text-right">IGN</Label>
                <Input id="ign-edit" value={editingPlayer.ign} onChange={(e) => setEditingPlayer({ ...editingPlayer, ign: e.target.value })} className="col-span-3 bg-gray-900" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Region</Label>
                <div className="col-span-3">
                  <Select value={editingPlayer.region} onValueChange={(value) => setEditingPlayer({ ...editingPlayer, region: value as Player['region'] })}>
                    <SelectTrigger className="bg-gray-900"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NA">North America</SelectItem>
                      <SelectItem value="EU">Europe</SelectItem>
                      <SelectItem value="ASIA">Asia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Device</Label>
                <div className="col-span-3">
                  <Select value={editingPlayer.device} onValueChange={(value) => setEditingPlayer({ ...editingPlayer, device: value as Player['device'] })}>
                    <SelectTrigger className="bg-gray-900"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PC">PC</SelectItem>
                      <SelectItem value="Mobile">Mobile</SelectItem>
                      <SelectItem value="Console">Console</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="points-edit" className="text-right">Points</Label>
                <Input id="points-edit" type="number" value={editingPlayer.global_points} onChange={(e) => setEditingPlayer({ ...editingPlayer, global_points: parseInt(e.target.value) || 0 })} className="col-span-3 bg-gray-900" />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button onClick={() => setShowEditDialog(false)} variant="secondary">Cancel</Button>
            <Button onClick={handlePlayerSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagePlayersTab;
