import { AuthService } from "@/services/AuthService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  const user = AuthService.getCurrentUser();
  return (
    <div className="mx-auto max-w-xl p-4">
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {user ? (
            <>
              <div className="text-sm">Email: {user.email}</div>
              {user.name && <div className="text-sm">Name: {user.name}</div>}
            </>
          ) : (
            <div className="text-sm text-muted-foreground">No user logged in.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;