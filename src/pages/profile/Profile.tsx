import { useEffect, useState } from "react";
import { AuthService } from "@/services/AuthService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatLayout from "@/components/chat/ChatLayout";
import AvatarWithFrame from "@/components/profile/AvatarWithFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showError, showSuccess } from "@/utils/toast";
import { ProfileService, type Profile } from "@/services/ProfileService";

const Profile = () => {
  const user = AuthService.getCurrentUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [file, setFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    const load = async () => {
      if (user?.id) {
        const p = await ProfileService.getByUserId(user.id);
        setProfile(p);
      }
    };
    void load();
  }, [user?.id]);

  return (
    <ChatLayout title="Profile">
      <div className="mx-auto max-w-xl p-4">
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <AvatarWithFrame name={user?.name || "User"} imageUrl={profile?.profile_image || user?.avatarUrl} />
              <div className="space-y-1">
                {user ? (
                  <>
                    <div className="text-sm">Email: {user.email}</div>
                    {user.name && <div className="text-sm">Username: {user.name}</div>}
                    {profile?.phone && <div className="text-sm">Phone: {profile.phone}</div>}
                    {typeof profile?.coins === "number" && <div className="text-sm">Coins: {profile.coins}</div>}
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">No user logged in.</div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Profile Image</div>
              <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0])} />
              <Button
                variant="outline"
                onClick={async () => {
                  if (!user?.id || !file) return;
                  try {
                    const url = await ProfileService.uploadProfileImage(user.id, file);
                    if (url) {
                      const p = await ProfileService.getByUserId(user.id);
                      setProfile(p);
                      showSuccess("Profile image updated");
                    } else {
                      showError("Storage not configured");
                    }
                  } catch (e: any) {
                    showError(e.message || "Failed to upload image");
                  }
                }}
              >
                Upload
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ChatLayout>
  );
};

export default Profile;