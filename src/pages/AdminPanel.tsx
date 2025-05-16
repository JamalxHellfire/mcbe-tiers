import React, { useState, useEffect } from 'react';
import { useAdminPanel } from '@/hooks/useAdminPanel';
import { playerService, PlayerRegion, DeviceType, GameMode, TierLevel } from '@/services/playerService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Edit, Trash2, Ban } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { NewsArticleCard } from '@/components/NewsArticleCard';

const AdminPanel = () => {
  const {
    isAdminMode,
    pinInputValue,
    setPinInputValue,
    isSubmitting,
    handlePinSubmit,
    handleLogout,
    submitPlayerResult,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    selectedPlayer,
    setSelectedPlayer,
    loadPlayerDetails,
    clearSelectedPlayer,
    updatePlayer,
    updatePlayerTier,
    deletePlayer,
    banPlayer
  } = useAdminPanel();
  
  // Local state for player submission form
  const [ign, setIgn] = useState('');
  const [javaUsername, setJavaUsername] = useState('');
  const [device, setDevice] = useState<DeviceType | undefined>(undefined);
  const [region, setRegion] = useState<PlayerRegion | undefined>(undefined);
  const [gamemode, setGamemode] = useState<GameMode>('Bedwars');
  const [tier, setTier] = useState<TierLevel | "NA">('NA');
  
  // Local state for player update form
  const [updateJavaUsername, setUpdateJavaUsername] = useState('');
  const [updateRegion, setUpdateRegion] = useState<PlayerRegion | undefined>(undefined);
  const [updateDevice, setUpdateDevice] = useState<DeviceType | undefined>(undefined);
  const [updateGamemodeTier, setUpdateGamemodeTier] = useState<TierLevel>('Tier1');
  const [updateGamemode, setUpdateGamemode] = useState<GameMode>('Bedwars');
  
  // Local state for news article dialog
  const [openNewsArticleDialog, setOpenNewsArticleDialog] = useState(false);
  const [newsArticleTitle, setNewsArticleTitle] = useState('');
  const [newsArticleContent, setNewsArticleContent] = useState('');
  const [newsArticleAuthor, setNewsArticleAuthor] = useState('');
  const [newsArticleTags, setNewsArticleTags] = useState('');
  
  // Local state for news articles
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  
  // Local state for edit mode
  const [editMode, setEditMode] = useState(false);
  
  // Reset selected player on unmount
  useEffect(() => {
    return () => {
      clearSelectedPlayer();
    };
  }, [clearSelectedPlayer]);
  
  // Handle player submission
  const handlePlayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await submitPlayerResult(
        ign,
        javaUsername,
        device,
        region,
        gamemode,
        tier
      );
      
      // Clear the form
      setIgn('');
      setJavaUsername('');
      setDevice(undefined);
      setRegion(undefined);
      setGamemode('Bedwars');
      setTier('NA');
    } catch (error) {
      console.error('Failed to submit player:', error);
      toast.error('Failed to submit player');
    }
  };
  
  // Handle player update
  const handlePlayerUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlayer) {
      toast.error('No player selected');
      return;
    }
    
    try {
      await updatePlayer(
        selectedPlayer.id,
        updateJavaUsername,
        updateRegion,
        updateDevice
      );
    } catch (error) {
      console.error('Failed to update player:', error);
      toast.error('Failed to update player');
    }
  };
  
  // Handle player tier update
  const handlePlayerTierUpdate = async () => {
    if (!selectedPlayer) {
      toast.error('No player selected');
      return;
    }
    
    try {
      await updatePlayerTier(
        selectedPlayer.id,
        updateGamemode,
        updateGamemodeTier
      );
    } catch (error) {
      console.error('Failed to update player tier:', error);
      toast.error('Failed to update player tier');
    }
  };
  
  // Handle player deletion
  const handlePlayerDelete = async () => {
    if (!selectedPlayer) {
      toast.error('No player selected');
      return;
    }
    
    try {
      await deletePlayer(selectedPlayer.id);
    } catch (error) {
      console.error('Failed to delete player:', error);
      toast.error('Failed to delete player');
    }
  };
  
  // Handle player ban
  const handlePlayerBan = async () => {
    if (!selectedPlayer) {
      toast.error('No player selected');
      return;
    }
    
    try {
      await banPlayer(selectedPlayer);
    } catch (error) {
      console.error('Failed to ban player:', error);
      toast.error('Failed to ban player');
    }
  };
  
  // Handle news article submission
  const handleNewsArticleSubmit = async () => {
    // Implement news article submission logic here
    console.log('Submitting news article:', {
      title: newsArticleTitle,
      content: newsArticleContent,
      author: newsArticleAuthor,
      tags: newsArticleTags,
    });
    
    // Clear the form
    setNewsArticleTitle('');
    setNewsArticleContent('');
    setNewsArticleAuthor('');
    setNewsArticleTags('');
    setOpenNewsArticleDialog(false);
  };
  
  return (
    <div className="container py-8">
      {!isAdminMode ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Admin Login</h2>
          <p className="text-muted-foreground">
            Enter the admin PIN to access admin functions.
          </p>
          <div className="flex items-center space-x-2">
            <Input
              type="password"
              placeholder="Admin PIN"
              value={pinInputValue}
              onChange={(e) => setPinInputValue(e.target.value)}
              className="w-48"
            />
            <Button onClick={handlePinSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Login'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
          
          {/* Player Submission Form */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Submit Player Result</h3>
            <form onSubmit={handlePlayerSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ign">Player IGN</Label>
                <Input
                  type="text"
                  id="ign"
                  value={ign}
                  onChange={(e) => setIgn(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="javaUsername">Java Username</Label>
                <Input
                  type="text"
                  id="javaUsername"
                  value={javaUsername}
                  onChange={(e) => setJavaUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="device">Device</Label>
                <Select onValueChange={(value) => setDevice(value as DeviceType)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                    <SelectItem value="PC">PC</SelectItem>
                    <SelectItem value="Console">Console</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="region">Region</Label>
                <Select onValueChange={(value) => setRegion(value as PlayerRegion)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NA">North America</SelectItem>
                    <SelectItem value="EU">Europe</SelectItem>
                    <SelectItem value="AS">Asia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="gamemode">Gamemode</Label>
                <Select onValueChange={(value) => setGamemode(value as GameMode)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gamemode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bedwars">Bedwars</SelectItem>
                    <SelectItem value="Duels">Duels</SelectItem>
                    <SelectItem value="TheBridge">TheBridge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tier">Tier</Label>
                <Select onValueChange={(value) => setTier(value as TierLevel | "NA")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NA">Unranked</SelectItem>
                    <SelectItem value="Tier1">Tier 1</SelectItem>
                    <SelectItem value="Tier2">Tier 2</SelectItem>
                    <SelectItem value="Tier3">Tier 3</SelectItem>
                    <SelectItem value="Tier4">Tier 4</SelectItem>
                    <SelectItem value="Tier5">Tier 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="w-full">
                  Submit Player
                </Button>
              </div>
            </form>
          </section>
          
          {/* Player Search and Edit Section */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Player Search and Edit</h3>
            <Input
              type="text"
              placeholder="Search by player IGN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            {isSearching && (
              <div className="text-muted-foreground">Searching...</div>
            )}
            
            {searchResults.length > 0 && (
              <div className="rounded-md border">
                <ScrollArea>
                  <Table>
                    <TableCaption>A list of players that match your search query.</TableCaption>
                    <TableHead>
                      <TableRow>
                        <TableHead>IGN</TableHead>
                        <TableHead>Java Username</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {searchResults.map((player) => (
                        <TableRow key={player.id}>
                          <TableCell>{player.ign}</TableCell>
                          <TableCell>{player.java_username}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => loadPlayerDetails(player.id)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setSelectedPlayer(player);
                                  handlePlayerDelete();
                                }}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => {
                                  setSelectedPlayer(player);
                                  handlePlayerBan();
                                }}>
                                  <Ban className="mr-2 h-4 w-4" />
                                  Ban
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            )}
            
            {selectedPlayer && (
              <div className="space-y-4 rounded-md border p-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold">
                    Editing Player: {selectedPlayer.ign}
                    <Badge className="ml-2">{selectedPlayer.region}</Badge>
                  </h4>
                  <Button variant="ghost" size="sm" onClick={clearSelectedPlayer}>
                    Clear Selection
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="edit-mode" checked={editMode} onCheckedChange={setEditMode} />
                  <Label htmlFor="edit-mode">Edit Mode</Label>
                </div>
                
                <form onSubmit={handlePlayerUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="updateJavaUsername">Java Username</Label>
                    <Input
                      type="text"
                      id="updateJavaUsername"
                      value={updateJavaUsername}
                      onChange={(e) => setUpdateJavaUsername(e.target.value)}
                      disabled={!editMode}
                      defaultValue={selectedPlayer.java_username || ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="updateRegion">Region</Label>
                    <Select onValueChange={(value) => setUpdateRegion(value as PlayerRegion)} disabled={!editMode} defaultValue={selectedPlayer.region || ''}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NA">North America</SelectItem>
                        <SelectItem value="EU">Europe</SelectItem>
                        <SelectItem value="AS">Asia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="updateDevice">Device</Label>
                    <Select onValueChange={(value) => setUpdateDevice(value as DeviceType)} disabled={!editMode} defaultValue={selectedPlayer.device || ''}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select device" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mobile">Mobile</SelectItem>
                        <SelectItem value="PC">PC</SelectItem>
                        <SelectItem value="Console">Console</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Button type="submit" className="w-full" disabled={!editMode}>
                      Update Player
                    </Button>
                  </div>
                </form>
                
                {/* Player Tier Update */}
                <div className="space-y-2">
                  <h5 className="text-md font-semibold">Update Player Tier</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="updateGamemode">Gamemode</Label>
                      <Select onValueChange={(value) => setUpdateGamemode(value as GameMode)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select gamemode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bedwars">Bedwars</SelectItem>
                          <SelectItem value="Duels">Duels</SelectItem>
                          <SelectItem value="TheBridge">TheBridge</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="updateGamemodeTier">Tier</Label>
                      <Select onValueChange={(value) => setUpdateGamemodeTier(value as TierLevel)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select tier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tier1">Tier 1</SelectItem>
                          <SelectItem value="Tier2">Tier 2</SelectItem>
                          <SelectItem value="Tier3">Tier 3</SelectItem>
                          <SelectItem value="Tier4">Tier 4</SelectItem>
                          <SelectItem value="Tier5">Tier 5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Button onClick={handlePlayerTierUpdate} className="w-full">
                        Update Tier
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
          
          {/* News Article Management Section */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold">News Article Management</h3>
            <Button onClick={() => setOpenNewsArticleDialog(true)}>
              Create News Article
            </Button>
            
            {/* News Article List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {newsArticles.map((article) => (
                <NewsArticleCard
                  key={article.id}
                  article={article}
                  isAdmin={true}
                  onEditClick={() => {
                    // Implement edit logic here
                    console.log('Edit article:', article.id);
                  }}
                  onDeleteClick={() => {
                    // Implement delete logic here
                    console.log('Delete article:', article.id);
                  }}
                />
              ))}
            </div>
          </section>
          
          {/* News Article Creation Dialog */}
          <Dialog open={openNewsArticleDialog} onOpenChange={setOpenNewsArticleDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create News Article</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    type="text"
                    id="title"
                    value={newsArticleTitle}
                    onChange={(e) => setNewsArticleTitle(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="content" className="text-right">
                    Content
                  </Label>
                  <Input
                    type="text"
                    id="content"
                    value={newsArticleContent}
                    onChange={(e) => setNewsArticleContent(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="author" className="text-right">
                    Author
                  </Label>
                  <Input
                    type="text"
                    id="author"
                    value={newsArticleAuthor}
                    onChange={(e) => setNewsArticleAuthor(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tags" className="text-right">
                    Tags
                  </Label>
                  <Input
                    type="text"
                    id="tags"
                    value={newsArticleTags}
                    onChange={(e) => setNewsArticleTags(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleNewsArticleSubmit}>
                  Create Article
                </Button>
                <DialogClose>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
