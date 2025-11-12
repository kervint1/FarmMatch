import Link from "next/link";
import { Card, CardBody, CardImage, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FarmCardProps {
  id: number;
  name: string;
  city: string;
  prefecture: string;
  experience_type: string;
  price_per_day: number;
  main_image_url?: string;
  rating?: number;
}

export function FarmCard({
  id,
  name,
  city,
  prefecture,
  experience_type,
  price_per_day,
  main_image_url,
  rating,
}: FarmCardProps) {
  const experienceLabel = {
    agriculture: "農業体験",
    livestock: "畜産体験",
    fishery: "漁業体験",
  }[experience_type] || experience_type;

  return (
    <Link href={`/farms/${id}`}>
      <Card hoverable className="h-full">
        <CardImage
          src={main_image_url || "http://localhost:8000/uploads/farm_images/farm1_main.jpg"}
          alt={name}
        />
        <CardBody>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {name}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {prefecture} {city}
              </p>
            </div>
            {rating && (
              <span className="text-sm font-semibold text-yellow-500">
                ⭐ {rating}
              </span>
            )}
          </div>

          <div className="mb-3">
            <Badge variant="secondary" size="sm">
              {experienceLabel}
            </Badge>
          </div>

          <div className="text-lg font-bold text-green-600">
            ¥{price_per_day?.toLocaleString()}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
