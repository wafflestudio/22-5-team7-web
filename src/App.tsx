import './reset.css';

//import { useReducer } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import BottomNavBar from './components/BottomNavBar';
import AuctionPage from './pages/AuctionPage';
import ChatPage from './pages/ChatPage';
import ChatRoomPage from './pages/ChatRoomPage';
import CommunityPage from './pages/CommunityPage';
import CommunityPostPage from './pages/CommunityPostPage';
import CommunityRegisterPage from './pages/CommunityRegisterPage';
import ItemPage from './pages/ItemPage';
import ItemPostPage from './pages/ItemPostPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import MannersPage from './pages/MannersPage';
import MyBuysPage from './pages/MyBuysPage';
import MyLikesPage from './pages/MyLikesPage';
import MyPage from './pages/MyPage';
import MyProfilePage from './pages/MyProfilePage';
import MySellsPage from './pages/MySellsPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import ReviewsPage from './pages/ReviewsPage';
import SearchPage from './pages/SearchPage';
import SearchResultPage from './pages/SearchResultPage';
import SellsPage from './pages/SellsPage';
import SettingsPage from './pages/SettingsPage';
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
          <Route path="/item/:id" element={<ItemPage />} />
          <Route path="/itempost" element={<ItemPostPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/search/:query" element={<SearchResultPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/post" element={<CommunityRegisterPage />} />
          <Route path="/community/:id" element={<CommunityPostPage />} />
          <Route path="/auctions" element={<AuctionPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:id" element={<ChatRoomPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypage/settings" element={<SettingsPage />} />
          <Route path="/mypage/profile" element={<MyProfilePage />} />
          <Route path="/mypage/likes" element={<MyLikesPage />} />
          <Route path="/mypage/sells" element={<MySellsPage />} />
          <Route path="/mypage/buys" element={<MyBuysPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/profile/:id/sells" element={<SellsPage />} />
          <Route path="/profile/:id/manners" element={<MannersPage />} />
          <Route path="/profile/:id/reviews" element={<ReviewsPage />} />
          <Route path="/temp" element={<TempPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};
