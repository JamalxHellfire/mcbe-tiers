import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Player, GameMode, TierLevel } from '@/services/playerService';
import { useToast } from '@/hooks/use-toast';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useAdminPanel } from '@/hooks/useAdminPanel';

const AdminPanel = () => {
  const {
    players,
    fetchPlayers,
    updatePlayer,
    deletePlayer,
    createPlayer,
    assignTiersBulk,
    loading,
  } = useAdminPanel();
  const [activeTab, setActiveTab] = useState<'players' | 'tiers' | 'news'>('players');
  const [newPlayer, setNewPlayer] = useState<Omit<Player, 'id' | 'overall_rank'>>({
    ign: '',
    region: 'NA',
    device: 'PC',
    global_points: 0,
    tier: 'Not Ranked'
  });
  const [bulkTierAssignment, setBulkTierAssignment] = useState({
    gamemode: 'Crystal' as GameMode,
    tier: 'Not Ranked' as TierLevel,
    points: 0,
    playerIds: [] as string[],
  });
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handlePlayerEdit = (player: Player) => {
    setEditingPlayer(player);
    setShowEditDialog(true);
  };

  const handlePlayerSave = (updatedPlayer: Player) => {
    updatePlayer(updatedPlayer);
    setShowEditDialog(false);
    setEditingPlayer(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-6">
        <h1 className="text-3xl font-bold text-center">Admin Panel</h1>
        <p className="text-gray-400 text-center">Manage players, tiers, and news.</p>
      </header>
      
      <nav className="bg-gray-700 p-4">
        <Tabs defaultValue="players" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="players" onClick={() => setActiveTab('players')}>Players</TabsTrigger>
            <TabsTrigger value="tiers" onClick={() => setActiveTab('tiers')}>Tiers</TabsTrigger>
            {/* <TabsTrigger value="news" onClick={() => setActiveTab('news')}>News</TabsTrigger> */}
          </TabsList>
          <TabsContent value="players">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Player Management</h2>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Create New Player</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ign">IGN</Label>
                    <Input
                      type="text"
                      id="ign"
                      value={newPlayer.ign}
                      onChange={(e) => setNewPlayer({ ...newPlayer, ign: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="region">Region</Label>
                    <Select onValueChange={(value) => setNewPlayer({ ...newPlayer, region: value as Player['region'] })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NA">North America</SelectItem>
                        <SelectItem value="EU">Europe</SelectItem>
                        <SelectItem value="ASIA">Asia</SelectItem>
                        <SelectItem value="SA">South America</SelectItem>
                        <SelectItem value="AF">Africa</SelectItem>
                        <SelectItem value="OCE">Oceania</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="device">Device</Label>
                    <Select onValueChange={(value) => setNewPlayer({ ...newPlayer, device: value as Player['device'] })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a device" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PC">PC</SelectItem>
                        <SelectItem value="Mobile">Mobile</SelectItem>
                        <SelectItem value="Console">Console</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="global_points">Global Points</Label>
                    <Input
                      type="number"
                      id="global_points"
                      value={newPlayer.global_points.toString()}
                      onChange={(e) => setNewPlayer({ ...newPlayer, global_points: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tier">Tier</Label>
                    <Select onValueChange={(value) => setNewPlayer({ ...newPlayer, tier: value as Player['tier'] })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HT1">HT1</SelectItem>
                        <SelectItem value="LT1">LT1</SelectItem>
                        <SelectItem value="HT2">HT2</SelectItem>
                        <SelectItem value="LT2">LT2</SelectItem>
                        <SelectItem value="HT3">HT3</SelectItem>
                        <SelectItem value="LT3">LT3</SelectItem>
                        <SelectItem value="HT4">HT4</SelectItem>
                        <SelectItem value="LT4">LT4</SelectItem>
                        <SelectItem value="HT5">HT5</SelectItem>
                        <SelectItem value="LT5">LT5</SelectItem>
                        <SelectItem value="Retired">Retired</SelectItem>
                        <SelectItem value="Not Ranked">Not Ranked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={() => createPlayer(newPlayer)}>Create Player</Button>
              </div>
              
              {players.map((player) => (
                <div key={player.id} className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{player.ign}</h3>
                      <p className="text-gray-400">
                        {player.region} • {player.device} • {player.global_points} points
                        {player.tier && ` • ${player.tier}`}
                      </p>
                    </div>
                    <button
                      onClick={() => handlePlayerEdit(player)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="tiers">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Bulk Tier Assignment</h2>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Assign Tiers to Multiple Players</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gamemode">Gamemode</Label>
                    <Select onValueChange={(value) => setBulkTierAssignment({ ...bulkTierAssignment, gamemode: value as GameMode })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a gamemode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Crystal">Crystal</SelectItem>
                        <SelectItem value="Sword">Sword</SelectItem>
                        <SelectItem value="Mace">Mace</SelectItem>
                        <SelectItem value="Axe">Axe</SelectItem>
                        <SelectItem value="SMP">SMP</SelectItem>
                        <SelectItem value="UHC">UHC</SelectItem>
                        <SelectItem value="NethPot">NethPot</SelectItem>
                        <SelectItem value="Bedwars">Bedwars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tier">Tier</Label>
                    <Select onValueChange={(value) => setBulkTierAssignment({ ...bulkTierAssignment, tier: value as TierLevel })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HT1">HT1</SelectItem>
                        <SelectItem value="LT1">LT1</SelectItem>
                        <SelectItem value="HT2">HT2</SelectItem>
                        <SelectItem value="LT2">LT2</SelectItem>
                        <SelectItem value="HT3">HT3</SelectItem>
                        <SelectItem value="LT3">LT3</SelectItem>
                        <SelectItem value="HT4">HT4</SelectItem>
                        <SelectItem value="LT4">LT4</SelectItem>
                        <SelectItem value="HT5">HT5</SelectItem>
                        <SelectItem value="LT5">LT5</SelectItem>
                        <SelectItem value="Retired">Retired</SelectItem>
                        <SelectItem value="Not Ranked">Not Ranked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="points">Points</Label>
                    <Input
                      type="number"
                      id="points"
                      value={bulkTierAssignment.points.toString()}
                      onChange={(e) => setBulkTierAssignment({ ...bulkTierAssignment, points: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-lg font-semibold">Select Players</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {players.map((player) => (
                      <div key={player.id} className="flex items-center">
                        <Checkbox
                          id={`player-${player.id}`}
                          checked={selectedPlayerIds.includes(player.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedPlayerIds([...selectedPlayerIds, player.id]);
                            } else {
                              setSelectedPlayerIds(selectedPlayerIds.filter(id => id !== player.id));
                            }
                          }}
                        />
                        <Label htmlFor={`player-${player.id}`} className="ml-2">{player.ign}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button
                  onClick={() => assignTiersBulk(selectedPlayerIds, bulkTierAssignment.gamemode, bulkTierAssignment.tier, bulkTierAssignment.points)}
                  disabled={selectedPlayerIds.length === 0}
                >
                  Assign Tiers to Selected Players
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </nav>

      <Dialog open={showEditDialog} onOpenChange={() => setShowEditDialog(false)}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 border border-gray-700 rounded-lg">
          <DialogHeader>
            <DialogTitle>Edit Player</DialogTitle>
          </DialogHeader>
          {editingPlayer && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ign" className="text-right">
                  IGN
                </Label>
                <Input
                  type="text"
                  id="ign"
                  value={editingPlayer.ign}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, ign: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="region" className="text-right">
                  Region
                </Label>
                <Select onValueChange={(value) => setEditingPlayer({ ...editingPlayer, region: value as Player['region'] })}>
                  <SelectTrigger className="w-full col-span-3">
                    <SelectValue placeholder={editingPlayer.region} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NA">North America</SelectItem>
                    <SelectItem value="EU">Europe</SelectItem>
                    <SelectItem value="ASIA">Asia</SelectItem>
                    <SelectItem value="SA">South America</SelectItem>
                    <SelectItem value="AF">Africa</SelectItem>
                    <SelectItem value="OCE">Oceania</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="device" className="text-right">
                  Device
                </Label>
                <Select onValueChange={(value) => setEditingPlayer({ ...editingPlayer, device: value as Player['device'] })}>
                  <SelectTrigger className="w-full col-span-3">
                    <SelectValue placeholder={editingPlayer.device} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PC">PC</SelectItem>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                    <SelectItem value="Console">Console</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="global_points" className="text-right">
                  Global Points
                </Label>
                <Input
                  type="number"
                  id="global_points"
                  value={editingPlayer.global_points.toString()}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, global_points: parseInt(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tier" className="text-right">
                  Tier
                </Label>
                <Select onValueChange={(value) => setEditingPlayer({ ...editingPlayer, tier: value as Player['tier'] })}>
                  <SelectTrigger className="w-full col-span-3">
                    <SelectValue placeholder={editingPlayer.tier || "Not Ranked"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HT1">HT1</SelectItem>
                    <SelectItem value="LT1">LT1</SelectItem>
                    <SelectItem value="HT2">HT2</SelectItem>
                    <SelectItem value="LT2">LT2</SelectItem>
                    <SelectItem value="HT3">HT3</SelectItem>
                    <SelectItem value="LT3">LT3</SelectItem>
                    <SelectItem value="HT4">HT4</SelectItem>
                    <SelectItem value="LT4">LT4</SelectItem>
                    <SelectItem value="HT5">HT5</SelectItem>
                    <SelectItem value="LT5">LT5</SelectItem>
                    <SelectItem value="Retired">Retired</SelectItem>
                    <SelectItem value="Not Ranked">Not Ranked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button onClick={() => setShowEditDialog(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={() => handlePlayerSave(editingPlayer)} className="ml-2">
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
