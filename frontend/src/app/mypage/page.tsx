"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { ReservationList } from "@/components/features/reservation/ReservationList";
import { getUser, getUserByEmail, updateUser } from "@/lib/api";
import { uploadUserAvatar } from "@/lib/api/users";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  prefecture?: string;
  city?: string;
  avatar_url?: string;
  user_type: string;
}

export default function MyPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // プロフィール編集用ステート
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone_number: "",
    prefecture: "",
    city: "",
  });
  const [saving, setSaving] = useState(false);

  // 画像アップロード用ステート
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user) return;

      try {
        setLoading(true);

        // localStorageまたはメールアドレスでユーザーIDを取得
        let currentUserId: string | null = localStorage.getItem("farmMatch_userId");

        if (!currentUserId && session.user.email) {
          try {
            const user = await getUserByEmail(session.user.email);
            currentUserId = user.id.toString();
            localStorage.setItem("farmMatch_userId", currentUserId);
          } catch (error) {
            console.error("Error fetching user by email:", error);
            return;
          }
        }

        if (!currentUserId) {
          console.error("Could not determine user ID");
          return;
        }

        setUserId(currentUserId);
        const userData = await getUser(currentUserId);
        setUserProfile(userData);

        // 編集フォームの初期値を設定
        setEditForm({
          name: userData.name || "",
          phone_number: userData.phone_number || "",
          prefecture: userData.prefecture || "",
          city: userData.city || "",
        });

        // TODO: ユーザーのレビュー取得エンドポイントが実装されたら有効化
        // const reviewsData = await getReviews(0, 100, undefined, userId);
        // setMyReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session?.user]);

  const handleEditProfile = async () => {
    if (!userId) return;

    try {
      setSaving(true);
      const updatedUser = await updateUser(userId, editForm);
      setUserProfile(updatedUser);
      setIsEditing(false);
      alert("プロフィールを更新しました！");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("プロフィールの更新に失敗しました。");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (userProfile) {
      setEditForm({
        name: userProfile.name || "",
        phone_number: userProfile.phone_number || "",
        prefecture: userProfile.prefecture || "",
        city: userProfile.city || "",
      });
    }
    setIsEditing(false);
    setSelectedFile(null); // 選択されたファイルをクリア
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // ファイルタイプとサイズのバリデーション
      if (!file.type.startsWith("image/")) {
        alert("画像ファイルのみ選択してください。");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        alert("ファイルサイズは5MB以下にしてください。");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile || !userId) return;

    try {
      setUploading(true);
      const updatedUser = await uploadUserAvatar(userId, selectedFile);
      setUserProfile(updatedUser);
      setSelectedFile(null);
      alert("プロフィール画像を更新しました！");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("画像のアップロードに失敗しました。");
    } finally {
      setUploading(false);
    }
  };

  if (!session) {
    return (
      <div className="bg-white">
        <Container size="md" className="flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">ログインが必要です</h1>
            <p className="text-gray-600 mb-6">マイページを表示するにはログインしてください</p>
            <Link href="/login">
              <Button variant="primary" size="lg">
                ログイン
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <Container size="lg" className="py-8">
        {/* プロフィールセクション */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">読み込み中...</p>
          </div>
        ) : userProfile ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">プロフィール</h2>
              {!isEditing && (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  編集
                </Button>
              )}
            </div>

            <div className="flex items-start gap-6">
              <div className="flex flex-col items-center">
                <img
                  src={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : userProfile.avatar_url ||
                        session?.user?.image ||
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
                  }
                  alt={userProfile.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                />
                {isEditing && (
                  <div className="mt-4 space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                    {selectedFile && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleUploadAvatar}
                        disabled={uploading}
                        className="w-full"
                      >
                        {uploading ? "アップロード中..." : "画像をアップロード"}
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">名前</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        電話番号
                      </label>
                      <input
                        type="tel"
                        value={editForm.phone_number}
                        onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                        placeholder="090-1234-5678"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          都道府県
                        </label>
                        <input
                          type="text"
                          value={editForm.prefecture}
                          onChange={(e) => setEditForm({ ...editForm, prefecture: e.target.value })}
                          placeholder="東京都"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          市区町村
                        </label>
                        <input
                          type="text"
                          value={editForm.city}
                          onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                          placeholder="渋谷区"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button variant="primary" onClick={handleEditProfile} disabled={saving}>
                        {saving ? "保存中..." : "保存"}
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit} disabled={saving}>
                        キャンセル
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{userProfile.name}</h3>
                      <p className="text-gray-600">{userProfile.email}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {userProfile.user_type === "admin" && "管理者"}
                        {userProfile.user_type === "host" && "農家ホスト"}
                        {userProfile.user_type === "guest" && "ゲスト"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">連絡先情報</h4>
                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="font-medium">電話番号:</span>{" "}
                            {userProfile.phone_number || "未設定"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">所在地</h4>
                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="font-medium">都道府県:</span>{" "}
                            {userProfile.prefecture || "未設定"}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">市区町村:</span>{" "}
                            {userProfile.city || "未設定"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* タブナビゲーション */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              プロフィール
            </button>
            <button
              onClick={() => setActiveTab("reservations")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "reservations"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              予約履歴
            </button>
            <button
              onClick={() => setActiveTab("wishlist")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "wishlist"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              ウィッシュリスト
            </button>
          </nav>
        </div>

        {/* プロフィールタブ */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">プロフィール詳細</h2>
            {userProfile ? (
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <img
                    src={
                      userProfile.avatar_url ||
                      session?.user?.image ||
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
                    }
                    alt={userProfile.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{userProfile.name}</h3>
                    <p className="text-gray-600">{userProfile.email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {userProfile.user_type === "admin" && "管理者"}
                      {userProfile.user_type === "host" && "農家ホスト"}
                      {userProfile.user_type === "guest" && "ゲスト"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">連絡先情報</h4>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">電話番号:</span>{" "}
                        {userProfile.phone_number || "未設定"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">所在地</h4>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">都道府県:</span>{" "}
                        {userProfile.prefecture || "未設定"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">市区町村:</span>{" "}
                        {userProfile.city || "未設定"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">プロフィール情報の読み込みに失敗しました</p>
              </div>
            )}
          </div>
        )}

        {/* 予約履歴タブ */}
        {activeTab === "reservations" && (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">予約履歴</h2>
            {userId ? (
              <ReservationList userId={userId} />
            ) : (
              <p className="text-gray-600">ユーザー情報の読み込みに失敗しました</p>
            )}
          </div>
        )}

        {/* ウィッシュリストタブ */}
        {activeTab === "wishlist" && (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">ウィッシュリスト</h2>
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((farm) => (
                  <Link key={farm.id} href={`/farms/${farm.id}`}>
                    <Card hoverable>
                      <img
                        src={farm.image}
                        alt={farm.name}
                        className="w-full h-40 object-cover rounded-t-lg"
                      />
                      <CardBody>
                        <CardTitle>{farm.name}</CardTitle>
                        <p className="text-sm text-gray-600 mb-3">{farm.location}</p>
                        <p className="text-lg font-bold text-green-600">
                          ¥{farm.price.toLocaleString()}
                        </p>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card>
                <CardBody className="text-center py-12">
                  <p className="text-gray-600 mb-4">ウィッシュリストは空です</p>
                  <Link href="/search">
                    <Button variant="primary">
                      {userProfile?.user_type === "host" ? "ゲストを探す" : "ファームを探す"}
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
