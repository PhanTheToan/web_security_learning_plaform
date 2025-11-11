import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserProfileCard({ user, proficiencyLevel }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar>
          <AvatarImage src={user.avatarUrl || "/avatar.png"} alt={user.fullName} />
          <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{user.fullName}</CardTitle>
          <CardDescription>Proficiency Level: {proficiencyLevel}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
