
import React, { useState } from 'react';
import { adminService } from '@/services/adminService';
import { useAdminPanel } from '@/hooks/useAdminPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import AdminSubmissionForm from '@/components/AdminSubmissionForm';

export function AdminPanel() {
  const {
    isAdminMode,
    pinInputValue,
    setPinInputValue,
    isSubmitting,
    handlePinSubmit,
    handleLogout,
    massRegisterPlayers,
    generateFakePlayers,
    wipeAllData
  } = useAdminPanel();

  const [massRegisterText, setMassRegisterText] = useState<string>('');
  const [fakePlayers, setFakePlayers] = useState<number>(100);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isWiping, setIsWiping] = useState<boolean>(false);
  const [wipeConfirmation, setWipeConfirmation] = useState<string>('');

  // Handle PIN input form submission
  const handlePinFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePinSubmit();
  };

  // Handle mass registration form submission
  const handleMassRegister = async () => {
    if (!massRegisterText.trim()) {
      toast.error('Please enter player data');
      return;
    }

    const count = await massRegisterPlayers(massRegisterText);
    if (count > 0) {
      setMassRegisterText('');
      toast.success(`Successfully registered ${count} players`);
    }
  };

  // Handle fake players generation
  const handleGenerateFakePlayers = async () => {
    setIsGenerating(true);
    try {
      const count = await generateFakePlayers(fakePlayers);
      if (count > 0) {
        toast.success(`Generated ${count} fake players`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle data wipe
  const handleWipeData = async () => {
    if (wipeConfirmation !== 'WIPE ALL DATA') {
      toast.error('Please enter the confirmation text exactly');
      return;
    }

    setIsWiping(true);
    try {
      const success = await wipeAllData();
      if (success) {
        toast.success('All data has been wiped');
        setWipeConfirmation('');
      }
    } finally {
      setIsWiping(false);
    }
  };

  if (!isAdminMode) {
    // Admin login form
    return (
      <div className="container max-w-md mx-auto py-12">
        <Card>
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>Enter the admin PIN to continue</CardDescription>
          </CardHeader>
          <form onSubmit={handlePinFormSubmit}>
            <CardContent>
              <Input
                type="password"
                placeholder="Enter PIN"
                value={pinInputValue}
                onChange={(e) => setPinInputValue(e.target.value)}
                autoComplete="off"
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  // Admin panel content
  return (
    <div className="container max-w-4xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Tabs defaultValue="submit" className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="submit">Submit Results</TabsTrigger>
          <TabsTrigger value="register">Register Players</TabsTrigger>
          <TabsTrigger value="tools">Admin Tools</TabsTrigger>
        </TabsList>

        {/* Results Submission Tab */}
        <TabsContent value="submit">
          <AdminSubmissionForm />
        </TabsContent>

        {/* Mass Registration Tab */}
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Mass Register Players</CardTitle>
              <CardDescription>
                Register multiple players at once using a CSV-style format.
                Format: IGN,JavaUsername (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                value={massRegisterText}
                onChange={(e) => setMassRegisterText(e.target.value)}
                className="w-full h-60 p-2 border rounded"
                placeholder="Player1,JavaUsername1&#10;Player2,JavaUsername2&#10;Player3"
              />
              <Button onClick={handleMassRegister} className="w-full">
                Register Players
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Tools Tab */}
        <TabsContent value="tools">
          <div className="grid gap-6">
            {/* Fake Players Generation */}
            <Card>
              <CardHeader>
                <CardTitle>Generate Fake Players</CardTitle>
                <CardDescription>
                  Create random players for testing purposes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    value={fakePlayers}
                    onChange={(e) => setFakePlayers(parseInt(e.target.value) || 100)}
                    min="1"
                    max="1000"
                  />
                  <Button
                    onClick={handleGenerateFakePlayers}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Data Wipe (Dangerous) */}
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  These actions cannot be undone. Be very careful.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md bg-destructive/10 p-4">
                  <h3 className="font-semibold text-destructive mb-2">
                    Wipe All Data
                  </h3>
                  <p className="text-sm mb-4">
                    This will permanently delete all players and scores from the
                    database. Type "WIPE ALL DATA" to confirm.
                  </p>
                  <div className="flex items-center gap-4">
                    <Input
                      value={wipeConfirmation}
                      onChange={(e) => setWipeConfirmation(e.target.value)}
                      placeholder="WIPE ALL DATA"
                    />
                    <Button
                      variant="destructive"
                      onClick={handleWipeData}
                      disabled={
                        isWiping || wipeConfirmation !== 'WIPE ALL DATA'
                      }
                    >
                      {isWiping ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Wiping...
                        </>
                      ) : (
                        'Wipe Data'
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminPanel;
