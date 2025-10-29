"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUser, getUserByEmail } from "@/lib/api";

type UserType = "guest" | "host" | "";

export default function SignupPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<UserType>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // ユーザー作成処理（OAuth後）
  useEffect(() => {
    const createUserAfterOAuth = async () => {
      if (!session?.user) {
        console.log("Session not ready:", session);
        return;
      }

      const signupUserType = sessionStorage.getItem("signupUserType") as UserType;
      if (!signupUserType) {
        console.log("No signup user type found in sessionStorage");
        return;
      }

      try {
        console.log("Creating user with:", {
          google_id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          user_type: signupUserType,
        });

        try {
          await createUser({
            google_id: session.user.id || "",
            email: session.user.email || "",
            name: session.user.name || "",
            user_type: signupUserType,
          });
          console.log("User created successfully");
        } catch (error: any) {
          // ユーザーが既に存在する場合は無視
          if (error.message.includes("User already exists")) {
            console.log("User already exists, continuing...");
          } else {
            throw error;
          }
        }

        // メールアドレスでユーザーを取得して、user_idをlocalStorageに保存
        if (session.user.email) {
          try {
            const user = await getUserByEmail(session.user.email);
            localStorage.setItem("farmMatch_userId", user.id.toString());
            console.log("User ID saved:", user.id);
          } catch (error) {
            console.error("Error fetching user:", error);
          }
        }

        // クリーンアップ
        sessionStorage.removeItem("signupUserType");
        sessionStorage.removeItem("signupFormData");

        // マイページにリダイレクト
        router.push("/mypage");
      } catch (error) {
        console.error("Error in signup process:", error);
        // エラーが発生してもページは開く（手動でリトライ可能）
      }
    };

    createUserAfterOAuth();
  }, [session, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleSignUp = async () => {
    if (!userType) {
      alert("ユーザータイプを選択してください");
      return;
    }

    try {
      setIsLoading(true);
      // Store user type in session storage for post-auth handling
      sessionStorage.setItem("signupUserType", userType);
      sessionStorage.setItem("signupFormData", JSON.stringify(formData));

      await signIn("google", {
        redirect: true,
        callbackUrl: "/signup",
      });
    } catch (error) {
      console.error("Sign up error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Farm Match</h1>
          <p className="text-gray-600">新規会員登録</p>
        </div>

        {/* ユーザータイプ選択 */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">
            あなたは？
          </p>
          <div className="space-y-2">
            <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-400 hover:bg-green-50" style={{ borderColor: userType === "guest" ? "#16a34a" : undefined, backgroundColor: userType === "guest" ? "#f0fdf4" : undefined }}>
              <input
                type="radio"
                name="userType"
                value="guest"
                checked={userType === "guest"}
                onChange={() => setUserType("guest")}
                className="w-4 h-4 text-green-600"
              />
              <span className="ml-3">
                <span className="block font-medium text-gray-900">
                  ゲスト（体験者）
                </span>
                <span className="text-sm text-gray-600">
                  農業体験を探している
                </span>
              </span>
            </label>

            <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-400 hover:bg-green-50" style={{ borderColor: userType === "host" ? "#16a34a" : undefined, backgroundColor: userType === "host" ? "#f0fdf4" : undefined }}>
              <input
                type="radio"
                name="userType"
                value="host"
                checked={userType === "host"}
                onChange={() => setUserType("host")}
                className="w-4 h-4 text-green-600"
              />
              <span className="ml-3">
                <span className="block font-medium text-gray-900">
                  ホスト（農家）
                </span>
                <span className="text-sm text-gray-600">
                  農業体験を提供したい
                </span>
              </span>
            </label>
          </div>
        </div>

        {/* Google OAuth ボタン */}
        <button
          onClick={handleGoogleSignUp}
          disabled={isLoading || !userType}
          className="w-full bg-white border-2 border-gray-300 rounded-lg py-3 px-4 flex items-center justify-center gap-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="text-gray-700 font-medium">
            {isLoading ? "登録中..." : "Googleで登録"}
          </span>
        </button>

        {/* フッター */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            既にアカウントをお持ちですか？{" "}
            <Link
              href="/login"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
