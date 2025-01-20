import './reset.css';

//import { useReducer } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import BottomNavBar from './components/BottomNavBar';
import AuctionItemPage from './pages/AuctionItemPage';
import AuctionPage from './pages/AuctionPage';
import AuctionPostPage from './pages/AuctionPostPage';
import ChatPage from './pages/ChatPage';
import ChatRoomPage from './pages/ChatRoomPage';
import CommunityEditPage from './pages/CommunityEditPage';
import CommunityPage from './pages/CommunityPage';
import CommunityPostPage from './pages/CommunityPostPage';
import CommunityRegisterPage from './pages/CommunityRegisterPage';
import ItemEditPage from './pages/ItemEditPage';
import ItemPage from './pages/ItemPage';
import ItemPostPage from './pages/ItemPostPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import MannerPraisePage from './pages/MannerPraisePage';
import MannersPage from './pages/MannersPage';
import MyBuysPage from './pages/MyBuysPage';
import MyCommunityPosts from './pages/MyCommunityPosts';
import MyLikesPage from './pages/MyLikesPage';
import MyPage from './pages/MyPage';
import MyProfileEditPage from './pages/MyProfileEditPage';
import MySellsPage from './pages/MySellsPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import ReviewsPage from './pages/ReviewsPage';
import SearchPage from './pages/SearchPage';
import SearchResultPage from './pages/SearchResultPage';
import SellsPage from './pages/SellsPage';
import SetLocationPage from './pages/SetLocationPage';
import SettingsPage from './pages/SettingsPage';
import SocialLoginRedirectPage from './pages/SocialLoginRedirectPage';
import TempPage from './pages/TempPage';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const showNavBar = [
    '/main',
    '/community',
    '/auctions',
    '/chat',
    '/mypage',
  ].includes(location.pathname);

  return (
    <>
      {children}
      {showNavBar && <BottomNavBar />}
    </>
  );
};

export const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/oauth2/redirect"
            element={<SocialLoginRedirectPage />}
          />
          <Route path="/location" element={<SetLocationPage />} />
          <Route path="/item/:id" element={<ItemPage />} />
          <Route path="/itemedit/:id" element={<ItemEditPage />} />
          <Route path="/itempost" element={<ItemPostPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/search/:query" element={<SearchResultPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/post" element={<CommunityRegisterPage />} />
          <Route path="/community/edit/:id" element={<CommunityEditPage />} />
          <Route path="/community/:id" element={<CommunityPostPage />} />
          <Route path="/auctions" element={<AuctionPage />} />
          <Route path="/auctions/:id" element={<AuctionItemPage />} />
          <Route path="/auctions/post" element={<AuctionPostPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:id" element={<ChatRoomPage />} />
          <Route path="/mannerpraise" element={<MannerPraisePage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypage/settings" element={<SettingsPage />} />
          <Route path="/mypage/profile/edit" element={<MyProfileEditPage />} />
          <Route path="/mypage/likes" element={<MyLikesPage />} />
          <Route path="/mypage/sells" element={<MySellsPage />} />
          <Route path="/mypage/buys" element={<MyBuysPage />} />
          <Route path="/mypage/posts" element={<MyCommunityPosts />} />
          <Route path="/profile/:nickname" element={<ProfilePage />} />
          <Route path="/profile/:nickname/sells" element={<SellsPage />} />
          <Route path="/profile/:nickname/manners" element={<MannersPage />} />
          <Route path="/profile/:nickname/reviews" element={<ReviewsPage />} />
          <Route path="/temp" element={<TempPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};
