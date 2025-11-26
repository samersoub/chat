import { useEffect, useState } from "react";
import { AuthService } from "@/services/AuthService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatLayout from "@/components/chat/ChatLayout";
import AvatarWithFrame from "@/components/profile/AvatarWithFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showError, showSuccess } from "@/utils/toast";
import { ProfileService, type Profile } from "@/services/ProfileService";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileDetails from "@/components/profile/ProfileDetails";
import ProfileMoments from "@/components/profile/ProfileMoments";
import ProfileCover from "@/components/profile/ProfileCover";
import QuickActionsBar from "@/components/profile/QuickActionsBar";

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
      <div className="mx-auto max-w-3xl p-4 space-y-4">
        {/* Top cover with header content overlay */}
        <ProfileCover>
          <ProfileHeader user={user} profile={profile} />
        </ProfileCover>

        {/* Quick actions under the cover */}
        <QuickActionsBar className="px-1" />

        {/* Stats */}
        <ProfileStats profile={profile} />

        {/* Tabs: Moments & Personal Profile */}
        <ProfileTabs
          defaultValue="moments"
          momentsSlot={<ProfileMoments photos={[]} />}
          detailsSlot={
            <ProfileDetails
              user={user}
              profile={profile}
              onProfileUpdated={(p) => setProfile(p)}
            />
          }
        />
      </div>
    </ChatLayout>
  );
};

export default Profile;