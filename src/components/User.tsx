import gravatar from "gravatar";

type AvatarProps = {
  email: string;
  size?: number;
  className?: string;
};

export const Avatar = ({ email, size, className }: AvatarProps) => {
  const avatarURL = gravatar.url(email, {
    s: size?.toString() || "200",
    d: "identicon",
  });

  return <img className={className ?? ""} src={avatarURL} alt="Avatar" />;
};

type UsernameCardProps = {
  username: string;
  email: string;
};

export const UsernameCard = ({ username, email }: UsernameCardProps) => {
  return (
    <div className="flex flex-row justify-start items-center gap-1 text-slate-500 text-sm hover:text-slate-600 hover:cursor-pointer">
      <Avatar email={email} className="w-4 rounded-full" />
      <span className="w-32 truncate">{username}</span>
    </div>
  );
};
