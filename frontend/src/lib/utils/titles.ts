import type { UserTitle } from "@/types/user";
import type { StampCollectionSummary } from "@/types/stamp";

export function calculateUserTitles(summary: StampCollectionSummary): UserTitle[] {
  const titles: UserTitle[] = [];
  const count = summary.total_prefectures;

  // 都道府県数ベース
  if (count >= 47) {
    titles.push({
      title: "全国制覇",
      description: "47都道府県すべてを訪問",
      icon: "🏆",
    });
  } else if (count >= 30) {
    titles.push({
      title: "全国マスター",
      description: "30都道府県以上を訪問",
      icon: "🌟",
    });
  } else if (count >= 20) {
    titles.push({
      title: "全国エキスパート",
      description: "20都道府県以上を訪問",
      icon: "⭐",
    });
  } else if (count >= 10) {
    titles.push({
      title: "10県制覇",
      description: "10都道府県以上を訪問",
      icon: "🎖️",
    });
  } else if (count >= 5) {
    titles.push({
      title: "5県制覇",
      description: "5都道府県以上を訪問",
      icon: "🏅",
    });
  } else if (count >= 3) {
    titles.push({
      title: "3県制覇",
      description: "3都道府県以上を訪問",
      icon: "🎗️",
    });
  } else if (count >= 1) {
    titles.push({
      title: "旅の始まり",
      description: "最初の都道府県を訪問",
      icon: "🌱",
    });
  }

  // ファーム訪問数ベース
  if (summary.total_farms >= 20) {
    titles.push({
      title: "ファーム巡礼者",
      description: "20ファーム以上を訪問",
      icon: "🚜",
    });
  } else if (summary.total_farms >= 10) {
    titles.push({
      title: "ファーム探検家",
      description: "10ファーム以上を訪問",
      icon: "🌾",
    });
  }

  // 訪問回数ベース
  if (summary.total_visits >= 50) {
    titles.push({
      title: "リピーター殿堂",
      description: "50回以上の訪問",
      icon: "💎",
    });
  } else if (summary.total_visits >= 20) {
    titles.push({
      title: "常連さん",
      description: "20回以上の訪問",
      icon: "💚",
    });
  }

  if (titles.length === 0) {
    titles.push({
      title: "新人ゲスト",
      description: "これから旅を始めましょう",
      icon: "👋",
    });
  }

  return titles.slice(0, 3); // 最大3つ
}
