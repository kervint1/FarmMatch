"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardImage, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFarms } from "@/lib/api";

export default function HomePage() {
  const { data: session } = useSession();
  const [featuredFarms, setFeaturedFarms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const farms = await getFarms(0, 3);
        setFeaturedFarms(farms);
      } catch (error) {
        console.error("Error fetching farms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, []);

  const features = [
    {
      icon: "🌾",
      title: "多様な農業体験",
      description: "野菜栽培から果実収穫まで、様々な農業体験が選べます",
    },
    {
      icon: "👥",
      title: "農家と直接繋がる",
      description: "農家の方と直接コミュニケーションを取ることができます",
    },
    {
      icon: "⭐",
      title: "レビュー・評価システム",
      description: "他のユーザーの評価を参考に、安心して予約できます",
    },
    {
      icon: "📍",
      title: "全国の農場に対応",
      description: "日本全国の多くの農場から、あなたにぴったりの体験を見つけられます",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* ヒーロー セクション */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 py-20 md:py-32">
        <Container size="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* テキスト */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                農業体験をシェアしよう
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Farm Match は、農業体験をしたい人と提供したい農家を繋ぐプラットフォームです。全国の農場で本物の農業を体験しよう。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {session ? (
                  <Link href="/search">
                    <Button variant="primary" size="lg" fullWidth>
                      ファームを探す
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/signup" className="flex-1">
                      <Button variant="primary" size="lg" fullWidth>
                        無料で始める
                      </Button>
                    </Link>
                    <Link href="/login" className="flex-1">
                      <Button variant="outline" size="lg" fullWidth>
                        ログイン
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* ヒーロー画像 */}
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1500595046891-cceef1ee6147?w=600&h=400&fit=crop"
                alt="農業体験"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* フィーチャー セクション */}
      <section className="py-20 md:py-28">
        <Container size="lg">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              なぜ Farm Match？
            </h2>
            <p className="text-lg text-gray-600">
              農業体験の新しい形をご提案します
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="h-full">
                <CardBody className="text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 人気のファーム セクション */}
      <section className="bg-gray-50 py-20 md:py-28">
        <Container size="lg">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              人気のファーム
            </h2>
            <p className="text-lg text-gray-600">
              多くのユーザーに選ばれている農場をご紹介
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">読み込み中...</p>
            </div>
          ) : featuredFarms.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredFarms.map((farm) => (
                  <Link key={farm.id} href={`/farms/${farm.id}`}>
                    <Card hoverable className="h-full">
                      <CardImage
                        src={farm.main_image_url || "http://localhost:8000/uploads/farm_images/farm1_main.jpg"}
                        alt={farm.name}
                      />
                      <CardBody>
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="flex-1">{farm.name}</CardTitle>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{farm.location}</p>

                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="primary" size="sm">
                            {farm.experience_type}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-1 mb-4">
                          <span className="text-yellow-400 text-lg">⭐</span>
                          <span className="font-semibold text-gray-900">
                            {farm.rating || "未評価"}
                          </span>
                        </div>

                        <div className="text-lg font-bold text-green-600">
                          ¥{farm.price_per_person?.toLocaleString()}
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link href="/search">
                  <Button variant="primary" size="lg">
                    もっと見る
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">ファームが見つかりません</p>
            </div>
          )}
        </Container>
      </section>

      {/* CTA セクション */}
      <section className="bg-green-600 py-16 md:py-20">
        <Container size="md">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              あなたの農業体験、始めませんか？
            </h2>
            <p className="text-lg text-green-100 mb-8">
              今すぐ Farm Match に参加して、新しい農業との出会いを始めましょう
            </p>
            {!session && (
              <Link href="/signup">
                <Button variant="secondary" size="lg">
                  無料登録
                </Button>
              </Link>
            )}
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
