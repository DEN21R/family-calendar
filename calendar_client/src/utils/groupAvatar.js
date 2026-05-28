import GroupsIcon from '@mui/icons-material/Groups'
import HomeIcon from '@mui/icons-material/Home'
import FavoriteIcon from '@mui/icons-material/Favorite'
import StarIcon from '@mui/icons-material/Star'
import PetsIcon from '@mui/icons-material/Pets'
import CelebrationIcon from '@mui/icons-material/Celebration'

const iconMap = {
  groups: GroupsIcon,
  home: HomeIcon,
  favorite: FavoriteIcon,
  star: StarIcon,
  pets: PetsIcon,
  celebration: CelebrationIcon,
}

export function getGroupAvatarIcon(avatarKey) {
  return iconMap[avatarKey] || GroupsIcon
}
