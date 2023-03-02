import { lazy } from "react"
import AllUsers from "../AdminLayout/AllUsers.jsx"
import Categories from "../AdminLayout/Categories.jsx"
import ChannelsInfoAdmin from "../AdminLayout/ChannelsInfoAdmin.jsx"
import EditCategory from "../AdminLayout/EditCategory.jsx"
import EditChannel from "../AdminLayout/EditChannel.jsx"
import EditVideo from "../AdminLayout/EditVideo.jsx"
import VideoDetails from "../AdminLayout/VideoDetails.jsx"
import Videos from "../AdminLayout/Videos.jsx"
import AddVideoToChannel from "../AdminLayout/AddVideoToChannel.jsx"

const SignUp = lazy(()=> import("../../pages/Auth/Signup.jsx"))
const Login= lazy(()=> import("../../pages/Auth/Login.jsx"))
const AboutUs= lazy(()=> import("../../pages/User/AboutUs.jsx"))
const Audios= lazy(()=> import("../../pages/User/Audios.jsx"))
const UserCategories = lazy(()=> import("../../pages/User/Categories.jsx"))
const Channels= lazy(()=> import("../../pages/User/Channels.jsx"))
const EditUserVideo= lazy(()=> import("../../pages/User/EditVideos.jsx"))
const Livestream= lazy(()=> import("../../pages/User/Livestream.js"))
const Music= lazy(()=> import("../../pages/User/Music"))
const MyVideos= lazy(()=> import("../../pages/User/MyVideos.jsx"))
const PrivacyPolicy= lazy(()=> import("../../pages/User/PrivacyPolicy.jsx"))
const Search= lazy(()=> import("../../pages/User/Search.jsx"))
const SingleCategory= lazy(()=> import("../../pages/User/SingleCategory.jsx"))
const SingleChannel= lazy(()=> import("../../pages/User/SingleChannel.jsx"))
const SingleVideo= lazy(()=> import("../../pages/User/SingleVideo.jsx"))
const Streams= lazy(()=> import("../../pages/User/Streams.js"))
const UserProfile= lazy(()=> import("../../pages/User/UserProfile.jsx"))
const UserHomePage = lazy(() => import("../../pages/User/Home"))


var routes = [
  {
    path: "/signin",
    name: "landing",
    component: Login,
    role: "none",
    protect: false,
  },
  {
    path: "/signup",
    name: "landing",
    component: SignUp,
    role: "none",
    protect: false,
  },
  {
    path: "/",
    name: "home",
    component: UserHomePage,
    role: "user",
    content_creator: false,
    protect: false,
  },
  {
    path: "/privacypolicy",
    name: "home",
    component: PrivacyPolicy,
    role: "user",
    content_creator: false,
    protect: false,
  },
  {
    path: "/aboutus",
    name: "home",
    component: AboutUs,
    role: "user",
    content_creator: false,
    protect: false,
  },
  {
    path: "/search",
    name: "home",
    component: Search,
    role: "user",
    content_creator: false,
    protect: false,
  },
  {
    path: "/community",
    name: "home",
    component: UserCategories,
    role: "user",
    content_creator: false,
    protect: false,
  },
  {
    path: "/category/:id",
    name: "home",
    component: SingleCategory,
    role: "user",
    content_creator: false,
    protect: false,
  },

  {
    path: "/video/:id",
    name: "home",
    component: SingleVideo,
    role: "user",
    content_creator: false,
    protect: false,
  },
  {
    path: "/channel/:id",
    name: "home",
    component: SingleChannel,
    role: "user",
    content_creator: false,
    protect: false,
  },
  {
    path: "/my_videos",
    name: "home",
    component: MyVideos,
    role: "user",
    content_creator: false,
    protect: false,
  },
  {
    path: "/my_videos/edit/:id",
    name: "home",
    component: EditUserVideo,
    role: "user",
    content_creator: false,
    protect: false,
  },
  {
    path: "/profile",
    name: "home",
    component: UserProfile,
    role: "user",
    content_creator: false,
    protect: false,
  },
  {
    path: "/channels",
    name: "channels",
    component: Channels,
    role: "user",
    content_creator: false,
    protect: false,
  },
  {
    path: "/live/:id",
    name: "Livestream",
    component: Livestream,
    role: "user",
    content_creator: false,
    protect: false,
  },
  {
    path: "/join/:id",
    name: "Livestream",
    component: Livestream,
    role: "user",
    content_creator: false,
    protect: false,
  },
  {
    path: "/streams",
    name: "Stream",
    component: Streams,
    role: "user",
    content_creator: false,
    protect: false,
  },
  {
    path: "/music",
    name: "Music",
    component: Music,
    role: "user",
    content_creator: false,
    protect: false,
  },
  {
    path: "/audio/live/:id",
    name: "Audios",
    component: Audios,
    role: "user",
    content_creator: false,
    protect: false,
  },
  {
    path: "/audio/join/:id",
    name: "Audios",
    component: Audios,
    role: "user",
    content_creator: false,
    protect: false,
  },
  {
    path: "/admin/video/:id",
    name: "landing",
    component: VideoDetails,
    role: "admin",
    protect: true,
  },
  {
    path: "/admin/videos/",
    name: "landing",
    component: Videos,
    role: "admin",
    content_creator: true,
    protect: true,
  },
  {
    path: "/admin/add/video",
    name: "landing",
    component: AddVideoToChannel,
    role: "admin",
    content_creator: true,
    protect: true,
  },
  {
    path: "/admin/categories",
    name: "landing",
    component: Categories,
    role: "admin",
    protect: true,
  },
  {
    path: "/admin/users",
    name: "landing",
    component: AllUsers,
    role: "admin",
    protect: true,
  },
  {
    path: "/admin/channels",
    name: "landing",
    component: ChannelsInfoAdmin,
    role: "admin",
    protect: true,
  },
  {
    path: "/admin/edit/category/:id",
    name: "landing",
    component: EditCategory,
    role: "admin",
    protect: true,
  },
  {
    path: "/admin/edit/channel/:id",
    name: "landing",
    component: EditChannel,
    role: "admin",
    protect: true,
  },
  {
    path: "/admin/edit/video/:id",
    name: "landing",
    component: EditVideo,
    role: "admin",
    protect: true,
  },
];

export default routes;
