import { AuthService } from "@/services/AuthService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatLayout from "@/components/chat/ChatLayout";
import AvatarWithFrame from "@/components/profile/AvatarWithFrame";

const Profile = () => {
  const user = AuthService.getCurrentUser();
  return (
    <ChatLayout title="Profile">
      <div className="mx-auto max-w-xl p-4">
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <AvatarWithFrame name={user?.name || "User"} />
              <div className="space-y-1">
                {user ? (
                  <>
                    <div className="text-sm">Email: {user.email}</div>
                    {user.name && <div className="text-sm">Name: {user.name}</div>}
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">No user logged in.</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ChatLayout>
  );
};

export default Profile;