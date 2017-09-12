interface Order {
  id: number;
  url: string;
  keyword: string;
  tier: string;
  tier_display: string;
}

interface ContentMessage {
  event: string;
  message: any
}
