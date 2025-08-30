import { useNavigate } from "react-router-dom";

interface ClickableUsernameProps {
  username: string;
  userId?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ClickableUsername = ({ username, userId, className = "", children }: ClickableUsernameProps) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Generate userId from username if not provided
    const profileId = userId || username.toLowerCase().replace(/\s+/g, '_');
    navigate(`/profile/${profileId}`);
  };

  return (
    <span 
      className={`cursor-pointer hover:text-primary transition-colors ${className}`}
      onClick={handleClick}
      title={`View ${username}'s profile`}
    >
      {children || username}
    </span>
  );
};